/**
 * InterviewIQ™ Platform - Frontend Client Application
 * Communicates with FastAPI Python Backend
 */

class InterviewIQApp {
  constructor() {
    this.activeView = 'recruiter';
    this.activePersona = 'Recruiter';
    this.demoStep = 1;
    this.candidates = [];
    this.questions = [];
    this.interviewers = [];
    this.hiringManagers = [];
    this.historicalInterviews = [];
    this.workdayRecords = [];
    this.slackMessages = [];
    this.activeSession = null;
    this.selectedCompareIds = [];
    this.currentQIndex = 0;
    this.charts = {};

    this.demoSteps = [
      { num: 1, title: "1. Select Candidate", desc: "Choose a candidate from the Recruiter Pipeline", view: "recruiter" },
      { num: 2, title: "2. Start Interview", desc: "Launch live interview session with Dr. Elena Rostova", view: "interview" },
      { num: 3, title: "3. Answer Questions", desc: "Answer MCQ & Subjective questions with simulated candidate answers", view: "interview" },
      { num: 4, title: "4. View Scores", desc: "Inspect real-time score updates and competency tracking in sidebar", view: "interview" },
      { num: 5, title: "5. Follow-ups", desc: "Review intelligent follow-up suggestions recommended by Copilot", view: "interview" },
      { num: 6, title: "6. Scorecard", desc: "Complete interview to view 5-dimension radar competency chart", view: "scorecard" },
      { num: 7, title: "7. AI Summary", desc: "Review auto-generated executive summary and hiring recommendation", view: "scorecard" },
      { num: 8, title: "8. Submit Workday", desc: "Sync feedback scorecard directly into mock Workday HCM portal", view: "workday" },
      { num: 9, title: "9. Slack Alert", desc: "Verify automated rich BlockKit notification posted in Slack", view: "slack" },
      { num: 10, title: "10. Analytics", desc: "Return to Recruiter Dashboard to review pipeline metrics and charts", view: "recruiter" }
    ];
  }

  async init() {
    await this.fetchData();
    this.renderDemoStepper();
    this.navigate(this.activeView);
    if (window.lucide) lucide.createIcons();
  }

