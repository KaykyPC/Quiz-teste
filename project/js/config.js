// Configurações do Quiz - Facilita alterações futuras
const QUIZ_CONFIG = {
    // Textos
    texts: {
        header: {
            logoImage: "images/logo.png", // Sua logo PNG
            logoAlt: "Logo"
        },
        question1: {
            title: "Voitures disponibles sans acompte",
            subtitle: "Choisissez une valeur pour voir les mensualités",
            question: "Quelle est la gamme de prix de la voiture que vous souhaitez acheter ?",
            options: [
                { value: "5000-15000", text: "5 000€ à 15 000€" },
                { value: "15000-25000", text: "15 000€ à 25 000€" }
            ]
        },
        question2: {
            title: "Financement personnalisé",
            subtitle: "Nous allons trouver la meilleure option pour vous",
            question: "Quel est votre revenu mensuel approximatif ?",
            options: [
                { value: "2000-5000", text: "2 000€ à 5 000€" },
                { value: "5000+", text: "Plus de 5 000€" }
            ]
        },
        result: {
            title: "Félicitations ! Nous avons trouvé des options pour vous !",
            subtitle: "Basé sur vos réponses, nous avons les meilleures conditions de financement.",
            cardTitle: "Vos options de financement :",
            ctaButton: "Demander une Proposition"
        }
    },
    
    // Cores - Facilita mudanças de tema
    colors: {
        primary: "#1E3A8A",
        primaryHover: "#1E40AF",
        secondary: "#0F172A",
        gradient: {
            header: "linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%)",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            leftSection: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
            button: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
            progress: "linear-gradient(90deg, #1E3A8A, #3B82F6)"
        }
    },
    
    // Configurações de comportamento
    behavior: {
        transitionDelay: 300, // ms
        progressAnimationDuration: 300, // ms
        buttonClickDelay: 400 // ms
    },
    
    // URLs e imagens
    assets: {
        flagImage: "images/france-flag.png",
        carImage: "images/car.png"
    }
};