const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. CANDIDATES (20 Candidates across 5 roles)
const candidates = [
  // GenAI Engineer (4)
  {
    id: "CAND-101",
    name: "Dr. Elena Rostova",
    role: "GenAI Engineer",
    experienceYears: 7,
    skills: ["PyTorch", "LLaMA 3", "LangChain", "LoRA Fine-tuning", "vLLM", "Vector DBs (Qdrant/Pinecone)"],
    resumeSummary: "PhD in NLP. Spearheaded enterprise LLM deployment serving 2M daily requests. Optimized latency by 45% using FP8 quantization and vLLM inference engine.",
    interviewStage: "Scheduled",
    assignedInterviewerId: "INT-001",
    assignedInterviewerName: "Sarah Jenkins (Lead AI Scientist)",
    hiringManagerId: "HM-001",
    email: "elena.rostova@techmail.io",
    location: "San Francisco, CA (Hybrid)",
    education: "Ph.D. in Computer Science - Stanford University",
    targetSalary: "$210,000 - $230,000",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-102",
    name: "Marcus Vance",
    role: "GenAI Engineer",
    experienceYears: 5,
    skills: ["Hugging Face", "RAG Pipeline", "Prompt Engineering", "OpenAI APIs", "FastAPI", "ChromaDB"],
    resumeSummary: "Built conversational agent pipelines for FinTech compliance. Implemented hybrid semantic + BM25 search retrieval with cross-encoder reranking.",
    interviewStage: "Screening",
    assignedInterviewerId: "INT-002",
    assignedInterviewerName: "David Chen (Staff ML Engineer)",
    hiringManagerId: "HM-001",
    email: "marcus.vance@aiworks.org",
    location: "Austin, TX (Remote)",
    education: "M.S. in Artificial Intelligence - UT Austin",
    targetSalary: "$180,000 - $195,000",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-103",
    name: "Priya Sharma",
    role: "GenAI Engineer",
    experienceYears: 6,
    skills: ["Agentic Workflows", "LangGraph", "Semantic Kernel", "Guardrails AI", "Docker", "Python"],
    resumeSummary: "Specialized in multi-agent LLM systems with autonomous tool calling and human-in-the-loop validation. Authored internal AI safety guidelines.",
    interviewStage: "Scheduled",
    assignedInterviewerId: "INT-001",
    assignedInterviewerName: "Sarah Jenkins (Lead AI Scientist)",
    hiringManagerId: "HM-001",
    email: "priya.sharma@innovate.tech",
    location: "New York, NY (Hybrid)",
    education: "B.S. in Computer Science - IIT Bombay",
    targetSalary: "$195,000 - $215,000",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-104",
    name: "Jordan Lee",
    role: "GenAI Engineer",
    experienceYears: 4,
    skills: ["PyTorch", "Hugging Face", "CUDA", "TensorRT-LLM", "AWS Bedrock", "Glow"],
    resumeSummary: "Hardware-accelerated deep learning practitioner. Reduced GPU compute cost by 38% through model pruning and flash-attention v2 optimizations.",
    interviewStage: "Completed",
    assignedInterviewerId: "INT-002",
    assignedInterviewerName: "David Chen (Staff ML Engineer)",
    hiringManagerId: "HM-001",
    email: "jordan.lee@hyperai.dev",
    location: "Seattle, WA (Remote)",
    education: "B.S. in Data Science - University of Washington",
    targetSalary: "$175,000 - $190,000",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    overallScore: 88,
    recommendation: "Strong Hire"
  },

  // AI Architect (4)
  {
    id: "CAND-105",
    name: "Vikram Malhotra",
    role: "AI Architect",
    experienceYears: 12,
    skills: ["Enterprise AI Architecture", "MLOps", "Model Governance", "Kubeflow", "Triton Server", "Cost Engineering"],
    resumeSummary: "Ex-Google Chief Solutions Architect. Architected global AI fabric processing 100M+ inferences/day. Led AI governance and NIST compliance across 40+ engineering squads.",
    interviewStage: "Scheduled",
    assignedInterviewerId: "INT-003",
    assignedInterviewerName: "Sophia Zhang (VP of Engineering)",
    hiringManagerId: "HM-002",
    email: "vikram.malhotra@cloudai.com",
    location: "San Jose, CA (Onsite)",
    education: "M.S. in Computer Systems - Carnegie Mellon",
    targetSalary: "$260,000 - $290,000",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-106",
    name: "Amara Okonkwo",
    role: "AI Architect",
    experienceYears: 10,
    skills: ["Multi-Tenant AI Platforms", "Vector Search Scale", "AWS SageMaker", "Kafka AI Streaming", "Security Enclaves"],
    resumeSummary: "Engineered zero-trust enterprise LLM gateway with automated PII masking, token rate-limiting, and cost allocation telemetry.",
    interviewStage: "Feedback Pending",
    assignedInterviewerId: "INT-004",
    assignedInterviewerName: "Alex Rivera (Principal Architect)",
    hiringManagerId: "HM-002",
    email: "amara.okonkwo@enterprise.io",
    location: "Atlanta, GA (Hybrid)",
    education: "B.S. in Electrical & Computer Eng - Georgia Tech",
    targetSalary: "$240,000 - $265,000",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-107",
    name: "Liam O'Connor",
    role: "AI Architect",
    experienceYears: 9,
    skills: ["Distributed Training", "Ray", "Slurm", "NeMo Framework", "On-Premises GPU Clusters", "Azure AI"],
    resumeSummary: "Architected 512-H100 GPU cluster for training custom domain foundation models with zero-checkpointing downtime.",
    interviewStage: "Screening",
    assignedInterviewerId: "INT-003",
    assignedInterviewerName: "Sophia Zhang (VP of Engineering)",
    hiringManagerId: "HM-002",
    email: "liam.oconnor@deepgrid.ie",
    location: "Boston, MA (Remote)",
    education: "M.S. in Distributed Systems - MIT",
    targetSalary: "$250,000 - $275,000",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-108",
    name: "Rachel Goldman",
    role: "AI Architect",
    experienceYears: 11,
    skills: ["Generative AI Governance", "SOC2/HIPAA for AI", "Enterprise Search", "GCP Vertex Architecture"],
    resumeSummary: "Designed healthcare AI pipeline adhering to strict HIPAA protocols with on-device anonymization and differential privacy.",
    interviewStage: "Completed",
    assignedInterviewerId: "INT-004",
    assignedInterviewerName: "Alex Rivera (Principal Architect)",
    hiringManagerId: "HM-002",
    email: "rachel.goldman@medai.org",
    location: "Chicago, IL (Hybrid)",
    education: "B.S. in Computer Science - Northwestern University",
    targetSalary: "$245,000 - $270,000",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    overallScore: 92,
    recommendation: "Strong Hire"
  },

  // Data Engineer (4)
  {
    id: "CAND-109",
    name: "Rajesh Kothari",
    role: "Data Engineer",
    experienceYears: 6,
    skills: ["Apache Spark", "Apache Iceberg", "dbt", "Snowflake", "Kafka Streaming", "Airflow", "Python/PySpark"],
    resumeSummary: "Designed real-time event streaming lakehouse supporting 4TB/day ingestion. Cut batch processing times from 6 hours to 45 minutes using dbt & Iceberg.",
    interviewStage: "Scheduled",
    assignedInterviewerId: "INT-005",
    assignedInterviewerName: "Kavita Nair (Staff Data Engineer)",
    hiringManagerId: "HM-003",
    email: "rajesh.kothari@datalake.io",
    location: "Dallas, TX (Hybrid)",
    education: "M.S. in Computer Engineering - Texas A&M",
    targetSalary: "$165,000 - $185,000",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-110",
    name: "Hannah Schmidt",
    role: "Data Engineer",
    experienceYears: 5,
    skills: ["Databricks", "Delta Lake", "PySpark", "Kafka", "Great Expectations", "PostgreSQL"],
    resumeSummary: "Built automated data quality monitoring across 150+ operational data tables. Decreased pipeline failure triage time by 70%.",
    interviewStage: "Screening",
    assignedInterviewerId: "INT-006",
    assignedInterviewerName: "Marcus Sterling (Lead Data Architect)",
    hiringManagerId: "HM-003",
    email: "hannah.schmidt@datapipe.de",
    location: "Denver, CO (Remote)",
    education: "B.S. in Mathematics & CS - TU Munich",
    targetSalary: "$155,000 - $170,000",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-111",
    name: "Carlos Delgado",
    role: "Data Engineer",
    experienceYears: 8,
    skills: ["ClickHouse", "Flink", "Kafka Streams", "BigQuery", "Terraform Data", "Python"],
    resumeSummary: "Engineered ultra-low latency real-time analytical engine querying 500M+ financial ticker rows in sub-100ms.",
    interviewStage: "Feedback Pending",
    assignedInterviewerId: "INT-005",
    assignedInterviewerName: "Kavita Nair (Staff Data Engineer)",
    hiringManagerId: "HM-003",
    email: "carlos.delgado@fintechdata.com",
    location: "Miami, FL (Hybrid)",
    education: "B.S. in Computer Science - University of Florida",
    targetSalary: "$175,000 - $195,000",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-112",
    name: "Zoe Chen",
    role: "Data Engineer",
    experienceYears: 4,
    skills: ["AWS Glue", "Redshift", "dbt Cloud", "Athena", "Python", "SQL Expert"],
    resumeSummary: "Migrated legacy SQL Server data warehouse to AWS Redshift Serverless, achieving 50% monthly infrastructure cost reduction.",
    interviewStage: "Completed",
    assignedInterviewerId: "INT-006",
    assignedInterviewerName: "Marcus Sterling (Lead Data Architect)",
    hiringManagerId: "HM-003",
    email: "zoe.chen@analytix.io",
    location: "San Francisco, CA (Remote)",
    education: "B.S. in Information Systems - UC Berkeley",
    targetSalary: "$145,000 - $160,000",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    overallScore: 78,
    recommendation: "Hire"
  },

  // Full Stack Engineer (4)
  {
    id: "CAND-113",
    name: "Lucas Barbosa",
    role: "Full Stack Engineer",
    experienceYears: 7,
    skills: ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "TailwindCSS", "PostgreSQL", "Redis"],
    resumeSummary: "Principal UI Architect for SaaS analytics dashboard used by 500k monthly active users. High focus on Web Vitals and 60fps micro-interactions.",
    interviewStage: "Scheduled",
    assignedInterviewerId: "INT-007",
    assignedInterviewerName: "Emily Wong (Engineering Manager - UI)",
    hiringManagerId: "HM-004",
    email: "lucas.barbosa@webstack.dev",
    location: "Austin, TX (Hybrid)",
    education: "B.S. in Computer Science - University of Sao Paulo",
    targetSalary: "$165,000 - $185,000",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-114",
    name: "Maya Lin",
    role: "Full Stack Engineer",
    experienceYears: 5,
    skills: ["React", "Vue.js", "Node.js", "Express", "MongoDB", "WebSockets", "Docker"],
    resumeSummary: "Built real-time collaborative document editor with Operational Transformation (OT) and WebSocket broadcasting engine.",
    interviewStage: "Screening",
    assignedInterviewerId: "INT-008",
    assignedInterviewerName: "Nathaniel Price (Staff Frontend Engineer)",
    hiringManagerId: "HM-004",
    email: "maya.lin@reactflow.org",
    location: "Portland, OR (Remote)",
    education: "B.S. in Software Engineering - Oregon State",
    targetSalary: "$150,000 - $165,000",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-115",
    name: "Tariq Mansoor",
    role: "Full Stack Engineer",
    experienceYears: 8,
    skills: ["TypeScript", "NestJS", "React", "Microfrontends", "Kafka", "PostgreSQL", "Prisma"],
    resumeSummary: "Architected microfrontend orchestration layer decomposing monolithic banking portal into 8 independently deployable domain remotes.",
    interviewStage: "Feedback Pending",
    assignedInterviewerId: "INT-007",
    assignedInterviewerName: "Emily Wong (Engineering Manager - UI)",
    hiringManagerId: "HM-004",
    email: "tariq.mansoor@stackscale.com",
    location: "New York, NY (Hybrid)",
    education: "M.S. in Software Systems - NYU Tandon",
    targetSalary: "$180,000 - $200,000",
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-116",
    name: "Chloe Dubois",
    role: "Full Stack Engineer",
    experienceYears: 4,
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", "Jest/Cypress"],
    resumeSummary: "Delivered design system components adopted by 12 cross-functional product teams with 100% WCAG 2.1 AA accessibility compliance.",
    interviewStage: "Completed",
    assignedInterviewerId: "INT-008",
    assignedInterviewerName: "Nathaniel Price (Staff Frontend Engineer)",
    hiringManagerId: "HM-004",
    email: "chloe.dubois@designtech.fr",
    location: "Montreal, QC (Remote)",
    education: "B.S. in Computer Science - McGill University",
    targetSalary: "$140,000 - $155,000",
    avatarUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80",
    overallScore: 62,
    recommendation: "Borderline"
  },

  // DevOps Engineer (4)
  {
    id: "CAND-117",
    name: "Dmitri Ivanov",
    role: "DevOps Engineer",
    experienceYears: 9,
    skills: ["Kubernetes", "Terraform", "ArgoCD", "Helm", "AWS/EKS", "Prometheus/Grafana", "eBPF"],
    resumeSummary: "Maintained 99.995% uptime across 1,200+ microservices on multi-region Kubernetes clusters. Automated GitOps canary deployments with Argo Rollouts.",
    interviewStage: "Scheduled",
    assignedInterviewerId: "INT-009",
    assignedInterviewerName: "Gary Larson (Director of SRE)",
    hiringManagerId: "HM-005",
    email: "dmitri.ivanov@sreworks.io",
    location: "Raleigh, NC (Hybrid)",
    education: "B.S. in Network Engineering - Moscow State Tech",
    targetSalary: "$185,000 - $210,000",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-118",
    name: "Aaliyah Brooks",
    role: "DevOps Engineer",
    experienceYears: 6,
    skills: ["AWS", "Terraform", "GitHub Actions", "Docker", "Vault", "Datadog", "Python/Bash"],
    resumeSummary: "Automated end-to-end security compliance scanning in CI/CD pipeline, catching 95% of infrastructure misconfigurations pre-merge.",
    interviewStage: "Screening",
    assignedInterviewerId: "INT-010",
    assignedInterviewerName: "Samantha Reed (Principal DevOps Architect)",
    hiringManagerId: "HM-005",
    email: "aaliyah.brooks@cloudops.net",
    location: "Washington, DC (Remote)",
    education: "B.S. in Cybersecurity - University of Maryland",
    targetSalary: "$160,000 - $180,000",
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-119",
    name: "Kenji Sato",
    role: "DevOps Engineer",
    experienceYears: 7,
    skills: ["Kubernetes", "Service Mesh (Istio)", "Chaos Engineering", "GCP (GKE)", "Ansible", "Linux Kernel"],
    resumeSummary: "Implemented Chaos Mesh testing to identify single-points-of-failure; boosted mean-time-to-recovery (MTTR) by 60%.",
    interviewStage: "Feedback Pending",
    assignedInterviewerId: "INT-009",
    assignedInterviewerName: "Gary Larson (Director of SRE)",
    hiringManagerId: "HM-005",
    email: "kenji.sato@srejapan.co.jp",
    location: "San Jose, CA (Hybrid)",
    education: "B.S. in Computer Science - University of Tokyo",
    targetSalary: "$175,000 - $195,000",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-120",
    name: "Oliver Wright",
    role: "DevOps Engineer",
    experienceYears: 3,
    skills: ["Docker", "Jenkins", "AWS (EC2/S3)", "Bash", "Basic Terraform"],
    resumeSummary: "Junior DevOps engineer supporting basic containerization and build pipelines. Limited hands-on experience with production Kubernetes.",
    interviewStage: "Completed",
    assignedInterviewerId: "INT-010",
    assignedInterviewerName: "Samantha Reed (Principal DevOps Architect)",
    hiringManagerId: "HM-005",
    email: "oliver.wright@juniorops.dev",
    location: "London, UK (Remote)",
    education: "B.S. in Information Tech - University of Leeds",
    targetSalary: "$110,000 - $125,000",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    overallScore: 42,
    recommendation: "No Hire"
  }
];

