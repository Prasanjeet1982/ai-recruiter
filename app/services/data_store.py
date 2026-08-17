import json
import os
from typing import List, Optional, Dict, Any
from app.config import (
    CANDIDATES_FILE,
    QUESTIONS_FILE,
    INTERVIEWERS_FILE,
    HIRING_MANAGERS_FILE,
    HISTORICAL_INTERVIEWS_FILE,
    WORKDAY_RECORDS_FILE,
    SLACK_MESSAGES_FILE
)
from app.models.candidate import Candidate, Interviewer, HiringManager
from app.models.question import Question
from app.models.interview import InterviewRecord, ActiveInterviewSession
from app.models.workday import WorkdayRecord
from app.models.slack import SlackMessage

class DataStore:
    def __init__(self):
        self.candidates: List[Candidate] = []
        self.questions: List[Question] = []
        self.interviewers: List[Interviewer] = []
        self.hiring_managers: List[HiringManager] = []
        self.historical_interviews: List[InterviewRecord] = []
        self.workday_records: List[WorkdayRecord] = []
        self.slack_messages: List[SlackMessage] = []
        self.active_session: Optional[ActiveInterviewSession] = None
        self.demo_step: int = 1
        self.load_all()

    def _read_json(self, filepath):
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def load_all(self):
        cand_data = self._read_json(CANDIDATES_FILE)
        self.candidates = [Candidate(**c) for c in cand_data]

        q_data = self._read_json(QUESTIONS_FILE)
        self.questions = [Question(**q) for q in q_data]

        inv_data = self._read_json(INTERVIEWERS_FILE)
        self.interviewers = [Interviewer(**i) for i in inv_data]

        hm_data = self._read_json(HIRING_MANAGERS_FILE)
        self.hiring_managers = [HiringManager(**h) for h in hm_data]

        hist_data = self._read_json(HISTORICAL_INTERVIEWS_FILE)
        self.historical_interviews = [InterviewRecord(**h) for h in hist_data]

        wd_data = self._read_json(WORKDAY_RECORDS_FILE)
        self.workday_records = [WorkdayRecord(**w) for w in wd_data]

        slk_data = self._read_json(SLACK_MESSAGES_FILE)
        self.slack_messages = [SlackMessage(**s) for s in slk_data]

    def get_candidate(self, candidate_id: str) -> Optional[Candidate]:
        for c in self.candidates:
            if c.id == candidate_id:
                return c
        return None

    def update_candidate(self, candidate_id: str, updates: Dict[str, Any]) -> Optional[Candidate]:
        for idx, c in enumerate(self.candidates):
            if c.id == candidate_id:
                updated_data = c.model_dump()
                updated_data.update(updates)
                self.candidates[idx] = Candidate(**updated_data)
                return self.candidates[idx]
        return None

    def add_historical_interview(self, record: InterviewRecord):
        self.historical_interviews.insert(0, record)

    def add_workday_record(self, record: WorkdayRecord):
        self.workday_records.insert(0, record)

    def add_slack_message(self, message: SlackMessage):
        self.slack_messages.insert(0, message)

    def reset_to_defaults(self):
        self.active_session = None
        self.demo_step = 1
        self.load_all()

data_store = DataStore()
