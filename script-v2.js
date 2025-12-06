/*
======================================
TARKAN SALAR - LPV2 SCRIPT
Focused "Blue Ocean" Diagnostic Logic
======================================
*/

document.addEventListener("DOMContentLoaded", () => {
  
  // Force icon render on load
  if (window.lucide) window.lucide.createIcons();

  /**
   * ======================================
   * SECTION 1: MODAL CONTROLS
   * ======================================
   */
  const diagnosticModal = document.getElementById("diagnostic-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  
  // Triggers specific to LPV2
  const heroBtn = document.getElementById("open-diagnostic-btn-hero");
  const imgBtn = document.getElementById("open-diagnostic-btn-img"); // The button inside the mockup
  const visualTrigger = document.getElementById("visual-trigger"); // The clickable mockup container

  const openModal = () => {
    if (diagnosticModal) {
      diagnosticModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Lock background scroll
      // Critical: Re-render icons so modal icons appear
      if (window.lucide) window.lucide.createIcons();
    }
  };

  const closeModal = () => {
    if (diagnosticModal) {
      diagnosticModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  // Attach listeners
  if (heroBtn) heroBtn.addEventListener("click", openModal);
  if (imgBtn) imgBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal(); });
  if (visualTrigger) visualTrigger.addEventListener("click", openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

  // Close on outside click
  if (diagnosticModal) {
    diagnosticModal.addEventListener("click", (e) => {
      if (e.target === diagnosticModal) closeModal();
    });
  }

  /**
   * ======================================
   * SECTION 2: THE "GOLDEN 15" QUESTION BANK
   * ======================================
   */
  const quizContainer = document.getElementById("quiz-container");
  if (!quizContainer) return;

  const questionBank = [
    // --- PART 1: DIAGNOSTIC (Best Practices) ---
    // These Yes/No/Scale questions determine the Score
    {
      q: "If you stopped all ads today, would your sales drop by more than 50% immediately?", // Q1
      type: "select",
      options: [
        "Yes – we rely heavily on paid acquisition",
        "Somewhat – but we have organic traffic too",
        "No – we have a strong loyal customer base"
      ]
    },
    {
      q: "Do you have an automated post-purchase email flow that generates at least 15% of your revenue?", // Q2
      type: "select",
      options: ["Yes, it's a machine", "We have one, but it's basic", "No, we rely on newsletters/campaigns"]
    },
    {
      q: "Is your current profit margin (EBITDA) above 20%?", // Q3
      type: "select",
      options: ["Yes, comfortably", "It fluctuates around break-even", "No, we are currently burning cash to grow"]
    },
    {
      q: "If you raised your prices by 20% tomorrow, would your customers stay?", // Q4 (Pricing Power)
      type: "select",
      options: ["Yes, they value the brand", "We'd lose some, but it would balance out", "No, they buy because we are affordable"]
    },
    {
      q: "Do you launch at least one new 'Blue Ocean' product variation or bundle every quarter?", // Q5 (Innovation)
      type: "select",
      options: ["Yes, we innovate constantly", "We try, but supply chain slows us down", "No, we sell the same core catalogue"]
    },
    {
      q: "How would you describe your current use of AI in operations?", // Q6 (AI Maturity)
      type: "select",
      options: [
        "3D (Advanced): Fully integrated into supply chain & CX",
        "2D (Basic): We use ChatGPT for copy/emails",
        "1D (None): We don't really use AI"
      ]
    },
    {
      q: "Do you have a 'Single Source of Truth' dashboard that tracks real-time LTV and Contribution Margin?", // Q7 (Clarity)
      type: "select",
      options: ["Yes, I know my numbers daily", "Sort of, I check spreadsheets weekly", "No, I wait for my accountant"]
    },
    {
      q: "Is your founder still the primary bottleneck for major decisions?", // Q8 (Ops)
      type: "select",
      options: ["No, the team runs the show", "Sometimes", "Yes, everything goes through me"]
    },
    {
      q: "If your brand disappeared tomorrow, would customers *genuinely* miss it, or just find a replacement?", // Q9 (Brand Moat)
      type: "select",
      options: ["They'd miss us deeply", "They'd be annoyed but switch", "They'd just buy from a competitor"]
    },
    {
      q: "Are you currently sitting on more than 20% dead stock?", // Q10 (Cash Flow)
      type: "select",
      options: ["No, inventory turns fast", "A little bit", "Yes, cash is tied up in stock"]
    },

    // --- PART 2: PROFILING (Qualifying) ---
    // These questions help YOU sell on the call
    {
      q: "What is your current annual revenue run rate?", // Q11
      type: "select",
      options: ["$500k - $1M", "$1M – $3M", "$3M – $8M", "$8M – $20M", "$20M+"]
    },
    {
      q: "What is your #1 goal for the next 6 months?", // Q12
      type: "select",
      options: ["Maximize Profitability", "Aggressive Top-Line Growth", "Prepare for Exit/Sale", "Stabilize Operations"]
    },
    {
      q: "What is the biggest obstacle stopping you right now?", // Q13
      type: "select",
      options: ["Rising Ad Costs (CAC)", "Operational Chaos / Burnout", "Inventory/Cash Flow", "Low Retention / LTV"]
    },
    {
      q: "How urgent is fixing this problem?", // Q14
      type: "select",
      options: ["Critical: Need to fix it in 30 days", "High: This quarter", "Medium: Just exploring options"]
    },
    {
      q: "Anything else you want us to know about your business?", // Q15 (Open Text)
      type: "open",
      placeholder: "Tell me about your specific situation..."
    }
  ];

  // --- DOM ELEMENTS ---
  const quizStartEl = document.getElementById("quiz-start");
  const startQuizBtn = document.getElementById("start-quiz-btn");
  const quizQuestionsEl = document.getElementById("quiz-questions");
  const quizProgressBar = document.getElementById("quiz-progress-bar");
  const quizSlidesContainer = quizContainer.querySelector(".quiz-slides");
  
  const quizLeadCaptureEl = document.getElementById("quiz-lead-capture");
  const submitLeadBtn = document.getElementById("submit-lead-btn");
  const quizLeadErrorEl = document.getElementById("quiz-lead-error");
  const quizResultsEl = document.getElementById("quiz-results");

  // --- STATE ---
  let currentQuestionIndex = 0;
  let answers = {};

  // --- INIT QUIZ ---
  function initQuiz() {
    if(!quizSlidesContainer) return;
    quizSlidesContainer.innerHTML = "";
    renderQuestions();
    if(startQuizBtn) startQuizBtn.addEventListener("click", startQuiz);
    addQuizListeners();
  }

  function renderQuestions() {
    questionBank.forEach((q, index) => {
      const questionEl = document.createElement("div");
      questionEl.className = "quiz-question hidden"; // Hidden by default
      questionEl.dataset.questionIndex = index;

      let optionsHtml = "";
      if (q.type === "select") {
        optionsHtml = q.options
          .map((option) => `<button class="quiz-option" data-value="${option}">${option}</button>`)
          .join("");
      } else if (q.type === "open") {
        optionsHtml = `<textarea class="quiz-textarea" placeholder="${q.placeholder}" data-index="${index}"></textarea>`;
      }

      const navHtml = `
        <div class="quiz-nav">
          <button class="btn btn-secondary btn-back" ${index === 0 ? 'style="visibility: hidden;"' : ""}>Back</button>
          ${
            index === questionBank.length - 1
              ? `<button class="btn btn-primary btn-submit-quiz">See My Results</button>`
              : `<button class="btn btn-primary btn-next ${q.type === "open" ? "" : "hidden"}">Next</button>`
          }
        </div>
      `;

      questionEl.innerHTML = `
        <label class="question-label" for="q${index}">${index + 1}. ${q.q}</label>
        <div class="space-y-4 mt-6">${optionsHtml}</div>
        ${navHtml}
      `;
      quizSlidesContainer.appendChild(questionEl);
    });
  }

  function addQuizListeners() {
    quizSlidesContainer.addEventListener("click", (e) => {
      // Option Click
      if (e.target.classList.contains("quiz-option")) {
        handleOptionClick(e.target);
      }
      // Nav Click
      if (e.target.classList.contains("btn-next")) showQuestion(currentQuestionIndex + 1);
      if (e.target.classList.contains("btn-back")) showQuestion(currentQuestionIndex - 1);
      if (e.target.classList.contains("btn-submit-quiz")) showLeadCapture();
    });

    // Textarea Input
    quizSlidesContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("quiz-textarea")) {
        const index = parseInt(e.target.dataset.index, 10);
        answers[index] = e.target.value;
      }
    });

    // Lead Capture Back Button
    if (quizLeadCaptureEl) {
      const backBtn = quizLeadCaptureEl.querySelector(".btn-back");
      if(backBtn) backBtn.addEventListener("click", () => showQuestion(questionBank.length - 1));
    }
  }

  function handleOptionClick(optionBtn) {
    const index = currentQuestionIndex;
    const value = optionBtn.dataset.value;

    answers[index] = value;

    // Visual selection
    const parent = optionBtn.parentNode;
    Array.from(parent.children).forEach((btn) => btn.classList.remove("selected"));
    optionBtn.classList.add("selected");

    // Auto-advance
    setTimeout(() => {
      showQuestion(index + 1);
    }, 300);
  }

  function startQuiz() {
    quizStartEl.classList.add("hidden");
    quizLeadCaptureEl.classList.add("hidden");
    quizResultsEl.classList.add("hidden");
    quizQuestionsEl.classList.remove("hidden");
    showQuestion(0);
  }

  function showQuestion(index) {
    if (index < 0 || index >= questionBank.length) return;
    currentQuestionIndex = index;

    // Hide all questions
    const allQs = quizSlidesContainer.querySelectorAll(".quiz-question");
    allQs.forEach(q => {
      q.classList.remove("active-question");
      q.classList.add("hidden"); // Ensure hidden class is applied
    });

    // Show current
    const activeQ = quizSlidesContainer.querySelector(`.quiz-question[data-question-index="${index}"]`);
    if(activeQ) {
      activeQ.classList.remove("hidden");
      activeQ.classList.add("active-question");
    }

    // Hide others
    quizLeadCaptureEl.classList.add("hidden");
    quizQuestionsEl.classList.remove("hidden");

    // Update Bar
    if(quizProgressBar) {
      const progress = ((index + 1) / questionBank.length) * 100;
      quizProgressBar.style.width = `${progress}%`;
    }
  }

  function showLeadCapture() {
    quizQuestionsEl.classList.add("hidden");
    quizLeadCaptureEl.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  }

  // --- GOOGLE SHEETS & SCORING LOGIC ---
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGYEUCBm3ueYKPmgDBulXupsufhifXxXdvixZS0zsq8HvD0U6VTs1eeigRUNf94w1PUg/exec';

  if (submitLeadBtn) {
    submitLeadBtn.addEventListener("click", () => {
      const name = document.getElementById("quiz-name").value;
      const email = document.getElementById("quiz-email").value;
      const phone = document.getElementById("quiz-phone").value;
      const business = document.getElementById("quiz-business").value;
      const btnText = document.getElementById("btn-text");

      if (!name || !email || !business) {
        if(quizLeadErrorEl) quizLeadErrorEl.classList.remove("hidden");
        return;
      }
      if(quizLeadErrorEl) quizLeadErrorEl.classList.add("hidden");

      if(btnText) btnText.textContent = "Analyzing...";
      submitLeadBtn.disabled = true;

      const results = calculateResultsLogic();

      // Send to Backend
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("business", business);
      formData.append("score", results.score);
      formData.append("profitLeak", results.profitLeak);
      formData.append("answers", JSON.stringify(answers));

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
      })
      .then(() => renderDashboard(results, business, email))
      .catch(() => renderDashboard(results, business, email));
    });
  }

  function calculateResultsLogic() {
    let score = 0;
    
    // Helper to check answers safely
    const check = (idx, txt) => (answers[idx] || "").toString().includes(txt);

    // Q1 (Ads Reliance): "No" is best
    if(check(0, "No")) score += 10;
    else if(check(0, "Somewhat")) score += 5;

    // Q2 (Email Flow): "Machine" is best
    if(check(1, "machine")) score += 10;
    else if(check(1, "basic")) score += 5;

    // Q3 (Profit): "Comfortably" is best
    if(check(2, "Comfortably")) score += 10;

    // Q4 (Pricing Power): "Yes" is best
    if(check(3, "Yes")) score += 10;

    // Q5 (Innovation): "Yes" is best
    if(check(4, "innovate")) score += 10;

    // Q6 (AI): "3D" is best
    if(check(5, "3D")) score += 10;
    else if(check(5, "2D")) score += 5;

    // Q7 (Dashboard): "Yes" is best
    if(check(6, "Yes")) score += 10;

    // Q8 (Founder Bottleneck): "No" is best
    if(check(7, "No")) score += 10;

    // Q9 (Moat): "Miss us" is best
    if(check(8, "miss us")) score += 10;

    // Q10 (Deadstock): "No" is best
    if(check(9, "No")) score += 10;

    // Profit Leak Calculation based on Revenue Bracket (Q11 / Index 10)
    let revenueMultiplier = 20000;
    const revAnswer = answers[10] || "";
    if (revAnswer.includes("$1M")) revenueMultiplier = 50000;
    if (revAnswer.includes("$3M")) revenueMultiplier = 100000;
    if (revAnswer.includes("$8M")) revenueMultiplier = 250000;
    if (revAnswer.includes("$20M+")) revenueMultiplier = 500000;

    // Max score is 100. The missing points % is the leak %
    const leakFactor = (100 - score) / 100; // e.g., Score 60 -> 0.4 leak factor
    const profitLeak = Math.round(leakFactor * revenueMultiplier);

    return { score, profitLeak };
  }

  function renderDashboard(results, businessName, email) {
    quizLeadCaptureEl.classList.add("hidden");
    quizResultsEl.classList.remove("hidden");
    
    // Update Text
    const safeSet = (id, txt) => { const el = document.getElementById(id); if(el) el.textContent = txt; };
    
    safeSet("result-business-name", businessName);
    safeSet("quiz-score-value", results.score);
    safeSet("profit-leak-value", "$" + results.profitLeak.toLocaleString());
    safeSet("confirm-email", email);

    // Score Label
    const scoreLabel = document.getElementById("score-label");
    if(scoreLabel) {
      if(results.score < 50) {
        scoreLabel.textContent = "⚠️ Red Ocean Danger Zone";
        scoreLabel.className = "relative z-10 text-brand-red font-bold text-lg";
      } else if (results.score < 80) {
        scoreLabel.textContent = "⚠️ The Messy Middle";
        scoreLabel.className = "relative z-10 text-brand-orange font-bold text-lg";
      } else {
        scoreLabel.textContent = "🌊 Blue Ocean Ready";
        scoreLabel.className = "relative z-10 text-brand-primary font-bold text-lg";
      }
    }

    // Dynamic Insights based on specific answers
    const posText = (answers[3] || "").includes("Yes") 
      ? "STRONG: Your pricing power suggests a differentiated brand."
      : "WEAK: You are competing on price. This is a 'Red Ocean' trap.";
    safeSet("insight-positioning", posText);

    const retText = (answers[1] || "").includes("machine")
      ? "SOLID: Your backend is monetizing customers well."
      : "LEAKY: You are paying for customers but not keeping them.";
    safeSet("insight-retention", retText);

    const aiText = (answers[5] || "").includes("3D")
      ? "ADVANCED: You are ahead of the curve."
      : "LAGGING: Competitors using AI will have 30% lower OPEX than you.";
    safeSet("insight-ai", aiText);

    // Render Radar Chart
    const canvas = document.getElementById('blueOceanChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const s = results.score;
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Brand', 'Ops', 'AI', 'Profit', 'Speed'],
                datasets: [{
                    label: 'Audit',
                    data: [s, s > 50 ? s-10 : s+10, s > 70 ? 90 : 40, s, s-5],
                    backgroundColor: 'rgba(216, 249, 17, 0.2)',
                    borderColor: '#D8F911',
                    pointBackgroundColor: '#D8F911',
                    borderWidth: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        pointLabels: { color: 'rgba(255,255,255,0.7)', font: { size: 10 } },
                        ticks: { display: false, backdropColor: 'transparent' },
                        suggestedMin: 0, suggestedMax: 100
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Run Init
  initQuiz();
});