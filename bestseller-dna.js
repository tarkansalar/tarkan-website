
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION & DATA ---

    // SCORING CONFIG
    // Each scored question contributes to a specific category.
    // Max per question is 25. Max per category is 50. Total max is 200.
    
    const QUESTIONS = [
        // --- SECTION 0: Reality Check (Warm-Up) - UNSCORED ---
        { 
            id: 'q0', 
            category: 'context',
            text: 'Which statement best describes your business right now?', 
            type: 'single', 
            options: [
                { label: 'Revenue is growing, but cash always feels tighter than it should', points: 0 },
                { label: 'We\'re busy, but not making the progress we expect at this stage', points: 0 },
                { label: 'Too many products, no clear winners to double down on', points: 0 },
                { label: 'Growth has stalled and I can\'t clearly explain why', points: 0 },
                { label: 'Things are fine — I\'m pressure-testing', points: 0 }
            ]
        },

        // --- SECTION 1: Business Snapshot (Authority Filter) - UNSCORED ---
        { 
            id: 'q1', 
            category: 'context',
            text: 'What\'s your annual revenue?', 
            type: 'single', 
            options: [
                { label: '$3M–$5M', points: 0 },
                { label: '$5M–$10M', points: 0 },
                { label: '$10M–$20M', points: 0 },
                { label: '$20M+', points: 0 }
            ]
        },
        { 
            id: 'q2', 
            category: 'context',
            text: 'What category best describes your business?', 
            type: 'single', 
            options: [
                { label: 'Apparel & Fashion', points: 0 },
                { label: 'Beauty / Skincare', points: 0 },
                { label: 'Supplements / Health', points: 0 },
                { label: 'Home & Lifestyle', points: 0 },
                { label: 'Food & Beverage', points: 0 },
                { label: 'Other', points: 0 }
            ]
        },
        { 
            id: 'q3', 
            category: 'context',
            text: 'How many active SKUs are you currently carrying?', 
            type: 'single', 
            options: [
                { label: 'Under 15', points: 0 },
                { label: '15–30', points: 0 },
                { label: '31–50', points: 0 },
                { label: '51–100', points: 0 },
                { label: '100+', points: 0 }
            ]
        },

        // --- SECTION 2: Focus & Winner Concentration (Bestseller DNA & Focus) ---
        { 
            id: 'q4', 
            category: 'focus',
            text: 'Roughly how much of your revenue comes from your top 5 SKUs?', 
            type: 'single', 
            options: [
                { label: 'Over 80%', points: 25 },
                { label: '60–80%', points: 20 },
                { label: '40–60%', points: 10 },
                { label: 'Under 40%', points: 5 },
                { label: 'I\'m not sure', points: 0 }
            ]
        },
        { 
            id: 'q5', 
            category: 'focus',
            text: 'When you look at your catalog honestly, which feels closer to the truth?', 
            type: 'single', 
            options: [
                { label: 'A few products clearly carry the business', points: 25 },
                { label: 'Revenue is spread thin across many SKUs', points: 10 },
                { label: 'Past winners are declining, new ones haven\'t replaced them', points: 10 },
                { label: 'I don\'t have a clear view', points: 5 }
            ]
        },

        // --- SECTION 3: Trapped Cash & Inventory Reality (Trapped Cash & Inventory) ---
        { 
            id: 'q6', 
            category: 'cash',
            text: 'How much inventory (COGS value) has been sitting unsold for 90+ days?', 
            type: 'single', 
            options: [
                { label: 'Under $50K', points: 25 },
                { label: '$50K–$150K', points: 20 },
                { label: '$150K–$300K', points: 10 },
                { label: '$300K–$500K', points: 5 },
                { label: '$500K+', points: 0 },
                { label: 'I\'m not sure', points: 0 }
            ]
        },
        { 
            id: 'q7', 
            category: 'cash',
            text: 'How do you currently deal with underperforming SKUs?', 
            type: 'single', 
            options: [
                { label: 'We cut them fast and reallocate cash', points: 25 },
                { label: 'We try to discount and move them', points: 15 },
                { label: 'We keep them and hope demand picks up', points: 5 },
                { label: 'We don\'t have a clear process', points: 5 }
            ]
        },

        // --- SECTION 4: Decision Quality (Decision Quality & Launch Discipline) ---
        { 
            id: 'q8', 
            category: 'decision',
            text: 'How do you decide which products to launch or scale?', 
            type: 'single', 
            options: [
                { label: 'Customer demand & internal data', points: 25 },
                { label: 'Trend tools & forecasts', points: 15 },
                { label: 'Founder instinct', points: 10 },
                { label: 'Market/competitor imitation', points: 10 },
                { label: 'It\'s a mix, but not systemized', points: 5 }
            ]
        },
        { 
            id: 'q9', 
            category: 'decision',
            text: 'In the last 12 months, how many product launches flopped (under 20% of projected sales)?', 
            type: 'single', 
            options: [
                { label: 'None', points: 25 },
                { label: '1–2', points: 20 },
                { label: '3–5', points: 10 },
                { label: '6+', points: 5 },
                { label: 'I don\'t track this', points: 5 }
            ]
        },

        // --- SECTION 5: Margin & Pressure (Margin & Pressure) ---
        { 
            id: 'q10', 
            category: 'margin',
            text: 'What best describes your current gross margin?', 
            type: 'single', 
            options: [
                { label: '60%+', points: 25 },
                { label: '45–60%', points: 20 },
                { label: '30–45%', points: 10 },
                { label: 'Under 30%', points: 5 },
                { label: 'I\'m not sure', points: 5 }
            ]
        },
        { 
            id: 'q11', 
            category: 'margin',
            text: 'Which pressure feels heaviest right now?', 
            type: 'single', 
            options: [
                { label: 'Too much cash tied up in inventory', points: 10 },
                { label: 'Rising CAC compressing margins', points: 20 },
                { label: 'No clear product focus', points: 15 },
                { label: 'Founder bandwidth / decision fatigue', points: 15 },
                { label: 'A mix of everything', points: 10 }
            ]
        },

        // --- SECTION 6: Cost of Inaction & Forward Vision - UNSCORED ---
        { 
            id: 'q12', 
            category: 'context',
            text: 'If nothing changes in the next 6–12 months, what\'s the biggest risk?', 
            type: 'single', 
            options: [
                { label: 'More cash injections or dilution', points: 0 },
                { label: 'Heavy discounting that damages the brand', points: 0 },
                { label: 'Staying stuck at this revenue level', points: 0 },
                { label: 'Burnout from complexity', points: 0 },
                { label: 'I haven\'t thought about it, but it worries me', points: 0 }
            ]
        },
        { 
            id: 'q13', 
            category: 'context',
            text: 'If you keep operating exactly as you are for another 12 months, what do you estimate the cost will be?', 
            type: 'single', 
            options: [
                { label: 'Under $100K', points: 0 },
                { label: '$100K–$250K', points: 0 },
                { label: '$250K–$500K', points: 0 },
                { label: '$500K–$1M', points: 0 },
                { label: 'Over $1M', points: 0 },
                { label: 'I haven\'t calculated it (but I know it\'s significant)', points: 0 }
            ]
        },
        { 
            id: 'q14', 
            category: 'context',
            text: 'What would a win look like for your business in the next 12 months?', 
            type: 'single', 
            options: [
                { label: 'Free up $200K+ in trapped cash and reinvest it into winners', points: 0 },
                { label: 'Cut SKU count by 30%+ without losing revenue', points: 0 },
                { label: 'Have a clear, data-backed product roadmap', points: 0 },
                { label: 'Hit a specific revenue or margin target I\'m currently missing', points: 0 },
                { label: 'All of the above', points: 0 }
            ]
        },
        { 
            id: 'q15', 
            category: 'context',
            text: 'How quickly do you want to act on this?', 
            type: 'single', 
            options: [
                { label: 'Immediately — this is urgent', points: 0 },
                { label: 'Within 30 days', points: 0 },
                { label: 'Within 90 days', points: 0 },
                { label: 'Just exploring for now', points: 0 }
            ]
        },

        // --- SECTION 7: Authority CTA (Soft Close) - UNSCORED ---
        { 
            id: 'q16', 
            category: 'context',
            text: 'Based on your answers, I can map out exactly where your cash is trapped. Would you like me to walk you through what this means?', 
            type: 'single', 
            options: [
                { label: 'Yes — clarity would help', points: 0 },
                { label: 'Maybe — depends on what I see', points: 0 },
                { label: 'Not right now', points: 0 }
            ]
        },
        { 
            id: 'q17', 
            category: 'context',
            text: 'Is there anything specific about your situation I should know before reviewing your answers?', 
            type: 'text', 
            placeholder: 'e.g., "I feel alone and unsupported in this..."'
        }
    ];

    // COPYWRITING TEMPLATES FOR REPORT
    const REPORT_COPY = {
        focus: {
            title: "Bestseller DNA & Focus",
            weak: "You haven't yet concentrated revenue in a clear set of winners. Your catalog is likely bloated with 'hopeful' products that are draining attention.",
            moderate: "You have winners, but they're not getting full focus. Your best SKUs are effectively subsidizing a long tail of mediocre performers.",
            strong: "You're doing an excellent job concentrating revenue into a small hero set. The next step is to aggressively scale these winners."
        },
        cash: {
            title: "Trapped Cash & Inventory",
            weak: "You likely have significant cash sitting on shelves in products your customers have already voted against. This drains optionality.",
            moderate: "You have some efficiency, but likely still have $50k-$150k trapped in slow-movers that could be redeployed.",
            strong: "Your inventory runs lean. You're efficient at turning cash back into more cash. Keep this discipline as you scale."
        },
        decision: {
            title: "Decision Quality & Launch Discipline",
            weak: "Your launch process is leaking capital. Relying on 'mix but not systemized' decisions means every launch is a gamble, not a calculated step.",
            moderate: "You have some wins, but the 'flopped' launches are costing you momentum. You need a sharper filter before committing capital.",
            strong: "Your launch filter is working. You're not guessing—you're verifying demand before spending real money."
        },
        margin: {
            title: "Margin & Pressure",
            weak: "Margin pressure is high. If trapped inventory forces repeated discounting, your unit economics will crumble.",
            moderate: "Your margin is workable, but not bulletproof. You must be ruthless about controlling CAC and avoiding unnecessary discounts.",
            strong: "You have healthy margins that allow for aggressive acquisition. Protect this by not letting complexity creep in."
        }
    };

    // STATE
    let currentQuestionIndex = 0;
    let scores = { focus: 0, cash: 0, decision: 0, margin: 0 };
    let answers = {}; // Keyed by question ID (q0, q1...)
    let categoryRatings = {}; // Keyed by category: 'Weak', 'Moderate', 'Strong'
    let overallScore = 0;

    // DOM Elements
    const quizContainer = document.getElementById('quiz-dynamic-container');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNKT18hgrms40Z8XXl9Eb1qUtYsVGIfeug-sUD01k8UtGv1NTf9srBtj8Gw568_v2LIw/exec';

    console.log("--- BESTSELLER DNA DIAGNOSTIC LOADED ---");

    function init() {
        if(!quizContainer) return;
        renderQuestion();
    }

    function renderQuestion() {
        const q = QUESTIONS[currentQuestionIndex];
        
        // Calculate progress
        let progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;
        
        let html = `
            <div class="fade-in">
                <div class="mb-8">
                    <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                        <span>Question ${currentQuestionIndex + 1} of ${QUESTIONS.length}</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-[#D8F911] transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                </div>

                <h2 class="text-3xl font-display font-bold text-white mb-2">${q.text}</h2>
                ${q.id === 'q17' ? '<p class="text-white/50 mb-6 text-sm">Optional: Share any specific context.</p>' : ''}
                
                <div class="space-y-4 mt-6">
        `;

        if (q.type === 'single') {
            html += q.options.map(opt => `
                <button class="quiz-option w-full text-left p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D8F911]/50 transition-all group flex items-center justify-between" onclick="handleAnswer('${q.id}', '${q.category}', ${opt.points}, '${opt.label.replace(/'/g, "\\'")}')">
                    <span class="font-medium text-white/80 group-hover:text-white">${opt.label}</span>
                    <span class="opacity-0 group-hover:opacity-100 text-[#D8F911] transform translate-x-2 group-hover:translate-x-0 transition-all">→</span>
                </button>
            `).join('');
        } else if (q.type === 'text') {
            html += `
                <textarea id="q17-text" class="quiz-textarea" placeholder="${q.placeholder}"></textarea>
                <button class="w-full bg-[#D8F911] text-black font-bold text-lg py-4 rounded-xl mt-4 hover:scale-[1.02] transition-transform uppercase tracking-wide" onclick="handleTextAnswer()">
                    Finish & Analyze
                </button>
            `;
        }

        html += `</div></div>`;
        quizContainer.innerHTML = html;
        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Keep user focused
    }

    window.handleAnswer = (qId, category, points, label) => {
        // Record Answer
        answers[qId] = label;
        
        // Add Points if category exists
        if (category && scores[category] !== undefined) {
            scores[category] += points;
        }

        nextStep();
    };

    window.handleTextAnswer = () => {
        const text = document.getElementById('q17-text').value;
        answers['q17'] = text;
        nextStep();
    }

    function nextStep() {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            calculateResults();
            renderLeadForm();
        }
    }

    function calculateResults() {
        // 1. Calculate Overall Score
        overallScore = scores.focus + scores.cash + scores.decision + scores.margin;

        // 2. Determine Ratings for each category (0-50)
        // 0–20: Weak, 21–35: Moderate, 36–50: Strong
        const getRating = (score) => {
            if (score <= 20) return "Weak";
            if (score <= 35) return "Moderate";
            return "Strong";
        };

        categoryRatings = {
            focus: getRating(scores.focus),
            cash: getRating(scores.cash),
            decision: getRating(scores.decision),
            margin: getRating(scores.margin)
        };
    }

    function renderLeadForm() {
        const html = `
            <div class="fade-in max-w-lg mx-auto py-10">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-display font-bold text-white mb-2">Your Trapped Cash Report is Ready</h2>
                    <p class="text-white/60">Enter your email and we’ll send your personalized diagnostic + 90-day action plan in the next 60 seconds.</p>
                </div>
                
                <div class="space-y-4">
                    <input type="text" id="lead-name" placeholder="First Name" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    <input type="email" id="lead-email" placeholder="Work Email" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    <p class="text-xs text-white/40 ml-1">We hate spam too. Only actionable insights, no fluff.</p>
                    <input type="tel" id="lead-phone" placeholder="Phone Number" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    <input type="text" id="lead-business" placeholder="Business Name" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    
                    <button onclick="submitLead()" class="w-full bg-[#D8F911] text-black font-bold text-xl py-4 rounded-xl hover:scale-[1.02] transition-transform uppercase tracking-wide">
                        SEND MY REPORT
                    </button>
                </div>
            </div>
        `;
        quizContainer.innerHTML = html;
        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.submitLead = () => {
        const name = document.getElementById('lead-name').value;
        const email = document.getElementById('lead-email').value;
        const phone = document.getElementById('lead-phone').value;
        const business = document.getElementById('lead-business').value;

        if(!name || !email || !phone || !business) return alert("Please fill in all fields to unlock your report.");
        
        renderLoader(name, email, phone, business);
    };

    function renderLoader(name, email, phone, business) {
        // Overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px);
            z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center;
        `;
        overlay.innerHTML = `
            <div class="w-20 h-20 border-4 border-white/10 border-t-[#D8F911] rounded-full animate-spin mb-6"></div>
            <h3 class="text-2xl font-display font-bold text-white tracking-widest animate-pulse">GENERATING REPORT...</h3>
            <p class="text-white/50 mt-4 text-sm">Mapping your trapped cash...</p>
        `;
        document.body.appendChild(overlay);

        // Prepare Data for GAS
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("business", business);
        formData.append("answers", JSON.stringify(answers));
        formData.append("scores", JSON.stringify(scores)); // {focus: 30, cash: 10...}
        formData.append("overallScore", overallScore);
        formData.append("categoryRatings", JSON.stringify(categoryRatings)); // {focus: 'Moderate'...}
        
        // This 'type' field helps GAS know which quiz this is, if we combine them later.
        formData.append("quizType", "bestseller-dna"); 

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: formData,
            mode: "no-cors"
        }).then(() => {
             console.log("Data sent to sheet");
        }).catch(err => console.error(err));

        setTimeout(() => {
            overlay.remove();
            renderReport(name);
        }, 2500);
    }

    // --- REPORT GENERATION ---
    function renderReport(name) {
        
        // Determine Overall Rating Label
        let overallRatingLabel = "Very Weak";
        if (overallScore > 80) overallRatingLabel = "Weak";
        if (overallScore > 130) overallRatingLabel = "Moderate";
        if (overallScore > 170) overallRatingLabel = "Strong";

        // Dynamic "Two Biggest Problems" logic (Simple Heuristic: lowest scores)
        // Sort categories by score
        const sortedCats = Object.entries(scores).sort(([,a], [,b]) => a - b);
        const worstCat = sortedCats[0][0]; 
        const secondWorstCat = sortedCats[1][0];

        const problemText = {
            focus: "You likely have diluted focus across too many SKUs, channels, and campaigns.",
            cash: "You have cash sitting on shelves in products your customers have already voted against.",
            decision: "Your launch process is leaking capital; you're likely guessing rather than verifying.",
            margin: "Your margins are under pressure, making it dangerous to scale without fixing unit economics."
        };

        const html = `
            <div class="report-wrapper fade-in text-left pb-24 pt-4">
                
                <!-- EXECUTIVE SUMMARY -->
                <div class="max-w-4xl mx-auto mb-16 px-4">
                    <div class="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
                         <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest">REPORT GENERATED FOR ${name.toUpperCase()}</p>
                    </div>
                    
                    <h1 class="text-5xl md:text-7xl font-display font-bold text-white mb-2 tracking-tighter" style="font-family: 'Anton', sans-serif;">
                        ${overallScore}<span class="text-3xl md:text-4xl text-white/20">/200</span>
                    </h1>
                    
                    <h2 class="text-3xl md:text-4xl font-display font-bold mb-10 uppercase text-${overallRatingLabel === 'Strong' ? 'brand-primary' : (overallRatingLabel === 'Moderate' ? 'yellow-400' : 'red-500')}">
                        ${overallRatingLabel} HEALTH SCORE
                    </h2>

                    <!-- SCORE TABLE -->
                    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
                        <h3 class="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Category Breakdown</h3>
                        <div class="space-y-3">
                            ${Object.keys(scores).map(cat => `
                                <div class="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <span class="text-white/80 capitalize">${REPORT_COPY[cat].title}</span>
                                    <div class="flex items-center gap-4">
                                        <span class="text-white font-bold">${scores[cat]}/50</span>
                                        <span class="text-xs px-2 py-1 rounded bg-white/10 text-white/60 w-20 text-center">${categoryRatings[cat]}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- KEY INSIGHTS -->
                    <div class="mb-12">
                        <h3 class="text-2xl font-bold text-white mb-4">Your Two Biggest Leaks:</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start gap-3">
                                <span class="text-red-500 font-bold mt-1">1.</span>
                                <p class="text-white/80"><strong>${REPORT_COPY[worstCat].title}:</strong> ${problemText[worstCat]}</p>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="text-red-500 font-bold mt-1">2.</span>
                                <p class="text-white/80"><strong>${REPORT_COPY[secondWorstCat].title}:</strong> ${problemText[secondWorstCat]}</p>
                            </li>
                        </ul>
                    </div>

                    <div class="p-6 bg-[#D8F911]/10 border border-[#D8F911]/30 rounded-xl mb-16">
                         <p class="text-[#D8F911] font-bold mb-1 uppercase text-xs tracking-widest">Estimated Cost of Inaction</p>
                         <p class="text-2xl text-white font-display">${answers['q13'] || '$250K - $500K'}</p>
                    </div>
                </div>

                <!-- DETAILED BREAKDOWNS -->
                <div class="max-w-4xl mx-auto px-4 space-y-12 mb-20">
                    <h3 class="text-3xl font-display font-bold text-white border-b border-white/10 pb-4">Detailed Analysis</h3>
                    
                    ${Object.keys(scores).map(cat => `
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <div class="flex justify-between items-start mb-4">
                                <h4 class="text-xl font-bold text-white">${REPORT_COPY[cat].title}</h4>
                                <span class="text-sm font-bold px-3 py-1 rounded bg-black/30 text-white/70 border border-white/10">${categoryRatings[cat]}</span>
                            </div>
                            <p class="text-white/70 leading-relaxed mb-4">
                                ${REPORT_COPY[cat][categoryRatings[cat].toLowerCase()]}
                            </p>
                             <div class="text-sm text-white/40">
                                <strong>Your Answer:</strong> ${answers[cat === 'focus' ? 'q4' : (cat === 'cash' ? 'q6' : (cat === 'decision' ? 'q8' : 'q10'))]}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- 90 DAY PLAN -->
                <div class="max-w-4xl mx-auto px-4 mb-20">
                     <h3 class="text-3xl font-display font-bold text-white border-b border-white/10 pb-6 mb-8">Your 90-Day Focus Plan</h3>
                     
                     <div class="space-y-6">
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-[#D8F911]/20 rounded-full flex items-center justify-center text-[#D8F911] font-bold border border-[#D8F911]/20">1</div>
                            <div>
                                <h4 class="text-xl font-bold text-white mb-2">Weeks 1-4: Free Trapped Cash</h4>
                                <p class="text-white/60">Run a SKU profitability audit. Design a liquidation sprint for your $150k+ in dead stock (bundles, wholesale) to unlock immediate capital.</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-[#D8F911]/20 rounded-full flex items-center justify-center text-[#D8F911] font-bold border border-[#D8F911]/20">2</div>
                            <div>
                                <h4 class="text-xl font-bold text-white mb-2">Weeks 3-6: Fix Launch Filter</h4>
                                <p class="text-white/60">Codify a launch checklist: minimum margin, preorder validation, and clear differentiation. No product launches without hitting these gates.</p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-[#D8F911]/20 rounded-full flex items-center justify-center text-[#D8F911] font-bold border border-[#D8F911]/20">3</div>
                            <div>
                                <h4 class="text-xl font-bold text-white mb-2">Weeks 4-8: Back the Winners</h4>
                                <p class="text-white/60">Shift 70%+ of ad spend and inventory buys to your top 5 SKUs. Build your acquisition narrative purely around these heroes.</p>
                            </div>
                        </div>
                     </div>
                </div>

                <!-- FINAL CTA -->
                <div class="max-w-4xl mx-auto px-4 text-center">
                    <div class="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl p-10 md:p-16">
                        <h3 class="text-4xl md:text-5xl font-display font-bold text-white mb-6" style="font-family: 'Anton', sans-serif;">
                            Don't Do This Alone.
                        </h3>
                        <p class="text-white/60 mb-10 text-lg max-w-2xl mx-auto">
                            You're sitting on trapped cash and acting on it isn't about "more hustle"—it's about a cleaner system. Let's map your numbers to a 30-day liquidation plan.
                        </p>
                        
                        <a href="https://calendly.com/cantstopmeofficial/tarkan-salar-meeting-duration-adjustable-clone" 
                           target="_blank" 
                           class="inline-block bg-[#D8F911] text-black font-extrabold text-lg md:text-xl py-5 px-10 rounded-lg shadow-[0_4px_20px_rgba(216,249,17,0.4)] hover:scale-[1.02] hover:-translate-y-1 transition-all transform uppercase tracking-wide">
                           BOOK 30-MIN STRATEGY CALL <span class="ml-2">→</span>
                        </a>
                    </div>
                     <p class="text-white/30 mt-8 text-sm italic">
                        "${answers['q17'] || 'No additional notes provided.'}"
                    </p>
                </div>
            </div>
        `;

        quizContainer.innerHTML = html;
        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    init();
});
