const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 50 Historical Interviews
const historicalInterviews = [];

const roles = ["GenAI Engineer", "AI Architect", "Data Engineer", "Full Stack Engineer", "DevOps Engineer"];
const interviewersList = [
  { id: "INT-001", name: "Sarah Jenkins" },
  { id: "INT-002", name: "David Chen" },
  { id: "INT-003", name: "Sophia Zhang" },
  { id: "INT-004", name: "Alex Rivera" },
  { id: "INT-005", name: "Kavita Nair" },
  { id: "INT-006", name: "Marcus Sterling" },
  { id: "INT-007", name: "Emily Wong" },
  { id: "INT-008", name: "Nathaniel Price" },
  { id: "INT-009", name: "Gary Larson" },
  { id: "INT-010", name: "Samantha Reed" }
];

const sampleNames = [
  "Dr. Elena Rostova", "Marcus Vance", "Priya Sharma", "Jordan Lee",
  "Vikram Malhotra", "Amara Okonkwo", "Liam O'Connor", "Rachel Goldman",
  "Rajesh Kothari", "Hannah Schmidt", "Carlos Delgado", "Zoe Chen",
  "Lucas Barbosa", "Maya Lin", "Tariq Mansoor", "Chloe Dubois",
  "Dmitri Ivanov", "Aaliyah Brooks", "Kenji Sato", "Oliver Wright",
  "Sebastian Miller", "Claire Fontaine", "Devon Taylor", "Anya Petrov",
  "Gabriel Santos", "Fatima Al-Mansoor", "Lars Lindqvist", "Mei-Ling Zhou",
  "Arthur Pendelton", "Naomi Osaka-Smith", "Isaac Newton-John", "Siddharth Rao",
  "Valeria Gomez", "Kofi Annan-Boateng", "Jonas Salk", "Hanna Vance",
  "Kareem Abdul-Jabbar", "Silvia Rossi", "Thabo Mbeki", "Hiroshi Tanaka",
  "Leila Benali", "Mateo Hernandez", "Evelyn Reed", "Dante Alighieri",
  "Nadia Boulanger", "Willem Dafoe-Lee", "Grace Hopper-Diaz", "Alan Turing-Lin",
  "Ada Lovelace-Park", "Claude Shannon-Roy"
];

for (let i = 1; i <= 50; i++) {
  const roleIndex = (i - 1) % roles.length;
  const role = roles[roleIndex];
  const candName = sampleNames[i - 1] || `Candidate ${i}`;
  const interviewer = interviewersList[(i - 1) % interviewersList.length];

  // Score distribution: realistic bell curve
  // 15 Strong Hire (>85), 20 Hire (70-85), 10 Borderline (50-69), 5 No Hire (<50)
  let score;
  let rec;
  if (i <= 15) {
    score = Math.floor(86 + Math.random() * 12); // 86 - 98
    rec = "Strong Hire";
  } else if (i <= 35) {
    score = Math.floor(70 + Math.random() * 15); // 70 - 85
    rec = "Hire";
  } else if (i <= 45) {
    score = Math.floor(52 + Math.random() * 17); // 52 - 69
    rec = "Borderline";
  } else {
    score = Math.floor(35 + Math.random() * 14); // 35 - 49
    rec = "No Hire";
  }

  const techScore = Math.min(5, Math.max(1, Math.round((score / 100) * 5 * (0.9 + Math.random() * 0.2))));
  const probScore = Math.min(5, Math.max(1, Math.round((score / 100) * 5 * (0.88 + Math.random() * 0.22))));
  const commScore = Math.min(5, Math.max(1, Math.round((score / 100) * 5 * (0.85 + Math.random() * 0.25))));
  const archScore = Math.min(5, Math.max(1, Math.round((score / 100) * 5 * (0.92 + Math.random() * 0.18))));
  const codeScore = Math.min(5, Math.max(1, Math.round((score / 100) * 5 * (0.9 + Math.random() * 0.2))));

  // Dates spread over past 60 days
  const daysAgo = Math.floor(Math.random() * 58) + 1;
  const dateObj = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const dateStr = dateObj.toISOString().split('T')[0];

  historicalInterviews.push({
    id: `INT-REC-${1000 + i}`,
    candidateId: `CAND-${100 + ((i - 1) % 20) + 1}`,
    candidateName: candName,
    candidateRole: role,
    interviewerId: interviewer.id,
    interviewerName: interviewer.name,
    hiringManagerId: `HM-00${roleIndex + 1}`,
    date: dateStr,
    status: i % 10 === 0 ? "Feedback Pending" : "Completed",
    mode: i % 3 === 0 ? "MCQ" : i % 3 === 1 ? "Subjective" : "Hybrid",
    totalScore: score,
    recommendation: rec,
    competencyScores: {
      technicalKnowledge: techScore,
      problemSolving: probScore,
      communication: commScore,
      architectureSkills: archScore,
      codingSkills: codeScore
    },
    summary: {
      strengths: [
        `Demonstrated crisp command of ${role} paradigms and modern toolchains.`,
        "Articulated system trade-offs with structured, first-principles logic.",
        "Proactively addressed scalability, latency, and edge failure modes."
      ],
      weaknesses: rec === "Strong Hire" ? ["Minor deep-dive needed on edge-case telemetry."] : [
        "Needs deeper familiarity with production incident triage.",
        "Could strengthen knowledge of multi-region replication mechanics."
      ],
      keyObservations: [
        `Strong cultural alignment with engineering rigor; confident in ${role} methodologies.`,
        "Quickly incorporated interviewer hints and adjusted design proposals."
      ],
      areasForImprovement: [
        "Hands-on practice with extreme high-concurrency stress testing.",
        "Expanding cross-functional architectural documentation."
      ],
      overallSummary: `Candidate displayed ${rec === 'Strong Hire' ? 'exceptional mastery and standout technical acumen' : rec === 'Hire' ? 'solid fundamentals and reliable execution capability' : rec === 'Borderline' ? 'acceptable baseline skills but clear depth gaps' : 'significant knowledge gaps'} throughout the structured evaluation.`
    },
    workdaySynced: i % 4 !== 0,
    workdaySyncTimestamp: i % 4 !== 0 ? `${dateStr}T16:30:00Z` : undefined,
    slackNotified: true,
    slackNotificationTimestamp: `${dateStr}T16:31:00Z`
  });
}

