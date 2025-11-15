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
   * (New functionality per guide)
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
      lucide.createIcons();
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
   * (Updated for new modal buttons)
   * ======================================
   */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = mobileMenu.querySelectorAll('a[href^="#"]');
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
   * (Heavily modified for modal & lead capture)
   * ======================================
   */
  const quizContainer = document.getElementById("quiz-container");
  if (!quizContainer) return; // Don't run quiz logic if container isn't found

  // --- 4A. QUIZ DATA BANK (Unchanged from original) ---
  const questionBank = [
    // Part 1: Brand Positioning (9 questions)
    {
      q: "What industry are you in?",
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
      q: "What's your current annual revenue?",
      type: "select",
      options: ["$250K - $1M", "$1M – $3M", "$3M – $5M", "$5M – $8M", "$8M+"], // Updated per guide
    },
    {
      q: "If you were sold out of your best-selling product for 4 weeks, what would your customers do?",
      type: "select",
      options: [
        "Wait for us to restock – they only want our brand",
        "Buy from a competitor – they need the product type, not ours",
        "Not sure – we've never tested this",
      ],
    },
    {
      q: "If you raised your prices by 20% tomorrow, what would happen?",
      type: "select",
      options: [
        "Sales would stay strong – our customers value what we offer",
        "We'd lose most customers – they're price-sensitive",
        "Not sure – we're afraid to test it",
      ],
    },
    {
      q: "If your brand disappeared tomorrow, would your customers miss you—or just find a replacement?",
      type: "select",
      options: [
        "They'd genuinely miss us – we have a loyal community",
        "They'd replace us easily – we're interchangeable",
        "Honestly, I don't know",
      ],
    },
    {
      q: "When you pitch your brand to a stranger or investor, do they 'get it' immediately?",
      type: "select",
      options: [
        "Yes – they instantly understand our category and value",
        "Mostly – they get it after a short explanation",
        "Not really – we have to explain multiple times",
        "No – people are often confused about what we actually do",
      ],
    },
    {
      q: "Where do most of your customers discover you?",
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
      q: "What's your biggest competitive threat right now?",
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
      q: 'Complete this sentence: "Our customers choose us because..."',
      type: "open",
      placeholder: "Type your 1-2 sentence answer here...",
    },
    // Part 2: AI Readiness (6 questions)
    {
      q: "How are you currently using AI in your business?",
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
      q: "If you had an extra $100K right now, where would you invest it to grow fastest?",
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
      q: "What's the #1 thing stealing your time right now that AI or systems could handle?",
      type: "open",
      placeholder: "e.g., Answering support tickets, managing inventory...",
    },
    {
      q: "How do you currently track profitability and cash flow?",
      type: "select",
      options: [
        "Strong system – we have dashboards, a CFO, or solid tools",
        "Manual tracking – spreadsheets, but inconsistent",
        "Accountant once a year – we're reactive, not proactive",
        "Honestly, we're not clear on real profits",
      ],
    },
    {
      q: "What's the ONE problem you want solved in the next 30 days?",
      type: "open",
      placeholder: "Be specific...",
    },
    {
      q: "What's your ideal outcome 12 months from now?",
      type: "open",
      placeholder: "e.g., 'Exit the business', 'Double profitability', 'Remove myself from operations'...",
    },
    // Part 3: Coaching Fit (6 questions)
    {
      q: "Have you worked with a coach, consultant, or advisor before?",
      type: "select",
      options: [
        "Yes, and it was transformational",
        "Yes, but it didn't work out (they didn't understand my business)",
        "No, but I'm open to it",
        "No, I prefer to figure it out myself",
      ],
    },
    {
      q: "What matters most to you when choosing someone to help you grow? (Select up to 3)",
      type: "multi-select",
      limit: 3, // Special property for this question
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
      q: "If the right coach could help you add $500K–$1M in profit in 8 weeks, what would you be willing to invest?",
      type: "select",
      options: ["$5K – $10K", "$10K – $15K", "$15K – $25K", "$25K+", "Not sure – depends on the plan and ROI"],
    },
    {
      q: "How urgent is solving your biggest business problem right now?",
      type: "select",
      options: [
        "Extremely urgent – it's keeping me up at night",
        "Very urgent – I need help within 30 days",
        "Somewhat urgent – I'll focus on it this quarter",
        "Not urgent – just exploring options",
      ],
    },
    {
      q: "If you could wave a magic wand and fix ONE thing in your business today, what would it be?",
      type: "open",
      placeholder: "The one thing causing the most friction...",
    },
    {
      q: "BONUS: Is there anything else you'd like to share about your business, goals, or challenges?",
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
  const quizLeadErrorEl = document.getElementById("quiz-lead-error"); // <-- Issue 4 Fix

  // Results elements
  const quizResultsEl = document.getElementById("quiz-results");
  const quizScoreValueEl = document.getElementById("quiz-score-value");
  const resultText1El = document.getElementById("result-text-1");
  const resultText2El = document.getElementById("result-text-2");
  const resultText3El = document.getElementById("result-text-3");
  const profitLeakValueEl = document.getElementById("profit-leak-value");

  // --- 4C. QUIZ STATE ---
  let currentQuestionIndex = 0;
  let answers = {}; // Stores answers by question index

  // --- 4D. QUIZ FUNCTIONS ---

  /**
   * Initializes the quiz, renders questions, and sets up listeners.
   */
  function initQuiz() {
    // Clear the placeholder content from HTML
    quizSlidesContainer.innerHTML = "";

    // Render all question slides into the container
    renderQuestions();

    // Add main event listener
    startQuizBtn.addEventListener("click", startQuiz);

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
                        ? `<button class="btn btn-primary btn-submit-quiz">See My Results</button>` // Renamed to avoid conflict
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
      quizLeadCaptureEl.querySelector(".btn-back").addEventListener("click", () => {
        showQuestion(questionBank.length - 1);
      });

      // Submit Lead button -> Show Results
      submitLeadBtn.addEventListener("click", () => {
        // Here you would normally validate and send the lead
        const name = document.getElementById("quiz-name").value;
        const email = document.getElementById("quiz-email").value;

        // Issue 4 Fix: Replace alert() with non-blocking validation
        if (!name || !email) {
          quizLeadErrorEl.classList.remove("hidden"); // Show error message
          return; // Stop execution
        }

        // If validation passes, hide error and proceed
        quizLeadErrorEl.classList.add("hidden");

        // console.log("Lead Captured:", { name, email, answers });
        calculateAndShowResults(); // This will now run, showing the score card
      });
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
      answers[index] = value;

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
    quizSlidesContainer.querySelector(`.quiz-question[data-question-index="${index}"]`).classList.add("active-question");
    quizQuestionsEl.classList.remove("hidden");

    // Update progress bar
    const progress = ((index + 1) / questionBank.length) * 100;
    quizProgressBar.style.width = `${progress}%`;

    // Issue 1 Fix: Render icons (for "Back" button)
    lucide.createIcons();
  }

  /**
   * (New) Shows the lead capture form.
   */
  function showLeadCapture() {
    quizQuestionsEl.classList.add("hidden");
    quizResultsEl.classList.add("hidden");
    quizLeadCaptureEl.classList.remove("hidden");
    // Issue 1 Fix: Render icons (for buttons on this screen)
    lucide.createIcons();
  }

  /**
   * Calculates the score and populates the results screen.
   */
  function calculateAndShowResults() {
    let score = 20; // Base score
    let profitLeak = 100000; // Base leak

    // --- Scoring Logic (Based on original script) ---
    // Q3: Loyalty
    if (answers[2] === "Wait for us to restock – they only want our brand") score += 15;
    // Q4: Pricing Power
    if (answers[3] === "Sales would stay strong – our customers value what we offer") score += 10;
    // Q5: Loyalty
    if (answers[4] === "They'd genuinely miss us – we have a loyal community") score += 10;
    // Q6: Clarity
    if (answers[5] === "Yes – they instantly understand our category and value") score += 15;
    // Q10: AI Readiness
    if (answers[9] && answers[9].includes("3D (Unfair advantage): Using AI for product innovation, customer insights, etc.")) score += 15;
    // Q18: Budget
    if (answers[17] === "$15K – $25K" || answers[17] === "$25K+") score += 15;
    // Q19: Urgency
    if (answers[18] === "Extremely urgent – it's keeping me up at night" || answers[18] === "Very urgent – I need help within 30 days") score += 10;
    
    // Ensure score is max 100
    if (score > 100) score = 100;

    // --- Result Text Logic (Based on original script) ---
    // 1. Clarity Gap
    if (answers[5] && (answers[5].includes("Not really") || answers[5].includes("No"))) {
      resultText1El.textContent =
        "Your answers show a critical lack of brand clarity. Customers and investors are likely confused, which directly costs you sales and wastes ad spend.";
    } else {
      resultText1El.textContent =
        "Your clarity seems high, but we can leverage this by building systems to ensure that clarity translates to every part of your operation.";
    }

    // 2. Loyalty Gap
    if (answers[2] && (answers[2].includes("Buy from a competitor") || (answers[4] && answers[4].includes("They'd replace us easily")))) {
      resultText2El.textContent =
        "You're likely trapped in a 'Red Ocean,' competing on price, not value. This makes you vulnerable to cheaper knockoffs and market saturation.";
    } else {
      resultText2El.textContent =
        "You have a strong, loyal brand. Now we must build the operational engine to serve that community profitably and at scale.";
    }

    // 3. AI Leverage Gap
    if (answers[9] && (answers[9].includes("Not using AI at all") || answers[9].includes("1D (Basic automation)"))) {
      resultText3El.textContent =
        "You are currently using AI for basic tasks, but missing the 3D 'unfair advantage' to systemize operations, automate workflows, and drive product innovation.";
    } else {
      resultText3El.textContent =
        "You're already leveraging AI. Our sprint will focus on integrating it into a '3D Unfair Advantage' that your competitors can't copy.";
    }

    // Calculate final profit leak
    profitLeak += (100 - score) * 3500;
    profitLeakValueEl.textContent = `$${profitLeak.toLocaleString()}`;

    // Display results
    quizScoreValueEl.textContent = score;
    quizQuestionsEl.classList.add("hidden");
    quizLeadCaptureEl.classList.add("hidden");
    quizResultsEl.classList.remove("hidden"); // <-- This shows the score card
  }

  // --- 4E. KICK IT OFF ---
  initQuiz();

  // --- 5. GLOBAL ICON RENDER ---
  // Issue 1 Fix: Call lucide.createIcons() after DOM is loaded
  // This renders all icons on the main page.
  lucide.createIcons();
}); // End of DOMContentLoaded