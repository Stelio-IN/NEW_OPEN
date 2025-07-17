from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Message, User
from schemas import MessageCreate, MessageOut
from auth import get_db, get_current_user
import logging

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def normalize_phone(phone: str) -> str:
    """Normalize phone number by removing non-digits and ensuring + prefix."""
    if not phone:
        return phone
    cleaned = ''.join(filter(str.isdigit, phone.strip()))
    normalized = f"+{cleaned}" if not phone.startswith('+') else phone
    logger.info(f"Normalized phone: {phone} -> {normalized}")
    return normalized

@router.post("/send", response_model=MessageOut)
def send_message(
        msg: MessageCreate,
        db: Session = Depends(get_db),
        current_user=Depends(get_current_user)
):
    normalized_phone = normalize_phone(msg.receiver_phone)
    receiver = db.query(User).filter_by(phone=normalized_phone).first()
    if not receiver:
        logger.error(f"User not found for phone: {normalized_phone}")
        raise HTTPException(status_code=404, detail="Destinatário não encontrado")
    if receiver.id == current_user.id:
        raise HTTPException(status_code=400, detail="Não pode enviar mensagem para si mesmo")

    message = Message(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        content=msg.content
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    message.sender_username = current_user.username
    message.receiver_username = receiver.username
    message.sender_phone = current_user.phone
    message.receiver_phone = receiver.phone

    return message

@router.get("/inbox", response_model=list[MessageOut])
def get_inbox(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    messages = db.query(Message).filter(Message.receiver_id == current_user.id).all()

    for msg in messages:
        sender = db.query(User).filter_by(id=msg.sender_id).first()
        msg.sender_username = sender.username
        msg.sender_phone = sender.phone
        msg.receiver_username = current_user.username
        msg.receiver_phone = current_user.phone

    return messages

@router.get("/sent", response_model=list[MessageOut])
def get_sent_messages(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    messages = db.query(Message).filter(Message.sender_id == current_user.id).all()

    for msg in messages:
        receiver = db.query(User).filter_by(id=msg.receiver_id).first()
        msg.sender_username = current_user.username
        msg.sender_phone = current_user.phone
        msg.receiver_username = receiver.username
        msg.receiver_phone = receiver.phone

    return messages