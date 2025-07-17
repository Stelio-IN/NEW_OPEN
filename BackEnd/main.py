from fastapi import FastAPI
from database import Base, engine
from routers import users, messages
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "Chat API"}