  async fetchData() {
    try {
      const [cRes, qRes, invRes, histRes, wdRes, slkRes, sessRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/questions'),
        fetch('/api/interviewers'),
        fetch('/api/historical'),
        fetch('/api/workday'),
        fetch('/api/slack'),
        fetch('/api/session')
      ]);

      this.candidates = await cRes.json();
      this.questions = await qRes.json();
      this.interviewers = await invRes.json();
      this.historicalInterviews = await histRes.json();
      this.workdayRecords = await wdRes.json();
      this.slackMessages = await slkRes.json();
      this.activeSession = await sessRes.json();

      this.updateActiveSessionPill();
    } catch (err) {
      console.error("Failed to load platform data:", err);
    }
  }

  updateActiveSessionPill() {
    const pill = document.getElementById('active-session-pill');
    const label = document.getElementById('session-candidate-label');
    if (this.activeSession && !this.activeSession.isCompleted) {
      pill.classList.remove('hidden');
      label.textContent = `Session: ${this.activeSession.candidate.name.split(' ')[0]}`;
    } else {
      pill.classList.add('hidden');
    }
  }

  navigate(viewName) {
    this.activeView = viewName;
    
    // Update tab styling
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.className = 'nav-tab flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-slate-100';
    });
    const activeTab = document.getElementById(`tab-${viewName}`);
    if (activeTab) {
      activeTab.className = 'nav-tab flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap bg-blue-600 text-white shadow-xs';
    }

    const container = document.getElementById('app-viewport');
    container.innerHTML = '';

    if (viewName === 'recruiter') this.renderRecruiterView(container);
    else if (viewName === 'hiringManager') this.renderHiringManagerView(container);
    else if (viewName === 'interview') this.renderInterviewView(container);
    else if (viewName === 'scorecard') this.renderScorecardView(container);
    else if (viewName === 'questions') this.renderQuestionsView(container);
    else if (viewName === 'workday') this.renderWorkdayView(container);
    else if (viewName === 'slack') this.renderSlackView(container);

    if (window.lucide) lucide.createIcons();
  }

  setPersona(persona) {
    this.activePersona = persona;
    document.getElementById('btn-persona-recruiter').className = persona === 'Recruiter' ? 'px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-xs' : 'px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200';
    document.getElementById('btn-persona-interviewer').className = persona === 'Interviewer' ? 'px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-xs' : 'px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200';
    document.getElementById('btn-persona-hm').className = persona === 'Hiring Manager' ? 'px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-xs' : 'px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200';
    
    if (persona === 'Recruiter') this.navigate('recruiter');
    else if (persona === 'Interviewer') this.navigate('interview');
    else if (persona === 'Hiring Manager') this.navigate('hiringManager');
  }

  renderDemoStepper() {
    const container = document.getElementById('demo-steps-container');
    const textLabel = document.getElementById('demo-step-text');
    const currentStepObj = this.demoSteps.find(s => s.num === this.demoStep) || this.demoSteps[0];

    textLabel.innerHTML = `Step ${this.demoStep} of 10: <strong class="text-blue-900 font-bold">${currentStepObj.title.split('. ')[1]}</strong> &mdash; ${currentStepObj.desc}`;

    container.innerHTML = this.demoSteps.map(step => {
      const isCurrent = step.num === this.demoStep;
      const isPast = step.num < this.demoStep;

      return `
        <button onclick="app.setDemoStep(${step.num})" class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all ${
          isCurrent 
            ? 'bg-blue-600 text-white font-bold shadow-md border border-blue-700' 
            : isPast 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
        }">
          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
            isCurrent ? 'bg-white text-blue-700' : isPast ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
          }">${isPast ? '✓' : step.num}</span>
          <span class="text-[11px] truncate font-medium">${step.title.split('. ')[1]}</span>
        </button>
      `;
    }).join('');
  }

  setDemoStep(stepNum) {
    this.demoStep = stepNum;
    this.renderDemoStepper();
    const step = this.demoSteps.find(s => s.num === stepNum);
    if (step) {
      if (step.num === 2 && !this.activeSession) {
        this.startInterview(this.candidates[0].id);
      } else {
        this.navigate(step.view);
      }
    }
  }

  nextDemoStep() {
    this.setDemoStep(Math.min(10, this.demoStep + 1));
  }

  prevDemoStep() {
    this.setDemoStep(Math.max(1, this.demoStep - 1));
  }

  async resetDemoData() {
    await fetch('/api/reset', { method: 'POST' });
    await this.fetchData();
    this.demoStep = 1;
    this.renderDemoStepper();
    this.navigate('recruiter');
    alert('Demo data successfully reset to initial factory state.');
  }

  /* ----------------------------------------------------
     MODULE 1: RECRUITER DASHBOARD
  ---------------------------------------------------- */
  renderRecruiterView(container) {
    const totalCount = this.historicalInterviews.length + this.candidates.filter(c => c.interviewStage === 'Interview In Progress').length;
    const completedCount = this.historicalInterviews.filter(h => h.status === 'Completed').length;
    const scheduledCount = this.candidates.filter(c => c.interviewStage === 'Scheduled').length;
    const pendingFeedbackCount = this.candidates.filter(c => c.interviewStage === 'Feedback Pending').length;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Banner -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <i data-lucide="activity" class="w-4 h-4"></i>
              </span>
              <h1 class="text-xl font-heading font-bold text-slate-900 tracking-tight">
                Enterprise Recruiter Command Center
              </h1>
            </div>
            <p class="text-xs text-slate-500 mt-1">Real-time pipeline monitoring, automated interviewer matching, and AI copilot execution tracking.</p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="app.startInterview('${this.candidates[0].id}')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-200"></i>
              <span>Launch Quick AI Demo (Dr. Elena)</span>
            </button>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Interviews</span>
              <i data-lucide="users" class="w-4 h-4 text-blue-600"></i>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-extrabold text-slate-900 font-heading">${totalCount}</span>
              <span class="text-[11px] text-emerald-600 block font-semibold">+14% this month</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Completed</span>
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-extrabold text-emerald-700 font-heading">${completedCount}</span>
              <span class="text-[11px] text-slate-500 block font-medium">Copilot Validated</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Scheduled</span>
              <i data-lucide="clock" class="w-4 h-4 text-indigo-600"></i>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-extrabold text-indigo-700 font-heading">${scheduledCount}</span>
              <span class="text-[11px] text-slate-500 block font-medium">Next 48 Hours</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Pending Feedback</span>
              <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600"></i>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-extrabold text-amber-600 font-heading">${pendingFeedbackCount + 3}</span>
              <span class="text-[11px] text-amber-700 block font-semibold">Requires Follow-up</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Interviewer Load</span>
              <i data-lucide="bar-chart-3" class="w-4 h-4 text-cyan-600"></i>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-extrabold text-cyan-800 font-heading">84.6%</span>
              <span class="text-[11px] text-emerald-600 block font-semibold">Optimal Band</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Avg Feedback Time</span>
              <i data-lucide="trending-up" class="w-4 h-4 text-emerald-600"></i>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-extrabold text-emerald-700 font-heading">2.1 hrs</span>
              <span class="text-[11px] text-emerald-600 block font-semibold">Down from 48 hrs</span>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                  <i data-lucide="bar-chart-3" class="w-4 h-4 text-blue-600"></i>
                  Hiring Funnel & Conversion Velocity
                </h2>
                <p class="text-xs text-slate-500">Candidate flow from resume screening to final offer</p>
              </div>
            </div>
            <div class="h-64 w-full relative">
              <canvas id="chart-funnel"></canvas>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <i data-lucide="pie-chart" class="w-4 h-4 text-blue-600"></i>
                Outcome Distribution
              </h2>
              <p class="text-xs text-slate-500">Historical AI recommendation breakdown</p>
            </div>
            <div class="h-52 w-full my-auto relative">
              <canvas id="chart-outcomes"></canvas>
            </div>
          </div>
        </div>

        <!-- Candidates Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <i data-lucide="users" class="w-4 h-4 text-blue-600"></i>
                Candidate Pipeline & Requisitions (${this.candidates.length})
              </h2>
              <p class="text-xs text-slate-500">Select candidate to start AI-assisted interview or inspect evaluation profiles</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th class="py-3 px-4">Candidate</th>
                  <th class="py-3 px-4">Role & Experience</th>
                  <th class="py-3 px-4">Core Skills</th>
                  <th class="py-3 px-4">Stage</th>
                  <th class="py-3 px-4">Assigned Interviewer</th>
                  <th class="py-3 px-4">Score / Rec</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${this.candidates.map(cand => `
                  <tr class="hover:bg-blue-50/50 transition-colors">
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-3">
                        <img src="${cand.avatarUrl}" alt="${cand.name}" class="w-9 h-9 rounded-full object-cover border border-slate-200">
                        <div>
                          <span class="font-bold text-slate-900 block">${cand.name}</span>
                          <span class="text-[11px] text-slate-500 font-medium">${cand.location}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="text-slate-800 font-semibold block">${cand.role}</span>
                      <span class="text-[11px] text-slate-500">${cand.experienceYears} Years Exp</span>
                    </td>
                    <td class="py-3.5 px-4">
                      <div class="flex flex-wrap gap-1 max-w-xs">
                        ${cand.skills.slice(0, 3).map(s => `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">${s}</span>`).join('')}
                      </div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        cand.interviewStage === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        cand.interviewStage === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        ${cand.interviewStage}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="text-slate-800 block font-medium">${cand.assignedInterviewerName.split(' (')[0]}</span>
                    </td>
                    <td class="py-3.5 px-4">
                      ${cand.overallScore ? `
                        <div class="flex items-center gap-1.5">
                          <span class="font-bold text-slate-900">${cand.overallScore}%</span>
                          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            cand.recommendation === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                            cand.recommendation === 'Hire' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }">${cand.recommendation}</span>
                        </div>
                      ` : '<span class="text-slate-400 italic">Not evaluated</span>'}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <button onclick="app.startInterview('${cand.id}')" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all">
                        Start Interview
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Render Funnel Chart
    const ctxFunnel = document.getElementById('chart-funnel').getContext('2d');
    new Chart(ctxFunnel, {
      type: 'bar',
      data: {
        labels: ['Applied (120)', 'Screened (68)', 'Scheduled (32)', 'Completed (42)', 'Offered (18)', 'Hired (14)'],
        datasets: [{
          data: [120, 68, 32, 42, 18, 14],
          backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#0284c7', '#10b981', '#059669'],
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } }
      }
    });

    // Render Outcome Donut Chart
    const ctxOutcome = document.getElementById('chart-outcomes').getContext('2d');
    new Chart(ctxOutcome, {
      type: 'doughnut',
      data: {
        labels: ['Strong Hire', 'Hire', 'Borderline', 'No Hire'],
        datasets: [{
          data: [18, 22, 7, 3],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } }
      }
    });
  }

  /* ----------------------------------------------------
     MODULE 2: LIVE INTERVIEW COPILOT WORKSPACE
  ---------------------------------------------------- */
  async startInterview(candidateId) {
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId })
    });
    this.activeSession = await res.json();
    this.currentQIndex = 0;
    this.demoStep = 3;
    this.renderDemoStepper();
    this.updateActiveSessionPill();
    this.navigate('interview');
  }

  renderInterviewView(container) {
    if (!this.activeSession) {
      container.innerHTML = `
        <div class="max-w-md mx-auto py-16 text-center space-y-4">
          <i data-lucide="bot" class="w-12 h-12 text-blue-600 mx-auto"></i>
          <h2 class="text-xl font-bold font-heading">No Active Interview Session</h2>
          <p class="text-xs text-slate-500">Select a candidate from the Recruiter Pipeline to launch the AI Copilot.</p>
          <button onclick="app.startInterview('${this.candidates[0].id}')" class="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
            Start Demo with Dr. Elena Rostova
          </button>
        </div>
      `;
      return;
    }

    const { candidate, interviewer, questionSet, answers, evaluationResult, interviewerNotes } = this.activeSession;
    const currentQ = questionSet[this.currentQIndex] || questionSet[0];
    const currentAns = answers.find(a => a.questionId === currentQ.questionId);

    // Build transcript text
    let transcriptText = "Candidate is responding to question...";
    if (currentAns?.selectedResponseId && currentQ.predefinedResponses) {
      const resp = currentQ.predefinedResponses.find(r => r.id === currentAns.selectedResponseId);
      if (resp) transcriptText = resp.candidateTranscript;
    } else if (currentAns?.selectedOption) {
      transcriptText = `Candidate selected: Option "${currentAns.selectedOption}"`;
    }

    container.innerHTML = `
      <div class="space-y-4 text-xs">
        <!-- Question Stepper Bar -->
        <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <span class="font-bold text-slate-900">Questions (${answers.length}/${questionSet.length}):</span>
          <div class="flex items-center gap-1.5">
            ${questionSet.map((q, idx) => {
              const isCurr = idx === this.currentQIndex;
              const isDone = answers.some(a => a.questionId === q.questionId);
              return `
                <button onclick="app.jumpQuestion(${idx})" class="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  isCurr ? 'bg-blue-600 text-white border border-blue-700' :
                  isDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }">${idx + 1}</button>
              `;
            }).join('')}
          </div>
          <button onclick="app.completeInterviewSession()" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs">
            Complete & View Scorecard
          </button>
        </div>

        <!-- 3-Column Split View -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          <!-- Left: Candidate Profile (3 cols) -->
          <div class="lg:col-span-3 space-y-4">
            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div class="flex items-center gap-3">
                <img src="${candidate.avatarUrl}" alt="${candidate.name}" class="w-12 h-12 rounded-xl object-cover border-2 border-blue-500">
                <div>
                  <h3 class="font-bold text-slate-900 text-sm font-heading">${candidate.name}</h3>
                  <span class="text-blue-700 font-semibold block text-[11px]">${candidate.role}</span>
                  <span class="text-[10px] text-slate-500 font-medium">${candidate.location}</span>
                </div>
              </div>
              <p class="text-slate-600 text-[11px] pt-2 border-t border-slate-100">
                <strong>Resume:</strong> ${candidate.resumeSummary}
              </p>
              <div class="flex flex-wrap gap-1">
                ${candidate.skills.map(s => `<span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">${s}</span>`).join('')}
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-500">Assigned Evaluator</span>
              <div class="flex items-center gap-2">
                <img src="${interviewer.avatarUrl}" class="w-7 h-7 rounded-full object-cover">
                <div>
                  <span class="font-bold text-slate-900 block">${interviewer.name}</span>
                  <span class="text-[10px] text-slate-600">${interviewer.title}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Center: Question Card (6 cols) -->
          <div class="lg:col-span-6 space-y-4">
            <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    Q${this.currentQIndex + 1} of ${questionSet.length}
                  </span>
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">${currentQ.difficulty}</span>
                  <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">${currentQ.questionType}</span>
                </div>
                <span class="text-xs font-bold text-blue-700">${currentQ.score} Pts</span>
              </div>

              ${currentQ.scenarioContext ? `
                <div class="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-medium">
                  <strong>Enterprise Context:</strong> "${currentQ.scenarioContext}"
                </div>
              ` : ''}

              <h2 class="text-base font-bold font-heading text-slate-900 leading-snug">
                ${currentQ.question}
              </h2>

              <!-- Live Audio Waveform & Speech-to-Text -->
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Audio Stream & Speech Transcription
                  </span>
                  <div class="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
                    <span class="waveform-bar"></span>
                    <span class="waveform-bar"></span>
                    <span class="waveform-bar"></span>
                    <span class="waveform-bar"></span>
                    <span class="text-[10px] text-blue-700 font-mono font-bold ml-1">HD</span>
                  </div>
                </div>
                <div class="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-800 leading-relaxed">
                  "${transcriptText}"
                </div>
              </div>

              <!-- Options / Responses -->
              ${currentQ.questionType === 'MCQ' && currentQ.options ? `
                <div class="space-y-2 pt-2">
                  <span class="font-bold uppercase text-slate-500 block text-[10px]">Select Candidate Answer:</span>
                  <div class="space-y-2">
                    ${currentQ.options.map((opt, idx) => {
                      const isSel = currentAns?.selectedOption === opt;
                      const isCorr = opt === currentQ.correctAnswer;
                      const letter = String.fromCharCode(65 + idx);
                      return `
                        <button onclick="app.selectMcqAnswer('${opt}')" class="w-full p-3 rounded-xl text-left border flex items-start gap-3 transition-all ${
                          isSel ? (isCorr ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-400') : 'bg-white border-slate-200 hover:bg-slate-50'
                        }">
                          <span class="w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs ${
                            isSel ? (isCorr ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-700'
                          }">${letter}</span>
                          <div>
                            <span class="font-semibold text-slate-800 block">${opt}</span>
                            ${isSel && currentQ.explanation ? `<p class="text-[11px] text-slate-600 pt-1"><strong>Explanation:</strong> ${currentQ.explanation}</p>` : ''}
                          </div>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              ${(currentQ.questionType === 'Subjective' || currentQ.questionType === 'Scenario') && currentQ.predefinedResponses ? `
                <div class="space-y-2.5 pt-2">
                  <span class="font-bold uppercase text-slate-500 block text-[10px]">Candidate Response Depth:</span>
                  <div class="space-y-2">
                    ${currentQ.predefinedResponses.map(resp => {
                      const isSel = currentAns?.selectedResponseId === resp.id;
                      return `
                        <button onclick="app.selectSubjectiveAnswer('${resp.id}')" class="w-full p-3 rounded-xl text-left border transition-all ${
                          isSel ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }">
                          <div class="flex items-center justify-between mb-1">
                            <span class="font-bold text-slate-900">${resp.label}</span>
                            <span class="font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">Score: ${resp.score}/10</span>
                          </div>
                          <p class="text-[11px] text-slate-700 font-mono italic">"${resp.candidateTranscript}"</p>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Stepper Controls -->
              <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                <button onclick="app.jumpQuestion(${Math.max(0, this.currentQIndex - 1)})" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium">Prev</button>
                <span class="font-bold text-slate-700">${this.currentQIndex + 1} of ${questionSet.length}</span>
                <button onclick="app.jumpQuestion(${Math.min(questionSet.length - 1, this.currentQIndex + 1)})" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold">Next</button>
              </div>
            </div>

            <!-- Notes -->
            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span class="font-bold text-slate-800 block">Interviewer Observation Log</span>
              <textarea id="notes-input" onblur="app.saveNotes(this.value)" rows="2" class="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400" placeholder="Custom interviewer impressions...">${interviewerNotes || ''}</textarea>
            </div>
          </div>

          <!-- Right: Copilot Telemetry Sidebar (3 cols) -->
          <div class="lg:col-span-3 space-y-4">
            <div class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-heading font-bold text-slate-900 text-xs">AI Copilot Telemetry</span>
                <span class="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">Active</span>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between text-[10px] text-slate-600 font-semibold">
                  <span>Coverage Progress</span>
                  <span>${answers.length}/${questionSet.length} (${Math.round((answers.length / questionSet.length) * 100)}%)</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${(answers.length / questionSet.length) * 100}%"></div>
                </div>
              </div>
            </div>

            ${currentAns?.copilotFeedback ? `
              <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <span class="font-bold text-slate-900 block text-xs">Live Copilot Insights</span>
                ${currentAns.copilotFeedback.strength ? `
                  <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                    <strong>Demonstrated Strength:</strong> ${currentAns.copilotFeedback.strength}
                  </div>
                ` : ''}
                ${currentAns.copilotFeedback.weakness && !currentAns.copilotFeedback.weakness.includes('None') ? `
                  <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                    <strong>Knowledge Gap:</strong> ${currentAns.copilotFeedback.weakness}
                  </div>
                ` : ''}
              </div>

              ${currentAns.copilotFeedback.followUpQuestions?.length ? `
                <div class="p-3.5 rounded-xl bg-white border border-blue-200 shadow-xs space-y-2">
                  <span class="font-bold text-slate-900 block text-xs">Recommended Follow-Ups</span>
                  ${currentAns.copilotFeedback.followUpQuestions.map(fq => `
                    <div class="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                      <p class="text-slate-800 font-medium">"${fq}"</p>
                      <button onclick="app.appendNote('Follow-up asked: ${fq.replace(/'/g, "\\'")}')" class="text-blue-600 font-bold hover:underline text-[10px]">+ Insert into Notes</button>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            ` : `
              <div class="p-4 rounded-xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
                Select an answer choice to trigger Copilot strengths, gaps, and follow-up questions.
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }

  jumpQuestion(index) {
    this.currentQIndex = index;
    this.renderInterviewView(document.getElementById('app-viewport'));
  }

  async selectMcqAnswer(opt) {
    const q = this.activeSession.questionSet[this.currentQIndex];
    const isCorrect = opt === q.correctAnswer;
    const score = isCorrect ? (q.score || 10) : 2;

    const answerPayload = {
      questionId: q.questionId,
      questionType: "MCQ",
      selectedOption: opt,
      isCorrect: isCorrect,
      scoreAwarded: score,
      competency: q.competency,
      copilotFeedback: {
        strength: isCorrect ? `Accurately identified correct architectural pattern (${opt}).` : "Attempted question.",
        weakness: !isCorrect ? `Selected incorrect option (${opt}). Correct answer: ${q.correctAnswer}` : "None",
        followUpQuestions: [
          `Why is "${q.correctAnswer}" preferred over alternative options in high-scale systems?`,
          `How would you monitor and measure this in production telemetry?`
        ]
      },
      timestamp: new Date().toISOString()
    };

    const res = await fetch('/api/session/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerPayload)
    });
    this.activeSession = await res.json();
    this.demoStep = 4;
    this.renderDemoStepper();
    this.renderInterviewView(document.getElementById('app-viewport'));
  }

  async selectSubjectiveAnswer(respId) {
    const q = this.activeSession.questionSet[this.currentQIndex];
    const resp = q.predefinedResponses.find(r => r.id === respId);

    const answerPayload = {
      questionId: q.questionId,
      questionType: q.questionType,
      selectedResponseId: resp.id,
      scoreAwarded: resp.score,
      competency: q.competency,
      copilotFeedback: {
        strength: resp.strength,
        weakness: resp.weakness,
        followUpQuestions: resp.followUpQuestions
      },
      timestamp: new Date().toISOString()
    };

    const res = await fetch('/api/session/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerPayload)
    });
    this.activeSession = await res.json();
    this.demoStep = 4;
    this.renderDemoStepper();
    this.renderInterviewView(document.getElementById('app-viewport'));
  }

  async saveNotes(notes) {
    if (!this.activeSession) return;
    await fetch('/api/session/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
  }

  async appendNote(text) {
    const existing = this.activeSession?.interviewerNotes || '';
    const updated = existing ? `${existing}\n• ${text}` : `• ${text}`;
    await this.saveNotes(updated);
    this.activeSession.interviewerNotes = updated;
    this.renderInterviewView(document.getElementById('app-viewport'));
  }

  async completeInterviewSession() {
    const res = await fetch('/api/session/complete', { method: 'POST' });
    const record = await res.json();
    await this.fetchData();
    this.demoStep = 6;
    this.renderDemoStepper();
    this.navigate('scorecard');
  }

  /* ----------------------------------------------------
     MODULE 3: SCORECARD & AI SUMMARY
  ---------------------------------------------------- */
  renderScorecardView(container) {
    const rec = this.activeSession?.evaluationResult ? {
      candidateName: this.activeSession.candidate.name,
      candidateRole: this.activeSession.candidate.role,
      interviewerName: this.activeSession.interviewer.name,
      totalScore: this.activeSession.evaluationResult.totalScore,
      recommendation: this.activeSession.evaluationResult.recommendation,
      recommendationRationale: this.activeSession.evaluationResult.recommendationRationale,
      competencies: this.activeSession.evaluationResult.competencies,
      strengths: this.activeSession.evaluationResult.strengths,
      weaknesses: this.activeSession.evaluationResult.weaknesses,
      overallSummary: this.activeSession.evaluationResult.overallSummary
    } : (this.historicalInterviews[0] ? {
      candidateName: this.historicalInterviews[0].candidateName,
      candidateRole: this.historicalInterviews[0].candidateRole,
      interviewerName: this.historicalInterviews[0].interviewerName,
      totalScore: this.historicalInterviews[0].totalScore,
      recommendation: this.historicalInterviews[0].recommendation,
      recommendationRationale: "Candidate demonstrated exceptional performance across technical and system design rubrics.",
      competencies: this.historicalInterviews[0].competencyScores,
      strengths: this.historicalInterviews[0].summary.strengths,
      weaknesses: this.historicalInterviews[0].summary.weaknesses,
      overallSummary: this.historicalInterviews[0].summary.overallSummary
    } : null);

    if (!rec) {
      container.innerHTML = `<div class="py-16 text-center text-slate-500">No scorecard available. Conduct an interview first.</div>`;
      return;
    }

    if (rec.recommendation === 'Strong Hire' || rec.recommendation === 'Hire') {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Scorecard Header -->
        <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div class="space-y-1.5">
            <span class="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
              FINAL EVALUATION REPORT
            </span>
            <h1 class="text-2xl font-heading font-bold text-slate-900 tracking-tight">
              ${rec.candidateName} &mdash; <span class="text-blue-700">${rec.candidateRole}</span>
            </h1>
            <p class="text-xs text-slate-500">Evaluated by <strong class="text-slate-800">${rec.interviewerName}</strong> &bull; Validated via Rule Engine</p>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="text-xs font-bold text-slate-500 uppercase block">Aggregate Score</span>
              <span class="text-3xl font-heading font-extrabold text-slate-900">${rec.totalScore}<span class="text-lg text-slate-400">/100</span></span>
            </div>

            <div class="px-5 py-3 rounded-2xl border shadow-sm ${
              rec.recommendation === 'Strong Hire' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' :
              rec.recommendation === 'Hire' ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-amber-50 border-amber-300 text-amber-900'
            }">
              <span class="text-[10px] font-bold uppercase block opacity-70">AI Recommendation</span>
              <span class="text-lg font-heading font-bold">${rec.recommendation}</span>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span class="text-xs text-slate-600 font-medium">Deterministic Rule Scoring Verified &mdash; Zero External AI Service APIs</span>
          <div class="flex items-center gap-2.5">
            <button onclick="app.syncToWorkday()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
              Submit Feedback to Workday HCM
            </button>
            <button onclick="app.postToSlack('${rec.candidateName}', '${rec.candidateRole}', ${rec.totalScore}, '${rec.recommendation}')" class="px-4 py-2 rounded-xl bg-[#4A154B] hover:bg-[#611f69] text-white font-bold text-xs shadow-sm">
              Notify Hiring Channel on Slack
            </button>
          </div>
        </div>

        <!-- Radar & Competency Breakdown Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 class="text-sm font-bold text-slate-900 font-heading">5-Dimension Competency Radar</h2>
            <div class="h-64 w-full relative">
              <canvas id="chart-radar"></canvas>
            </div>
          </div>

          <div class="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 class="text-sm font-bold text-slate-900 font-heading">Competency Scores (Rated 1-5)</h2>
            <div class="space-y-2.5 text-xs">
              ${[
                { label: 'Technical Knowledge', val: rec.competencies.technicalKnowledge },
                { label: 'Problem Solving', val: rec.competencies.problemSolving },
                { label: 'Communication', val: rec.competencies.communication },
                { label: 'Architecture Skills', val: rec.competencies.architectureSkills },
                { label: 'Coding Skills', val: rec.competencies.codingSkills }
              ].map(c => `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span class="font-bold text-slate-800">${c.label}</span>
                  <div class="flex items-center gap-1.5">
                    ${[1,2,3,4,5].map(star => `
                      <span class="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                        star <= c.val ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                      }">${star}</span>
                    `).join('')}
                    <span class="ml-2 font-bold text-slate-900">${c.val}/5</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 class="font-bold text-slate-900 font-heading">Key Strengths & Identified Gaps</h3>
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <strong>Demonstrated Strengths:</strong>
              <ul class="list-disc list-inside">${rec.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <strong>Areas for Improvement:</strong>
              <ul class="list-disc list-inside">${rec.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 class="font-bold text-slate-900 font-heading">Executive Narrative</h3>
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
              ${rec.overallSummary}
            </div>
            <p class="text-slate-500 pt-2 border-t border-slate-100">
              <strong>Hiring Rationale:</strong> ${rec.recommendationRationale}
            </p>
          </div>
        </div>
      </div>
    `;

    // Render Radar Chart
    const ctxRadar = document.getElementById('chart-radar').getContext('2d');
    new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: ['Technical', 'Problem Solving', 'Communication', 'Architecture', 'Coding'],
        datasets: [
          {
            label: 'Candidate',
            data: [
              rec.competencies.technicalKnowledge,
              rec.competencies.problemSolving,
              rec.competencies.communication,
              rec.competencies.architectureSkills,
              rec.competencies.codingSkills
            ],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.25)'
          },
          {
            label: 'Benchmark',
            data: [4, 4, 3.5, 4, 4],
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.08)',
            borderDash: [4, 4]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: { min: 0, max: 5, ticks: { stepSize: 1, display: false } }
        }
      }
    });
  }

  async syncToWorkday() {
    await fetch('/api/workday/sync', { method: 'POST' });
    await this.fetchData();
    this.demoStep = 8;
    this.renderDemoStepper();
    alert('✓ Interview Feedback Submitted Successfully to Workday HCM for Requisition #REQ-2026-084!');
    this.navigate('workday');
  }

  async postToSlack(candidateName, role, score, recommendation) {
    await fetch('/api/slack/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'interview_completed',
        data: { candidateName, role, score, recommendation }
      })
    });
    await this.fetchData();
    this.demoStep = 9;
    this.renderDemoStepper();
    this.navigate('slack');
  }

  /* ----------------------------------------------------
     MODULE 4: HIRING MANAGER DASHBOARD
  ---------------------------------------------------- */
  renderHiringManagerView(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div>
            <h1 class="text-xl font-heading font-bold text-slate-900 tracking-tight">Hiring Manager Decision Portal</h1>
            <p class="text-xs text-slate-500 mt-1">Review candidate talent leaderboards, compare scorecards, and approve offer packages.</p>
          </div>
        </div>

        <!-- 4 Column Pipeline -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="font-bold text-blue-700 block">Ready for Decision (4)</span>
            ${this.candidates.slice(0, 3).map(c => `
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div class="flex justify-between font-bold text-slate-900">
                  <span>${c.name}</span>
                  <span class="text-emerald-700">${c.overallScore || 88}%</span>
                </div>
                <span class="text-[11px] text-slate-500 block">${c.role}</span>
                <button onclick="alert('Offer package approved for ${c.name}!')" class="w-full py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]">
                  Approve Offer
                </button>
              </div>
            `).join('')}
          </div>

          <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="font-bold text-emerald-700 block">Offer Extended (3)</span>
            <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
              <span class="font-bold text-slate-900 block">Dr. Elena Rostova</span>
              <span class="text-[11px] text-slate-600 block">GenAI Engineer &bull; $225,000</span>
              <span class="text-[10px] text-emerald-800 font-bold">Pending Candidate Signature</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="font-bold text-amber-700 block">Follow-up Panel Needed (2)</span>
            <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
              <span class="font-bold text-slate-900 block">Carlos Delgado</span>
              <span class="text-[11px] text-slate-600 block">Score: 68% &bull; Borderline</span>
              <button onclick="alert('Requested 30-min leveling panel.')" class="w-full py-1 rounded bg-white text-slate-700 border border-slate-300 text-[11px]">Request Leveling</button>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="font-bold text-blue-700 block">Requisition Demand</span>
            <div class="space-y-1.5 text-[11px]">
              <div class="flex justify-between"><span>GenAI Eng</span><strong>3/6 Filled</strong></div>
              <div class="flex justify-between"><span>AI Architect</span><strong>2/4 Filled</strong></div>
              <div class="flex justify-between"><span>Data Eng</span><strong>4/5 Filled</strong></div>
            </div>
          </div>
        </div>

        <!-- Leaderboard Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="p-5 border-b border-slate-100 font-bold text-slate-900">Talent Leaderboard</div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <tr>
                  <th class="py-3 px-4">Rank</th>
                  <th class="py-3 px-4">Candidate</th>
                  <th class="py-3 px-4">Role</th>
                  <th class="py-3 px-4">Score</th>
                  <th class="py-3 px-4">Recommendation</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${this.candidates.slice(0, 10).map((c, idx) => `
                  <tr class="hover:bg-slate-50">
                    <td class="py-3 px-4 font-mono font-bold text-slate-500">#${idx + 1}</td>
                    <td class="py-3 px-4 font-bold text-slate-900">${c.name}</td>
                    <td class="py-3 px-4 text-slate-700">${c.role}</td>
                    <td class="py-3 px-4 font-extrabold text-slate-900">${c.overallScore || (90 - idx * 2)}%</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded font-bold ${idx < 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
                        ${idx < 4 ? 'Strong Hire' : 'Hire'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     MODULE 5: QUESTION BANK
  ---------------------------------------------------- */
  renderQuestionsView(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h1 class="text-xl font-heading font-bold text-slate-900">Question Bank Explorer</h1>
            <p class="text-xs text-slate-500 mt-1">Browse ${this.questions.length} calibrated assessment questions across 5 roles.</p>
          </div>
          <span class="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">${this.questions.length} Questions</span>
        </div>

        <div class="space-y-3">
          ${this.questions.slice(0, 15).map(q => `
            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-blue-700">${q.questionId}</span>
                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">${q.role}</span>
                <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">${q.difficulty}</span>
                <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">${q.questionType}</span>
              </div>
              <h3 class="font-bold text-slate-900 text-sm font-heading">${q.question}</h3>
              ${q.scenarioContext ? `<p class="text-slate-600 bg-indigo-50/50 p-2 rounded border border-indigo-100">"${q.scenarioContext}"</p>` : ''}
              ${q.explanation ? `<p class="text-slate-600"><strong>Explanation:</strong> ${q.explanation}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     MODULE 6: MOCK WORKDAY HCM
  ---------------------------------------------------- */
  renderWorkdayView(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-[#003b71] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-white text-[#003b71] font-bold flex items-center justify-center text-base">W</div>
            <div>
              <h1 class="text-lg font-bold font-heading">Workday Recruiting HCM</h1>
              <p class="text-xs text-blue-200">Requisition #REQ-2026-084 &bull; Scorecard Synchronization Hub</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="p-4 border-b border-slate-100 font-bold text-slate-900 text-xs">Synchronized Candidate Scorecards</div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <tr>
                  <th class="py-3 px-4">ID</th>
                  <th class="py-3 px-4">Candidate</th>
                  <th class="py-3 px-4">Job Title</th>
                  <th class="py-3 px-4">Rating</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4">Submitted By</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${this.workdayRecords.map(w => `
                  <tr class="hover:bg-slate-50">
                    <td class="py-3.5 px-4 font-mono font-bold text-blue-700">${w.id}</td>
                    <td class="py-3.5 px-4 font-bold text-slate-900">${w.candidateName}</td>
                    <td class="py-3.5 px-4 text-slate-700">${w.jobTitle}</td>
                    <td class="py-3.5 px-4 font-bold text-emerald-700">${w.overallRating}</td>
                    <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">${w.scorecardStatus}</span></td>
                    <td class="py-3.5 px-4 text-slate-600">${w.submittedBy}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     MODULE 7: MOCK SLACK CONNECT
  ---------------------------------------------------- */
  renderSlackView(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-[#4A154B] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-lg font-heading">#interview-updates</span>
            <span class="text-xs bg-[#611f69] px-2 py-0.5 rounded-full">Slack Connect</span>
          </div>
          <button onclick="app.postToSlack('Carlos Delgado', 'Full Stack Engineer', 72, 'Hire')" class="px-3 py-1 bg-white text-[#4A154B] font-bold text-xs rounded-lg">
            Simulate Slack Alert
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          ${this.slackMessages.map(msg => `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div class="flex items-center gap-2">
                <img src="${msg.sender.avatar}" class="w-6 h-6 rounded-md object-cover">
                <span class="font-bold text-slate-900">${msg.sender.name}</span>
                <span class="text-[10px] text-slate-400">${msg.timestamp}</span>
              </div>
              <p class="text-slate-800 font-medium">${msg.text}</p>
              ${msg.blocks ? msg.blocks.map(b => `
                ${b.fields ? `
                  <div class="grid grid-cols-2 gap-1 bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                    ${b.fields.map(f => `<div>${f.replace(/\*/g, '')}</div>`).join('')}
                  </div>
                ` : ''}
              `).join('') : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Global Application Root
const app = new InterviewIQApp();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
