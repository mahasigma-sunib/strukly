from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.database import create_db_and_tables
from src.routers import users, expenses, goals

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router)
app.include_router(expenses.router)
app.include_router(goals.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Koi Backend"}