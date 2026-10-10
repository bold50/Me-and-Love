const questions = [
    { q: "What is your biggest personal insecurity right now?", o: ["Finance & Career milestones", "Relationship security / fear of abandonment", "Intelligence and professional competence", "Social anxiety and blending in", "Body image and physical appearance"] },
    { q: "Which love language makes you feel the most secure and cherished?", o: ["Words of Affirmation (verbal praise/validation)", "Quality Time (undivided attention)", "Physical Touch (holding hands, hugs)", "Acts of Service (easing your daily burdens)", "Receiving Gifts (thoughtful tokens)"] },
    { q: "When we have a disagreement or tension, what is your instinctual reaction?", o: ["Talk it through immediately until it's completely resolved", "Take a few hours alone to process before speaking", "Shut down, withdraw emotionally, or become quiet", "Brush it off quickly and pretend everything is fine"] },
    { q: "What area of our future do you dream about or plan for the most?", o: ["Building financial freedom and career growth together", "Traveling, exploring new cultures, and adventure", "Creating a cozy, peaceful home environment", "Deepening our emotional maturity and mental bond"] },
    { q: "In what area do you wish we could connect even deeper?", o: ["Shared intellectual conversations and life goals", "Physical intimacy and spontaneous romance", "Simple, quiet presence without screen distractions", "Collaborating on creative or lifestyle projects"] },
    { q: "What is a hidden fear you rarely say out loud about yourself?", o: ["That I'm a burden to the people I love", "That I won't live up to my potential", "That I'll get left behind as life moves faster", "That I'm difficult to understand completely"] },
    { q: "What is your baseline attitude toward managing personal finance?", o: ["Strict saver—I get anxious when spending money", "Balanced—investing in stability but enjoying the present", "Spontaneous spender—experiences and comfort matter most right now", "Anxious observer—I tend to avoid looking at my accounts"] },
    { q: "Which trait from your childhood or family dynamic affects you the most today?", o: ["The pressure to always perform perfectly and succeed", "Needing frequent reassurance that I am valued and loved", "Being hyper-independent and keeping my problems to myself", "An inclination to avoid conflict or play the peacemaker"] },
    { q: "What is your absolute ultimate energy recharger after an exhausting week?", o: ["Total isolation, gaming, or reading alone at home", "A cozy movie or cooking night with just you", "Going out for dynamic social events or gatherings with friends", "Exploring nature, walking outdoors, or working out"] },
    { q: "What makes you feel unmatched respect and admiration from a partner?", o: ["When they notice and verbally acknowledge my hard work", "When they take my opinions seriously during difficult choices", "When they defend and support me in front of other people", "When they respect my boundaries and need for personal space"] },
    { q: "When you feel low or emotional distress, what is the best way I can help?", o: ["Listen to me vent without offering any unsolicited advice", "Give me space to sit alone until I am ready to converse", "Hold me tightly or sit beside me without talking", "Help me problem-solve and find a clear logical strategy"] },
    { q: "What is a major relationship milestone or bucket-list goal that matters deeply to you?", o: ["Co-owning a home styled uniquely to our taste", "Embarking on a long-term international trip together", "Building a shared investment or creative business project", "Reaching a state of complete emotional vulnerability without fear"] },
    { q: "What dynamic or habit irritates you the most in daily communication?", o: ["Passive-aggressive hints instead of direct phrasing", "Being interrupted or talked over during conversations", "Delayed text responses or general digital absence", "Feeling like my feelings are being dismissed as irrational"] },
    { q: "Which element of your personality do you feel is most misunderstood by others?", o: ["My quietness—people assume I'm bored or upset when I'm just thinking", "My humor—people miss when I am being serious", "My intense drive—people confuse my high focus with coldness", "My sensitivity—people think minor hurdles defeat me completely"] }
];

let appState = {
    currentUser: null,
    currentQuestionIndex: 0,
    answers: { 'User 1': null, 'User 2': null }
};

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const p1Data = urlParams.get('p1');
    const p2Data = urlParams.get('p2');

    if (p1Data) {
        try { appState.answers['User 1'] = JSON.parse(atob(p1Data)); } catch(e) { console.error("Error reading Partner 1 data:", e); }
    }
    if (p2Data) {
        try { appState.answers['User 2'] = JSON.parse(atob(p2Data)); } catch(e) { console.error("Error reading Partner 2 data:", e); }
    }
}

