from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime

from src.database import get_session
from src.models import User, GoalItem, GoalItemCreate, GoalItemRead, GoalItemUpdate
from src.auth import get_current_user

router = APIRouter()

@router.post("/api/goal", response_model=GoalItemRead)
async def add_goal(goal_data: GoalItemCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    db_goal = GoalItem(
        user_id=current_user.id,
        name=goal_data.name,
        price=goal_data.price,
        deposited=0.0,
        completed=False
    )
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal

@router.get("/api/goal", response_model=List[GoalItemRead])
async def get_goals(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    statement = select(GoalItem).where(GoalItem.user_id == current_user.id)
    goals = session.exec(statement).all()
    return goals

@router.put("/api/goal/{goal_id}", response_model=GoalItemRead)
async def update_goal_deposit(goal_id: int, goal_update: GoalItemUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    goal = session.get(GoalItem, goal_id)
    if not goal or goal.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    if goal.completed:
        raise HTTPException(status_code=400, detail="Cannot edit completed goal")
        
    # Logic:
    # If you subtract deposit → Add User.UnusedBudget
    # If you add deposit → Subtract User.UnusedBudget
    
    diff = goal_update.deposited - goal.deposited
    
    # Check if user has enough unused budget if adding deposit
    if diff > 0:
        if current_user.unused_budget < diff:
            # Instructions don't explicitly say to fail, but it implies budget constraint.
            # "Unused money is added at the end of month" -> User.unused_budget
            # Let's assume we can only deposit what we have in unused_budget?
            # Or maybe we can deposit from "budget"?
            # "If you add deposit → Subtract User.UnusedBudget"
            # This implies we are moving money from UnusedBudget to Goal.
            # So we should check if we have enough.
            raise HTTPException(status_code=400, detail="Insufficient unused budget")
            
    current_user.unused_budget -= diff
    goal.deposited = goal_update.deposited
    
    session.add(current_user)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal

@router.put("/api/wishlist/complete", response_model=GoalItemRead)
async def complete_goal(goal_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Note: Instructions say `PUT /api/wishlist/complete`
    # But how do we pass the goal ID? Query param? Body?
    # Usually it's `/api/wishlist/complete/{id}` or body.
    # Instructions don't specify body for this.
    # I'll assume query param `goal_id` or body.
    # Let's use query param for simplicity if not specified, or I can change route to `/api/wishlist/complete/{goal_id}`.
    # But the path is `/api/wishlist/complete`.
    # So I'll expect `goal_id` in query or body.
    # Let's use query param.
    
    goal = session.get(GoalItem, goal_id)
    if not goal or goal.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    if goal.completed:
        raise HTTPException(status_code=400, detail="Goal already completed")
        
    goal.completed = True
    goal.completed_at = datetime.utcnow()
    
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal
