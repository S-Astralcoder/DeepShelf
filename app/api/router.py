# External
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path


app = FastAPI(title="DeepShelf", description="A web-based application for keeping tabs on articles you have read.")



# Website serving

STATIC_DIR = Path(__file__).resolve().parent.parent.parent / "static" 

app.mount(path="/", app=StaticFiles(directory=STATIC_DIR, html=True), name="static")

@app.get("/", name="check health")
def health():
    return {"status" : "ok"}