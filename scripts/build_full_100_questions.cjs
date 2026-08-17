const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// We will construct 20 comprehensive questions for each of the 5 roles = 100 questions.
// Roles:
// 1. GenAI Engineer (20)
// 2. AI Architect (20)
// 3. Data Engineer (20)
// 4. Full Stack Engineer (20)
// 5. DevOps Engineer (20)

const questions = [];

const roles = [
  "GenAI Engineer",
  "AI Architect",
  "Data Engineer",
  "Full Stack Engineer",
  "DevOps Engineer"
];

// Helper to create rich questions
const genAiQuestions = [
  {
    id: "GENAI-001",
    diff: "Advanced",
    type: "Subjective",
    comp: "Technical Knowledge",
    q: "How does LoRA (Low-Rank Adaptation) enable parameter-efficient fine-tuning of large language models, and how do you choose rank r and alpha?",
    pre: [
      { id: "resp_a", label: "Response A (Deep Mathematical & Practical Mastery)", transcript: "LoRA freezes pre-trained weights W_0 and injects trainable rank decomposition matrices A and B (W = W_0 + (alpha/r)*B*A). Matrix B is zero-initialized, A is Gaussian. Rank r is chosen between 8-64 depending on task complexity; alpha is set to 2*r. Merging weights post-training eliminates any inference latency penalty.", score: 10, strength: "Precise formula, matrix initialization logic, and practical hyperparameter guidelines.", weakness: "None.", followUpQuestions: ["How does QLoRA 4-bit NormalFloat compare to LoRA?", "How do you avoid catastrophic forgetting during adaptation?"] },
      { id: "resp_b", label: "Response B (Solid Understanding)", transcript: "LoRA freezes the base model and trains small adapter matrices. It cuts memory usage dramatically. Rank r controls the size of the adapter and alpha is a multiplier. You can merge weights for inference.", score: 7, strength: "Good understanding of frozen weights and adapter merging.", weakness: "Omitted matrix initialization details and scaling math.", followUpQuestions: ["Why is matrix B initialized to zeros?", "What happens if rank r is too high?"] },
      { id: "resp_c", label: "Response C (Surface Level)", transcript: "LoRA trains small adapter weights instead of the full model. It saves GPU memory so you can train on smaller GPUs using Hugging Face PEFT.", score: 4, strength: "Understands memory savings and PEFT tooling.", weakness: "Lacks architectural mechanics and matrix decomposition understanding.", followUpQuestions: ["What does rank r represent in matrix math?", "How does LoRA differ from full fine-tuning?"] }
    ]
  },
  {
    id: "GENAI-002",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "When deploying high-throughput LLM inference with vLLM, which mechanism eliminates KV-cache memory fragmentation?",
    opts: ["FlashAttention v2 chunking", "PagedAttention with virtual memory block allocation", "Rotary Positional Embedding (RoPE) compression", "ZeRO-3 optimizer offloading"],
    ans: "PagedAttention with virtual memory block allocation",
    exp: "PagedAttention partitions the KV cache into fixed-size virtual blocks, eliminating internal and external memory fragmentation."
  },
  {
    id: "GENAI-003",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you mitigate hallucinations in an enterprise Retrieval-Augmented Generation (RAG) system handling legal and financial queries?",
    pre: [
      { id: "resp_a", label: "Response A (Multi-Layer Defense)", transcript: "We implement a 4-tier pipeline: 1) Hybrid retrieval (dense embeddings + BM25) with cross-encoder reranking. 2) Grounded system prompts enforcing strict citation. 3) Output guardrails (NeMo Guardrails / Guardrails AI). 4) Automated verification using RAGAS Faithfulness metrics with confidence thresholding.", score: 9, strength: "Covers ingestion, hybrid search, reranking, guardrails, and RAGAS metrics.", weakness: "Could expand on resolving contradictory multi-document facts.", followUpQuestions: ["How do you handle contradictory documents in retrieval?", "What is the latency cost of cross-encoder reranking?"] },
      { id: "resp_b", label: "Response B (Prompt & Parameter Tuning)", transcript: "We set temperature to 0, use strict system prompts telling the model only to use context, and use smaller 512-token chunks with 50-token overlap.", score: 6, strength: "Good practical basics (temp 0, chunk overlap).", weakness: "Lacks evaluation metrics, rerankers, or output guardrail layers.", followUpQuestions: ["Why can high top-k retrieval increase hallucinations?", "How do you systematically benchmark RAG accuracy?"] }
    ]
  },
  {
    id: "GENAI-004",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "Which evaluation metric in the RAGAS framework measures whether the generated answer is strictly grounded in retrieved context?",
    opts: ["Context Recall", "Answer Relevance", "Faithfulness", "Context Precision"],
    ans: "Faithfulness",
    exp: "Faithfulness evaluates whether every claim in the response is supported by the retrieved context chunks."
  },
  {
    id: "GENAI-005",
    diff: "Advanced",
    type: "Scenario",
    comp: "Architecture Skills",
    scenario: "An enterprise customer service agent needs to perform multi-step actions: query orders via REST, check inventory via SQL, and issue refunds up to $100 autonomously while escalating higher amounts.",
    q: "How would you architect this multi-agent tool-calling system to guarantee state persistence, idempotency, and human-in-the-loop oversight?",
    pre: [
      { id: "resp_a", label: "Response A (State-Graph Architecture)", transcript: "Implement a state graph using LangGraph with persistent checkpointers. Use strict Pydantic JSON tool schemas, idempotency keys for API calls, and a conditional gate that halts refunds >$100, transitions to WAITING_APPROVAL, and dispatches a Slack approval webhook.", score: 10, strength: "Comprehensive state machine, idempotency guarantees, and webhook approval hook.", weakness: "None.", followUpQuestions: ["How do you handle API timeouts during intermediate steps?", "How is state serialized in distributed workers?"] },
      { id: "resp_b", label: "Response B (Simple Function Calling)", transcript: "Use OpenAI function calling in a while loop. Check if refund > 100, then send an email to the supervisor before calling the tool.", score: 6, strength: "Basic understanding of function calling and threshold logic.", weakness: "Lacks state checkpointing, crash recovery, and idempotency.", followUpQuestions: ["What happens if the server crashes during execution?", "How do you secure SQL queries against injection?"] }
    ]
  },
  {
    id: "GENAI-006",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the primary role of the 'temperature' parameter in autoregressive LLMs?",
    opts: ["Controls the maximum token length of output", "Scales logits before softmax to adjust probability entropy and creativity", "Sets CPU cooling fan speeds", "Filters tokens based on frequency"],
    ans: "Scales logits before softmax to adjust probability entropy and creativity",
    exp: "Temperature divides logits prior to softmax; lower values yield deterministic outputs while higher values increase randomness."
  },
  {
    id: "GENAI-007",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In PyTorch, which precision format provides the same dynamic range as FP32 while halving memory footprint without requiring loss scaling?",
    opts: ["FP16", "BF16 (Bfloat16)", "INT8", "FP4"],
    ans: "BF16 (Bfloat16)",
    exp: "BF16 has an 8-bit exponent identical to FP32, maintaining full dynamic range without underflow issues."
  },
  {
    id: "GENAI-008",
    diff: "Advanced",
    type: "Subjective",
    comp: "Coding Skills",
    q: "How do you implement streaming Server-Sent Events (SSE) for LLMs in FastAPI with graceful client disconnect handling?",
    pre: [
      { id: "resp_a", label: "Response A (Robust Streaming)", transcript: "Use FastAPI StreamingResponse with text/event-stream. Wrap an async generator consuming the LLM stream. Format chunks as 'data: {json}\\n\\n'. Wrap iteration in try/finally to catch client disconnects via request.is_disconnected() or asyncio.CancelledError, immediately aborting upstream GPU inference.", score: 10, strength: "Proper SSE formatting, async generator, and GPU compute abort on client disconnect.", weakness: "None.", followUpQuestions: ["How do you batch tokens to reduce HTTP packet overhead?", "How do you handle backpressure in slow clients?"] },
      { id: "resp_b", label: "Response B (Basic Streaming)", transcript: "Return a StreamingResponse with media type event-stream and yield tokens from a loop over the model stream.", score: 6, strength: "Uses StreamingResponse.", weakness: "Misses SSE line protocol and disconnect cancellation.", followUpQuestions: ["What happens to GPU memory if client closes tab?", "What is the SSE protocol delimiter?"] }
    ]
  },
  {
    id: "GENAI-009",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "Which vector distance metric is mathematically equivalent to Cosine Similarity when embedding vectors are normalized to unit length?",
    opts: ["Dot Product (Inner Product)", "Manhattan Distance (L1)", "Minkowski Distance", "Hamming Distance"],
    ans: "Dot Product (Inner Product)",
    exp: "When ||A|| = ||B|| = 1, Dot Product equals Cosine Similarity and is faster to compute."
  },
  {
    id: "GENAI-010",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Problem Solving",
    q: "When chunking Markdown documents containing complex tables for RAG, what is the best strategy?",
    opts: ["Fixed character chunking every 200 chars", "Structure-aware chunking preserving tables as atomic units with section headers", "Stripping tables completely", "Converting tables to raw images only"],
    ans: "Structure-aware chunking preserving tables as atomic units with section headers",
    exp: "Structure-aware chunking retains table rows/columns together and attaches hierarchical headers for context."
  },
  {
    id: "GENAI-011",
    diff: "Advanced",
    type: "Subjective",
    comp: "Architecture Skills",
    q: "Explain the differences between Dense Retrieval, Sparse Retrieval (BM25), and Hybrid Search with Reciprocal Rank Fusion (RRF).",
    pre: [
      { id: "resp_a", label: "Response A (Deep Algorithmic Comparison)", transcript: "Dense retrieval captures semantic meaning but misses exact keywords/IDs. Sparse (BM25) excels at exact keyword matching. Hybrid search executes both in parallel and merges rankings using RRF: Score = sum(1 / (k + rank_i)), where k=60. This combines conceptual recall with exact lexical precision.", score: 10, strength: "Clear formula, failure modes identified, and practical constant value.", weakness: "None.", followUpQuestions: ["How does SPLADE improve over BM25?", "When should you add a Cross-Encoder reranker?"] }
    ]
  },
  {
    id: "GENAI-012",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What does 'Tokenization' refer to in LLMs?",
    opts: ["Encrypting API access tokens", "Decomposing raw text into discrete sub-word integers mapped to vocabulary IDs", "Authenticating users via JWT", "Splitting database records"],
    ans: "Decomposing raw text into discrete sub-word integers mapped to vocabulary IDs",
    exp: "Tokenization converts text into integer token IDs based on Byte-Pair Encoding or WordPiece."
  },
  {
    id: "GENAI-013",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "Which quantization method uses activation-aware weight quantization to preserve salient weights in LLMs?",
    opts: ["AWQ (Activation-aware Weight Quantization)", "Naive round-to-nearest int", "FP32 baseline", "Lossy JPEG compression"],
    ans: "AWQ (Activation-aware Weight Quantization)",
    exp: "AWQ identifies the 1% most salient weight channels based on activation magnitudes and protects them from quantization error."
  },
  {
    id: "GENAI-014",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "How does Direct Preference Optimization (DPO) simplify alignment compared to PPO-based RLHF?",
    opts: ["Eliminates the need for a separate reward model and reinforcement learning training loop", "Uses genetic algorithms instead of gradient descent", "Removes the requirement for preference datasets", "Disables backpropagation"],
    ans: "Eliminates the need for a separate reward model and reinforcement learning training loop",
    exp: "DPO implicitly reparameterizes the reward function, directly optimizing the policy model via cross-entropy loss."
  },
  {
    id: "GENAI-015",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you protect LLM applications from Prompt Injection and Jailbreak attacks?",
    pre: [
      { id: "resp_a", label: "Response A (Layered Security)", transcript: "Multi-layered defense: 1) Input classification using guard models (Llama Guard). 2) Structural XML/Markdown delimiters isolating untrusted user input. 3) Output factuality and PII scanning. 4) Least-privilege tool execution permissions.", score: 10, strength: "Covers input sandboxing, structural delimiters, output validation, and scoped tool permissions.", weakness: "None.", followUpQuestions: ["How do you defend against indirect prompt injection in scraped web content?", "What is the latency impact of guard models?"] }
    ]
  },
  {
    id: "GENAI-016",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is 'Few-Shot Prompting'?",
    opts: ["Providing a few input-output demonstration examples inside the prompt", "Training a model for only 3 epochs", "Compressing a model to 3-bit weights", "Making 3 API requests per second"],
    ans: "Providing a few input-output demonstration examples inside the prompt",
    exp: "Few-shot prompting conditions the model by providing illustrative examples before the target question."
  },
  {
    id: "GENAI-017",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the primary mechanism behind Speculative Decoding?",
    opts: ["Using a fast small draft model to generate tokens that are verified in parallel by the target LLM", "Skipping attention layers randomly", "Predicting future user questions before they type", "Using quantum computing"],
    ans: "Using a fast small draft model to generate tokens that are verified in parallel by the target LLM",
    exp: "Speculative decoding generates candidate tokens with a tiny model and verifies them in a single target forward pass."
  },
  {
    id: "GENAI-018",
    diff: "Advanced",
    type: "Subjective",
    comp: "Technical Knowledge",
    q: "Explain the architecture of Mixture of Experts (MoE) models (e.g. Mixtral 8x7B).",
    pre: [
      { id: "resp_a", label: "Response A (Routing & Gating Mechanics)", transcript: "MoE replaces dense FFN layers with N expert sub-networks and a learned Gating router. For each token, the router computes Top-K softmax (e.g. Top-2 out of 8). Only active experts compute, providing massive parameter capacity at low FLOP cost. Load-balancing loss prevents routing collapse.", score: 10, strength: "Distinguishes active vs total parameters, Top-K per-token gating, and auxiliary loss.", weakness: "None.", followUpQuestions: ["How does MoE affect VRAM requirements during inference?", "How does expert parallelism work across multi-GPU nodes?"] }
    ]
  },
  {
    id: "GENAI-019",
    diff: "Beginner",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In the OpenAI/Anthropic SDKs, which parameter guarantees output adherence to a structured JSON schema?",
    opts: ["response_format with json_schema", "enforce_json=True", "temperature=0.0", "stream=False"],
    ans: "response_format with json_schema",
    exp: "Constrained grammar decoding forces LLM logits to only sample valid tokens according to the provided schema."
  },
  {
    id: "GENAI-020",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Problem Solving",
    q: "What does 'Needle In A Haystack' (NIAH) testing evaluate in Large Language Models?",
    opts: ["Information retrieval accuracy of specific facts at various depths across long context windows", "GPU power consumption", "Vector database query latency", "SQL injection risks"],
    ans: "Information retrieval accuracy of specific facts at various depths across long context windows",
    exp: "NIAH tests whether an LLM can accurately retrieve specific facts placed at arbitrary context depths (e.g. 10%, 50%, 90%)."
  }
];

