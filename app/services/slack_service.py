import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.services.data_store import data_store
from app.models.slack import SlackMessage, SlackBlock, SlackButton, SlackSender

class SlackService:
    def post_notification(self, notif_type: str, payload: Optional[Dict[str, Any]] = None) -> SlackMessage:
        payload = payload or {}
        now_str = "Just now"

        if notif_type == "interview_completed":
            cand_name = payload.get("candidateName", "Dr. Elena Rostova")
            role = payload.get("role", "GenAI Engineer")
            score = payload.get("score", 94)
            rec = payload.get("recommendation", "Strong Hire")
            rec_emoji = "🟢" if rec == "Strong Hire" else "🔵" if rec == "Hire" else "🟡" if rec == "Borderline" else "🔴"

            msg = SlackMessage(
                id=f"SLK-{int(time.time() * 1000)}",
                channel="interview-updates",
                sender=SlackSender(
                    name="AI Interview Copilot Bot",
                    avatar="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    isBot=True
                ),
                timestamp=now_str,
                text=f"⚡ Interview Feedback Submitted for {cand_name}",
                blocks=[
                    SlackBlock(
                        type="header",
                        text=f"🎯 Interview Scorecard Finalized: {cand_name}"
                    ),
                    SlackBlock(
                        type="section",
                        fields=[
                            f"*Role:* {role}",
                            f"*Score:* {score}/100",
                            f"*Recommendation:* {rec_emoji} {rec}",
                            f"*Evaluator:* Sarah Jenkins",
                            f"*Status:* Synced to Workday HCM",
                            f"*Date:* {datetime.now(timezone.utc).strftime('%b %d, %Y')}"
                        ]
                    ),
                    SlackBlock(
                        type="context",
                        text="📝 Summary: Candidate demonstrated deep architectural mastery and clear reasoning."
                    ),
                    SlackBlock(
                        type="actions",
                        buttons=[
                            SlackButton(label="View Radar Scorecard", action="view_scorecard", style="primary"),
                            SlackButton(label="Approve in Workday", action="approve_workday", style="default")
                        ]
                    )
                ]
            )
        elif notif_type == "reminder":
            cand_name = payload.get("candidateName", "Carlos Delgado")
            inv_name = payload.get("interviewerName", "Kavita Nair")
            msg = SlackMessage(
                id=f"SLK-{int(time.time() * 1000)}",
                channel="interview-updates",
                sender=SlackSender(
                    name="Recruiter Bot",
                    avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
                    isBot=True
                ),
                timestamp=now_str,
                text="⏰ Feedback Pending Reminder sent to Interviewer.",
                blocks=[
                    SlackBlock(type="header", text="⏰ Feedback Reminder Dispatched"),
                    SlackBlock(
                        type="section",
                        fields=[
                            f"*Candidate:* {cand_name}",
                            f"*Interviewer:* {inv_name}",
                            "*Urgency:* High (SLA: 4 hours remaining)"
                        ]
                    )
                ]
            )
        else:
            cand_name = payload.get("candidateName", "Dr. Elena Rostova")
            msg = SlackMessage(
                id=f"SLK-{int(time.time() * 1000)}",
                channel="hiring-pipeline",
                sender=SlackSender(
                    name="Interview Copilot Bot",
                    avatar="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    isBot=True
                ),
                timestamp=now_str,
                text=f"📌 Status Update: Candidate {cand_name} moved to Offer Approval pipeline.",
                blocks=[
                    SlackBlock(
                        type="section",
                        text=f"Candidate *{cand_name}* was approved for offer package generation by Hiring Manager."
                    )
                ]
            )

        data_store.add_slack_message(msg)
        data_store.demo_step = 9
        return msg

slack_service = SlackService()
