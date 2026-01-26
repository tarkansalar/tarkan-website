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

    function finishQuiz() {
        console.log('Quiz Finished', state.answers);
        alert("Assessment Completed! Submitting...");
        // This is where you would send data to backend or show results
    }
});
