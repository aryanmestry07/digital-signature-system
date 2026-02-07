from fastapi import FastAPI

app = FastAPI(title="Digital Signature System")

@app.get("/")
def root():
    return {"message": "Backend is running"}
