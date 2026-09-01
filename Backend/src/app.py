from fastapi import FastAPI




app = FastAPI(title="DeepShelf")



@app.get("/")
async def health():
    return {"message" : "working fine"}