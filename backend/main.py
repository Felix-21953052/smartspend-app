
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from typing import Optional

load_dotenv()

app = FastAPI(title="SmartSpend API")

# CORS – cho phép React frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── Models ───────────────────────────────────────────
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Expense(BaseModel):
    user_email: str
    title: str
    amount: float
    category: str
    date: str
    note: Optional[str] = ""

class ExpenseUpdate(BaseModel):
    title: str
    amount: float
    category: str
    date: str
    note: Optional[str] = ""

# ─── Health Check ─────────────────────────────────────
@app.get("/")
def root():
    return {"message": "SmartSpend API is running! 🚀"}

# ─── AUTH ROUTES ──────────────────────────────────────
@app.post("/auth/register")
def register(user: UserRegister):
    try:
        existing = supabase.table("profiles").select("*").eq("email", user.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        result = supabase.table("profiles").insert({
            "email": user.email,
            "full_name": user.full_name,
            "password": user.password
        }).execute()

        return {"message": "Registration successful", "user": {"email": user.email, "full_name": user.full_name}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login")
def login(user: UserLogin):
    try:
        result = supabase.table("profiles").select("*").eq("email", user.email).eq("password", user.password).execute()

        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        profile = result.data[0]
        return {
            "message": "Login successful",
            "user": {
                "email": profile["email"],
                "full_name": profile.get("full_name", "")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── EXPENSE ROUTES ───────────────────────────────────
@app.post("/expenses")
def add_expense(expense: Expense):
    try:
        result = supabase.table("expenses").insert({
            "user_email": expense.user_email,
            "title": expense.title,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date,
            "note": expense.note
        }).execute()

        return {"message": "Expense added successfully", "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/{user_email}")
def get_expenses(user_email: str):
    try:
        result = supabase.table("expenses").select("*").eq("user_email", user_email).order("date", desc=True).execute()
        return {"expenses": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: str):
    try:
        supabase.table("expenses").delete().eq("id", expense_id).execute()
        return {"message": "Expense deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/expenses/{expense_id}")
def update_expense(expense_id: str, expense: ExpenseUpdate):
    try:
        # Kiểm tra expense có tồn tại không
        existing = supabase.table("expenses").select("*").eq("id", expense_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Expense not found")

        result = supabase.table("expenses").update({
            "title": expense.title,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date,
            "note": expense.note
        }).eq("id", expense_id).execute()

        return {"message": "Expense updated successfully", "data": result.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