function updateLandingStatus() {
    const u1Done = appState.answers['User 1'] && Object.keys(appState.answers['User 1']).length === questions.length;
    const u2Done = appState.answers['User 2'] && Object.keys(appState.answers['User 2']).length === questions.length;

    const s1 = document.getElementById('status-u1');
    const s2 = document.getElementById('status-u2');
    
    s1.className = u1Done ? 'badge badge-complete' : 'badge badge-pending';
    s1.innerText = u1Done ? 'Answers Loaded 🔒' : 'Waiting...';

    s2.className = u2Done ? 'badge badge-complete' : 'badge badge-pending';
    s2.innerText = u2Done ? 'Answers Loaded 🔒' : 'Waiting...';

    const shareSection = document.getElementById('share-section');
    if ((u1Done && !u2Done) || (!u1Done && u2Done)) {
        shareSection.style.display = 'block';
    } else {
        shareSection.style.display = 'none';
    }

    document.getElementById('reveal-btn').disabled = !(u1Done && u2Done);
}

function startQuiz(user) {
    appState.currentUser = user;
    appState.currentQuestionIndex = 0;
    if (!appState.answers[user]) appState.answers[user] = {};
    switchPage('quiz-page');
    renderQuestion();
}

function renderQuestion() {
    const qData = questions[appState.currentQuestionIndex];
    document.getElementById('current-user-tag').innerText = `Answering as: ${appState.currentUser === 'User 1' ? 'Partner 1' : 'Partner 2'}`;
    document.getElementById('question-text').innerText = `${appState.currentQuestionIndex + 1}. ${qData.q}`;
    
    const optionsDiv = document.getElementById('options-container');
    optionsDiv.innerHTML = '';
    
    qData.o.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerText = option;
        btn.onclick = () => handleAnswer(idx);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('progress-text').innerText = `Question ${appState.currentQuestionIndex + 1} of ${questions.length}`;
    document.getElementById('progress-fill').style.width = `${((appState.currentQuestionIndex + 1) / questions.length) * 100}%`;
}

function handleAnswer(selectedIndex) {
    appState.answers[appState.currentUser][appState.currentQuestionIndex] = selectedIndex;

    if (appState.currentQuestionIndex < questions.length - 1) {
        appState.currentQuestionIndex++;
        renderQuestion();
    } else {
        switchPage('landing-page');
        updateLandingStatus();
        generateShareLink();
    }
}

function generateShareLink() {
    const baseUrl = window.location.origin + window.location.pathname;
    let params = new URLSearchParams();

    if (appState.answers['User 1']) {
        params.set('p1', btoa(JSON.stringify(appState.answers['User 1'])));
    }
    if (appState.answers['User 2']) {
        params.set('p2', btoa(JSON.stringify(appState.answers['User 2'])));
    }

    const shareUrl = `${baseUrl}?${params.toString()}`;
    document.getElementById('share-url-input').value = shareUrl;
}

function copyLink() {
    const copyText = document.getElementById('share-url-input');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.innerText = "Copied! 🎉";
    setTimeout(() => { copyBtn.innerText = "Copy Connection Link 📋"; }, 2000);
}

function revealResults() {
    switchPage('results-page');
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    questions.forEach((qData, index) => {
        const idx1 = appState.answers['User 1'][index];
        const idx2 = appState.answers['User 2'][index];
        
        const ans1 = qData.o[idx1];
        const ans2 = qData.o[idx2];
        const isMatch = idx1 === idx2;

        const block = document.createElement('div');
        block.className = 'result-block';
        block.innerHTML = `
            <div class="result-q">${index + 1}. ${qData.q}</div>
            <div class="answer-row ${isMatch ? 'match' : 'differ'}">
                <strong>Partner 1:</strong> ${ans1}
            </div>
            <div class="answer-row ${isMatch ? 'match' : 'differ'}">
                <strong>Partner 2:</strong> ${ans2}
            </div>
        `;
        container.appendChild(block);
    });
}

function switchPage(pageId) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showLanding() { switchPage('landing-page'); updateLandingStatus(); }

function resetQuiz() {
    if(confirm("Are you sure you want to completely restart?")) {
        window.location.href = window.location.origin + window.location.pathname;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkUrlParams();
    updateLandingStatus();
});
