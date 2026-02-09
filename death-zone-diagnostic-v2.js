
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION & DATA ---
    const TIER_CONTENT = {
        'SAFE ZONE': {
            title: "BLUE OCEAN",
            color: "#22c55e", // Green
            trappedCash: "$50k - $100k",
            biggestRisk: "Complacency",
            ctaText: "You are a market leader. The goal now is dominance and exit value.",
            analysisList: [
                "✅ <strong>You know your Bestseller DNA</strong>: You have a clear pattern connecting your top-performing products.",
                "✅ <strong>Low dead stock risk</strong>: Your inventory is focused.",
                "✅ <strong>Strong 80/20 focus</strong>: 20% of your products generate 80% of your revenue."
            ],
            roadmapSteps: [
                { title: "Document DNA", desc: "Write down the pattern connecting your top 5 products." },
                { title: "Build 80/20 System", desc: "80% Stable Heroes, 20% Controlled Experiments." },
                { title: "Train Your Team", desc: "Your team should make product decisions without you." },
                { title: "Exit Strategy", desc: "Prepare financials for a potential valuation." }
            ]
        },
        'WARNING ZONE': {
            title: "WARNING ZONE",
            color: "#eab308", // Yellow
            trappedCash: "$100k - $200k",
            biggestRisk: "Standardization",
            ctaText: "You have winners, but can't articulate the pattern. You're starting to chase trends.",
            analysisList: [
                "⚠️ <strong>Bestseller DNA is unclear</strong>: You have winners, but making decisions on gut feeling.",
                "⚠️ <strong>Dead stock is building up</strong>: Cash is tied up in slow movers.",
                "⚠️ <strong>Starting to chase trends</strong>: Using tools to find 'hot' products instead of your brand voice."
            ],
            roadmapSteps: [
                { title: "Identify DNA", desc: "Look at your top 5 products. Find the psychographic pattern." },
                { title: "Kill What Doesn't Fit", desc: "Liquidate non-core SKUs to free up cash." },
                { title: "Focus 80% on Heroes", desc: "Never run out of your bestsellers." },
                { title: "Test 20% Experiments", desc: "Only test products that fit your DNA." }
            ]
        },
        'DANGER ZONE': {
            title: "DANGER ZONE",
            color: "#f97316", // Orange
            trappedCash: "$200k - $400k",
            biggestRisk: "Stagnation",
            ctaText: "You are chasing trends based on what competitors are doing. Cash flow is tightening.",
            analysisList: [
                "🟠 <strong>No clear Bestseller DNA</strong>: You are ordering products based on what's 'hot'.",
                "🟠 <strong>Significant dead stock</strong>: Old inventory is trapping $200k+ of your cash.",
                "🟠 <strong>Diluting Brand Voice</strong>: You are chasing trends that don't fit."
            ],
            roadmapSteps: [
                { title: "Find DNA (URGENT)", desc: "You need outside help to see the pattern you're missing." },
                { title: "Aggressive Liquidation", desc: "Turn dead stock back into cash immediately." },
                { title: "Stop Bleeding", desc: "Stop ordering random products." },
                { title: "Remove Bottleneck", desc: "Train your team to execute without you." }
            ]
        },
        'DEATH ZONE': {
            title: "DEATH ZONE",
            color: "#ef4444", // Red
            trappedCash: "$400k - $500k+",
            biggestRisk: "Total Burnout",
            ctaText: "You are working harder than your team. Your business is dependent on your energy. One bad month could break everything.",
            analysisList: [
                "🔴 <strong>NO Bestseller DNA</strong>: Ordering products based on gut feeling. No pattern.",
                "🔴 <strong>Critical dead stock</strong>: Massive inventory trap. Cash is gone.",
                "🔴 <strong>Bleeding cash</strong>: Margins shrinking, CAC rising, constant crisis."
            ],
            roadmapSteps: [
                { title: "EMERGENCY TRIAGE", desc: "Identify top 5 products. Kill everything else immediately." },
                { title: "Find DNA Expert", desc: "You are too close to see it. You need an expert eye." },
                { title: "Implement Zara Model", desc: "Build the 80/20 system to survive." },
                { title: "Systematize Decisions", desc: "Stop being the bottleneck." }
            ]
        }
    };

    const QUESTIONS = [
        // Category (Not Scored)
        { id: 'q0', text: 'What is your business category?', type: 'single', options: [
            { label: 'Fashion / Apparel', points: 0 }, { label: 'Beauty / Cosmetics', points: 0 }, 
            { label: 'Health / Wellness', points: 0 }, { label: 'Home Goods', points: 0 },
            { label: 'Electronics / Gadgets', points: 0 }, { label: 'Other', points: 0 } ]
        },
        // 16 Scored Questions (0-5 Points)
        { id: 'q1', text: 'Current Annual Revenue?', type: 'single', options: [
            { label: 'Under $3M', points: 5 }, { label: '$3M–$7M', points: 3 }, 
            { label: '$7M–$15M', points: 1 }, { label: '$15M+', points: 0 } ]
        },
        { id: 'q2', text: 'Hours per week you work?', type: 'single', options: [
            { label: '70+', points: 5 }, { label: '50–70', points: 3 }, 
            { label: '40–50', points: 1 }, { label: 'Under 40', points: 0 } ]
        },
        { id: 'q3', text: 'If you left for 7 days?', type: 'single', options: [
            { label: 'Total Chaos', points: 5 }, { label: 'Major Fires', points: 4 }, 
            { label: 'Recoverable Delays', points: 2 }, { label: 'Smooth Sailing', points: 0 } ]
        },
        { id: 'q4', text: 'Who is your ideal customer?', type: 'single', options: [
            { label: "Don't know / Broad", points: 5 }, { label: "Vague idea", points: 3 }, 
            { label: "Somewhat defined", points: 1 }, { label: "Crystal Clear & Specific", points: 0 } ]
        },
        { id: 'q5', text: 'Why do customers choose you?', type: 'single', options: [
            { label: 'Price / Discounts', points: 5 }, { label: 'Not Sure', points: 5 }, 
            { label: 'Weak Reasons', points: 3 }, { label: 'Unique Value (Clear)', points: 0 } ]
        },
        { id: 'q6', text: 'Reliance on discounts?', type: 'single', options: [
            { label: 'Always (Addicted)', points: 5 }, { label: 'Frequently', points: 4 }, 
            { label: 'Occasionally', points: 2 }, { label: 'Rarely / Never', points: 0 } ]
        },
        { id: 'q7', text: '% Revenue from Top 3 Products?', type: 'single', options: [
            { label: 'Under 20% (Spread Thin)', points: 5 }, { label: '20–40%', points: 3 }, 
            { label: '40–60%', points: 1 }, { label: '60%+ (Clear Winners)', points: 0 } ]
        },
        { id: 'q8', text: 'Contribution margin per SKU?', type: 'single', options: [
            { label: 'No idea', points: 5 }, { label: 'For some products', points: 3 }, 
            { label: 'Yes (Estimate)', points: 1 }, { label: 'Yes (Exact Data)', points: 0 } ]
        },
        { id: 'q9', text: 'Dead Inventory % (>90 days)?', type: 'single', options: [
            { label: 'Over 30%', points: 5 }, { label: '10–30%', points: 3 }, 
            { label: 'Under 10%', points: 1 }, { label: 'Minimal / None', points: 0 } ]
        },
        { id: 'q10', text: 'Team interruptions per day?', type: 'single', options: [
            { label: '10+ (Constant)', points: 5 }, { label: '5–10', points: 3 }, 
            { label: '3–5', points: 1 }, { label: '0–2 (Rare)', points: 0 } ]
        },
        { id: 'q11', text: 'One task you can\'t stop?', type: 'single', options: [
            { label: 'Firefighting / Ops', points: 5 }, { label: 'Approving basic work', points: 4 }, 
            { label: 'Sales / Content', points: 2 }, { label: 'Strategy / Leadership', points: 0 } ]
        },
        { id: 'q12', text: 'Trust in your numbers (1-10)?', type: 'single', options: [
            { label: '1–3 (Guessing)', points: 5 }, { label: '4–6', points: 3 }, 
            { label: '7–9', points: 1 }, { label: '10 (Data-Driven)', points: 0 } ]
        },
        { id: 'q13', text: 'How fast do you need this fixed?', type: 'single', options: [
            { label: 'Immediately', points: 5 }, { label: '2–4 Weeks', points: 3 }, 
            { label: '1–3 Months', points: 1 }, { label: 'Just Exploring', points: 0 } ]
        },
        { id: 'q14', text: '#1 Outcome Desired?', type: 'single', options: [
            { label: 'Stop Firefighting', points: 5 }, { label: 'Fix Cash Flow', points: 5 }, 
            { label: 'Scale Growth', points: 3 }, { label: 'Prepare for Exit', points: 0 } ]
        },
        { id: 'q15', text: 'Personal cost of inaction?', type: 'single', options: [
            { label: 'Health / Burnout', points: 5 }, { label: 'Relationships', points: 5 }, 
            { label: 'Wealth / Opportunity', points: 3 }, { label: 'Confidence', points: 2 } ]
        },
        { id: 'q16', text: 'Previous attempts to fix?', type: 'single', options: [
            { label: 'Agencies / Consultants', points: 5 }, { label: 'New Hires', points: 3 }, 
            { label: 'Courses / Books', points: 2 }, { label: 'Nothing yet', points: 0 } ]
        }
    ];

    let currentQuestionIndex = 0;
    let totalScore = 0;
    let answers = {};
    let category = "";

    // DOM Elements
    const quizContainer = document.getElementById('quiz-dynamic-container');
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOSYCeL9jTgkJFpt2n_23VwcIcIIIYaeb26PChycLM-86RgrYklXyuJIQdpZk4zZxshQ/exec"

    // DEBUG LOG
    console.log("--- DEATH ZONE DIAGNOSTIC v2 (DETAILED) LOADED ---");

    function init() {
        if(!quizContainer) return;
        renderQuestion();
    }

    function renderQuestion() {
        const q = QUESTIONS[currentQuestionIndex];
        // Calculate progress (excluding Category Q0)
        let progress = 0;
        if(currentQuestionIndex > 0) {
             progress = ((currentQuestionIndex) / (QUESTIONS.length - 1)) * 100;
        }
        
        const html = `
            <div class="fade-in">
                <div class="mb-8">
                    <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                        <span>Question ${currentQuestionIndex === 0 ? 'Start' : currentQuestionIndex} of ${QUESTIONS.length - 1}</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                    <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-[#D8F911] transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                </div>

                <h2 class="text-3xl font-display font-bold text-white mb-8">${q.text}</h2>
                
                <div class="space-y-4">
                    ${q.options.map(opt => `
                        <button class="quiz-option w-full text-left p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D8F911]/50 transition-all group flex items-center justify-between" onclick="handleAnswer(${opt.points}, '${opt.label}')">
                            <span class="font-medium text-white/80 group-hover:text-white">${opt.label}</span>
                            <span class="opacity-0 group-hover:opacity-100 text-[#D8F911] transform translate-x-2 group-hover:translate-x-0 transition-all">→</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        quizContainer.innerHTML = html;
    }

    window.handleAnswer = (points, label) => {
        if (currentQuestionIndex === 0) {
            category = label; // Store category separately
        } else {
            totalScore += points;
        }
        answers[`q${currentQuestionIndex}`] = label;

        if (currentQuestionIndex < QUESTIONS.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            renderLeadForm();
        }
    };

    function renderLeadForm() {
        const html = `
            <div class="fade-in max-w-lg mx-auto">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-display font-bold text-white mb-2">Analysis Complete</h2>
                    <p class="text-white/60">Enter your details to reveal your Profit Leak Report.</p>
                </div>
                
                <div class="space-y-4">
                    <input type="text" id="lead-name" placeholder="First Name" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    <input type="email" id="lead-email" placeholder="Work Email" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    <input type="tel" id="lead-phone" placeholder="Phone Number" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    <input type="text" id="lead-business" placeholder="Business Name" class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#D8F911] outline-none transition-colors">
                    
                    <button onclick="submitLead()" class="w-full bg-[#D8F911] text-black font-bold text-xl py-4 rounded-xl hover:scale-[1.02] transition-transform uppercase tracking-wide">
                        Reveal My Report
                    </button>
                    <p class="text-center text-xs text-white/30">Your data is secure. No spam.</p>
                </div>
            </div>
        `;
        quizContainer.innerHTML = html;
        // Auto scroll to form
        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px);
            z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center;
        `;
        overlay.innerHTML = `
            <div class="w-20 h-20 border-4 border-white/10 border-t-[#D8F911] rounded-full animate-spin mb-6"></div>
            <h3 class="text-2xl font-display font-bold text-white tracking-widest animate-pulse">ANALYZING DATA...</h3>
            <p class="text-white/50 mt-4 text-sm">Comparing ${category} benchmarks...</p>
        `;
        document.body.appendChild(overlay);

        // Calculate Tier (0-80)
        // 0-20 Safe, 21-40 Warning, 41-60 Danger, 61-80 Death
        let tier = 'DEATH ZONE';
        if (totalScore <= 20) tier = 'SAFE ZONE';
        else if (totalScore <= 40) tier = 'WARNING ZONE';
        else if (totalScore <= 60) tier = 'DANGER ZONE';

        // Send to GAS (Async)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("business", business);
        formData.append("category", category);
        formData.append("score", totalScore);
        formData.append("answers", JSON.stringify(answers));

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: formData,
            mode: "no-cors"
        }).then(() => {
             console.log("Data sent to sheet");
        }).catch(err => console.error(err));

        setTimeout(() => {
            overlay.remove();
            renderReport(tier, totalScore);
        }, 2500);
    }

    function renderReport(tier, score) {
        const data = TIER_CONTENT[tier];
        const color = data.color;

        // INLINE STYLES FOR MOBILE FIX
        const cardStyle = `width: 100% !important; display: flex !important; margin-bottom: 1rem !important; flex-direction: row; align-items: flex-start;`;
        const roadmapStyle = `width: 100% !important; margin-bottom: 1.5rem !important;`;

        const html = `
            <div class="report-wrapper fade-in text-left pb-24 pt-4">
                
                <!-- HEADER & SCORE CARD -->
                <div class="max-w-4xl mx-auto mb-20 text-center px-4">
                    <div class="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
                         <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest">DIAGNOSTIC COMPLETE</p>
                    </div>
                    
                    <h1 class="text-7xl md:text-9xl font-display font-bold text-white mb-2 tracking-tighter" style="font-family: 'Anton', sans-serif;">
                        ${score}<span class="text-3xl md:text-4xl text-white/20">/80</span>
                    </h1>
                    
                    <h2 class="text-3xl md:text-5xl font-display font-bold mb-12 uppercase" style="color: ${color}; text-shadow: 0 0 40px ${color}40; font-family: 'Anton', sans-serif;">
                        ${tier}
                    </h2>

                     <!-- Summary Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 md:border border-white/10 rounded-2xl md:bg-white/5 backdrop-blur-sm max-w-3xl mx-auto">
                        <div class="bg-white/5 md:bg-transparent border border-white/10 md:border-0 md:border-r p-6 rounded-xl md:rounded-none">
                             <p class="text-xs font-bold uppercase tracking-widest mb-2 text-white/40">Trapped Cash</p>
                             <p class="text-2xl md:text-3xl font-display font-bold text-white" style="font-family: 'Anton', sans-serif;">${data.trappedCash}</p>
                        </div>
                         <div class="bg-white/5 md:bg-transparent border border-white/10 md:border-0 md:border-r p-6 rounded-xl md:rounded-none">
                             <p class="text-xs font-bold uppercase tracking-widest mb-2 text-white/40">Biggest Risk</p>
                             <p class="text-xl font-bold text-[#ef4444] leading-tight">${data.biggestRisk}</p>
                        </div>
                         <div class="bg-white/5 md:bg-transparent border border-white/10 md:border-0 p-6 rounded-xl md:rounded-none">
                             <p class="text-xs font-bold uppercase tracking-widest mb-2 text-white/40">Action Level</p>
                             <div class="inline-block px-3 py-1 bg-[${color}]/20 rounded border border-[${color}]/30">
                                <p class="text-sm font-bold text-[${color}] uppercase tracking-wide">IMMEDIATE</p>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- SPLIT SECTION: Analysis & Roadmap -->
                <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 px-4 mb-32">
                    
                    <!-- LEFT: DEEP DIVE ANALYSIS -->
                    <div class="w-full">
                        <h3 class="text-2xl md:text-3xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4 inline-block">
                            YOUR SCORE BREAKDOWN
                        </h3>
                        <div class="flex flex-col gap-4 w-full" style="display: flex !important; flex-direction: column !important; width: 100% !important;">
                            ${data.analysisList.map(item => `
                                <div class="w-full bg-white/5 border border-white/10 p-5 rounded-xl flex items-start gap-4 hover:border-[${color}]/30 transition-colors relative overflow-hidden group" style="${cardStyle}">
                                     <div class="w-8 h-8 rounded-full bg-[${color}]/20 flex flex-shrink-0 items-center justify-center text-[${color}] font-bold border border-[${color}]/20 mt-1">
                                        !
                                     </div>
                                     <div class="relative z-10 flex-1">
                                        <p class="text-white/80 leading-relaxed text-sm md:text-base font-medium">${item}</p>
                                     </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- RIGHT: ROADMAP -->
                    <div class="w-full">
                         <h3 class="text-2xl md:text-3xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4 inline-block mt-8 lg:mt-0">
                            8-Week Roadmap
                        </h3>
                        <div class="flex flex-col w-full">
                             ${data.roadmapSteps.map((step, index) => `
                                <div class="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-6 relative hover:bg-white/10 transition-all group" style="${roadmapStyle}">
                                    <div class="flex items-center gap-3 mb-4">
                                        <span class="bg-[${color}]/10 text-[${color}] border border-[${color}]/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                            Step 0${index + 1}
                                        </span>
                                        <div class="h-[1px] flex-grow bg-white/10"></div>
                                    </div>
                                    <div class="relative z-10">
                                        <h4 class="text-xl font-bold text-white mb-3 uppercase tracking-wide">${step.title}</h4>
                                        <p class="text-white/60 text-sm md:text-base leading-relaxed">${step.desc}</p>
                                    </div>
                                </div>
                             `).join('')}
                        </div>
                    </div>

                </div>

                <!-- FINAL CTA (SOLID BUTTON) -->
                <div class="max-w-4xl mx-auto px-4 text-center">
                    <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16">
                         <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(216,249,17,0.05),transparent_70%)] pointer-events-none"></div>

                        <div class="relative z-10">
                            <h3 class="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase leading-tight" style="font-family: 'Anton', sans-serif;">
                                Stop Guessing.<br>Start Scaling.
                            </h3>
                            <p class="text-white/60 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light">
                                ${data.ctaText}
                            </p>
                            
                            <a href="https://calendly.com/cantstopmeofficial/tarkan-salar-meeting-duration-adjustable-clone" 
                               target="_blank" 
                               class="inline-block bg-[#D8F911] text-black font-extrabold text-lg md:text-xl py-5 px-10 rounded-lg shadow-[0_4px_20px_rgba(216,249,17,0.4)] hover:shadow-[0_4px_30px_rgba(216,249,17,0.6)] hover:scale-[1.02] hover:-translate-y-1 transition-all transform uppercase tracking-wide w-full md:w-auto">
                               BOOK FREE STRATEGY CALL <span class="ml-2">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        quizContainer.innerHTML = html;
        // Auto scroll to results top
        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    init();
});
