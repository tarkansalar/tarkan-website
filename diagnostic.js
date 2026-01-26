document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        currentQuestion: 0,
        answers: {
            q1: null,
            q2: [],
            q3: null,
            q4: null,
            q5: null,
            q6: null,
            q7: null,
            q8: null,
            contact: {
                name: '',
                email: '',
                phoneCode: '',
                phone: '',
                business: ''
            }
        }
    };

    // DOM Elements
    const questions = document.querySelectorAll('.quiz-question');
    const nextBtns = document.querySelectorAll('.next-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const progressHeader = document.getElementById('progress-header');
    
    // Initialize
    updateUI();

    // Event Listeners for Single Select Options
    document.querySelectorAll('.single-select-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const btn = e.target.closest('.single-select-option'); // Ensure we get the button
            if (!btn) return;

            const questionElement = btn.closest('.quiz-question');
            const questionId = questionElement.dataset.id;
            const value = btn.dataset.value;
            
            // Highlight selected
            const siblings = questionElement.querySelectorAll('.single-select-option');
            siblings.forEach(sib => {
                sib.classList.remove('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
                sib.classList.add('border-white/30', 'text-brand-white/80');
            });
            btn.classList.add('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
            btn.classList.remove('border-white/30', 'text-brand-white/80');

            // Save answer
            state.answers[questionId] = value;

            // Auto-advance after short delay (only if not contact form)
            if (questionId !== 'contact') {
                setTimeout(() => {
                    nextQuestion();
                }, 400);
            }
        });
    });

    // Event Listeners for Multi Select Options (Question 2)
    document.querySelectorAll('.multi-select-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const btn = e.target.closest('.multi-select-option');
            if (!btn) return;
            
            const value = btn.dataset.value;
            const isSelected = btn.classList.contains('selected');

            if (isSelected) {
                btn.classList.remove('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
                btn.classList.add('border-white/30', 'text-brand-white/80');
                // Remove from array
                state.answers.q2 = state.answers.q2.filter(item => item !== value);
            } else {
                btn.classList.add('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
                btn.classList.remove('border-white/30', 'text-brand-white/80');
                // Add to array
                state.answers.q2.push(value);
            }
        });
    });

    // Navigation Buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', nextQuestion);
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', prevQuestion);
    });
    
    // Submit Button
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
             if (validateContactForm()) {
                finishQuiz();
             }
        });
    }

    // Functions
    function nextQuestion() {
        if (state.currentQuestion < questions.length - 1) {
            state.currentQuestion++;
            updateUI();
        } 
    }

    function prevQuestion() {
        if (state.currentQuestion > 0) {
            state.currentQuestion--;
            updateUI();
        }
    }

    function updateUI() {
        // Show/Hide Questions
        questions.forEach((q, index) => {
            if (index === state.currentQuestion) {
                q.classList.add('active-question');
                q.style.display = 'block';
                // Add fade in animation
                q.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                q.classList.remove('active-question');
                q.style.display = 'none';
            }
        });

        // Update Progress
        if(progressHeader) {
            // If contact step (last step)
            if (state.currentQuestion === questions.length - 1) {
                 progressHeader.innerHTML = '<span class="text-brand-primary text-xl">Final Step</span>';
            } else {
                 progressHeader.innerHTML = `Question <span class="text-brand-primary text-xl">${state.currentQuestion + 1}</span>/8`;
            }
        }
        
        // Scroll to top of assessment container
        const assessmentContainer = document.getElementById('assessment-container');
        if(assessmentContainer) {
             assessmentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function validateContactForm() {
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const phoneInput = document.getElementById('contact-phone');
        const countryCodeInput = document.getElementById('contact-country-code');
        const businessInput = document.getElementById('contact-business');

        if (!nameInput || !emailInput || !phoneInput || !countryCodeInput || !businessInput) {
            // If elements are missing from DOM, just return false or log error
            return false;
        }
        
        const name = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const phoneCode = countryCodeInput.value;
        const business = businessInput.value;

        if (!name || !email || !phone || !business) {
            alert('Please fill in all fields.');
            return false;
        }
        
        // Basic Email Regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
             alert('Please enter a valid email address.');
             return false;
        }

        state.answers.contact = { name, email, phoneCode, phone, business };
        return true;
    }

    // --- GOOGLE SHEETS CONFIG ---
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGYEUCBm3ueYKPmgDBulXupsufhifXxXdvixZS0zsq8HvD0U6VTs1eeigRUNf94w1PUg/exec';

    function finishQuiz() {
        console.log('Quiz Finished', state.answers);
        
        // 1. Show Loader
        const loaderSection = document.getElementById('loader-section');
        const loaderText = document.getElementById('loader-text');
        if (loaderSection) {
            loaderSection.classList.remove('hidden');
            loaderSection.style.display = 'flex';
        }

        // 2. Calculate Results (Instant)
        const scores = calculateScores(state.answers);
        const reportHTML = generateReport(state.answers, scores);
        
        // Prepare Data for Google Sheet
        // We match the structure of the main site script for consistency
        const formData = new FormData();
        formData.append("name", state.answers.contact.name);
        formData.append("email", state.answers.contact.email);
        formData.append("phone", "'" + state.answers.contact.phoneCode + " " + state.answers.contact.phone);
        formData.append("business", state.answers.contact.business);
        
        // Map Root Cause Score (We use the max score as the "score" for the sheet)
        const maxScore = Math.max(scores.weakPositioning, scores.noBestsellers, scores.noSystems);
        formData.append("score", maxScore); 
        formData.append("profitLeak", 0); // Not calculated in this specific diagnostic, sending 0
        formData.append("answers", JSON.stringify(state.answers));
        
        // 3. Simulate Analysis Delay + Send Data
        let progressSteps = [
            "Identifying root causes...",
            "Analyze revenue structure...",
            "Comparing against Blue Ocean benchmarks...",
            "Generating verified report..."
        ];
        
        let step = 0;
        const interval = setInterval(() => {
            if(loaderText && step < progressSteps.length) {
                loaderText.textContent = progressSteps[step];
                step++;
            }
        }, 800);

        // Send to Google Sheet (Async)
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: formData,
            mode: "no-cors"
        })
        .then(() => {
            // Wait for at least the animation time
            setTimeout(() => {
                clearInterval(interval);
                completeQuiz(loaderSection, reportHTML);
            }, 3000); 
        })
        .catch((error) => {
            console.error("Sheet Error:", error);
            // Fallback: show result anyway
            setTimeout(() => {
                clearInterval(interval);
                completeQuiz(loaderSection, reportHTML);
            }, 3000);
        });
    }

    function completeQuiz(loader, reportHTML) {
        if(loader) {
            loader.style.display = 'none';
        }
        displayResults(reportHTML);
    }

    function calculateScores(answers) {
        let scores = {
            weakPositioning: 0,
            noBestsellers: 0,
            noSystems: 0
        };

        // --- Root Cause #1: Weak Positioning ---
        // Triggered if Q4 = "Unclear" or "Very unclear"
        if (answers.q4 === "Unclear" || answers.q4 === "Very unclear") {
            scores.weakPositioning++;
        }
        // Triggered if Q2 includes "Rising customer acquisition costs"
        // Note: we check strict string matches from HTML values
        if (answers.q2.includes("Rising CAC")) { 
            scores.weakPositioning++;
        }

        // --- Root Cause #2: No Clear Bestsellers ---
        // Triggered if Q5 = "Broad" or "Confused"
        if (answers.q5 === "Broad" || answers.q5 === "Confused") {
             scores.noBestsellers++;
        }
        // Triggered if Q6 = "Shrinking" or "Terrible"
        if (answers.q6 === "Shrinking" || answers.q6 === "Terrible") {
            scores.noBestsellers++;
        }
        // Triggered if Q2 includes "Overstock/dead inventory" or "Shrinking margins"
        if (answers.q2.includes("Overstock / dead inventory") || answers.q2.includes("Shrinking margins")) {
            scores.noBestsellers++;
        }

        // --- Root Cause #3: No Systems ---
        // Triggered if Q3 = "50-70" or "Over 70"
        if (answers.q3 === "50-70" || answers.q3 === "Over 70") {
            scores.noSystems++;
        }
        // Triggered if Q7 = "No" or "What systems?"
        if (answers.q7 === "No" || answers.q7 === "What systems?") {
            scores.noSystems++;
        }
        // Triggered if Q2 includes "Constant firefighting" or "Team waiting on you for every decision"
        if (answers.q2.includes("Firefighting") || answers.q2.includes("Bottleneck")) {
             scores.noSystems++;
        }
        
        return scores;
    }

    function generateReport(answers, scores) {
        // Step 1: Identify Primary Root Cause (Max Score)
        let primaryRootCause = "Weak Positioning"; // Default fallback
        let maxScore = -1;
        let secondaryRootCauses = [];

        // Find max score
        if (scores.weakPositioning > maxScore) {
            maxScore = scores.weakPositioning;
            primaryRootCause = "Weak Positioning";
        }
        if (scores.noBestsellers > maxScore) {
            maxScore = scores.noBestsellers;
            primaryRootCause = "No Clear Bestsellers";
        }
        if (scores.noSystems > maxScore) {
            maxScore = scores.noSystems;
            primaryRootCause = "No Systems";
        }
        
        // Identify Secondary Issues (2+ triggers)
        if (scores.weakPositioning >= 2 && primaryRootCause !== "Weak Positioning") secondaryRootCauses.push("Weak Positioning");
        if (scores.noBestsellers >= 2 && primaryRootCause !== "No Clear Bestsellers") secondaryRootCauses.push("No Clear Bestsellers");
        if (scores.noSystems >= 2 && primaryRootCause !== "No Systems") secondaryRootCauses.push("No Systems");

        // --- Build Content Sections ---
        
        // 1. Analysis Section (Specific to Primary Root Cause)
        let analysisText = "";
        if (primaryRootCause === "Weak Positioning") {
             analysisText = `<ul class="list-disc pl-5 mt-4 space-y-2 text-brand-white/80">
                ${(answers.q4 === "Unclear" || answers.q4 === "Very unclear") ? `<li>You mentioned your positioning is <strong>${answers.q4}</strong>. That's not a marketing problem—it's a positioning problem.</li>` : ''}
                ${answers.q2.includes("Rising CAC") ? `<li>You're facing <strong>rising customer acquisition costs</strong> (CAC). This happens when customers don't see a clear difference between you and competitors.</li>` : ''}
                ${(answers.q4 === "Somewhat clear" && answers.q6 === "Shrinking") ? `<li>Even though you feel your positioning is somewhat clear, your <strong>shrinking margins</strong> suggest customers are price-shopping you.</li>` : ''}
             </ul>`;
        } else if (primaryRootCause === "No Clear Bestsellers") {
            analysisText = `<ul class="list-disc pl-5 mt-4 space-y-2 text-brand-white/80">
                ${(answers.q5 === "Broad" || answers.q5 === "Confused") ? `<li>You mentioned you have a <strong>${answers.q5} product line</strong>. That's not a supply chain problem—it's a product focus problem.</li>` : ''}
                ${(answers.q2.includes("Overstock / dead inventory")) ? `<li>You're dealing with <strong>overstock</strong>. This is a classic symptom of having too many SKUs and no clear winners.</li>` : ''}
                ${(answers.q6 === "Shrinking" || answers.q6 === "Terrible") ? `<li>Your margins are <strong>${answers.q6}</strong>. This usually happens when resources are spread thin across underperforming products.</li>` : ''}
            </ul>`;
        } else if (primaryRootCause === "No Systems") {
             analysisText = `<ul class="list-disc pl-5 mt-4 space-y-2 text-brand-white/80">
                ${(answers.q3 === "50-70" || answers.q3 === "Over 70") ? `<li>You're working <strong>${answers.q3} hours per week</strong>. That's not a time management issue—it's a systems problem.</li>` : ''}
                ${(answers.q7 === "No" || answers.q7 === "What systems?") ? `<li>You stated that <strong>everything runs through you</strong>. You are the bottleneck.</li>` : ''}
                ${(answers.q2.includes("Firefighting")) ? `<li>You're constantly <strong>firefighting</strong> instead of thinking strategically.</li>` : ''}
            </ul>`;
        }
        
        // Fallback analysis if no specific triggers caught (rare but possible)
        if (!analysisText) {
             analysisText = `<p class="mt-4 text-brand-white/80">Based on your combination of answers, this is the area holding you back the most.</p>`;
        }

        // 2. Outcome Section
        let outcomeText = "";
        let caseStudyText = "";
        
        if (primaryRootCause === "Weak Positioning") {
            outcomeText = `<ul class="list-disc pl-5 space-y-2 text-brand-white/80">
                <li><strong class="text-brand-primary">Lower CAC:</strong> Customers seek you out instead of price-shopping.</li>
                <li><strong class="text-brand-primary">Higher conversion rates:</strong> 2-3x improvement.</li>
                <li><strong class="text-brand-primary">Premium pricing:</strong> Justified by clear value.</li>
                <li><strong class="text-brand-primary">Marketing becomes easier.</strong></li>
            </ul>`;
            
            caseStudyText = `<p class="italic text-brand-white/80">"A skincare brand was competing against 1,000 other 'natural skincare' brands. CAC was $85. Conversion rate was 1.2%. We repositioned them as 'skincare for women with hormonal acne and PCOS.' CAC dropped to $42. Conversion rate jumped to 3.8%. Same products. Different positioning."</p>`;
        } else if (primaryRootCause === "No Clear Bestsellers") {
             outcomeText = `<ul class="list-disc pl-5 space-y-2 text-brand-white/80">
                <li><strong class="text-brand-primary">80% of revenue</strong> comes from 20% of your products.</li>
                <li><strong class="text-brand-primary">Margins increase 20-40%</strong> by killing dead weight.</li>
                <li><strong class="text-brand-primary">Less overstock, better cash flow.</strong></li>
                <li><strong class="text-brand-primary">Supply chain becomes manageable.</strong></li>
            </ul>`;
            
            caseStudyText = `<p class="italic text-brand-white/80">"A supplements brand had 25 SKUs doing $8M in revenue. Margins were 28%. We identified 4 hero products, killed 15 underperformers, and focused all resources on the winners. Revenue stayed at $8M. Margins jumped to 48%. Cash flow improved instantly."</p>`;
        } else if (primaryRootCause === "No Systems") {
            outcomeText = `<ul class="list-disc pl-5 space-y-2 text-brand-white/80">
                <li><strong class="text-brand-primary">Team executes without you.</strong></li>
                <li><strong class="text-brand-primary">Your hours drop</strong> from 70+ to 35-40 per week.</li>
                <li><strong class="text-brand-primary">Business scales</strong> without you being the bottleneck.</li>
                <li><strong class="text-brand-primary">You stop firefighting.</strong></li>
            </ul>`;
            
            caseStudyText = `<p class="italic text-brand-white/80">"A home goods brand doing $6M was stuck. The founder was working 75-hour weeks. Every decision went through her. We built systems in 8 weeks. Her hours dropped to 35 per week. Revenue grew 40% in the next 6 months."</p>`;
        }

        // 3. Pain Points List
        const painPointsHTML = answers.q2.length > 0 
            ? `<ul class="list-disc pl-5 mt-4 space-y-2 text-brand-white/80">${answers.q2.map(p => `<li>${p}</li>`).join('')}</ul>`
            : `<p class="mt-4 text-brand-white/80">You identified specific operational challenges.</p>`;

        // 4. Secondary Issue Note
        const secondaryText = secondaryRootCauses.length > 0 
            ? `<div class="mt-8 p-4 bg-brand-white/5 border border-brand-white/10 rounded-lg">
                <p class="text-sm font-bold text-brand-orange uppercase mb-2">Secondary Issue Detected</p>
                <p class="text-brand-white/80">You're also showing strong signs of <strong>${secondaryRootCauses.join(" & ")}</strong>. We often fix this alongside the primary cause.</p>
               </div>`
            : "";

        // 5. Revenue Caveat
        const revenueCaveat = (answers.q1 === "Under $3M") 
            ? `<div class="mt-8 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
                <p class="font-bold text-brand-primary mb-2">Quick Note on Your Stage:</p>
                <p class="text-brand-white/90">You're at a stage where product-market fit is your main focus. The principles in this diagnostic still apply, but you might want to solidify your foundation first before diving into the 8-week program. Either way, let's talk and see if this is the right time.</p>
               </div>`
            : "";


        // --- HTML Construction ---
        return `
            <div class="animate-fadeIn">
                <h1 class="font-display text-4xl md:text-5xl font-bold mb-2">Your Root Cause:</h1>
                <h2 class="font-display text-5xl md:text-6xl font-bold text-brand-primary mb-8">${primaryRootCause}</h2>
                
                <div class="prose prose-invert prose-lg max-w-none text-brand-white/90">
                    <p class="text-xl">Hey ${answers.contact.name},</p>
                    <p>Thanks for taking the Root Cause Assessment. Based on your answers, I can see exactly what's breaking your business.</p>
                    
                    <hr class="border-white/10 my-8">
                    
                    <h3 class="text-2xl font-bold text-white mb-4">Here's why I'm confident:</h3>
                    ${analysisText}
                    ${secondaryText}

                    <hr class="border-white/10 my-8">

                    <h3 class="text-2xl font-bold text-white mb-4">What's happening right now:</h3>
                    <p class="text-brand-white/80">You identified these problems:</p>
                    ${painPointsHTML}
                    <p class="mt-4 font-bold text-brand-red">These aren't separate problems. They're all symptoms of ${primaryRootCause}.</p>

                    <hr class="border-white/10 my-8">

                    <h3 class="text-2xl font-bold text-white mb-4">Why your current fixes aren't working:</h3>
                    <p>You're treating symptoms, not the root cause. When you try to fix the symptoms of <strong>${primaryRootCause}</strong> without fixing the core issue, the problems just come back.</p>

                    <hr class="border-white/10 my-8">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-brand-white/5 p-6 rounded-xl border border-white/10">
                            <h3 class="text-xl font-bold text-brand-primary mb-4">What happens when you fix this:</h3>
                            ${outcomeText}
                        </div>
                        <div class="bg-brand-white/5 p-6 rounded-xl border border-white/10">
                            <h3 class="text-xl font-bold text-brand-white mb-4">Real Example:</h3>
                            ${caseStudyText}
                        </div>
                    </div>
                    
                    ${revenueCaveat}

                    <div class="mt-12">
                        <h3 class="text-2xl font-bold text-white mb-4">Your Next Step:</h3>
                        <p class="text-xl">I can fix this with you in 8 weeks.</p>
                        <p class="text-xl">Book a free 30-minute strategy call. I'll show you exactly how to fix <strong>${primaryRootCause}</strong> and what the 8-week process looks like.</p>
                    </div>
                </div>
            </div>
        `;
    }

    function displayResults(reportHTML) {
        // Hide assessment
        const assessmentSection = document.getElementById('assessment');
        assessmentSection.style.display = 'none';
        
        // Show results
        const resultsSection = document.getElementById('results-section');
        const reportContent = document.getElementById('report-content');
        
        reportContent.innerHTML = reportHTML;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});
