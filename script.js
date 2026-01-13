/*
======================================
TARKAN SALAR - CUSTOM SCRIPT (Revamped)
Based on the 22 Nov 2025 Blueprint
======================================
*/

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
  /**
   * ======================================
   * SECTION 1: DIAGNOSTIC MODAL CONTROLS
   * ======================================
   */
  const diagnosticModal = document.getElementById("diagnostic-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const openDiagnosticBtns = [
    document.getElementById("open-diagnostic-btn-nav"),
    document.getElementById("open-diagnostic-btn-mobile"),
    document.getElementById("open-diagnostic-btn-hero"),
    document.getElementById("open-diagnostic-btn-cta"),
    document.getElementById("open-diagnostic-btn-sticky"),
  ];

  const openModal = () => {
    if (diagnosticModal) {
      diagnosticModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent background scroll
      // Render icons inside the modal when it opens
      if (window.lucide) lucide.createIcons();
    }
  };

  const closeModal = () => {
    if (diagnosticModal) {
      diagnosticModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  // Add listeners to all "Start Diagnostic" buttons
  openDiagnosticBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", openModal);
    }
  });

  // Listener for the "X" close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  // Listener to close modal by clicking on the overlay
  if (diagnosticModal) {
    diagnosticModal.addEventListener("click", (e) => {
      if (e.target === diagnosticModal) {
        closeModal();
      }
    });
  }

  /**
   * ======================================
   * SECTION 2: MOBILE NAVIGATION
   * ======================================
   */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a[href^="#"]') : [];
  const mobileDiagnosticBtn = document.getElementById("open-diagnostic-btn-mobile");

  if (mobileMenuBtn && mobileMenu) {
    // Toggle menu open/close on button click
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close menu when a standard nav link is clicked
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });

    // Close menu *and* open modal when mobile diagnostic button is clicked
    if (mobileDiagnosticBtn) {
      mobileDiagnosticBtn.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        // openModal() is already attached to this button from Section 1
      });
    }
  }

  /**
   * ======================================
   * SECTION 3: FOOTER YEAR
   * ======================================
   */
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /**
   * ======================================
   * SECTION 4: BLUE OCEAN DIAGNOSTIC QUIZ
   * ======================================
   */
  const quizContainer = document.getElementById("quiz-container");
  // Don't run quiz logic if container isn't found
  if (!quizContainer) return; 

  // --- 4A. QUIZ DATA BANK ---
  const questionBank = [
    // Part 1: Brand Positioning (9 questions)
    {
      q: "What industry are you in?", // Index 0
      type: "select",
      options: [
        "Fashion & Apparel",
        "Cosmetics & Beauty",
        "Furniture & Home Goods",
        "Sports Equipment & Gear",
        "Supplements & Wellness",
        "Beverages (Coffee, Drinks, etc.)",
        "Other",
      ],
    },
    {
      q: "What's your current annual revenue?", // Index 1
      type: "select",
      options: ["$500k - $1M", "$1M – $3M", "$3M – $5M", "$5M – $8M", "$8M+"], 
    },
    {
      q: "If you were sold out of your best-selling product for 4 weeks, what would your customers do?", // Index 2
      type: "select",
      options: [
        "Wait for us to restock – they only want our brand",
        "Buy from a competitor – they need the product type, not ours",
        "Not sure – we've never tested this",
      ],
    },
    {
      q: "If you raised your prices by 20% tomorrow, what would happen?", // Index 3
      type: "select",
      options: [
        "Sales would stay strong – our customers value what we offer",
        "We'd lose most customers – they're price-sensitive",
        "Not sure – we're afraid to test it",
      ],
    },
    {
      q: "If your brand disappeared tomorrow, would your customers miss you—or just find a replacement?", // Index 4
      type: "select",
      options: [
        "They'd genuinely miss us – we have a loyal community",
        "They'd replace us easily – we're interchangeable",
        "Honestly, I don't know",
      ],
    },
    {
      q: "When you pitch your brand to a stranger or investor, do they 'get it' immediately?", // Index 5
      type: "select",
      options: [
        "Yes – they instantly understand our category and value",
        "Mostly – they get it after a short explanation",
        "Not really – we have to explain multiple times",
        "No – people are often confused about what we actually do",
      ],
    },
    {
      q: "Where do most of your customers discover you?", // Index 6
      type: "select",
      options: [
        "Paid ads (Meta, Google, TikTok)",
        "Organic social media",
        "Word of mouth / referrals",
        "Retail / wholesale partners",
        "Amazon or other marketplaces",
        "We're not sure – it's all mixed",
      ],
    },
    {
      q: "What's your biggest competitive threat right now?", // Index 7
      type: "select",
      options: [
        "Cheaper knockoffs flooding the market",
        "Bigger brands with more budget",
        "Customer indifference – they don't see why we're different",
        "Market saturation – everyone sells the same thing",
        "Rising ad costs – can't acquire customers profitably anymore",
      ],
    },
    {
      q: 'Complete this sentence: "Our customers choose us because..."', // Index 8
      type: "open",
      placeholder: "Type your 1-2 sentence answer here...",
    },
    // Part 2: AI Readiness (6 questions)
    {
      q: "How are you currently using AI in your business?", // Index 9
      type: "multi-select",
      options: [
        "1D (Basic automation): ChatGPT for emails, captions, basic tasks",
        "2D (Cost savings): Automating customer service, operations, workflows",
        "3D (Unfair advantage): Using AI for product innovation, customer insights, etc.",
        "Not using AI at all",
        "Using AI but not sure if it's actually helping",
      ],
    },
    {
      q: "If you had an extra $100K right now, where would you invest it to grow fastest?", // Index 10
      type: "select",
      options: [
        "Marketing & customer acquisition",
        "Product development & innovation",
        "Branding & positioning (to stand out)",
        "Systems, automation & AI tools",
        "Hiring & team",
        "I'm not sure – I need clarity first",
      ],
    },
    {
      q: "What's the #1 thing stealing your time right now that AI or systems could handle?", // Index 11
      type: "open",
      placeholder: "e.g., Answering support tickets, managing inventory...",
    },
    {
      q: "How do you currently track profitability and cash flow?", // Index 12
      type: "select",
      options: [
        "Strong system – we have dashboards, a CFO, or solid tools",
        "Manual tracking – spreadsheets, but inconsistent",
        "Accountant once a year – we're reactive, not proactive",
        "Honestly, we're not clear on real profits",
      ],
    },
    {
      q: "What's the ONE problem you want solved in the next 30 days?", // Index 13
      type: "open",
      placeholder: "Be specific...",
    },
    {
      q: "What's your ideal outcome 12 months from now?", // Index 14
      type: "open",
      placeholder: "e.g., 'Exit the business', 'Double profitability', 'Remove myself from operations'...",
    },
    // Part 3: Coaching Fit (6 questions)
    {
      q: "Have you worked with a coach, consultant, or advisor before?", // Index 15
      type: "select",
      options: [
        "Yes, and it was transformational",
        "Yes, but it didn't work out (they didn't understand my business)",
        "No, but I'm open to it",
        "No, I prefer to figure it out myself",
      ],
    },
    {
      q: "What matters most to you when choosing someone to help you grow? (Select up to 3)", // Index 16
      type: "multi-select",
      limit: 3, 
      options: [
        "Years of hands-on experience (10+ years)",
        "Built and scaled physical products themselves",
        "Deep expertise in my specific industry",
        "Proven frameworks and systems (not just theory)",
        "Someone who's been in the trenches",
        "Chemistry and trust",
      ],
    },
    {
      q: "If the right coach could help you add $500K–$1M in profit in 8 weeks, what would you be willing to invest?", // Index 17
      type: "select",
      options: ["$5K – $10K", "$10K – $15K", "$15K – $25K", "$25K+", "Not sure – depends on the plan and ROI"],
    },
    {
      q: "How urgent is solving your biggest business problem right now?", // Index 18
      type: "select",
      options: [
        "Extremely urgent – it's keeping me up at night",
        "Very urgent – I need help within 30 days",
        "Somewhat urgent – I'll focus on it this quarter",
        "Not urgent – just exploring options",
      ],
    },
    {
      q: "If you could wave a magic wand and fix ONE thing in your business today, what would it be?", // Index 19
      type: "open",
      placeholder: "The one thing causing the most friction...",
    },
    {
      q: "BONUS: Is there anything else you'd like to share about your business, goals, or challenges?", // Index 20
      type: "open",
      placeholder: "This context helps...",
    },
  ];

  // --- 4B. QUIZ DOM ELEMENTS ---
  const quizStartEl = document.getElementById("quiz-start");
  const startQuizBtn = document.getElementById("start-quiz-btn");
  const quizQuestionsEl = document.getElementById("quiz-questions");
  const quizProgressBar = document.getElementById("quiz-progress-bar");
  const quizSlidesContainer = quizContainer.querySelector(".quiz-slides");

  // New Lead Capture elements
  const quizLeadCaptureEl = document.getElementById("quiz-lead-capture");
  const submitLeadBtn = document.getElementById("submit-lead-btn");
  const quizLeadErrorEl = document.getElementById("quiz-lead-error");

  // Results elements
  const quizResultsEl = document.getElementById("quiz-results");

  // --- 4C. QUIZ STATE ---
  let currentQuestionIndex = 0;
  let answers = {}; // Stores answers by question index

  // --- 4D. QUIZ FUNCTIONS ---

  /**
   * Initializes the quiz, renders questions, and sets up listeners.
   */
  function initQuiz() {
    if(!quizSlidesContainer) return;
    
    // Clear the placeholder content from HTML
    quizSlidesContainer.innerHTML = "";

    // Render all question slides into the container
    renderQuestions();

    // Add main event listener
    if(startQuizBtn) startQuizBtn.addEventListener("click", startQuiz);

    // Add event listeners for rendered questions
    addQuizListeners();
  }

  /**
   * Renders all question slides into the DOM from the questionBank.
   */
  function renderQuestions() {
    questionBank.forEach((q, index) => {
      const questionEl = document.createElement("div");
      questionEl.className = "quiz-question";
      questionEl.dataset.questionIndex = index;

      let optionsHtml = "";
      switch (q.type) {
        case "select":
          optionsHtml = q.options
            .map((option) => `<button class="quiz-option" data-value="${option}">${option}</button>`)
            .join("");
          break;
        case "multi-select":
          optionsHtml = q.options
            .map((option) => `<button class="quiz-option multi" data-value="${option}">${option}</button>`)
            .join("");
          break;
        case "open":
          optionsHtml = `<textarea class="quiz-textarea" placeholder="${q.placeholder}" data-index="${index}"></textarea>`;
          break;
      }

      const navHtml = `
                <div class="quiz-nav">
                    <button class="btn btn-secondary btn-back" ${
                      index === 0 ? 'style="visibility: hidden;"' : ""
                    }>Back</button>
                    ${
                      index === questionBank.length - 1
                        ? `<button class="btn btn-primary btn-submit-quiz">See My Results</button>`
                        : `<button class="btn btn-primary btn-next ${
                            q.type === "open" ? "" : "hidden"
                          }">Next</button>`
                    }
                </div>
            `;

      questionEl.innerHTML = `
                <label class="question-label" for="q${index}">Q${index + 1}: ${q.q}</label>
                ${q.limit ? `<p class="question-description">(Select up to ${q.limit})</p>` : ""}
                <div class="space-y-4 mt-6">${optionsHtml}</div>
                ${navHtml}
            `;

      quizSlidesContainer.appendChild(questionEl);
    });
  }

  /**
   * Adds event listeners to the dynamically rendered quiz elements.
   */
  function addQuizListeners() {
    quizSlidesContainer.addEventListener("click", (e) => {
      // Handle Option Clicks
      if (e.target.classList.contains("quiz-option")) {
        handleOptionClick(e.target);
      }
      // Handle Nav Clicks
      if (e.target.classList.contains("btn-next")) {
        showQuestion(currentQuestionIndex + 1);
      }
      if (e.target.classList.contains("btn-back")) {
        showQuestion(currentQuestionIndex - 1);
      }
      // New flow: Submit Quiz -> Show Lead Capture
      if (e.target.classList.contains("btn-submit-quiz")) {
        showLeadCapture();
      }
    });

    // Handle open-ended answers
    quizSlidesContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("quiz-textarea")) {
        const index = parseInt(e.target.dataset.index, 10);
        answers[index] = e.target.value;
      }
    });

    // Add listeners for new Lead Capture step
    if (quizLeadCaptureEl) {
      // Back button on lead form goes to last question
      const backBtn = quizLeadCaptureEl.querySelector(".btn-back");
      if(backBtn) {
          backBtn.addEventListener("click", () => {
            showQuestion(questionBank.length - 1);
          });
      }
    }
  }

  /**
   * Handles logic when a user clicks a quiz option button.
   */
  function handleOptionClick(optionBtn) {
    const index = currentQuestionIndex;
    const question = questionBank[index];
    const value = optionBtn.dataset.value;

    if (question.type === "multi-select") {
      // Toggle selection
      optionBtn.classList.toggle("selected");

      // Get all selected options
      const selectedOptions = Array.from(optionBtn.parentNode.querySelectorAll(".selected")).map(
        (btn) => btn.dataset.value
      );

      // Enforce limit (for Q17)
      if (question.limit && selectedOptions.length > question.limit) {
        optionBtn.classList.remove("selected"); // Undo selection
        return;
      }

      answers[index] = selectedOptions;

      // Show 'Next' button for multi-select
      optionBtn.closest(".quiz-question").querySelector(".btn-next").classList.remove("hidden");
    } else if (question.type === "select") {
      // Store answer
      answers[index] = value; // This is a string

      // Visually select
      Array.from(optionBtn.parentNode.children).forEach((btn) => btn.classList.remove("selected"));
      optionBtn.classList.add("selected");

      // Auto-advance to next question
      setTimeout(() => {
        showQuestion(index + 1);
      }, 300);
    }
  }

  /**
   * Starts the quiz, hiding the start screen.
   */
  function startQuiz() {
    quizStartEl.classList.add("hidden");
    quizLeadCaptureEl.classList.add("hidden");
    quizResultsEl.classList.add("hidden");
    quizQuestionsEl.classList.remove("hidden");
    showQuestion(0);
  }

  /**
   * Displays a specific question by its index.
   */
  function showQuestion(index) {
    if (index < 0 || index >= questionBank.length) return;

    currentQuestionIndex = index;

    // Hide all questions
    quizSlidesContainer.querySelectorAll(".quiz-question").forEach((q) => {
      q.classList.remove("active-question");
    });

    // Hide other quiz screens
    quizLeadCaptureEl.classList.add("hidden");
    quizResultsEl.classList.add("hidden");

    // Show the current question and its parent container
    const activeQ = quizSlidesContainer.querySelector(`.quiz-question[data-question-index="${index}"]`);
    if(activeQ) activeQ.classList.add("active-question");
    
    quizQuestionsEl.classList.remove("hidden");

    // Update progress bar
    const progress = ((index + 1) / questionBank.length) * 100;
    if(quizProgressBar) quizProgressBar.style.width = `${progress}%`;

    // Render icons (for "Back" button)
    if (window.lucide) lucide.createIcons();
  }

  /**
   * (New) Shows the lead capture form.
   */
  function showLeadCapture() {
    quizQuestionsEl.classList.add("hidden");
    quizResultsEl.classList.add("hidden");
    quizLeadCaptureEl.classList.remove("hidden");
    // Render icons (for buttons on this screen)
    if (window.lucide) lucide.createIcons();
  }

  // --- GOOGLE SHEETS & AI LOGIC ---
  // IMPORTANT: This URL must be from a Web App deployment executed as "Me" with access "Anyone"
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGYEUCBm3ueYKPmgDBulXupsufhifXxXdvixZS0zsq8HvD0U6VTs1eeigRUNf94w1PUg/exec'; 

  if (submitLeadBtn) {
    submitLeadBtn.addEventListener("click", () => {
      const nameEl = document.getElementById("quiz-name");
      const emailEl = document.getElementById("quiz-email");
      const phoneEl = document.getElementById("quiz-phone");
      const businessEl = document.getElementById("quiz-business");
      const btnText = document.getElementById("btn-text");
      const quizLeadErrorEl = document.getElementById("quiz-lead-error");

      const name = nameEl ? nameEl.value : "";
      const email = emailEl ? emailEl.value : "";
      const phone = phoneEl ? phoneEl.value : "";
      const business = businessEl ? businessEl.value : "";

      // 1. Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      let errorMessage = "";
      
      if (!name) errorMessage = "Please enter your name.";
      else if (!email || !emailRegex.test(email)) errorMessage = "Please enter a valid email address.";
      else if (!phone) errorMessage = "Please enter your phone number.";
      else if (!business) errorMessage = "Please enter your business name.";

      if (errorMessage) {
        if(quizLeadErrorEl) {
            quizLeadErrorEl.textContent = errorMessage;
            quizLeadErrorEl.classList.remove("hidden");
        }
        return;
      }
      if(quizLeadErrorEl) quizLeadErrorEl.classList.add("hidden");

      // 2. Loading State
      if(btnText) btnText.textContent = "Analyzing Data...";
      submitLeadBtn.disabled = true;

      // 3. Local Calculation
      const results = calculateResultsLogic();

      // 4. Send Data to Google Sheets (Backend)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("business", business);
      formData.append("score", results.score);
      formData.append("profitLeak", results.profitLeak);
      formData.append("answers", JSON.stringify(answers));

      // 5. Send Data to CRM
      sendToCRM(name, email, phone, business, results.score);

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
      })
      .then(() => {
        // Success (or opaque success)
        renderDashboard(results, business, email);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Fallback: show dashboard anyway
        renderDashboard(results, business, email);
      });
    });
  }

  /**
   * Sends lead data to the external CRM API.
   */
  function sendToCRM(name, email, phone, business, score) {
    const url = "https://login.beunstoppable365.com/api/automations/6965f5c7d68b8/execute";
    
    // Construct the payload with required and optional custom fields
    // Note: The curl example uses key names like '{%contact.business_name%}' for custom fields due to the CRM's requirements.
    // We replicate that structure here.
    // Since we are sending JSON, keys with special chars are fine.
    const payload = {
      "api_token": "081b9d0fe5c806746fd4324e33081218",
      "contact_name": name,
      "contact_email": email,
      "contact_phone": phone,
      "{%contact.business_name%}": business,
      "{%contact.audit_score%}": score
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`CRM API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("CRM Success:", data);
    })
    .catch(error => {
        console.warn("CRM Error:", error);
        // We do strictly non-blocking logging here so it doesn't stop the user flow
    });
  }

  function calculateResultsLogic() {
    let score = 20; // Base score
    
    // Safe check helper to avoid crashes on undefined answers
    const checkAnswer = (index, keyword) => {
        if (!answers[index]) return false;
        // Handle array answers (multi-select) or strings
        const ans = Array.isArray(answers[index]) ? answers[index].join(" ") : answers[index];
        return ans.toString().includes(keyword);
    };

    // Logic Mapping (Tarkan's Rules)
    // Q3 (Index 2): "Wait for us" -> High Loyalty
    if (checkAnswer(2, "Wait for us")) score += 15; 
    // Q4 (Index 3): "Stay strong" -> Pricing Power
    if (checkAnswer(3, "Stay strong")) score += 10; 
    // Q5 (Index 4): "Genuinely miss" -> Brand Power
    if (checkAnswer(4, "Genuinely miss")) score += 10; 
    // Q6 (Index 5): "Yes" -> Clarity
    if (checkAnswer(5, "Yes")) score += 15; 
    // Q10 (Index 9): "3D" -> AI Maturity
    if (checkAnswer(9, "3D")) score += 15; 
    // Q19 (Index 18): "Extremely urgent" -> Urgency
    if (checkAnswer(18, "Extremely urgent")) score += 10; 

    if (score > 100) score = 100;

    // Calculate Profit Leak based on Revenue Bracket (Q2 / Index 1)
    let revenueMultiplier = 15000;
    const revAnswer = answers[1] || ""; 
    if (revAnswer === "$1M – $3M") revenueMultiplier = 50000;
    if (revAnswer === "$3M – $5M") revenueMultiplier = 85000;
    if (revAnswer === "$5M – $8M") revenueMultiplier = 150000;
    if (revAnswer === "$8M+") revenueMultiplier = 250000;

    // The lower the score, the higher the leak factor
    // Score 20 -> Leak Factor 8.0
    // Score 100 -> Leak Factor 0.0
    const leakFactor = (100 - score) / 10; 
    const profitLeak = Math.round(leakFactor * revenueMultiplier);

    return { score, profitLeak };
  }

  function renderDashboard(results, businessName, email) {
    // Hide Lead Form, Show Results
    quizLeadCaptureEl.classList.add("hidden");
    quizResultsEl.classList.remove("hidden");
    
    // 1. Populate Basic Text (Safely)
    setText("result-business-name", businessName);
    setText("quiz-score-value", results.score);
    setText("profit-leak-value", "$" + results.profitLeak.toLocaleString());
    setText("confirm-email", email);

    // 2. Score Label Styling
    const scoreLabel = document.getElementById("score-label");
    if(scoreLabel) {
        if(results.score < 50) {
            scoreLabel.textContent = "⚠️ Red Ocean Danger Zone";
            scoreLabel.className = "relative z-10 text-brand-red font-bold text-lg md:text-xl mt-2";
        } else if (results.score < 80) {
            scoreLabel.textContent = "⚠️ The Messy Middle";
            scoreLabel.className = "relative z-10 text-brand-orange font-bold text-lg md:text-xl mt-2";
        } else {
            scoreLabel.textContent = "🌊 Blue Ocean Ready";
            scoreLabel.className = "relative z-10 text-brand-primary font-bold text-lg md:text-xl mt-2";
        }
    }

    // 3. Populate The 3 Insights Grid (MATCHING YOUR HTML IDs)
    // Insight 1: Positioning (ID: insight-positioning)
    const posText = results.score < 60 
        ? "CRITICAL: You are competing on price. Analysis detects a '1D' positioning strategy. You are paying the 'Invisible Tax' on every ad dollar."
        : "GOOD: Brand strength is high, but operational drag is likely killing your margins. Move from 'Better' to 'Different'.";
    setText("insight-positioning", posText);

    // Insight 2: Retention (ID: insight-retention)
    // Based on Q3/Index 2
    let isLowRetention = false;
    if (answers[2] && answers[2].toString().includes("Buy from a competitor")) isLowRetention = true;
    
    const retText = isLowRetention
        ? "ALERT: Brand loyalty is fragile. A competitor with a better offer could steal your market share in 30 days." 
        : "OPPORTUNITY: High loyalty detected. You are sitting on a goldmine of LTV that isn't being fully monetized.";
    setText("insight-retention", retText);

    // Insight 3: AI Maturity (ID: insight-ai)
    // Based on Q10/Index 9
    let isAdvancedAI = false;
    if (answers[9]) {
       const ansStr = Array.isArray(answers[9]) ? answers[9].join(" ") : answers[9];
       if(ansStr.includes("3D")) isAdvancedAI = true;
    }

    const aiText = isAdvancedAI
        ? "ADVANCED: You use AI well. Is it connected to your supply chain? The next step is a fully autonomous 'Predictable Profit Engine'." 
        : "URGENT: Falling behind. Competitors using '3D AI' will undercut your pricing and outpace your innovation within 12 months.";
    setText("insight-ai", aiText);


    // 4. Render Radar Chart
    const canvas = document.getElementById('blueOceanChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Create visual sub-scores
        const clarityScore = results.score;
        const opsScore = results.score > 50 ? results.score - 15 : results.score + 10;
        const aiScore = results.score > 70 ? 80 : 30;
        const loyaltyScore = results.score > 60 ? results.score : results.score - 10;

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Clarity', 'Ops', 'AI', 'Loyalty', 'Pricing'],
                datasets: [{
                    label: 'Current State',
                    data: [clarityScore, opsScore, aiScore, loyaltyScore, clarityScore - 5],
                    backgroundColor: 'rgba(216, 249, 17, 0.2)',
                    borderColor: '#D8F911',
                    pointBackgroundColor: '#D8F911',
                    pointBorderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        pointLabels: { 
                            color: 'rgba(255,255,255,0.7)', 
                            font: { size: 11, family: 'Inter' } 
                        },
                        ticks: { display: false, backdropColor: 'transparent' },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
    
    // Re-render icons
    if (window.lucide) lucide.createIcons();
  }

  // Helper function to safely set text (Prevents Crashes)
  function setText(id, text) {
      const el = document.getElementById(id);
      if(el) {
          el.textContent = text;
      } else {
          console.warn("Element not found during dashboard render:", id);
      }
  }

  // --- 4E. KICK IT OFF ---
  initQuiz();

  // --- 5. GLOBAL ICON RENDER ---
  // Renders all icons on the main page.
  if(window.lucide) lucide.createIcons();

  /**
   * ======================================
   * TESTIMONIAL MODAL LOGIC
   * ======================================
   */
  const testimonialModal = document.getElementById("testimonial-modal");
  const closeTestimonialBtn = document.getElementById("close-testimonial-modal");
  const testimonialBtns = document.querySelectorAll(".open-testimonial-modal");

  // Elements to populate
  const tmImg = document.getElementById("tm-img");
  const tmName = document.getElementById("tm-name");
  const tmRole = document.getElementById("tm-role");
  const tmText = document.getElementById("tm-text");

  const openTestimonial = (btn) => {
    // 1. Get data from clicked button
    const name = btn.getAttribute("data-name");
    const role = btn.getAttribute("data-role");
    const img = btn.getAttribute("data-img");
    const text = btn.getAttribute("data-text");

    // 2. Populate Modal
    if(tmName) tmName.textContent = name;
    if(tmRole) tmRole.textContent = role;
    if(tmImg) tmImg.src = img;
    if(tmText) tmText.textContent = `"${text}"`;

    // 3. Show Modal
    if(testimonialModal) {
        testimonialModal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Lock scroll
    }
  };

  const closeTestimonial = () => {
    if(testimonialModal) {
        testimonialModal.style.display = "none";
        document.body.style.overflow = "auto"; // Unlock scroll
    }
  };

  // Attach Click Listeners
  testimonialBtns.forEach(btn => {
    btn.addEventListener("click", () => openTestimonial(btn));
  });

  if(closeTestimonialBtn) {
    closeTestimonialBtn.addEventListener("click", closeTestimonial);
  }

  // Close on outside click
  if(testimonialModal) {
    testimonialModal.addEventListener("click", (e) => {
        if(e.target === testimonialModal) closeTestimonial();
    });
  }
}); // End of DOMContentLoaded