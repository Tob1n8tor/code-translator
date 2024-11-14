from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI backend"}

# Example to fetch environment variables
@app.get("/config")
async def config():
    return {
        "API_PORT": os.getenv("API_PORT"),
        "SECRET_KEY": os.getenv("SECRET_KEY"),
    }
