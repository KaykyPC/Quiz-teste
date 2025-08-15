// Quiz de Carros - JavaScript Vanilla
class CarQuiz {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 2;
        this.answers = {};
        this.urlParams = new URLSearchParams(window.location.search);
        this.redirectUrl = this.urlParams.get('url') || '#';
        
        this.init();
    }

    init() {
        this.preloadImages();
        this.bindEvents();
        this.updateProgress();
        this.optimizeForMobile();
        
        // Inicializa com a primeira pergunta ativa
        this.showQuestion(1);
    }

    preloadImages() {
        // Pré-carrega a imagem do carro para melhor performance
        const carImage = new Image();
        carImage.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400&h=250';
    }

    optimizeForMobile() {
        // Otimizações específicas para mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'auto';
            
            // Previne zoom em inputs no iOS
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        }

        // Adiciona classe para touch devices
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }

    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('option-btn')) {
                e.target.click();
            }
        });

        // Otimização para touch devices
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('option-btn') || e.target.classList.contains('cta-button')) {
                e.target.style.transform = 'scale(0.98)';
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('option-btn') || e.target.classList.contains('cta-button')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 100);
            }
        }, { passive: true });

        // Resize handler otimizado
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.optimizeForMobile();
            }, 250);
        });
    }

    showQuestion(questionNumber) {
        const screens = document.querySelectorAll('.question-screen');
        const targetScreen = document.getElementById(`question${questionNumber}`);
        
        if (!targetScreen) return;

        // Remove active de todas as telas
        screens.forEach(screen => {
            screen.classList.remove('active');
            screen.style.opacity = '0';
        });

        // Mostra a tela alvo com transição suave
        setTimeout(() => {
            targetScreen.classList.add('active');
            targetScreen.style.opacity = '1';
            
            // Re-habilita botões da nova pergunta
            const buttons = targetScreen.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.style.background = 'var(--primary-color)';
                btn.style.transform = '';
            });
        }, 100);

        this.currentQuestion = questionNumber;
        this.updateProgress();
    }

    updateProgress() {
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            bar.style.width = `${progress}%`;
        });
    }

    handleAnswer(value, text) {
        const questionId = `question${this.currentQuestion}`;
        
        // Armazena a resposta
        this.answers[questionId] = {
            value: value,
            text: text
        };

        // Desabilita todos os botões da pergunta atual
        const currentScreen = document.querySelector('.question-screen.active');
        const buttons = currentScreen.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.getAttribute('data-value') === value) {
                btn.style.background = 'var(--primary-hover)';
                btn.style.transform = 'scale(0.98)';
            }
        });

        // Vibração em dispositivos móveis (se suportado)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Próxima pergunta ou resultado
        setTimeout(() => {
            if (this.currentQuestion < this.totalQuestions) {
                this.showQuestion(this.currentQuestion + 1);
            } else {
                this.showResult();
            }
        }, 600);
    }

    showResult() {
        // Esconde todas as telas de pergunta
        const screens = document.querySelectorAll('.question-screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
            screen.style.opacity = '0';
        });

        // Mostra a tela de resultado
        setTimeout(() => {
            const resultScreen = document.getElementById('result');
            resultScreen.classList.add('active');
            resultScreen.style.opacity = '1';
            
            this.populateResult();
        }, 300);

        // Atualiza progresso para 100%
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.style.width = '100%';
        });
    }

    populateResult() {
        const resultDetails = document.getElementById('resultDetails');
        if (!resultDetails) return;

        const priceRange = this.answers.question1?.text || 'Não informado';
        const monthlyPayment = this.answers.question2?.text || 'Não informado';

        resultDetails.innerHTML = `
            <div class="result-item">
                <strong>Faixa de preço escolhida:</strong><br>
                ${priceRange}
            </div>
            <div class="result-item">
                <strong>Valor mensal desejado:</strong><br>
                ${monthlyPayment}
            </div>
            <div class="result-item">
                <strong>Status:</strong><br>
                Pré-aprovado para financiamento
            </div>
        `;
    }

    handleRedirect() {
        // Adiciona os dados do quiz à URL de redirecionamento
        const params = new URLSearchParams();
        
        Object.keys(this.answers).forEach(key => {
            params.append(key, JSON.stringify(this.answers[key]));
        });

        if (this.redirectUrl && this.redirectUrl !== '#') {
            const separator = this.redirectUrl.includes('?') ? '&' : '?';
            window.location.href = `${this.redirectUrl}${separator}${params.toString()}`;
        } else {
            // Fallback - mostra os dados em um alert
            alert('Quiz concluído!\n\nDados coletados:\n' + JSON.stringify(this.answers, null, 2));
        }
    }

    // Métodos públicos para debugging
    getAnswers() {
        return this.answers;
    }

    restart() {
        this.currentQuestion = 1;
        this.answers = {};
        this.showQuestion(1);
        
        // Re-habilita todos os botões
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.background = 'var(--primary-color)';
            btn.style.transform = '';
        });
    }
}

// Funções globais para compatibilidade com onclick
let quizInstance;

function selectAnswer(value, text) {
    if (quizInstance) {
        quizInstance.handleAnswer(value, text);
    }
}

function handleRedirect() {
    if (quizInstance) {
        quizInstance.handleRedirect();
    }
}

// Inicialização otimizada
function initQuiz() {
    quizInstance = new CarQuiz();
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}

// Service Worker para cache (opcional - melhora performance)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker não disponível, continua normalmente
        });
    });
}

// Previne comportamentos indesejados em mobile
document.addEventListener('touchmove', (e) => {
    // Permite scroll normal, mas previne bounce em iOS
    if (e.target.closest('.quiz-container')) {
        e.preventDefault();
    }
}, { passive: false });

// Otimização para performance em dispositivos lentos
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    // Reduz animações em dispositivos com poucos cores
    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
}