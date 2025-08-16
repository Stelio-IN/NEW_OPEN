# from fastapi import FastAPI, Depends, HTTPException
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from fastapi.middleware.cors import CORSMiddleware
# import jwt
# from sqlalchemy.orm import Session
# from database import Base, engine, SessionLocal
# from routers import users, messages
# from fraud_detection import FraudDetectionRequest, detect_fraud
#
# # Create database tables
# Base.metadata.create_all(bind=engine)
#
# app = FastAPI()
#
# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# # Include routers
# app.include_router(users.router, prefix="/api/users", tags=["users"])
# app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
#
# security = HTTPBearer()
#
# # Authentication dependency
# def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     try:
#         payload = jwt.decode(credentials.credentials, "secret_key", algorithms=["HS256"])
#         user_id = payload.get("user_id")
#         return user_id
#     except:
#         raise HTTPException(status_code=401, detail="Invalid token")
#
# # Database dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
#
# # Fraud detection endpoint
# @app.post("/api/detect_fraud", response_model=dict)
# async def fraud_detection_endpoint(request: FraudDetectionRequest, db: Session = Depends(get_db)):
#     return await detect_fraud(request)
#
# @app.get("/")
# async def root():
#     return {"message": "Chat API"}
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import jwt
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from routers import users, messages
from fraud_detection import FraudDetectionRequest, detect_fraud
from google.cloud import dialogflow_v2 as dialogflow
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])

security = HTTPBearer()

# Authentication dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, "secret_key", algorithms=["HS256"])
        user_id = payload.get("user_id")
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fraud detection endpoint
@app.post("/api/detect_fraud", response_model=dict)
async def fraud_detection_endpoint(request: FraudDetectionRequest, db: Session = Depends(get_db)):
    return await detect_fraud(request)

# Dialogflow webhook request model
class DialogflowRequest(BaseModel):
    session: str
    queryResult: dict
    responseId: str

# Dialogflow webhook endpoint
@app.post("/webhook")
async def dialogflow_webhook(request: DialogflowRequest):
    try:
        # Extract query text and session from the Dialogflow request
        query_text = request.queryResult.get("queryText", "")
        session_id = request.session.split("/")[-1]  # Extract session ID from session path

        # Initialize Dialogflow session client
        session_client = dialogflow.SessionsClient()
        session = session_client.session_path(project_id="newagent-xly9", session_id=session_id)

        # Create query input
        text_input = dialogflow.TextInput(text=query_text, language_code="pt-br")
        query_input = dialogflow.QueryInput(text=text_input)

        # Send request to Dialogflow
        response = session_client.detect_intent(
            request={"session": session, "query_input": query_input}
        )

        # Extract response text
        fulfillment_text = response.query_result.fulfillment_text

        # Return Dialogflow-compatible response
        return JSONResponse(content={
            "fulfillmentText": fulfillment_text,
            "source": "webhook"
        })
    except Exception as e:
        print(f"Error processing Dialogflow request: {str(e)}")
        return JSONResponse(content={
            "fulfillmentText": "Desculpe, ocorreu um erro ao processar sua solicitação.",
            "source": "webhook"
        }, status_code=500)

@app.get("/")
async def root():
    return {"message": "Chat API"}