// 2. INTERVIEWERS (10 Interviewers)
const interviewers = [
  {
    id: "INT-001",
    name: "Sarah Jenkins",
    title: "Lead AI Scientist",
    department: "Applied AI Research",
    email: "sarah.jenkins@enterprise.com",
    rating: 4.9,
    activeInterviewsCount: 4,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-002",
    name: "David Chen",
    title: "Staff ML Engineer",
    department: "GenAI Foundations",
    email: "david.chen@enterprise.com",
    rating: 4.8,
    activeInterviewsCount: 3,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-003",
    name: "Sophia Zhang",
    title: "VP of AI Engineering",
    department: "Executive Engineering",
    email: "sophia.zhang@enterprise.com",
    rating: 5.0,
    activeInterviewsCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-004",
    name: "Alex Rivera",
    title: "Principal Architect",
    department: "Enterprise Architecture",
    email: "alex.rivera@enterprise.com",
    rating: 4.7,
    activeInterviewsCount: 5,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-005",
    name: "Kavita Nair",
    title: "Staff Data Engineer",
    department: "Data Platform",
    email: "kavita.nair@enterprise.com",
    rating: 4.9,
    activeInterviewsCount: 3,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-006",
    name: "Marcus Sterling",
    title: "Lead Data Architect",
    department: "Analytics Engineering",
    email: "marcus.sterling@enterprise.com",
    rating: 4.6,
    activeInterviewsCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-007",
    name: "Emily Wong",
    title: "Engineering Manager - UI",
    department: "Frontend Experience",
    email: "emily.wong@enterprise.com",
    rating: 4.8,
    activeInterviewsCount: 4,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-008",
    name: "Nathaniel Price",
    title: "Staff Frontend Engineer",
    department: "Product Engineering",
    email: "nathaniel.price@enterprise.com",
    rating: 4.7,
    activeInterviewsCount: 3,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-009",
    name: "Gary Larson",
    title: "Director of SRE",
    department: "Infrastructure & Security",
    email: "gary.larson@enterprise.com",
    rating: 4.9,
    activeInterviewsCount: 4,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "INT-010",
    name: "Samantha Reed",
    title: "Principal DevOps Architect",
    department: "Cloud Engineering",
    email: "samantha.reed@enterprise.com",
    rating: 4.8,
    activeInterviewsCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80"
  }
];