// Workday Records Seed
const mockWorkdayRecords = [
  {
    id: "WD-1001",
    reqNumber: "REQ-2026-084",
    jobTitle: "Lead GenAI Engineer",
    candidateId: "CAND-101",
    candidateName: "Dr. Elena Rostova",
    stage: "Assessment / Interview",
    submittedBy: "Sarah Jenkins",
    submittedAt: "2026-08-16T14:30:00Z",
    scorecardStatus: "Submitted",
    overallRating: "Strong Hire (94/100)",
    recommendation: "Strong Hire",
    notes: "Outstanding depth in vLLM, PagedAttention, and distributed LoRA fine-tuning. Highly recommended for offer."
  },
  {
    id: "WD-1002",
    reqNumber: "REQ-2026-092",
    jobTitle: "Principal AI Architect",
    candidateId: "CAND-105",
    candidateName: "Vikram Malhotra",
    stage: "Offer Preparation",
    submittedBy: "Sophia Zhang",
    submittedAt: "2026-08-15T11:15:00Z",
    scorecardStatus: "Submitted",
    overallRating: "Strong Hire (96/100)",
    recommendation: "Strong Hire",
    notes: "Ex-Google architect with unparalleled enterprise LLM gateway design and AI governance leadership."
  },
  {
    id: "WD-1003",
    reqNumber: "REQ-2026-041",
    jobTitle: "Senior Data Engineer",
    candidateId: "CAND-109",
    candidateName: "Rajesh Kothari",
    stage: "Interview Complete",
    submittedBy: "Kavita Nair",
    submittedAt: "2026-08-14T17:45:00Z",
    scorecardStatus: "Submitted",
    overallRating: "Hire (82/100)",
    recommendation: "Hire",
    notes: "Strong knowledge of Iceberg ACID transactions and Flink 2PC checkpointing."
  }
];

// Slack Messages Seed
const mockSlackMessages = [
  {
    id: "SLK-MSG-001",
    channel: "interview-updates",
    sender: {
      name: "Interview Copilot Bot",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      isBot: true
    },
    timestamp: "Today at 10:30 AM",
    text: "🎉 Interview Completed & Feedback Submitted!",
    blocks: [
      {
        type: "header",
        text: "⚡ AI Interview Copilot: Evaluation Completed"
      },
      {
        type: "section",
        fields: [
          "*Candidate:* Dr. Elena Rostova",
          "*Role:* GenAI Engineer",
          "*Interviewer:* Sarah Jenkins",
          "*Overall Score:* 94 / 100",
          "*Recommendation:* 🟢 Strong Hire",
          "*Status:* Synced to Workday HCM"
        ]
      },
      {
        type: "context",
        text: "💡 Key Strength: Flawless mathematical mastery of PagedAttention & LoRA rank decomposition."
      }
    ]
  },
  {
    id: "SLK-MSG-002",
    channel: "hiring-pipeline",
    sender: {
      name: "Arthur Vance (HM)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      isBot: false
    },
    timestamp: "Today at 10:45 AM",
    text: "Reviewed Dr. Elena Rostova's radar scorecard generated by the platform. The competency balance on Architecture (5/5) and Coding (5/5) is stellar. Let's fast-track the offer letter!",
    blocks: [
      {
        type: "section",
        text: "Reviewed Dr. Elena Rostova's radar scorecard generated by the platform. The competency balance on Architecture (5/5) and Coding (5/5) is stellar. Let's fast-track the offer letter!"
      }
    ]
  },
  {
    id: "SLK-MSG-003",
    channel: "interview-updates",
    sender: {
      name: "Interview Copilot Bot",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      isBot: true
    },
    timestamp: "Yesterday at 4:15 PM",
    text: "📅 Interview Scheduled: Vikram Malhotra for Principal AI Architect with Sophia Zhang on Mon, Aug 17, 2:00 PM.",
    blocks: [
      {
        type: "header",
        text: "📅 New Interview Scheduled"
      },
      {
        type: "section",
        fields: [
          "*Candidate:* Vikram Malhotra",
          "*Position:* Principal AI Architect",
          "*Interviewer:* Sophia Zhang (VP Eng)",
          "*Scheduled Time:* Mon, Aug 17, 2:00 PM PST"
        ]
      }
    ]
  }
];

fs.writeFileSync(path.join(dataDir, 'historicalInterviews.json'), JSON.stringify(historicalInterviews, null, 2));
fs.writeFileSync(path.join(dataDir, 'mockWorkdayRecords.json'), JSON.stringify(mockWorkdayRecords, null, 2));
fs.writeFileSync(path.join(dataDir, 'mockSlackMessages.json'), JSON.stringify(mockSlackMessages, null, 2));

console.log("Successfully generated historical interviews, Workday records, and Slack messages!");
