from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class SlackSender(BaseModel):
    name: str
    avatar: str
    isBot: bool

class SlackButton(BaseModel):
    label: str
    action: str
    style: Optional[str] = "default"

class SlackBlock(BaseModel):
    type: str  # header, section, actions, context, divider
    text: Optional[str] = None
    fields: Optional[List[str]] = None
    buttons: Optional[List[SlackButton]] = None

class SlackMessage(BaseModel):
    id: str
    channel: str
    sender: SlackSender
    timestamp: str
    text: str
    blocks: Optional[List[SlackBlock]] = None
