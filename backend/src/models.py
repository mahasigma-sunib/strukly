from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import JSON, Column
import uuid

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(index=True, unique=True)
    name: str
    hashed_password: str
    unused_budget: float = 0.0
    budget: float = 0.0

    expenses: List["Expense"] = Relationship(back_populates="user")
    budget_history: List["BudgetHistory"] = Relationship(back_populates="user")
    subscriptions: List["Subscription"] = Relationship(back_populates="user")
    goal_items: List["GoalItem"] = Relationship(back_populates="user")

class BudgetHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    month: int
    year: int
    budget: float

    user: Optional[User] = Relationship(back_populates="budget_history")

class Expense(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    subtotal: float
    tax: float
    service: float
    discount: float
    total_expense: float # before split bill
    total_my_expense: float # after split bill reduction
    category: str
    datetime: datetime
    members: List[str] = Field(default=[], sa_column=Column(JSON))
    vendor: str

    # Note: In a real postgres DB, members could be ARRAY(String). 
    # For SQLModel/SQLite compatibility, we might need a JSON column or a separate table.
    # For now, assuming simple list or JSON support in SQLModel with Pydantic.
    # However, SQLModel with SQLite doesn't natively support lists directly without JSON type.
    # We will use JSON type from sqlalchemy if needed, but for simplicity let's assume it works or we might need to adjust.
    # Actually, standard SQLModel doesn't support List[str] directly in columns without custom types.
    # I'll use JSON for members if using Postgres, but for generic compatibility I might need to be careful.
    # Let's use a simple approach: if it's just strings, maybe a comma separated string or a JSON field.
    # I will try to use JSON.
    
    user: Optional[User] = Relationship(back_populates="expenses")
    items: List["ExpenseItem"] = Relationship(back_populates="expense")

class ExpenseItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    expense_id: str = Field(foreign_key="expense.id")
    name: str
    quantity: int
    single_price: float
    assigned_member: Optional[str] = None # none if self

    expense: Optional[Expense] = Relationship(back_populates="items")

class Subscription(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    name: str
    category: str
    price: float
    interval: str # "monthly", "2month", etc.

    user: Optional[User] = Relationship(back_populates="subscriptions")

class GoalItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    name: str
    price: float
    deposited: float = 0.0
    completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="goal_items")

class UserCreate(SQLModel):
    email: str
    name: str
    password: str

class UserRead(SQLModel):
    id: str
    email: str
    name: str
    unused_budget: float
    budget: float

class UserLogin(SQLModel):
    email: str
    password: str

class Token(SQLModel):
    access_token: str
    token_type: str

class UserBudgetUpdate(SQLModel):
    budget: float

class ExpenseItemCreate(SQLModel):
    name: str
    quantity: int
    single_price: float
    assigned_member: Optional[str] = None

class ExpenseCreate(SQLModel):
    items: List[ExpenseItemCreate]
    subtotal: float
    tax: float
    service: float
    discount: float
    category: str
    datetime: datetime
    members: List[str] = []
    vendor: str

class ExpenseRead(SQLModel):
    id: str
    user_id: str
    items: List[ExpenseItem]
    subtotal: float
    tax: float
    service: float
    discount: float
    total_expense: float
    total_my_expense: float
    category: str
    datetime: datetime
    members: List[str]
    vendor: str

class ExpenseTracker(SQLModel):
    month: int
    year: int
    total_expense: float
    weekly_expenses: List[dict] # {week: 1, total: 100}

class GoalItemCreate(SQLModel):
    name: str
    price: float

class GoalItemRead(SQLModel):
    id: int
    user_id: str
    name: str
    price: float
    deposited: float
    completed: bool
    completed_at: Optional[datetime]
    created_at: datetime

class GoalItemUpdate(SQLModel):
    deposited: float

