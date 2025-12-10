from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class Product(BaseModel):
    id: str
    name: str
    price: float
    category: str
    image_url: str

class BodyMeasurements(BaseModel):
    shoulder: float
    waist: float
    hip: float

@app.get("/")
def read_root():
    return {"status": "Phygital Kiosk Backend Running"}

@app.get("/products", response_model=List[Product])
def get_products():
    return [
        {"id": "1", "name": "Cyber Jacket", "price": 120.0, "category": "top", "image_url": "/assets/jacket.png"},
        {"id": "2", "name": "Neon Pants", "price": 80.0, "category": "bottom", "image_url": "/assets/pants.png"}
    ]

@app.post("/scan-body")
def scan_body_simulation():
    # Mocking depth camera data
    return {"shoulder": 42.5, "waist": 30.0, "hip": 36.0}