// Helper to push role questions
genAiQuestions.forEach(q => {
  questions.push({
    questionId: q.id,
    role: "GenAI Engineer",
    difficulty: q.diff,
    questionType: q.type,
    competency: q.comp,
    question: q.q,
    scenarioContext: q.scenario,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.exp,
    score: 10,
    predefinedResponses: q.pre
  });
});

// AI Architect (20)
const aiArchitectQuestions = [
  {
    id: "ARCH-001",
    diff: "Advanced",
    type: "Subjective",
    comp: "Architecture Skills",
    q: "How would you design a multi-tenant Enterprise LLM Gateway supporting 50 internal applications with semantic caching, rate limiting, DLP/PII redaction, and intelligent model routing?",
    pre: [
      { id: "resp_a", label: "Response A (Enterprise Architecture)", transcript: "Architect a gateway in Go/Rust behind Envoy: 1) JWT auth with Redis token bucket quotas. 2) DLP pipeline with Presidio masking PII. 3) Redis semantic vector cache (similarity >0.96) reducing costs by 35%. 4) Smart router dispatching simple queries to 8B models and complex tasks to frontier models with automated failover. 5) OpenTelemetry tracing for token and cost analytics.", score: 10, strength: "Covers auth, DLP, semantic caching, tiered routing, and observability.", weakness: "None.", followUpQuestions: ["How do you handle semantic cache invalidation?", "How do you enforce GDPR compliance on cached queries?"] },
      { id: "resp_b", label: "Response B (Standard Proxy)", transcript: "Put a proxy server in front of OpenAI. Checks API keys, uses regex to mask credit cards, caches frequent questions, and switches providers if an API fails.", score: 6, strength: "Understands proxy, regex, caching, and failover.", weakness: "Lacks semantic vector caching specifics, tenant cost isolation, and observability.", followUpQuestions: ["How does semantic vector caching differ from exact match?", "How do you allocate chargebacks to business units?"] }
    ]
  },
  {
    id: "ARCH-002",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "Which architecture pattern is most appropriate for enterprise RAG with 100M+ documents requiring real-time ingestion and sub-200ms latency?",
    opts: ["Brute-force k-NN in RAM", "Hierarchical HNSW indexing with asynchronous Kafka ingestion and metadata pre-filtering", "Nightly full SQLite reindexing", "Client-side browser vector search"],
    ans: "Hierarchical HNSW indexing with asynchronous Kafka ingestion and metadata pre-filtering",
    exp: "Decoupling ingestion via Kafka and using HNSW with metadata pre-filtering scales to 100M+ vectors with sub-200ms query latency."
  },
  {
    id: "ARCH-003",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the primary advantage of Triton Inference Server over standard web server wrappers?",
    opts: ["Dynamic batching, concurrent multi-model GPU execution, and multi-framework backend support", "Built-in React frontend generator", "Integrated SQL database", "Runs without GPU drivers"],
    ans: "Dynamic batching, concurrent multi-model GPU execution, and multi-framework backend support",
    exp: "Triton maximizes GPU utilization through dynamic request batching and concurrent model execution."
  },
  {
    id: "ARCH-004",
    diff: "Advanced",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you design an AI model evaluation and governance framework to ensure compliance with the EU AI Act for high-risk systems?",
    pre: [
      { id: "resp_a", label: "Response A (Governance & Compliance Specialist)", transcript: "1) AI Risk Inventory & Classification. 2) CI/CD automated benchmarking on fairness, toxicity, and accuracy. 3) Full model provenance via MLflow/Weights & Biases for auditability. 4) Human-in-the-loop oversight with automated kill-switches. 5) Continuous post-market drift and incident monitoring.", score: 10, strength: "Direct alignment with EU AI Act technical provisions.", weakness: "None.", followUpQuestions: ["How do you detect embedding drift in unstructured text?", "What is the protocol for emergency model rollback?"] }
    ]
  },
  {
    id: "ARCH-005",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the primary trade-off between HNSW and IVF-PQ indexing in vector databases?",
    opts: ["HNSW gives higher recall/lower latency but requires high RAM; IVF-PQ compresses vectors for huge RAM savings with slight recall loss", "HNSW only works for audio", "IVF-PQ requires no training phase", "HNSW cannot support Cosine distance"],
    ans: "HNSW gives higher recall/lower latency but requires high RAM; IVF-PQ compresses vectors for huge RAM savings with slight recall loss",
    exp: "HNSW maintains an uncompressed graph in RAM for top speed/recall; IVF-PQ quantizes vectors to minimize memory footprint."
  },
  {
    id: "ARCH-006",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the core objective of MLOps in enterprise environments?",
    opts: ["Automating and standardizing the entire ML lifecycle from data ingestion to model deployment and monitoring", "Writing ML code in assembly", "Eliminating all data pipelines", "Managing software copyrights"],
    ans: "Automating and standardizing the entire ML lifecycle from data ingestion to model deployment and monitoring",
    exp: "MLOps establishes continuous integration, delivery, and automated monitoring for production ML."
  },
  {
    id: "ARCH-007",
    diff: "Advanced",
    type: "Scenario",
    scenario: "An enterprise runs 15 LLM applications across cloud and on-premise infrastructure. The CTO requires a 40% reduction in AI operating expenses.",
    comp: "Architecture Skills",
    q: "What architectural strategies would you implement to achieve this 40% cost reduction?",
    pre: [
      { id: "resp_a", label: "Response A (Cost Optimization Blueprint)", transcript: "1) Query routing: Route 70% simple queries to self-hosted 8B models on Spot GPU instances. 2) Semantic caching with Redis to bypass LLM generation on repeat queries. 3) Prompt compression and history truncation. 4) Continuous batching with TensorRT-LLM on high-volume endpoints.", score: 10, strength: "Addresses routing, caching, prompt optimization, and hardware utilization.", weakness: "None.", followUpQuestions: ["How do you verify small model output quality before fallback?", "What is the ROI breakeven for self-hosting GPUs vs APIs?"] }
    ]
  },
  {
    id: "ARCH-008",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "Which architecture pattern decouples model training from online feature calculation to eliminate training-serving skew?",
    opts: ["Feature Store (e.g. Feast, SageMaker Feature Store)", "Hardcoded SQL queries in client JS", "Global session cookies", "Recalculating all stats on each HTTP request"],
    ans: "Feature Store (e.g. Feast, SageMaker Feature Store)",
    exp: "A Feature Store provides a unified definition of features, serving point-in-time historical data for training and sub-millisecond lookups for inference."
  },
  {
    id: "ARCH-009",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is 'Data Drift' in machine learning monitoring?",
    opts: ["Statistical shift in the distribution of input features over time", "Database cables being moved", "Hard drive fragmentation", "Renaming database tables"],
    ans: "Statistical shift in the distribution of input features over time",
    exp: "Data drift occurs when production input feature distributions deviate from training data distributions."
  },
  {
    id: "ARCH-010",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "Which interconnect fabric and communication library provides the lowest latency for multi-node GPU distributed training?",
    opts: ["NVIDIA NCCL over InfiniBand with GPUDirect RDMA", "HTTP REST over 1Gbps Ethernet", "gRPC over public Wi-Fi", "WebSocket streams"],
    ans: "NVIDIA NCCL over InfiniBand with GPUDirect RDMA",
    exp: "NCCL with InfiniBand RDMA enables direct memory transfers between GPU memories across nodes."
  },
  {
    id: "ARCH-011",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the purpose of 'Model Quantization' (e.g. FP16 to INT4)?",
    opts: ["Reducing model weight precision to lower VRAM requirements and accelerate inference throughput", "Translating code into Python", "Encrypting weights with RSA keys", "Generating synthetic training data"],
    ans: "Reducing model weight precision to lower VRAM requirements and accelerate inference throughput",
    exp: "Quantization converts floating point weights to lower-bit representations, significantly reducing memory bandwidth bottlenecks."
  },
  {
    id: "ARCH-012",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What does 'SLA' stand for in enterprise cloud systems?",
    opts: ["Service Level Agreement", "System Logic Algorithm", "Software License Authorization", "Server Loading Architecture"],
    ans: "Service Level Agreement",
    exp: "An SLA defines the committed availability, latency, and performance standards between a service provider and client."
  },
  {
    id: "ARCH-013",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you design a disaster recovery and high availability (HA) architecture for a mission-critical AI inference platform?",
    pre: [
      { id: "resp_a", label: "Response A (Active-Active Multi-Region)", transcript: "Deploy active-active multi-region Kubernetes clusters behind global DNS load balancers (Route 53 / Cloudflare). Replicate vector indices and feature stores cross-region asynchronously. Implement automated health check failovers with circuit breakers and fallback to quantized local backup models in under 5 seconds.", score: 10, strength: "Active-active multi-region, automated circuit breakers, and sub-5s failover targets.", weakness: "None.", followUpQuestions: ["How do you handle vector database replication lag?", "What is your RTO and RPO target?"] }
    ]
  },
  {
    id: "ARCH-014",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "In an enterprise multi-agent workflow, what is the role of an Orchestrator/Supervisor agent?",
    opts: ["Decomposes high-level user tasks into sub-tasks, assigns them to specialized worker agents, and aggregates results", "Formats HTML tables for web browsers", "Compiles C++ binaries", "Manages database backups"],
    ans: "Decomposes high-level user tasks into sub-tasks, assigns them to specialized worker agents, and aggregates results",
    exp: "Supervisor agents maintain global workflow state, route requests dynamically to domain agents, and synthesize final responses."
  },
  {
    id: "ARCH-015",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What does 'Zero-Shot Learning' mean in modern AI models?",
    opts: ["The model performs a task without having received specific labeled training examples for that exact task", "The model operates with zero power consumption", "The model took zero seconds to train", "The model has zero parameters"],
    ans: "The model performs a task without having received specific labeled training examples for that exact task",
    exp: "Zero-shot learning relies on broad pre-trained representations to follow instructions without specialized fine-tuning."
  },
  {
    id: "ARCH-016",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "Which protocol is widely used for high-performance, low-latency inter-service RPC communication in ML microservice fabrics?",
    opts: ["gRPC over HTTP/2 with Protocol Buffers", "FTP file transfer", "SOAP XML over HTTP/1.0", "Telnet terminal sessions"],
    ans: "gRPC over HTTP/2 with Protocol Buffers",
    exp: "gRPC uses binary serialization via Protobuf and HTTP/2 multiplexing, delivering high performance and low serialization overhead."
  },
  {
    id: "ARCH-017",
    diff: "Advanced",
    type: "Subjective",
    comp: "Architecture Skills",
    q: "Explain how to architect a secure air-gapped private LLM environment for defense or banking clients.",
    pre: [
      { id: "resp_a", label: "Response A (Air-Gapped Private AI)", transcript: "1) Infrastructure: On-premise bare-metal GPU nodes completely disconnected from public internet with disabled outbound gateways. 2) Software: Self-hosted open-weights models (Llama 3 / Mistral) served via vLLM. 3) Offline Ingestion: Local Milvus/Qdrant vector databases indexed via local offline embedding models (e.g. BGE). 4) Access Control: Hardware token MFA with Kerberos/mTLS within internal VPC only.", score: 10, strength: "Complete zero-trust air-gapped architecture with local embedding and offline indexing.", weakness: "None.", followUpQuestions: ["How do you apply security patches and model updates in an air-gapped environment?", "How do you audit internal queries for data exfiltration?"] }
    ]
  },
  {
    id: "ARCH-018",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is an 'Embedding' in machine learning?",
    opts: ["A dense numerical vector representation of text, audio, or images where semantic similarity corresponds to geometric proximity", "An image embedded into a PDF document", "A hardware chip soldered to a motherboard", "A database foreign key constraint"],
    ans: "A dense numerical vector representation of text, audio, or images where semantic similarity corresponds to geometric proximity",
    exp: "Embeddings map discrete inputs into continuous vector spaces where similar concepts cluster together."
  },
  {
    id: "ARCH-019",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Problem Solving",
    q: "When load testing an LLM endpoint, what are the two distinct latency metrics that should always be monitored separately?",
    opts: ["Time to First Token (TTFT) and Inter-Token Latency (Time Per Output Token - TPOT)", "CPU Fan RPM and Disk Free Space", "Keyboard typing speed and monitor refresh rate", "Ethernet cable length and ping to Google"],
    ans: "Time to First Token (TTFT) and Inter-Token Latency (Time Per Output Token - TPOT)",
    exp: "TTFT measures prefill processing speed (prompt ingestion), while TPOT measures autoregressive decoding generation speed."
  },
  {
    id: "ARCH-020",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "What is 'Continuous Batching' (or In-Flight Batching) in modern inference engines like vLLM and TensorRT-LLM?",
    opts: ["Dynamically inserting new incoming requests and retiring completed sequences at every token iteration step rather than waiting for an entire batch to finish", "Running cron jobs every midnight", "Compressing log files hourly", "Re-training models continuously on live traffic"],
    ans: "Dynamically inserting new incoming requests and retiring completed sequences at every token iteration step rather than waiting for an entire batch to finish",
    exp: "Continuous batching operates at the token level, preventing short requests from being stalled by long requests in the same batch."
  }
];

