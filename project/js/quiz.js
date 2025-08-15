class Quiz {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 2;
        this.answers = {};
        this.urlParams = new URLSearchParams(window.location.search);
        this.redirectUrl = this.urlParams.get('url');
        this.init();
    }

    init() {
        this.preloadImages();
        this.bindEvents();
        this.showQuestion(1);
        this.optimizeForMobile();
    }

    preloadImages() {
        // Pré-carrega imagens para melhor performance
        const images = [QUIZ_CONFIG.assets.flagImage, QUIZ_CONFIG.assets.carImage];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    optimizeForMobile() {
        // Otimizações específicas para mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'auto';
            // Previne zoom em inputs no iOS
            document.addEventListener('touchstart', {}, true);
        }
    }

    bindEvents() {
        // Event delegation para melhor performance
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.handleAnswer(e.target);
            } else if (e.target.classList.contains('cta-button')) {
                this.handleRedirect();
            }
        });

        // Otimização para touch devices
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('option-btn')) {
                e.target.style.transform = 'scale(0.98)';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('option-btn')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 100);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('option-btn')) {
                this.handleAnswer(e.target);
            }
        });
    }

    handleAnswer(button) {
        // Previne múltiplos cliques
        if (button.disabled) return;
        
        const value = button.getAttribute('data-value');
        const questionId = `question${this.currentQuestion}`;
        
        // Desabilita todos os botões da pergunta atual
        const currentScreen = document.querySelector('.question-screen.active');
        const buttons = currentScreen.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Armazena a resposta
        this.answers[questionId] = {
            value: value,
            text: button.textContent.trim()
        };

        // Feedback visual otimizado
        button.style.background = QUIZ_CONFIG.colors.primaryHover;
        button.style.transform = 'scale(0.98)';
        
        // Vibração em dispositivos móveis (se suportado)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Transição suave
        setTimeout(() => {
            this.nextQuestion();
        }, QUIZ_CONFIG.behavior.buttonClickDelay);
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        } else {
            this.handleRedirect();
        }
    }

    showQuestion(questionNumber) {
        // Transição suave entre perguntas
        const currentActive = document.querySelector('.question-screen.active');
        const nextScreen = document.getElementById(`question${questionNumber}`);
        
        if (currentActive) {
            currentActive.style.opacity = '0';
            setTimeout(() => {
                currentActive.classList.remove('active');
                nextScreen.classList.add('active');
                nextScreen.style.opacity = '0';
                setTimeout(() => {
                    nextScreen.style.opacity = '1';
                }, 50);
            }, QUIZ_CONFIG.behavior.transitionDelay);
        } else {
            nextScreen.classList.add('active');
            nextScreen.style.opacity = '1';
        }

        // Atualiza barra de progresso com animação
        this.updateProgress(questionNumber);
        
        // Re-habilita botões da nova pergunta
        setTimeout(() => {
            const buttons = nextScreen.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.style.background = QUIZ_CONFIG.colors.primary;
                btn.style.transform = '';
            });
        }, QUIZ_CONFIG.behavior.transitionDelay + 100);
    }

    updateProgress(questionNumber) {
        const progress = (questionNumber / this.totalQuestions) * 100;
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            bar.style.transition = `width ${QUIZ_CONFIG.behavior.progressAnimationDuration}ms ease`;
            bar.style.width = `${progress}%`;
        });
    }


    // Método para obter respostas (útil para debugging)
    getAnswers() {
        return this.answers;
    }

    // Método para reiniciar o quiz (útil para testes)
    restart() {
        this.currentQuestion = 1;
        this.answers = {};
        this.showQuestion(1);
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.background = QUIZ_CONFIG.colors.primary;
            btn.style.transform = '';
        });
    }
}

// Inicialização otimizada
let quiz;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        quiz = new Quiz();
    });
} else {
    quiz = new Quiz();
}

// Otimizações para performance
window.addEventListener('resize', debounce(() => {
    if (quiz) {
        quiz.optimizeForMobile();
    }
}, 250));

// Função debounce para otimizar eventos de resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}