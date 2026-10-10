const questions = [
    {
        q: "What is your biggest personal insecurity right now?",
        a: ["Finance & Career milestones", "Relationship security / fear of abandonment", "Intelligence and professional competence", "Social anxiety and blending in", "Body image and physical appearance"]
    },
    {
        q: "Which love language makes you feel the most secure and cherished?",
        a: ["Words of Affirmation (verbal praise/validation)", "Quality Time (undivided attention)", "Physical Touch (holding hands, hugs)", "Acts of Service (easing your daily burdens)", "Receiving Gifts (thoughtful tokens)"]
    },
    {
        q: "When we have a disagreement or tension, what is your instinctual reaction?",
        a: ["Talk it through immediately until it's completely resolved", "Take a few hours alone to process before speaking", "Shut down, withdraw emotionally, or become quiet", "Brush it off quickly and pretend everything is fine"]
    },
    {
        q: "What area of our future do you dream about or plan for the most?",
        a: ["Building financial freedom and career growth together", "Traveling, exploring new cultures, and adventure", "Creating a cozy, peaceful home environment", "Deepening our emotional maturity and mental bond"]
    },
    {
        q: "In what area do you wish we could connect even deeper?",
        a: ["Shared intellectual conversations and life goals", "Physical intimacy and spontaneous romance", "Simple, quiet presence without screen distractions", "Collaborating on creative or lifestyle projects"]
    },
    {
        q: "What is a hidden fear you rarely say out loud about yourself?",
        a: ["That I'm a burden to the people I love", "That I won't live up to my potential", "That I'll get left behind as life moves faster", "That I'm difficult to understand completely"]
    }
];

let currentQuestionIndex = 0;
let myAnswers = [];
let partnerAnswers = [];
let isPartnerMode = false;

// Run checking setup instantly as file reads
const urlParams = new URLSearchParams(window.location.search);
const partnerData = urlParams.get('p');
if (partnerData) {
    try {
        partnerAnswers = JSON.parse(atob(partnerData));
        isPartnerMode = true;
        // Defer changing text elements until window finishes loading safely
        window.addEventListener('DOMContentLoaded', () => {
            document.getElementById('welcome-title').innerText = "Your Partner Has Challenged You! 💕";
            document.getElementById('welcome-desc').innerText = "Your partner has completed the quiz! Answer the questions yourself to instantly unlock both of your results side-by-side.";
        });
    } catch(e) {
        console.error("Link reading error.");
    }
}

function startQuiz() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const qData = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = `${currentQuestionIndex + 1}. ${qData.q}`;
    
    const percent = (currentQuestionIndex / questions.length) * 100;
    document.getElementById('progress').style.width = percent + '%';

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    qData.a.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = function() { selectOption(idx); };
        container.appendChild(btn);
    });
}

function selectOption(index) {
    myAnswers.push(index);
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    document.getElementById('question-screen').classList.add('hidden');
    if (isPartnerMode) {
        document.getElementById('reveal-screen').classList.remove('hidden');
        renderComparison();
    } else {
        document.getElementById('share-screen').classList.remove('hidden');
        const encryptedAnswers = btoa(JSON.stringify(myAnswers));
        const shareLink = window.location.href.split('?')[0] + '?p=' + encryptedAnswers;
        document.getElementById('share-url').value = shareLink;
    }
}

function renderComparison() {
    const container = document.getElementById('comparison-results');
    container.innerHTML = '';

    questions.forEach((qData, idx) => {
        const myChoiceText = qData.a[myAnswers[idx]];
        const partnerChoiceText = qData.a[partnerAnswers[idx]];
        const isMatch = myAnswers[idx] === partnerAnswers[idx];

        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${isMatch ? 'match' : 'diff'}`;
        
        resultItem.innerHTML = `
            <strong>Question ${idx + 1}: ${qData.q}</strong>
            <div class="result-answers">
                <div><span class="badge badge-partner">Partner</span> ${partnerChoiceText}</div>
                <div><span class="badge badge-you">You</span> ${myChoiceText}</div>
            </div>
        `;
        container.appendChild(resultItem);
    });
}

function copyLink() {
    const copyText = document.getElementById('share-url');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Magic Link Copied! Send it to your girlfriend now. 💕");
}
