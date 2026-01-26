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
            q8: null
        }
    };

    // DOM Elements
    const questions = document.querySelectorAll('.quiz-question');
    const nextBtns = document.querySelectorAll('.next-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentStepDisplay = document.getElementById('current-step');

    // Initialize
    updateUI();

    // Event Listeners for Single Select Options
    document.querySelectorAll('.single-select-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const questionId = e.target.closest('.quiz-question').dataset.id;
            const value = e.target.dataset.value;
            
            // Highlight selected
            const siblings = e.target.parentNode.children;
            for (let sib of siblings) {
                sib.classList.remove('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
                sib.classList.add('border-white/30', 'text-brand-white/80');
            }
            e.target.classList.add('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
            e.target.classList.remove('border-white/30', 'text-brand-white/80');

            // Save answer
            state.answers[questionId] = value;

            // Auto-advance after short delay
            setTimeout(() => {
                nextQuestion();
            }, 400);
        });
    });

    // Event Listeners for Multi Select Options (Question 2)
    document.querySelectorAll('.multi-select-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const value = e.target.dataset.value;
            const isSelected = e.target.classList.contains('selected');

            if (isSelected) {
                e.target.classList.remove('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
                e.target.classList.add('border-white/30', 'text-brand-white/80');
                // Remove from array
                state.answers.q2 = state.answers.q2.filter(item => item !== value);
            } else {
                e.target.classList.add('selected', 'border-brand-primary', 'bg-brand-primary/10', 'text-brand-primary');
                e.target.classList.remove('border-white/30', 'text-brand-white/80');
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

    // Functions
    function nextQuestion() {
        if (state.currentQuestion < questions.length - 1) {
            state.currentQuestion++;
            updateUI();
        } else {
            finishQuiz();
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
        if(currentStepDisplay) {
            currentStepDisplay.textContent = state.currentQuestion + 1;
        }
        
        // Scroll to top of assessment container
        const assessmentContainer = document.getElementById('assessment-container');
        if(assessmentContainer) {
             assessmentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function finishQuiz() {
        console.log('Quiz Finished', state.answers);
        alert("Assessment Completed! Logic to be implemented.");
        // Here we will eventually trigger the result logic
    }
});