// 3. HIRING MANAGERS (5 Managers)
const hiringManagers = [
  {
    id: "HM-001",
    name: "Dr. Arthur Vance",
    title: "Head of Generative AI Products",
    department: "GenAI Business Unit",
    email: "arthur.vance@enterprise.com",
    openReqs: 6,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "HM-002",
    name: "Claire Underwood",
    title: "VP of Enterprise Architecture",
    department: "Chief Technology Office",
    email: "claire.underwood@enterprise.com",
    openReqs: 4,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "HM-003",
    name: "Sanjay Patel",
    title: "Director of Global Data Platforms",
    department: "Data & Insights",
    email: "sanjay.patel@enterprise.com",
    openReqs: 5,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "HM-004",
    name: "Rebecca Thorne",
    title: "Senior Director of Web Applications",
    department: "Digital Experience",
    email: "rebecca.thorne@enterprise.com",
    openReqs: 8,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "HM-005",
    name: "Travis Sterling",
    title: "VP of Cloud & Infrastructure",
    department: "Core SRE & Security",
    email: "travis.sterling@enterprise.com",
    openReqs: 5,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
  }
];

fs.writeFileSync(path.join(dataDir, 'candidates.json'), JSON.stringify(candidates, null, 2));
fs.writeFileSync(path.join(dataDir, 'interviewers.json'), JSON.stringify(interviewers, null, 2));
fs.writeFileSync(path.join(dataDir, 'hiringManagers.json'), JSON.stringify(hiringManagers, null, 2));

console.log("Successfully generated candidates, interviewers, and hiring managers!");
