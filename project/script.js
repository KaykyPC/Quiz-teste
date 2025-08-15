let currentStep = 1;
let quizData = {
    priceRange: '',
    monthlyPayment: ''
};

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (currentStep / 2) * 100;
    progressFill.style.width = percentage + '%';
}

function showStep(stepNumber) {
    const currentStepElement = document.querySelector('.question-step.active');
    const nextStepElement = document.getElementById('step' + stepNumber);
    
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.classList.add('exiting');
        
        setTimeout(() => {
            currentStepElement.classList.remove('exiting');
        }, 500);
    }
    
    setTimeout(() => {
        nextStepElement.classList.add('active');
    }, 100);
    
    currentStep = stepNumber;
    updateProgressBar();
}

function selectPriceRange(range) {
    quizData.priceRange = range;
    console.log('Faixa de preço selecionada:', range);
    
    setTimeout(() => {
        showStep(2);
    }, 300);
}

function selectMonthlyPayment(payment) {
    quizData.monthlyPayment = payment;
    console.log('Quiz completo:', quizData);
    
    // Aqui você pode adicionar a lógica para processar o resultado final
    alert('Quiz concluído! Dados: ' + JSON.stringify(quizData, null, 2));
}

// Inicializar a barra de progresso
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
});