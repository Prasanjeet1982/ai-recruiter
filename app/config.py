import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"

CANDIDATES_FILE = DATA_DIR / "candidates.json"
QUESTIONS_FILE = DATA_DIR / "questions.json"
INTERVIEWERS_FILE = DATA_DIR / "interviewers.json"
HIRING_MANAGERS_FILE = DATA_DIR / "hiringManagers.json"
HISTORICAL_INTERVIEWS_FILE = DATA_DIR / "historicalInterviews.json"
WORKDAY_RECORDS_FILE = DATA_DIR / "mockWorkdayRecords.json"
SLACK_MESSAGES_FILE = DATA_DIR / "mockSlackMessages.json"
