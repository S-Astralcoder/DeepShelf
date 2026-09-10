# External
from uvicorn import run


# Internal
from api.router import app


if __name__ == "__main__":
    run(app=app, host="0.0.0.0", reload=True, port=8000)