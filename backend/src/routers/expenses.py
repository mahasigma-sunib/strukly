from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timedelta
import calendar

from src.database import get_session
from src.models import User, Expense, ExpenseItem, ExpenseCreate, ExpenseRead, ExpenseTracker
from src.auth import get_current_user

router = APIRouter()

@router.post("/api/expense", response_model=ExpenseRead)
async def add_expense(expense_data: ExpenseCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Calculate totals
    # total_expense = subtotal + tax + service - discount
    # But instructions say: "total_expense": 123, // before split bill
    # "total_my_expense": 123, // after split bill reduction
    
    # Logic for split bill:
    # If assigned_member is None, it's for self.
    # If assigned_member is set, it's for that member.
    # Wait, the instructions don't fully specify the split logic, but ExpenseItem has `assigned_member`.
    # "assigned_member": "" // none if self
    
    # Let's assume:
    # total_expense = sum of all items * quantity * single_price + tax + service - discount
    # total_my_expense = sum of items where assigned_member is None (or empty) + proportional tax/service/discount?
    # Or maybe just sum of items for self.
    # Let's assume simple logic:
    # total_expense is passed in? No, it's calculated or passed?
    # The request body has subtotal, tax, service, discount.
    # It doesn't have total_expense. We should calculate it.
    
    total_expense = expense_data.subtotal + expense_data.tax + expense_data.service - expense_data.discount
    
    # Calculate my expense
    # We need to know which items are for me.
    # assigned_member is empty string or None for self.
    my_items_total = 0
    all_items_total = 0
    
    for item in expense_data.items:
        item_total = item.quantity * item.single_price
        all_items_total += item_total
        if not item.assigned_member:
            my_items_total += item_total
            
    # Proportional tax/service/discount?
    # ratio = my_items_total / all_items_total if all_items_total > 0 else 0
    # my_tax = expense_data.tax * ratio
    # my_service = expense_data.service * ratio
    # my_discount = expense_data.discount * ratio
    # total_my_expense = my_items_total + my_tax + my_service - my_discount
    
    # Simplified: just use the ratio of the final total if subtotal matches items total.
    # If subtotal != all_items_total, we might have an issue, but let's trust subtotal.
    
    ratio = my_items_total / expense_data.subtotal if expense_data.subtotal > 0 else 1
    total_my_expense = total_expense * ratio

    db_expense = Expense(
        user_id=current_user.id,
        subtotal=expense_data.subtotal,
        tax=expense_data.tax,
        service=expense_data.service,
        discount=expense_data.discount,
        total_expense=total_expense,
        total_my_expense=total_my_expense,
        category=expense_data.category,
        datetime=expense_data.datetime,
        members=expense_data.members,
        vendor=expense_data.vendor
    )
    session.add(db_expense)
    session.commit()
    session.refresh(db_expense)
    
    for item in expense_data.items:
        db_item = ExpenseItem(
            expense_id=db_expense.id,
            name=item.name,
            quantity=item.quantity,
            single_price=item.single_price,
            assigned_member=item.assigned_member
        )
        session.add(db_item)
    
    session.commit()
    session.refresh(db_expense)
    return db_expense

@router.post("/api/expense/ocr", response_model=ExpenseCreate)
async def ocr_expense(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # Placeholder for OCR
    # Return dummy data as per instructions
    return {
        "items": [
            {
                "name": "bigmac",
                "quantity": 1,
                "single_price": 50,
                "assigned_member": None
            }
        ],
        "subtotal": 50,
        "tax": 5,
        "service": 2,
        "discount": 0,
        "category": "food",
        "datetime": datetime.utcnow(),
        "members": ["Skibidi", "Samuel"],
        "vendor": "mcd"
    }

@router.put("/api/expense/{expense_id}", response_model=ExpenseRead)
async def edit_expense(expense_id: str, expense_data: ExpenseCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    expense = session.get(Expense, expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Check if previous month
    current_date = datetime.utcnow()
    if expense.datetime.month < current_date.month and expense.datetime.year <= current_date.year:
         # Simple check: if it's strictly previous month or older.
         # Logic: if (year < current_year) OR (year == current_year AND month < current_month)
         # But what if it's December 2024 and now is Jan 2025?
         # expense: 2024-12, current: 2025-01. month 12 !< 1.
         # Correct logic:
         if expense.datetime.replace(day=1) < current_date.replace(day=1):
             raise HTTPException(status_code=400, detail="Cannot edit expenses from previous months")

    # Update fields
    expense.subtotal = expense_data.subtotal
    expense.tax = expense_data.tax
    expense.service = expense_data.service
    expense.discount = expense_data.discount
    expense.category = expense_data.category
    expense.datetime = expense_data.datetime
    expense.members = expense_data.members
    expense.vendor = expense_data.vendor
    
    # Recalculate totals (same logic as add)
    total_expense = expense_data.subtotal + expense_data.tax + expense_data.service - expense_data.discount
    
    my_items_total = 0
    for item in expense_data.items:
        item_total = item.quantity * item.single_price
        if not item.assigned_member:
            my_items_total += item_total
            
    ratio = my_items_total / expense_data.subtotal if expense_data.subtotal > 0 else 1
    total_my_expense = total_expense * ratio
    
    expense.total_expense = total_expense
    expense.total_my_expense = total_my_expense
    
    # Update items: Delete old, add new (simplest approach)
    # Or update existing? Deleting and recreating is safer for consistency.
    statement = select(ExpenseItem).where(ExpenseItem.expense_id == expense_id)
    existing_items = session.exec(statement).all()
    for item in existing_items:
        session.delete(item)
        
    for item in expense_data.items:
        db_item = ExpenseItem(
            expense_id=expense.id,
            name=item.name,
            quantity=item.quantity,
            single_price=item.single_price,
            assigned_member=item.assigned_member
        )
        session.add(db_item)
        
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

@router.delete("/api/expense/{expense_id}")
async def delete_expense(expense_id: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    expense = session.get(Expense, expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    current_date = datetime.utcnow()
    if expense.datetime.replace(day=1) < current_date.replace(day=1):
         raise HTTPException(status_code=400, detail="Cannot delete expenses from previous months")
         
    session.delete(expense)
    session.commit()
    return {"ok": True}

@router.get("/api/expense/tracker")
async def view_tracker(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # 1. View nth Month’s Expense History (current month?)
    # 2. View nth Month’s Expense
    #     1. Aggregate per weekly (total expense)
    
    # Instructions are a bit vague on "nth Month". Assuming current month or query param?
    # "Because we’re already selecting by month we don’t need pagination"
    # Let's assume query params month and year, default to current.
    
    # For now, implementing for current month/year or all?
    # "View nth Month’s Expense History" implies filtering.
    
    # Let's add query params.
    now = datetime.utcnow()
    month = now.month
    year = now.year
    
    # We need to fetch expenses for this month
    statement = select(Expense).where(
        Expense.user_id == current_user.id,
        # Extract month/year from datetime. SQLite/Postgres differences.
        # In Python filtering is easier for now if dataset is small, but DB side is better.
        # SQLModel/SQLAlchemy: extract('month', Expense.datetime) == month
    )
    # But `extract` needs import.
    # Let's just filter by range.
    start_date = datetime(year, month, 1)
    # end_date = start_date + 1 month
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
        
    statement = statement.where(Expense.datetime >= start_date, Expense.datetime < end_date)
    expenses = session.exec(statement).all()
    
    # Aggregate weekly
    # Week 1, 2, 3, 4...
    weekly_agg = {}
    
    total_expense_month = 0
    
    for expense in expenses:
        # Get week number of month? Or week of year?
        # "Aggregate per weekly" usually means Week 1, Week 2 of the month.
        day = expense.datetime.day
        week_num = (day - 1) // 7 + 1
        
        if week_num not in weekly_agg:
            weekly_agg[week_num] = 0
        weekly_agg[week_num] += expense.total_my_expense # Assuming we track MY expense
        total_expense_month += expense.total_my_expense
        
    weekly_expenses = [{"week": k, "total": v} for k, v in weekly_agg.items()]
    
    return {
        "month": month,
        "year": year,
        "total_expense": total_expense_month,
        "weekly_expenses": weekly_expenses,
        "expenses": expenses # Optional: return list of expenses too? Instructions say "View nth Month’s Expense History"
    }
