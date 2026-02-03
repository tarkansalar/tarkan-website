
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION & DATA ---
    const QUESTIONS = [
        {
            id: 'q1',
            category: 'Reality',
            text: 'What is your current annual revenue?',
            type: 'single',
            options: [
                { label: 'Under $3M', value: 'Under $3M' },
                { label: '$3M–$7M', value: '$3M–$7M' },
                { label: '$7M–$15M', value: '$7M–$15M' },
                { label: '$15M+', value: '$15M+' }
            ]
        },
        {
            id: 'q2',
            category: 'Reality',
            text: 'How many hours per week are you personally working in the business?',
            type: 'single',
            options: [
                { label: 'Under 40', value: 'Under 40' },
                { label: '40–50', value: '40–50' },
                { label: '50–70', value: '50–70', trigger: 'Systems' }, 
                { label: '70+', value: '70+', trigger: 'Systems' } 
            ]
        },
        {
            id: 'q3',
            category: 'Reality',
            text: 'If you stepped away for 7 days with no phone access, what would happen?',
            type: 'single',
            options: [
                { label: 'Nothing—business runs smoothly', value: 'Smooth' },
                { label: 'Some delays, but recoverable', value: 'Delays' },
                { label: 'Major fires and missed opportunities', value: 'Major fires', trigger: 'Systems' },
                { label: 'Complete chaos', value: 'Chaos', trigger: 'Systems' }
            ]
        },
        // Positioning (Root Cause #1)
        {
            id: 'q4',
            category: 'Positioning',
            text: 'Who is your ideal customer, and what specific problem do you solve for them?',
            subtext: 'Your answer: "We help __________ who want __________ without __________."',
            type: 'text',
            placeholder: 'e.g., We help busy moms who want glowing skin without a 10-step routine.'
        },
        {
            id: 'q5',
            category: 'Positioning',
            text: 'Why do customers choose you over your biggest competitor?',
            type: 'single',
            options: [
                { label: 'Crystal-clear reason (they tell us unprompted)', value: 'Clear' },
                { label: 'A few weak reasons (we think we know)', value: 'Weak' },
                { label: 'Price (we have to discount to win)', value: 'Price', trigger: 'Positioning' },
                { label: 'Honestly not sure', value: 'Not sure', trigger: 'Positioning' }
            ]
        },
        {
            id: 'q6',
            category: 'Positioning',
            text: 'How dependent is your growth on discounts or promotions?',
            type: 'single',
            options: [
                { label: 'Not at all—we rarely discount', value: 'Rarely' },
                { label: 'Occasionally (seasonal sales only)', value: 'Occasionally' },
                { label: 'Frequently (monthly promotions)', value: 'Frequently', trigger: 'Positioning' },
                { label: 'Always—we can\'t hit targets without them', value: 'Always', trigger: 'Positioning' }
            ]
        },
        // Bestsellers (Root Cause #2)
        {
            id: 'q7',
            category: 'Bestsellers',
            text: 'What percentage of your total revenue comes from your top 3 products?',
            type: 'single',
            options: [
                { label: '60%+ (clear winners)', value: '60%+' },
                { label: '40–60% (some concentration)', value: '40–60%' },
                { label: '20–40% (spread thin)', value: '20–40%', trigger: 'Bestsellers' },
                { label: 'Under 20% (no clear bestsellers)', value: 'Under 20%', trigger: 'Bestsellers' }
            ]
        },
        {
            id: 'q8',
            category: 'Bestsellers',
            text: 'Do you know the true contribution margin (profit after COGS + ads + fulfillment + returns) for each SKU?',
            type: 'single',
            options: [
                { label: 'Yes, for every SKU', value: 'Yes' },
                { label: 'For some products', value: 'Some' },
                { label: 'No, we don\'t track that level of detail', value: 'No', trigger: 'Bestsellers' }
            ]
        },
        {
            id: 'q9',
            category: 'Bestsellers',
            text: 'How much of your cash is currently tied up in inventory that hasn\'t moved in 90+ days?',
            type: 'single',
            options: [
                { label: 'Under 10%', value: 'Under 10%' },
                { label: '10–30%', value: '10–30%' },
                { label: 'Over 30%', value: 'Over 30%', trigger: 'Bestsellers' },
                { label: 'No idea (we don\'t track inventory aging)', value: 'No idea', trigger: 'Bestsellers' }
            ]
        },
        // Systems (Root Cause #3)
        {
            id: 'q10',
            category: 'Systems',
            text: 'How many times per day does your team need your approval or ask you a "quick question"?',
            type: 'single',
            options: [
                { label: '0–2 (rare)', value: '0–2' },
                { label: '3–5 (manageable)', value: '3–5' },
                { label: '5–10 (constant interruptions)', value: '5–10', trigger: 'Systems' },
                { label: '10+ (I\'m the bottleneck)', value: '10+', trigger: 'Systems' }
            ]
        },
        {
            id: 'q11',
            category: 'Systems',
            text: 'What is the ONE operational task you cannot stop doing right now, no matter how hard you try?',
            type: 'text',
            placeholder: 'e.g., approving creatives, answering support tickets...'
        },
        {
            id: 'q12',
            category: 'Systems',
            text: 'On a scale of 1–10, how much do you trust your numbers when making big decisions?',
            type: 'single',
            options: [
                { label: '1–3 (mostly guessing)', value: '1–3' },
                { label: '4–6 (some data, lots of gut feel)', value: '4–6' },
                { label: '7–9 (pretty confident in our data)', value: '7–9' },
                { label: '10 (fully data-driven)', value: '10' }
            ]
        },
        // Direction & Pain
        {
            id: 'q13',
            category: 'Direction',
            text: 'If you had a clear, proven 8-week plan to fix the root cause—not the symptoms—how fast would you want to start?',
            type: 'single',
            options: [
                { label: 'Immediately (this week)', value: 'Immediately' },
                { label: 'Within 2–4 weeks', value: '2–4 weeks' },
                { label: 'In 1–3 months', value: '1–3 months' },
                { label: 'Just exploring options for now', value: 'Exploring' }
            ]
        },
        {
            id: 'q14',
            category: 'Direction',
            text: 'What is the #1 outcome you want to achieve in the next 8 weeks?',
            type: 'single',
            options: [
                { label: 'Work fewer hours (get my life back)', value: 'Work fewer hours', trigger: 'Systems' },
                { label: 'Higher profit margins (stop leaving money on the table)', value: 'Higher profit margins', trigger: 'Bestsellers' },
                { label: 'Predictable systems (business runs without me)', value: 'Predictable systems', trigger: 'Systems' },
                { label: 'Scalable growth (break through the ceiling)', value: 'Scalable growth', trigger: 'Positioning' }
            ]
        },
        {
            id: 'q15',
            category: 'Direction',
            text: 'If you\'re still dealing with this exact same problem 12 months from now, what will it have cost you personally?',
            subtext: '(Check all that apply)',
            type: 'multi',
            options: [
                { label: 'My health (burnout, stress, sleep)', value: 'Health' },
                { label: 'My relationships (missing family time)', value: 'Relationships' },
                { label: 'My confidence (feeling stuck)', value: 'Confidence' },
                { label: 'My wealth (opportunity cost)', value: 'Wealth' },
                { label: 'My team (losing good people)', value: 'Team' },
                { label: 'My business (losing market share)', value: 'Business' }
            ]
        },
        {
            id: 'q16',
            category: 'Direction',
            text: 'What have you already tried to fix this problem that didn\'t work?',
            type: 'text',
            placeholder: 'e.g., specific agencies, consultants, tools...'
        }
    ];

    const state = {
        currentQuestion: 0,
        answers: {},
        isFinished: false
    };

    // --- 2. DOM ELEMENTS ---
    // We will render this container dynamically if it doesn't exist, but ideally it should be in HTML
    let quizContainer = document.getElementById('quiz-dynamic-container');
    if(!quizContainer) {
        // Fallback: log warning or try to find a placeholder
        console.warn('Quiz container not found. Ensure HTML has #quiz-dynamic-container');
    }

    // --- 3. CORE FUNCTIONS ---

    function init() {
        renderQuestion();
        setupNavigationListeners();
    }

    function renderQuestion() {
        if (!quizContainer) return;
        
        const q = QUESTIONS[state.currentQuestion];
        const progressPercent = ((state.currentQuestion + 1) / QUESTIONS.length) * 100;

        // Determine input HTML based on type
        let inputHTML = '';
        
        if (q.type === 'single') {
            inputHTML = `<div class="options-grid single-select">
                ${q.options.map(opt => `
                    <button class="quiz-option" data-value="${opt.value}">
                        ${opt.label}
                    </button>
                `).join('')}
            </div>`;
        } else if (q.type === 'multi') {
            inputHTML = `<div class="options-grid multi-select">
                ${q.options.map(opt => `
                    <button class="quiz-option" data-value="${opt.value}">
                        <span class="check-box"></span> ${opt.label}
                    </button>
                `).join('')}
                <button id="multi-next-btn" class="btn btn-primary mt-4 w-full" style="display:none;">Next Question</button>
            </div>`;
        } else if (q.type === 'text') {
            inputHTML = `<div class="text-input-wrapper">
                <textarea class="quiz-textarea" placeholder="${q.placeholder || ''}" rows="3"></textarea>
                <button id="text-next-btn" class="btn btn-primary mt-4 w-full">Next Question</button>
            </div>`;
        }

        const html = `
            <div class="quiz-wrapper fade-in">
                <!-- Progress Header -->
                <div class="quiz-header mb-6">
                    <div class="flex justify-between text-sm text-white/50 mb-2">
                        <span>Question ${state.currentQuestion + 1}/${QUESTIONS.length}</span>
                        <span>${Math.round(progressPercent)}% Completed</span>
                    </div>
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-brand-primary transition-all duration-300" style="width: ${progressPercent}%"></div>
                    </div>
                </div>

                <!-- Content -->
                <h3 class="question-title text-2xl font-bold mb-2 text-white">${q.text}</h3>
                ${q.subtext ? `<p class="text-white/60 mb-6 text-sm">${q.subtext}</p>` : ''}
                
                ${inputHTML}

                <!-- Back Button -->
                ${state.currentQuestion > 0 ? `
                    <button id="back-btn" class="text-white/40 text-sm mt-6 hover:text-white transition-colors">
                        ← Back
                    </button>
                ` : ''}
            </div>
        `;

        quizContainer.innerHTML = html;

        // Re-attach listeners for new elements
        attachOptionListeners(q);
        
        // Restore previous answer if exists
        restoreAnswer(q);
    }

    function attachOptionListeners(q) {
        // Single Select
        if (q.type === 'single') {
            document.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Visual Select
                    document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
                    e.currentTarget.classList.add('selected');
                    
                    // Save and Next
                    const value = e.currentTarget.dataset.value;
                    state.answers[q.id] = value;
                    
                    setTimeout(() => {
                        nextQuestion();
                    }, 300);
                });
            });
        }
        
        // Multi Select
        if (q.type === 'multi') {
            const nextBtn = document.getElementById('multi-next-btn');
            const currentAnswers = state.answers[q.id] || [];
            
            document.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const value = e.currentTarget.dataset.value;
                    e.currentTarget.classList.toggle('selected');
                    
                    // Update current list locally
                    const index = currentAnswers.indexOf(value);
                    if (index > -1) {
                         currentAnswers.splice(index, 1);
                    } else {
                         currentAnswers.push(value);
                    }
                    state.answers[q.id] = currentAnswers; // save reference

                    // Show next button if at least one selected
                    if (currentAnswers.length > 0) {
                        nextBtn.style.display = 'inline-block';
                    } else {
                        nextBtn.style.display = 'none';
                    }
                });
            });

            nextBtn.addEventListener('click', () => nextQuestion());
        }

        // Text Input
        if (q.type === 'text') {
            const textarea = document.querySelector('.quiz-textarea');
            const nextBtn = document.getElementById('text-next-btn');
            
            nextBtn.addEventListener('click', () => {
                const val = textarea.value.trim();
                // We allow empty answers or force? Let's force leniently (len > 0)
                if (val.length === 0) {
                    textarea.style.borderColor = '#ff4d4d';
                    return;
                }
                state.answers[q.id] = val;
                nextQuestion();
            });

            // Enter key shortcut (if not shift+enter)
            textarea.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    nextBtn.click();
                }
            });
        }

        // Back Button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', prevQuestion);
        }
    }

    function restoreAnswer(q) {
        const ans = state.answers[q.id];
        if (!ans) return;

        if (q.type === 'single') {
            const btn = document.querySelector(`.quiz-option[data-value="${ans}"]`);
            if (btn) btn.classList.add('selected');
        } else if (q.type === 'multi') {
             // Expect ans to be array
             if(Array.isArray(ans)) {
                 ans.forEach(val => {
                     const btn = document.querySelector(`.quiz-option[data-value="${val}"]`);
                     if (btn) btn.classList.add('selected');
                 });
                 if(ans.length > 0) {
                     document.getElementById('multi-next-btn').style.display = 'inline-block';
                 }
             }
        } else if (q.type === 'text') {
            const area = document.querySelector('.quiz-textarea');
            if (area) area.value = ans;
        }
    }

    function nextQuestion() {
        if (state.currentQuestion < QUESTIONS.length - 1) {
            state.currentQuestion++;
            renderQuestion();
        } else {
            finishQuiz();
        }
    }

    function prevQuestion() {
        if (state.currentQuestion > 0) {
            state.currentQuestion--;
            renderQuestion();
        }
    }

    // --- 4. SCORING ENGINE ---

    function calculatePrimaryNeed() {
        const answers = state.answers;
        let scores = {
            Positioning: 0,
            Bestsellers: 0,
            Systems: 0
        };

        // 1. Positioning Score (0–4)
        // +1 if Q4 is text (We interpret vague text as +1, but here we count non-empty text as potential trigger. 
        // ACTUALLY: Logic says "+1 if Q4 text is vague". Hard to detect programmatically without NLP. 
        // SHORTCUT: We assume if they filled it, it might be vague. But safer: Check other hard triggers first. 
        // Let's rely on Q14 for the 4th point if needed.
        // Or: If Q4 length < 20 chars, maybe vague? Let's skip automatic Q4 text scoring to be safe/conservative, 
        // OR assume +1 always as most have weak positioning. 
        // Let's follow strict triggers for others first:
        
        if (answers.q5 === 'Price' || answers.q5 === 'Not sure') scores.Positioning++;
        if (answers.q6 === 'Frequently' || answers.q6 === 'Always') scores.Positioning++;
        if (answers.q14 === 'Scalable growth') scores.Positioning++;
        // Adding a point if Q4 is present (assumed imperfect) to balance range? 
        // Let's stick to the 3 definitive ones + Q14. Max 3-4.

        // 2. Bestsellers Score (0–4)
        if (answers.q7 === '20–40%' || answers.q7 === 'Under 20%') scores.Bestsellers++;
        if (answers.q8 === 'No') scores.Bestsellers++; // "No, we don't track..."
        if (answers.q9 === 'Over 30%' || answers.q9 === 'No idea') scores.Bestsellers++;
        if (answers.q14 === 'Higher profit margins') scores.Bestsellers++;

        // 3. Systems Score (0–4)
        if (answers.q2 === '50–70' || answers.q2 === '70+') scores.Systems++; // "50-70" or "70+" from trigger list
        if (answers.q3 === 'Major fires' || answers.q3 === 'Chaos') scores.Systems++;
        if (answers.q10 === '5–10' || answers.q10 === '10+') scores.Systems++;
        if (answers.q14 === 'Work fewer hours' || answers.q14 === 'Predictable systems') scores.Systems++;

        // Bonus: "Everything runs through me" check (Q11 text or implied). 
        // We don't have a semantic checker for Q11 text. 
        // Rely on Q10 (Bottleneck) as proxy.

        // DETERMINE WINNER
        let primary = 'Systems'; // Default fallback
        let maxVal = -1;

        // Priority Order for ties: Systems > Bestsellers > Positioning
        // Method: Check current max. If new > max, take it. If new == max, take if higher priority?
        // Easier: Just find max value. Then resolve ties.
        
        maxVal = Math.max(scores.Systems, scores.Bestsellers, scores.Positioning);
        
        // Check ties based on priority
        if (scores.Systems === maxVal) {
            primary = 'Systems'; // Systems wins any tie involving it
        } else if (scores.Bestsellers === maxVal) {
            primary = 'Bestsellers'; // Wins against Positioning
        } else {
            primary = 'Positioning';
        }

        return {
            primary,
            scores
        };
    }

    function finishQuiz() {
        // Instead of showing report immediately, show lead form
        renderLeadForm();
    }

    function renderLeadForm() {
        if (!quizContainer) return;
        
        const html = `
            <div class="quiz-wrapper fade-in text-left">
                <div class="quiz-header mb-6 text-center">
                    <p class="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">ALMOST DONE</p>
                    <h2 class="text-3xl font-display font-bold text-white mb-2">Generatng Your Report...</h2>
                    <p class="text-white/60">Where should we send your full analysis?</p>
                </div>

                <div class="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 max-w-lg mx-auto">
                    <div class="options-grid gap-4">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm text-white/60 mb-2">First Name</label>
                            <input type="text" id="lead-name" class="quiz-textarea" style="min-height: 50px; padding: 0.75rem 1rem;" placeholder="e.g. Tarkan">
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm text-white/60 mb-2">Work Email</label>
                            <input type="email" id="lead-email" class="quiz-textarea" style="min-height: 50px; padding: 0.75rem 1rem;" placeholder="name@company.com">
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="block text-sm text-white/60 mb-2">Phone Number</label>
                            <input type="tel" id="lead-phone" class="quiz-textarea" style="min-height: 50px; padding: 0.75rem 1rem;" placeholder="e.g. +1 555-010-9999">
                        </div>

                        <!-- Business Name -->
                        <div>
                            <label class="block text-sm text-white/60 mb-2">Business Name</label>
                            <input type="text" id="lead-business" class="quiz-textarea" style="min-height: 50px; padding: 0.75rem 1rem;" placeholder="e.g. Smart Concepts">
                        </div>

                        <button id="submit-lead-btn" class="btn btn-primary mt-6 w-full py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                            SEE MY RESULTS &rarr;
                        </button>
                        
                         <p class="text-center text-xs text-white/30 mt-4">your data is safe. zero spam.</p>
                    </div>
                </div>
            </div>
        `;

        quizContainer.innerHTML = html;
        quizContainer.scrollIntoView({ behavior: 'smooth' });

        document.getElementById('submit-lead-btn').addEventListener('click', submitLeadForm);
    }

    function submitLeadForm() {
        const name = document.getElementById('lead-name').value.trim();
        const email = document.getElementById('lead-email').value.trim();
        const phone = document.getElementById('lead-phone').value.trim();
        const business = document.getElementById('lead-business').value.trim();

        // Simple validation
        let valid = true;
        [name, email, phone, business].forEach(val => {
            if(!val) valid = false;
        });

        if (!valid) {
            alert('Please fill out all fields to unlock your customized report.');
            return;
        }

        // Store Lead Data (Simulated for now, can perform API call here)
        state.leadData = { name, email, phone, business };
        
        // Use name in report?
        
        // Show Report
        const result = calculatePrimaryNeed();
        renderReport(result);
    }

    function renderReport(result) {
        if (!quizContainer) return;
        
        const primary = result.primary;
        const scores = result.scores;
        const answers = state.answers; 
        const leadName = state.leadData ? state.leadData.name : 'Founder';

        // Secondary logic...
        let secondary = null;
        if (primary !== 'Systems' && scores.Systems >= 2) secondary = 'Systems';
        else if (primary !== 'Bestsellers' && scores.Bestsellers >= 2 && (!secondary || scores.Bestsellers > scores.Systems)) secondary = 'Bestsellers'; // Simplified
        else if (primary !== 'Positioning' && scores.Positioning >= 2 && !secondary) secondary = 'Positioning';
        
        // --- CONTENT MAPPING ---
        const headlineMap = {
            'Positioning': 'Weak Positioning',
            'Bestsellers': 'No Clear Bestsellers',
            'Systems': 'No Systems'
        };

        const analysisMap = {
            'Positioning': `
                <ul class="analysis-list">
                    ${answers.q6 === 'Always' || answers.q6 === 'Frequently' ? '<li>You rely on discounts to move product (margin killer).</li>' : ''}
                    ${answers.q5 === 'Price' ? '<li>You compete on price because customers don\'t see your unique value.</li>' : ''}
                    <li><strong>Lower CAC & premium pricing</strong> are impossible without fixing this.</li>
                </ul>`,
            'Bestsellers': `
                <ul class="analysis-list">
                    ${answers.q9 === 'Over 30%' ? '<li>Cash is trapped in dead inventory.</li>' : ''}
                    ${answers.q7 === 'Under 20%' ? '<li>You have too many SKUs doing too little revenue.</li>' : ''}
                    <li><strong>80% of your revenue</strong> should come from 20% of products. Currently it doesn't.</li>
                </ul>`,
            'Systems': `
                <ul class="analysis-list">
                    ${answers.q2 === '70+' ? '<li>You are working 70+ hours/week. That is unsustainable.</li>' : ''}
                    ${answers.q10 === '10+' ? '<li>You are the bottleneck for every decision.</li>' : ''}
                    <li><strong>The business cannot scale</strong> because it relies 100% on your energy.</li>
                </ul>`
        };

        const outcomeMap = {
            'Positioning': 'Customers seeking YOU out, higher conversion rates, and premium pricing.',
            'Bestsellers': 'Higher margins (40%+), better cash flow, and a simplified supply chain.',
            'Systems': 'A business that runs without you, 35-hour work weeks, and scalable growth.'
        };
        
        // Personal Cost List
        const personalCosts = Array.isArray(answers.q15) ? answers.q15.join(', ') : (answers.q15 || 'Unknown');

        const html = `
            <div class="report-wrapper fade-in text-left">
                <div class="result-header text-center mb-8">
                    <p class="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">DIAGNOSTIC COMPLETE</p>
                    <h2 class="text-3xl md:text-5xl font-display font-bold text-white mb-2"> Your Primary Root Cause:</h2>
                    <h1 class="text-4xl md:text-6xl font-display font-bold text-brand-primary glow-text">${headlineMap[primary]}</h1>
                </div>

                <div class="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 mb-8">
                    <p class="text-xl text-white/90 mb-6">
                        Based on your answers, <strong>${headlineMap[primary]}</strong> is the #1 thing holding you back from ${answers.q1? answers.q1 : 'scalability'}.
                    </p>
                    
                    <h3 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Why this is happening:</h3>
                    <div class="text-white/80 mb-6 space-y-2">
                        ${analysisMap[primary] || '<p>Your answers indicate a fundamental gap in this area.</p>'}
                    </div>

                    ${secondary ? `
                        <div class="bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-lg mb-6">
                            <strong class="text-brand-primary uppercase text-xs tracking-wider">Secondary Issue Detected</strong>
                            <p class="text-white/90 text-sm mt-1">You are also showing signs of <strong>${headlineMap[secondary]}</strong>.</p>
                        </div>
                    ` : ''}

                    <div class="grid md:grid-cols-2 gap-6 mt-8">
                        <div>
                            <h4 class="font-bold text-white mb-2">The Cost of Inaction:</h4>
                            <p class="text-white/60 text-sm">You mentioned this will cost you: <br><span class="text-brand-red">${personalCosts}</span></p>
                        </div>
                        <div>
                            <h4 class="font-bold text-white mb-2">The Outcome of Fixing It:</h4>
                            <p class="text-brand-primary text-sm font-medium">${outcomeMap[primary]}</p>
                        </div>
                    </div>
                </div>

                <div class="cta-box text-center mt-10">
                    <h3 class="text-2xl font-bold text-white mb-4">I can help you fix this in 8 weeks.</h3>
                    <p class="text-white/70 max-w-lg mx-auto mb-8">
                        I've analyzed your situation. I know exactly how to solve <strong>${headlineMap[primary]}</strong>.
                        Let's build your roadmap.
                    </p>
                    <a href="#" class="btn btn-primary btn-large btn-pulse w-full md:w-auto">
                        BOOK YOUR FREE STRATEGY CALL
                    </a>
                    <p class="text-white/40 text-xs mt-4">Zero pitch. Just clarity on fixing ${headlineMap[primary]}.</p>
                </div>
            </div>
        `;
        
        quizContainer.innerHTML = html;
        quizContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function setupNavigationListeners() {
        // Find existing buttons in DOM that should trigger quiz start
        const startButtons = document.querySelectorAll('a[href="#diagnostic-start"]');
        startButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Show container if hidden (CSS might hide it initially)
                const section = document.querySelector('.diagnostic-intro'); // or specific ID
                if(quizContainer) {
                    quizContainer.style.display = 'block';
                    quizContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Initialize
    init();

});