aiArchitectQuestions.forEach(q => {
  questions.push({
    questionId: q.id,
    role: "AI Architect",
    difficulty: q.diff,
    questionType: q.type,
    competency: q.comp,
    question: q.q,
    scenarioContext: q.scenario,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.exp,
    score: 10,
    predefinedResponses: q.pre
  });
});

// Data Engineer (20)
const dataEngineerQuestions = [
  {
    id: "DATA-001",
    diff: "Advanced",
    type: "Subjective",
    comp: "Architecture Skills",
    q: "Explain the architecture of a Modern Lakehouse using Apache Iceberg or Delta Lake on top of object storage (S3). How does it handle ACID transactions, schema evolution, and hidden partitioning?",
    pre: [
      { id: "resp_a", label: "Response A (Deep Lakehouse Expertise)", transcript: "Iceberg structures data in 3 layers: Catalog (pointer to current metadata), Metadata Tree (metadata file -> manifest lists -> manifest files with file statistics), and Data Layer (Parquet). ACID is achieved via Optimistic Concurrency Control with atomic catalog pointer swap. Schema evolution is metadata-only with unique column IDs. Hidden partitioning decouples partition transforms from queries, eliminating manual directory-based WHERE clauses.", score: 10, strength: "Clear breakdown of Catalog and Manifest files; exact OCC commit mechanism and column ID schema evolution.", weakness: "None.", followUpQuestions: ["How does Iceberg handle Copy-on-Write vs Merge-on-Read?", "How do you compact small files without locking readers?"] }
    ]
  },
  {
    id: "DATA-002",
    diff: "Advanced",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Apache Spark, what causes 'Data Skew' during a Shuffle Hash Join, and how do you resolve it?",
    opts: ["Equal key distribution across workers", "Uneven key distribution causing one executor to process massive data while others idle; resolved by Salting keys or AQE skew join", "Too many columns in Parquet files", "Network cable disconnections"],
    ans: "Uneven key distribution causing one executor to process massive data while others idle; resolved by Salting keys or AQE skew join",
    exp: "Data skew overloads a single reducer partition. Salting or Spark AQE splits skewed partitions automatically."
  },
  {
    id: "DATA-003",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In Kafka, what happens if a consumer group has 5 active consumers but the subscribed topic only has 3 partitions?",
    opts: ["Each partition is read by all 5 consumers causing duplicates", "Kafka rejects the group", "3 consumers are assigned 1 partition each; 2 remain idle as hot standbys", "Kafka automatically creates 2 extra partitions"],
    ans: "3 consumers are assigned 1 partition each; 2 remain idle as hot standbys",
    exp: "A partition can only be assigned to one consumer per group; extra consumers remain idle."
  },
  {
    id: "DATA-004",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you achieve 'Exactly-Once Processing' semantics across an Apache Flink streaming pipeline writing to a database?",
    pre: [
      { id: "resp_a", label: "Response A (Two-Phase Commit & Checkpoints)", transcript: "Coordinate replayable Kafka offsets, Flink Chandy-Lamport state checkpoints, and a Two-Phase Commit (2PC) sink or idempotent UPSERT primary key sink. Flink opens a pre-commit transaction on the sink and only commits when checkpoint coordinator confirms success across all operators.", score: 10, strength: "Chandy-Lamport distributed snapshots, 2PC sink protocol, and idempotent UPSERT mechanics.", weakness: "None.", followUpQuestions: ["What happens if a worker crashes during pre-commit?", "How does Kafka transactional coordinator resolve zombie producers?"] }
    ]
  },
  {
    id: "DATA-005",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the primary advantage of Columnar file formats (Parquet/ORC) over Row formats (CSV/JSON) for analytics?",
    opts: ["Column pruning (reading only queried columns) and high compression ratios on homogeneous data", "Can be opened directly in Microsoft Word", "Can only store numbers", "Does not require a filesystem"],
    ans: "Column pruning (reading only queried columns) and high compression ratios on homogeneous data",
    exp: "Columnar formats minimize I/O by skipping unread columns and compressing identical data types efficiently."
  },
  {
    id: "DATA-006",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In dbt (data build tool), what is the difference between an 'ephemeral' and an 'incremental' model?",
    opts: ["Ephemeral models are compiled into CTEs in downstream queries; Incremental models only insert/update new records into a persistent table", "Ephemeral models write to CSV; Incremental drops the table on every run", "Ephemeral models only run in Python", "No difference"],
    ans: "Ephemeral models are compiled into CTEs in downstream queries; Incremental models only insert/update new records into a persistent table",
    exp: "Ephemeral models create no database objects (pure CTEs), while Incremental models update physical warehouse tables based on timestamps."
  },
  {
    id: "DATA-007",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "Which index type in SQL databases is optimized for range queries (e.g. date BETWEEN X and Y)?",
    opts: ["B+Tree Index", "Hash Index", "Bitmap Index", "Full-Text Inverted Index"],
    ans: "B+Tree Index",
    exp: "B+Tree leaf nodes are sorted and linked, making range scans O(log N + k)."
  },
  {
    id: "DATA-008",
    diff: "Advanced",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "Which open-source platform captures database change events (CDC) by reading PostgreSQL Write-Ahead Logs (WAL)?",
    opts: ["Debezium", "Apache Lucene", "Redis Sentinel", "Logstash UDP"],
    ans: "Debezium",
    exp: "Debezium streams row-level changes from database replication logs without polling query overhead."
  },
  {
    id: "DATA-009",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the difference between a Star Schema and a Snowflake Schema in data warehousing?",
    opts: ["Star schema dimension tables are denormalized; Snowflake schema dimension tables are normalized into sub-dimensions", "Star schema cannot store foreign keys", "Snowflake schema is only for weather data", "Star schema requires NoSQL databases"],
    ans: "Star schema dimension tables are denormalized; Snowflake schema dimension tables are normalized into sub-dimensions",
    exp: "Star schema denormalizes dimensions for simpler/faster queries; Snowflake normalizes dimensions to reduce redundancy."
  },
  {
    id: "DATA-010",
    diff: "Advanced",
    type: "Scenario",
    scenario: "A financial data pipeline experiences sudden out-of-order event arrivals due to mobile app offline queuing, corrupting 1-minute candlestick aggregations.",
    comp: "Problem Solving",
    q: "How would you handle late-arriving data in Apache Flink or Spark Structured Streaming?",
    pre: [
      { id: "resp_a", label: "Response A (Watermarks & Allowed Lateness)", transcript: "Implement Event-Time processing with bounded out-of-orderness Watermarks (e.g. Watermark = max(eventTime) - 10 minutes). For data arriving within the watermark window, window aggregations update state automatically. For events exceeding the watermark, route to a Dead-Letter / Side Output queue to trigger an asynchronous backfill compensation job.", score: 10, strength: "Uses event-time watermarking, allowed lateness windows, and side-output compensation pipelines.", weakness: "None.", followUpQuestions: ["What is the state memory overhead of keeping long watermarks?", "How do you reconcile downstream reports when late data updates?"] }
    ]
  },
  {
    id: "DATA-011",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What does ETL stand for?",
    opts: ["Extract, Transform, Load", "Execute, Test, Launch", "Encode, Transmit, Log", "Encrypt, Tokenize, Lock"],
    ans: "Extract, Transform, Load",
    exp: "ETL is the foundational data engineering process of gathering data from sources, transforming it, and loading into a destination."
  },
  {
    id: "DATA-012",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In PySpark, what is the effect of calling `.cache()` or `.persist()` on a DataFrame?",
    opts: ["Materializes and saves the DataFrame in executor memory/disk on the first action to avoid recomputing the entire lineage in subsequent actions", "Writes the data to local hard drive as a CSV", "Sends the data to a remote printer", "Deletes the DataFrame from RAM"],
    ans: "Materializes and saves the DataFrame in executor memory/disk on the first action to avoid recomputing the entire lineage in subsequent actions",
    exp: "Persisting caches intermediate DataFrame partitions across cluster executor memory, optimizing iterative algorithms."
  },
  {
    id: "DATA-013",
    diff: "Advanced",
    type: "Subjective",
    comp: "Technical Knowledge",
    q: "Compare the CAP Theorem trade-offs between Cassandra (AP) and CockroachDB/Spanner (CP).",
    pre: [
      { id: "resp_a", label: "Response A (Deep Distributed Systems Analysis)", transcript: "Cassandra prioritizes Availability and Partition Tolerance (AP) using peer-to-peer ring topology, tunable consistency (QUORUM / LOCAL_QUORUM), and vector clocks/hinted handoffs. CockroachDB/Spanner prioritize Consistency and Partition Tolerance (CP) using Raft/Paxos consensus algorithms and TrueTime/hybrid logical clocks, guaranteeing serializable ACID transactions across distributed shards at the expense of rejecting writes during network splits.", score: 10, strength: "Mastery of consensus protocols, tunable consistency, and partition failure modes.", weakness: "None.", followUpQuestions: ["How does CockroachDB achieve Raft range leasing?", "What is Read-Repair in Cassandra?"] }
    ]
  },
  {
    id: "DATA-014",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is an Airflow DAG?",
    opts: ["Directed Acyclic Graph; a collection of all the tasks you want to run, organized in a way that reflects their relationships and dependencies", "Data Archive Generator", "Dynamic Array Group", "Database Access Gateway"],
    ans: "Directed Acyclic Graph; a collection of all the tasks you want to run, organized in a way that reflects their relationships and dependencies",
    exp: "Airflow DAGs model workflow pipelines as directed graphs where execution flows in one direction without circular loops."
  },
  {
    id: "DATA-015",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the difference between a Dimension table and a Fact table in Kimball dimensional modeling?",
    opts: ["Fact tables contain numeric measurements and foreign keys; Dimension tables contain contextual descriptive attributes used for filtering and grouping", "Fact tables store user passwords; Dimension tables store emails", "Dimension tables are only for 3D coordinates", "There is no difference"],
    ans: "Fact tables contain numeric measurements and foreign keys; Dimension tables contain contextual descriptive attributes used for filtering and grouping",
    exp: "Fact tables record quantitative business events (e.g. sales amount), while Dimension tables give context (who, where, when, what)."
  },
  {
    id: "DATA-016",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "In real-time analytical engines like ClickHouse or Apache Pinot, what indexing technique allows instantaneous aggregation across billions of rows?",
    opts: ["Sparse primary index with sorted column parts and vectorized SIMD execution", "Brute-force nested loops", "Reading unindexed JSON files from disk", "Using JavaScript array.reduce()"],
    ans: "Sparse primary index with sorted column parts and vectorized SIMD execution",
    exp: "ClickHouse stores data sorted on primary keys in compressed columnar chunks, using sparse primary indexes and SIMD vectorization."
  },
  {
    id: "DATA-017",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you implement data quality monitoring and anomaly detection across 1,000 automated ETL pipelines?",
    pre: [
      { id: "resp_a", label: "Response A (Automated Data Observability)", transcript: "1) Schema & Contract testing: Great Expectations / Soda checks integrated in dbt pre-hooks and CI. 2) Metric Telemetry: Automated tracking of table volume deltas, null percentages, and freshness timestamps with Slack alerting. 3) Anomaly Detection: Statistical Z-score and ML anomaly detection (e.g. Monte Carlo) flagging unusual volume drops or distribution shifts. 4) Circuit Breaker: Halt downstream pipeline publishing if critical data quality assertions fail.", score: 10, strength: "Covers data contracts, continuous statistical monitoring, Slack webhooks, and circuit breaking.", weakness: "None.", followUpQuestions: ["How do you prevent false-positive alert fatigue in data quality monitors?", "What is a Data Contract?"] }
    ]
  },
  {
    id: "DATA-018",
    diff: "Beginner",
    type: "MCQ",
    comp: "Coding Skills",
    q: "Which SQL window function assigns a unique sequential integer to rows within a partition without gaps?",
    opts: ["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "COUNT()"],
    ans: "ROW_NUMBER()",
    exp: "ROW_NUMBER() outputs a continuous sequential numbering (1, 2, 3...) regardless of ties."
  },
  {
    id: "DATA-019",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the purpose of 'Compaction' in log-structured storage engines (LSM Trees / RocksDB)?",
    opts: ["Merging sorted string tables (SSTables) and purging deleted or superseded keys to reclaim disk space and speed up reads", "Converting Python files to C++", "Compressing images with zip", "Restarting database servers"],
    ans: "Merging sorted string tables (SSTables) and purging deleted or superseded keys to reclaim disk space and speed up reads",
    exp: "LSM tree compaction merges overlapping SSTables from upper levels into lower levels, removing obsolete records."
  },
  {
    id: "DATA-020",
    diff: "Advanced",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Snowflake architecture, what separates compute resources from persistent storage?",
    opts: ["Multi-cluster shared data architecture with virtual compute warehouses querying shared cloud object storage", "Using separate physical hard drives in a single tower", "Splitting code into two git repos", "Disabling SQL transactions"],
    ans: "Multi-cluster shared data architecture with virtual compute warehouses querying shared cloud object storage",
    exp: "Snowflake decouples independent Virtual Warehouses (compute) from centralized cloud storage (S3/GCS/Azure Blob)."
  }
];

dataEngineerQuestions.forEach(q => {
  questions.push({
    questionId: q.id,
    role: "Data Engineer",
    difficulty: q.diff,
    questionType: q.type,
    competency: q.comp,
    question: q.q,
    scenarioContext: q.scenario,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.exp,
    score: 10,
    predefinedResponses: q.pre
  });
});

// Full Stack Engineer (20)
const fullStackQuestions = [
  {
    id: "FS-001",
    diff: "Advanced",
    type: "Subjective",
    comp: "Architecture Skills",
    q: "Explain how React 18 Concurrent Features (Transitions, Suspense, and Server Components) work under the hood. How does the Fiber reconciler schedule work without blocking the main thread?",
    pre: [
      { id: "resp_a", label: "Response A (Mastery of React Internals)", transcript: "React 18 Fiber structures tree nodes as linked lists with child, sibling, and return pointers. The scheduler uses cooperative multitasking with Lane priorities (SyncLane, InputContinuousLane, TransitionLane). With useTransition(), updates are marked low-priority, yielding the event loop to keystrokes. Server Components execute on the backend, streaming serialized JSX wire formats and eliminating server dependencies from client JS bundles.", score: 10, strength: "Fiber linked list, Lane priority model, cooperative scheduling, and RSC wire format.", weakness: "None.", followUpQuestions: ["How does selective hydration work with Suspense?", "How do React Error Boundaries catch server streaming errors?"] }
    ]
  },
  {
    id: "FS-002",
    diff: "Advanced",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Node.js event loop architecture, in which phase are process.nextTick() and resolved microtask Promise callbacks executed?",
    opts: ["Immediately after the current synchronous operation finishes, before proceeding to the next event loop phase", "Only during the Close Callbacks phase", "Inside the Poll phase after TCP socket I/O", "On a background worker thread"],
    ans: "Immediately after the current synchronous operation finishes, before proceeding to the next event loop phase",
    exp: "Microtask queues are drained immediately when the current operation completes and between each event loop phase."
  },
  {
    id: "FS-003",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "When securing a Single Page Application against XSS and CSRF, where should session tokens be stored?",
    opts: ["In an HttpOnly, Secure, SameSite cookie with anti-CSRF token verification", "In browser localStorage", "In a global window.__TOKEN variable", "Inside URL query parameters"],
    ans: "In an HttpOnly, Secure, SameSite cookie with anti-CSRF token verification",
    exp: "HttpOnly cookies prevent XSS theft, Secure enforces HTTPS, and SameSite with CSRF tokens stops CSRF exploits."
  },
  {
    id: "FS-004",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you optimize Core Web Vitals (specifically Largest Contentful Paint - LCP, and Cumulative Layout Shift - CLS) on a high-traffic Next.js application?",
    pre: [
      { id: "resp_a", label: "Response A (Web Performance Specialist)", transcript: "For LCP: 1) Preload hero image with fetchpriority='high'. 2) Use next/image with modern WebP/AVIF. 3) Edge caching on CDN for TTFB <150ms. 4) Inline critical CSS. For CLS: 1) Explicit width/height or aspect-ratio on all media. 2) Reserve space for dynamic ad banners. 3) Use next/font with font-display: optional to eliminate font swap shifts.", score: 10, strength: "Covers fetchpriority, CDN caching, aspect-ratio, and font-display optimization.", weakness: "None.", followUpQuestions: ["What is Interaction to Next Paint (INP)?", "How do you monitor real user Web Vitals in production?"] }
    ]
  },
  {
    id: "FS-005",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the key difference between CSS Grid and CSS Flexbox?",
    opts: ["CSS Grid is a 2D layout system (rows and columns simultaneously); Flexbox is a 1D layout system (row OR column)", "Flexbox is only for mobile apps", "Grid cannot be styled with CSS", "Flexbox does not support justify-content"],
    ans: "CSS Grid is a 2D layout system (rows and columns simultaneously); Flexbox is a 1D layout system (row OR column)",
    exp: "Grid handles simultaneous two-dimensional row/column layouts; Flexbox aligns elements along a single main axis."
  },
  {
    id: "FS-006",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In TypeScript, what is the difference between 'unknown' and 'any'?",
    opts: ["'unknown' is type-safe because operations require type narrowing first; 'any' completely disables type checking", "'unknown' is only for numbers", "'any' is type-safe", "They are identical aliases"],
    ans: "'unknown' is type-safe because operations require type narrowing first; 'any' completely disables type checking",
    exp: "unknown forces compile-time type validation before usage, whereas any bypasses the type checker."
  },
  {
    id: "FS-007",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What does the HTTP status code 429 indicate?",
    opts: ["Too Many Requests (Rate limited by server)", "Permanent redirect", "Internal database error", "Unauthorized credentials"],
    ans: "Too Many Requests (Rate limited by server)",
    exp: "429 signals that the client has exceeded allowed request rate limits."
  },
  {
    id: "FS-008",
    diff: "Advanced",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In PostgreSQL, what is the difference between READ COMMITTED and REPEATABLE READ transaction isolation levels?",
    opts: ["READ COMMITTED sees committed changes made by concurrent transactions during the transaction; REPEATABLE READ freezes a snapshot at transaction start", "REPEATABLE READ locks the whole database", "READ COMMITTED allows dirty reads", "No difference in Postgres"],
    ans: "READ COMMITTED sees committed changes made by concurrent transactions during the transaction; REPEATABLE READ freezes a snapshot at transaction start",
    exp: "READ COMMITTED evaluates statements against freshly committed data, while REPEATABLE READ maintains a point-in-time snapshot."
  },
  {
    id: "FS-009",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In modern JavaScript, what is the benefit of using `structuredClone()` over `JSON.parse(JSON.stringify())` for deep copying objects?",
    opts: ["Properly clones circular references, Maps, Sets, Dates, and ArrayBuffers without loss", "It runs synchronously on GPU", "It works without JavaScript", "It reduces object size in RAM"],
    ans: "Properly clones circular references, Maps, Sets, Dates, and ArrayBuffers without loss",
    exp: "structuredClone natively supports complex JS types (Date, RegExp, Map, Set, TypedArray, circular refs) that JSON stringify destroys."
  },
  {
    id: "FS-010",
    diff: "Advanced",
    type: "Scenario",
    scenario: "A collaborative real-time whiteboarding web app with 5,000 concurrent users suffers from lagging stroke synchronization and high WebSocket server memory consumption.",
    comp: "Architecture Skills",
    q: "How would you architect the real-time synchronization engine to achieve sub-50ms latency and scale horizontally?",
    pre: [
      { id: "resp_a", label: "Response A (CRDTs & Distributed Pub/Sub)", transcript: "1) State Synchronization: Use CRDTs (Conflict-free Replicated Data Types like Yjs or Automerge) over WebSockets/WebRTC with binary encoded delta updates (Protobuf/MessagePack) instead of bulky JSON. 2) Backend Distribution: Horizontally scaled WebSocket gateways connected via Redis Pub/Sub or NATS clusters with room-based channel sharding. 3) Client Optimization: Client-side local optimistic rendering with interpolation smoothing and RAF-throttled stroke batching.", score: 10, strength: "Uses CRDTs, binary delta encoding, Redis/NATS sharding, and client optimistic rendering.", weakness: "None.", followUpQuestions: ["How does CRDT state compaction work for long-running boards?", "How do you handle client reconnects with missed deltas?"] }
    ]
  },
  {
    id: "FS-011",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the purpose of the `useEffect` cleanup function in React?",
    opts: ["Cancels active subscriptions, timers, or aborts fetch requests when the component unmounts or before re-running the effect", "Cleans the computer hard drive", "Deletes unrendered DOM nodes", "Restarts the browser tab"],
    ans: "Cancels active subscriptions, timers, or aborts fetch requests when the component unmounts or before re-running the effect",
    exp: "The returned cleanup function prevents memory leaks and stale event listeners across renders."
  },
  {
    id: "FS-012",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the primary difference between WebSockets and Server-Sent Events (SSE)?",
    opts: ["WebSockets provide bidirectional full-duplex communication over a single TCP connection; SSE is unidirectional from server to client over standard HTTP", "SSE is bidirectional, WebSockets are unidirectional", "WebSockets only work on Linux", "SSE requires custom browser plugins"],
    ans: "WebSockets provide bidirectional full-duplex communication over a single TCP connection; SSE is unidirectional from server to client over standard HTTP",
    exp: "WebSockets enable true bidirectional messaging; SSE provides lightweight unidirectional streaming over standard HTTP with built-in reconnection."
  },
  {
    id: "FS-013",
    diff: "Advanced",
    type: "Subjective",
    comp: "Technical Knowledge",
    q: "Explain how Module Federation in Webpack/Vite enables Microfrontend architecture.",
    pre: [
      { id: "resp_a", label: "Response A (Module Federation Architecture)", transcript: "Module Federation allows independent JavaScript builds to dynamically import remote modules at runtime without bundling them together at compile time. Host applications load Remote containers via a shared manifest. It manages shared singleton dependencies (like React, React-DOM, state stores) via version negotiation, preventing duplicate libraries and enabling zero-downtime independent team deployments.", score: 10, strength: "Covers host/remote containers, runtime dynamic imports, and shared singleton dependency resolution.", weakness: "None.", followUpQuestions: ["How do you handle CSS scoping and styling conflicts between microfrontends?", "What happens if a remote module fails to load over the network?"] }
    ]
  },
  {
    id: "FS-014",
    diff: "Beginner",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In CSS, what does the box-sizing property `border-box` do?",
    opts: ["Includes padding and border within the element's total specified width and height", "Adds a 10px red border to all elements", "Disables CSS margins", "Prevents element resizing on mobile"],
    ans: "Includes padding and border within the element's total specified width and height",
    exp: "border-box ensures width = content + padding + border, preventing layout calculation surprises."
  },
  {
    id: "FS-015",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Problem Solving",
    q: "When implementing debounce vs throttle on a search input with auto-complete suggestions, which technique should you use?",
    opts: ["Debounce (delays execution until user pauses typing for N milliseconds)", "Throttle (executes strictly once every N milliseconds regardless of typing)", "Neither (execute on every keystroke with zero delay)", "Block all keystrokes"],
    ans: "Debounce (delays execution until user pauses typing for N milliseconds)",
    exp: "Debounce waits for a pause in typing, preventing unnecessary intermediate API requests while the user is actively typing."
  },
  {
    id: "FS-016",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "In GraphQL, what is the 'N+1 Problem' and how is it resolved?",
    opts: ["Executing 1 query for parents and N subsequent database queries for each child relation; resolved using DataLoader batching and memoization caching", "Having more than N+1 schema fields", "Overloading the CPU with N+1 threads", "GraphQL server crash after N+1 queries"],
    ans: "Executing 1 query for parents and N subsequent database queries for each child relation; resolved using DataLoader batching and memoization caching",
    exp: "DataLoader batches individual entity requests within an event loop tick into a single SQL WHERE id IN (...) query."
  },
  {
    id: "FS-017",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Coding Skills",
    q: "How do you implement accessible keyboard navigation (WAI-ARIA) for a custom multi-select dropdown component?",
    pre: [
      { id: "resp_a", label: "Response A (Accessibility Engineering)", transcript: "1) Roles & Attributes: role='combobox' / 'listbox' / 'option', aria-expanded, aria-haspopup='listbox', aria-selected on chosen options, and aria-activedescendant pointing to active option ID. 2) Keyboard Navigation: ArrowUp/ArrowDown to move focus, Space/Enter to toggle selection, Escape to close and return focus to trigger, Home/End to jump to ends. 3) Focus Management: Maintain focus on trigger or listbox without breaking tab order.", score: 10, strength: "Covers ARIA roles, states, aria-activedescendant, and comprehensive keyboard handlers.", weakness: "None.", followUpQuestions: ["How does a screen reader announce live search filter results?", "What is the difference between visual focus and DOM focus?"] }
    ]
  },
  {
    id: "FS-018",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What does the SQL clause `HAVING` do compared to `WHERE`?",
    opts: ["HAVING filters groups after GROUP BY aggregations; WHERE filters individual rows before grouping", "HAVING is only for strings", "WHERE can only be used on primary keys", "They are identical"],
    ans: "HAVING filters groups after GROUP BY aggregations; WHERE filters individual rows before grouping",
    exp: "WHERE filters rows before aggregation; HAVING filters aggregated metric results (e.g. HAVING count(*) > 5)."
  },
  {
    id: "FS-019",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the purpose of Content Security Policy (CSP) HTTP headers?",
    opts: ["Restricts the sources from which scripts, styles, images, and fonts can be loaded and executed to prevent XSS and clickjacking", "Speeds up internet connection", "Enforces dark mode in browsers", "Compresses HTML files with Gzip"],
    ans: "Restricts the sources from which scripts, styles, images, and fonts can be loaded and executed to prevent XSS and clickjacking",
    exp: "CSP headers instruct browsers on trusted domains for executable scripts and assets, neutralizing injection attacks."
  },
  {
    id: "FS-020",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "In distributed web architectures, how does Idempotency Key handling work in payment or ordering APIs?",
    opts: ["Client sends a unique UUID in header; server stores request result in atomic Redis cache, returning identical result on retries without re-charging", "Forces user to type password twice", "Locks the database for 10 minutes", "Generates random credit card numbers"],
    ans: "Client sends a unique UUID in header; server stores request result in atomic Redis cache, returning identical result on retries without re-charging",
    exp: "Idempotency keys prevent duplicate mutations during network timeouts by caching the original operation result."
  }
];

fullStackQuestions.forEach(q => {
  questions.push({
    questionId: q.id,
    role: "Full Stack Engineer",
    difficulty: q.diff,
    questionType: q.type,
    competency: q.comp,
    question: q.q,
    scenarioContext: q.scenario,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.exp,
    score: 10,
    predefinedResponses: q.pre
  });
});

// DevOps Engineer (20)
const devOpsQuestions = [
  {
    id: "OPS-001",
    diff: "Advanced",
    type: "Subjective",
    comp: "Architecture Skills",
    q: "How do you architect a multi-cluster Kubernetes GitOps continuous delivery pipeline using ArgoCD, Helm, and progressive Canary rollouts (Argo Rollouts)?",
    pre: [
      { id: "resp_a", label: "Response A (Production GitOps Architecture)", transcript: "1) Git Repo: Declarative manifests separating apps/ and infra/ with environment overlays. 2) Central ArgoCD managing workload clusters via IAM OIDC. 3) Secret management with Bitnami SealedSecrets / External Secrets Operator. 4) Progressive Delivery via Argo Rollouts: step weights (10% -> 10m pause -> automated Prometheus AnalysisTemplate checking 5xx error rate <0.5% & p99 <250ms -> 50% -> 100%). Automated instant rollback on SLA breach.", score: 10, strength: "Full GitOps blueprint, automated metric analysis templates, and secret encryption.", weakness: "None.", followUpQuestions: ["How do you handle database migrations during active canaries?", "How do you update shared Helm charts across clusters?"] }
    ]
  },
  {
    id: "OPS-002",
    diff: "Advanced",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Linux container networking, how does eBPF-based Cilium replace kube-proxy (iptables)?",
    opts: ["Attaches eBPF programs directly to socket and network interface hooks (tc/XDP) for O(1) routing and line-rate encryption bypassing iptables chains", "Converts TCP packets to UDP broadcasts", "Turns off Kubernetes network policies", "Runs physical fiber cables to pods"],
    ans: "Attaches eBPF programs directly to socket and network interface hooks (tc/XDP) for O(1) routing and line-rate encryption bypassing iptables chains",
    exp: "eBPF replaces linear iptables searches with hash table Lookups in the Linux kernel for high packet throughput."
  },
  {
    id: "OPS-003",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Kubernetes, what is the crucial difference between a livenessProbe and a readinessProbe?",
    opts: ["livenessProbe checks if the pod container should be killed and restarted; readinessProbe checks if the pod should receive incoming traffic via Service endpoints", "readinessProbe reboots the node; livenessProbe sends emails", "livenessProbe is only for databases", "They are identical"],
    ans: "livenessProbe checks if the pod container should be killed and restarted; readinessProbe checks if the pod should receive incoming traffic via Service endpoints",
    exp: "Failed liveness probes restart containers; failed readiness probes remove pods from load balancer endpoints without restarts."
  },
  {
    id: "OPS-004",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you debug an application running in Kubernetes that is intermittently throwing OOMKilled (Exit Code 137) errors?",
    pre: [
      { id: "resp_a", label: "Response A (Systematic SRE Diagnostics)", transcript: "1) Verify via kubectl describe pod for exit code 137 and memory limits. 2) Telemetry: Inspect Grafana container_memory_working_set_bytes vs memory_rss to see if leak or spike. 3) Profiling: Continuous heap dumps / pprof. 4) Kernel Logs: Check dmesg for cgroup eviction events. 5) Remediation: Tune memory limits, fix memory buffers, or configure Horizontal Pod Autoscaler.", score: 10, strength: "Distinguishes working_set_bytes from RSS, mentions continuous profiling, heap dumps, and cgroups.", weakness: "None.", followUpQuestions: ["Why is working_set_bytes used for OOM eviction instead of RSS?", "How do JVM heap flags interact with container cgroups?"] }
    ]
  },
  {
    id: "OPS-005",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Terraform, what does `terraform plan` do?",
    opts: ["Creates an execution plan showing what cloud infrastructure additions, modifications, or deletions will occur without modifying real resources", "Deletes all cloud resources", "Commits files to GitHub", "Executes scripts on production servers"],
    ans: "Creates an execution plan showing what cloud infrastructure additions, modifications, or deletions will occur without modifying real resources",
    exp: "terraform plan compares state with code and shows the exact diff that terraform apply would perform."
  },
  {
    id: "OPS-006",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In Docker multi-stage builds, what is the primary benefit of separating the builder stage from the final production runtime image?",
    opts: ["Significantly reduces final container image size and shrinks attack surface by omitting compilers, SDKs, and build files", "Allows containers to run on Windows and Linux simultaneously", "Eliminates Docker daemon", "Speeds up hardware clocks"],
    ans: "Significantly reduces final container image size and shrinks attack surface by omitting compilers, SDKs, and build files",
    exp: "Multi-stage builds produce tiny, secure production containers containing only compiled artifacts and minimal runtimes."
  },
  {
    id: "OPS-007",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "Which observability pillar deals with structured timestamped event records of occurrences in an application?",
    opts: ["Logs", "Metrics", "Distributed Traces", "Continuous Profiles"],
    ans: "Logs",
    exp: "Logs capture discrete events with timestamps and contextual attributes."
  },
  {
    id: "OPS-008",
    diff: "Advanced",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Terraform state management, what mechanism prevents two engineers or CI pipelines from applying concurrent state modifications?",
    opts: ["State Locking (e.g. AWS DynamoDB table or Terraform Cloud state lock)", "Renaming main.tf", "VPN disconnect", "Git hooks deleting history"],
    ans: "State Locking (e.g. AWS DynamoDB table or Terraform Cloud state lock)",
    exp: "State locking acquires a mutex on remote state backends during operations to prevent race conditions and state corruption."
  },
  {
    id: "OPS-009",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the purpose of a Service Mesh (e.g. Istio, Linkerd) in a microservices architecture?",
    opts: ["Provides transparent mTLS encryption, traffic routing/splitting, circuit breaking, and observability between services via sidecar proxies", "Replaces physical network routers", "Generates React frontends", "Manages database backups"],
    ans: "Provides transparent mTLS encryption, traffic routing/splitting, circuit breaking, and observability between services via sidecar proxies",
    exp: "Service meshes manage service-to-service communication, security (mTLS), and telemetry without changing application code."
  },
  {
    id: "OPS-010",
    diff: "Advanced",
    type: "Scenario",
    scenario: "A production Kubernetes cluster experiences a cascading crash after a redis cache outage causes all 200 backend pods to flood the primary PostgreSQL database with reconnects.",
    comp: "Problem Solving",
    q: "What architectural patterns should be implemented to prevent this thundering herd / cascading collapse?",
    pre: [
      { id: "resp_a", label: "Response A (Resilience & Chaos Engineering)", transcript: "1) Connection Pooling: Deploy PgBouncer in front of PostgreSQL to bound maximum database connections. 2) Exponential Backoff with Full Jitter: Update client reconnect logic so retries distribute across time rather than synchronizing. 3) Circuit Breaking: Implement Envoy / resilience4j circuit breakers to fail-fast when database latency spikes. 4) Rate Limiting & Shedding: Drop non-critical read queries under overload.", score: 10, strength: "Covers connection pooling (PgBouncer), jittered exponential backoffs, circuit breakers, and load shedding.", weakness: "None.", followUpQuestions: ["How does Full Jitter mathematically differ from Equal Jitter?", "How do you test this resilience in CI with Chaos Mesh?"] }
    ]
  },
  {
    id: "OPS-011",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?",
    opts: ["CI automates building and testing code on commit; CD automates deploying validated code directly to production environments", "CI is for Linux, CD is for Windows", "CI takes 10 hours, CD takes 1 second", "There is no difference"],
    ans: "CI automates building and testing code on commit; CD automates deploying validated code directly to production environments",
    exp: "CI ensures code merges cleanly with passing automated tests; CD automates seamless release into production."
  },
  {
    id: "OPS-012",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In Prometheus metrics, what is the difference between a Counter and a Gauge?",
    opts: ["Counter only increases (or resets to zero on restart); Gauge can go up or down arbitrarily (e.g. memory usage, active connections)", "Counter can go down, Gauge only goes up", "Counters are only for CPU", "They are identical"],
    ans: "Counter only increases (or resets to zero on restart); Gauge can go up or down arbitrarily (e.g. memory usage, active connections)",
    exp: "Counters track cumulative events (e.g. total HTTP requests); Gauges measure instantaneous values (e.g. current queue depth)."
  },
  {
    id: "OPS-013",
    diff: "Advanced",
    type: "Subjective",
    comp: "Technical Knowledge",
    q: "Explain Zero Trust Architecture (ZTA) in cloud infrastructure and how to implement it using mTLS and SPIFFE/SPIRE.",
    pre: [
      { id: "resp_a", label: "Response A (Zero Trust Engineering)", transcript: "Zero Trust assumes network perimeter breach and enforces 'never trust, always verify'. SPIFFE provides a standardized cryptographic workload identity (SPIFFE ID URI), and SPIRE issues short-lived X.509 SVID certificates. Services establish mutual TLS (mTLS) with cryptographically verified workload identities, enforcing fine-grained RBAC authorization policies independent of network IP addresses.", score: 10, strength: "Covers SPIFFE/SPIRE architecture, short-lived SVID certs, mTLS handshake verification, and identity-based authorization.", weakness: "None.", followUpQuestions: ["How does SPIRE attest workloads running inside Kubernetes pods?", "How are SVID certificates rotated automatically without downtime?"] }
    ]
  },
  {
    id: "OPS-014",
    diff: "Beginner",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "In Linux, what command is used to inspect disk space usage across mounted filesystems?",
    opts: ["df -h", "free -m", "top", "chmod 777"],
    ans: "df -h",
    exp: "df -h shows disk space usage in human-readable gigabytes/megabytes."
  },
  {
    id: "OPS-015",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Problem Solving",
    q: "What is the purpose of Kubernetes Horizontal Pod Autoscaler (HPA)?",
    opts: ["Automatically scales the number of pod replicas up or down based on observed CPU/memory utilization or custom metrics", "Increases node RAM size physically", "Deletes pods after midnight", "Restarts dead servers"],
    ans: "Automatically scales the number of pod replicas up or down based on observed CPU/memory utilization or custom metrics",
    exp: "HPA queries metrics-server or Prometheus to adjust pod replica count according to defined target utilization thresholds."
  },
  {
    id: "OPS-016",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "In AWS IAM, what is the security principle of 'Least Privilege'?",
    opts: ["Granting only the absolute minimum permissions necessary to perform a specific task and no more", "Giving root admin access to all developers", "Deleting all IAM roles", "Allowing public read access on all S3 buckets"],
    ans: "Granting only the absolute minimum permissions necessary to perform a specific task and no more",
    exp: "Least privilege minimizes security blast radius by scoping IAM policies strictly to required actions and resource ARNs."
  },
  {
    id: "OPS-017",
    diff: "Intermediate",
    type: "Subjective",
    comp: "Problem Solving",
    q: "How do you automate Secrets Management in a Kubernetes cluster using HashiCorp Vault or AWS Secrets Manager?",
    pre: [
      { id: "resp_a", label: "Response A (External Secrets Operator)", transcript: "Deploy External Secrets Operator (ESO) in the cluster. Create SecretStore resources referencing AWS Secrets Manager or HashiCorp Vault with IAM Roles for Service Accounts (IRSA). Developers declare ExternalSecret CRDs in Git. ESO syncs secrets into native Kubernetes Secret objects in memory, allowing automatic secret rotation without storing plaintext credentials in Git repositories.", score: 10, strength: "Uses External Secrets Operator, IRSA IAM authentication, and automated rotation.", weakness: "None.", followUpQuestions: ["How does Vault Agent sidecar injector compare to External Secrets Operator?", "How do you trigger pod restarts when a synced secret rotates?"] }
    ]
  },
  {
    id: "OPS-018",
    diff: "Beginner",
    type: "MCQ",
    comp: "Coding Skills",
    q: "In a Dockerfile, what is the difference between `CMD` and `ENTRYPOINT`?",
    opts: ["`ENTRYPOINT` defines the executable that always runs; `CMD` provides default arguments that can be easily overridden from docker run CLI", "`CMD` runs as root, `ENTRYPOINT` runs as guest", "`ENTRYPOINT` is only for Windows", "They are identical aliases"],
    ans: "`ENTRYPOINT` defines the executable that always runs; `CMD` provides default arguments that can be easily overridden from docker run CLI",
    exp: "ENTRYPOINT configures the container as an executable; CMD sets default parameters that can be superseded."
  },
  {
    id: "OPS-019",
    diff: "Intermediate",
    type: "MCQ",
    comp: "Technical Knowledge",
    q: "What is Chaos Engineering and why is it practiced?",
    opts: ["Intentionally injecting faults (network latency, pod kills, disk fills) into production or staging systems to uncover hidden resilience vulnerabilities before real incidents occur", "Writing unformatted code randomly", "Deploying without unit tests", "Deleting random database rows"],
    ans: "Intentionally injecting faults (network latency, pod kills, disk fills) into production or staging systems to uncover hidden resilience vulnerabilities before real incidents occur",
    exp: "Chaos engineering builds confidence in system resilience by proactively validating automated recovery mechanisms under controlled failures."
  },
  {
    id: "OPS-020",
    diff: "Advanced",
    type: "MCQ",
    comp: "Architecture Skills",
    q: "In site reliability engineering (SRE), what is an 'Error Budget'?",
    opts: ["1 minus the SLO (Service Level Objective); the allowable amount of downtime or error rate that product teams can spend on risky new deployments before freezing releases to focus on reliability", "The financial budget paid to cloud providers", "The total number of bugs in Jira", "The cost of developer laptops"],
    ans: "1 minus the SLO (Service Level Objective); the allowable amount of downtime or error rate that product teams can spend on risky new deployments before freezing releases to focus on reliability",
    exp: "Error budgets balance feature velocity with reliability; exhausting the budget pauses feature rollouts in favor of stability improvements."
  }
];

devOpsQuestions.forEach(q => {
  questions.push({
    questionId: q.id,
    role: "DevOps Engineer",
    difficulty: q.diff,
    questionType: q.type,
    competency: q.comp,
    question: q.q,
    scenarioContext: q.scenario,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.exp,
    score: 10,
    predefinedResponses: q.pre
  });
});

fs.writeFileSync(path.join(dataDir, 'questions.json'), JSON.stringify(questions, null, 2));
console.log(`Generated exactly ${questions.length} questions across 5 roles!`);
