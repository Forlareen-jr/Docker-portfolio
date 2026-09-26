/* =========================================================
   CLOUD OPS CHALLENGE
   Interactive Cloud & DevOps Quiz
   ========================================================= */


/* =========================================================
   QUESTION BANK
   ========================================================= */

const challenges = [

    {
        category: "CLOUD COMPUTE",
        question:
            "Which cloud resource provides scalable compute capacity for running applications?",
        answers: [
            "Storage Account",
            "Virtual Machine",
            "Virtual Network",
            "Load Balancer"
        ],
        correct: "Virtual Machine"
    },

    {
        category: "CLOUD STORAGE",
        question:
            "Which service is primarily designed to store large amounts of unstructured data?",
        answers: [
            "Load Balancer",
            "Virtual Network",
            "Object Storage",
            "DNS Server"
        ],
        correct: "Object Storage"
    },

    {
        category: "NETWORKING",
        question:
            "What component provides an isolated network environment for cloud resources?",
        answers: [
            "Object Storage",
            "Container Image",
            "Database",
            "Virtual Network"
        ],
        correct: "Virtual Network"
    },

    {
        category: "LOAD BALANCING",
        question:
            "What is the primary purpose of a load balancer?",
        answers: [
            "Store files",
            "Distribute traffic across resources",
            "Create containers",
            "Encrypt passwords"
        ],
        correct: "Distribute traffic across resources"
    },

    {
        category: "CONTAINERS",
        question:
            "What technology packages an application and its dependencies into isolated units?",
        answers: [
            "DNS",
            "FTP",
            "Docker",
            "SSH"
        ],
        correct: "Docker"
    },

    {
        category: "DOCKER",
        question:
            "What is a Docker image?",
        answers: [
            "A physical server",
            "A network cable",
            "A database table",
            "A template used to create containers"
        ],
        correct: "A template used to create containers"
    },

    {
        category: "DOCKER COMPOSE",
        question:
            "What is Docker Compose primarily used for?",
        answers: [
            "Defining and running multi-container applications",
            "Editing Linux kernels",
            "Creating virtual machines",
            "Managing DNS records"
        ],
        correct: "Defining and running multi-container applications"
    },

    {
        category: "WEB SERVERS",
        question:
            "What is Nginx commonly used for?",
        answers: [
            "Container creation",
            "Web serving and reverse proxying",
            "Cloud billing",
            "Disk formatting"
        ],
        correct: "Web serving and reverse proxying"
    },

    {
        category: "LINUX",
        question:
            "Why is Alpine Linux commonly used for lightweight containers?",
        answers: [
            "It requires a GUI",
            "It only runs Windows software",
            "It has a very small footprint",
            "It requires a dedicated server"
        ],
        correct: "It has a very small footprint"
    },

    {
        category: "DOCKER BASICS",
        question:
            "What happens when you run a Docker container from an image?",
        answers: [
            "The image is deleted",
            "The host operating system is replaced",
            "Docker is uninstalled",
            "A running container is created from that image"
        ],
        correct: "A running container is created from that image"
    }

];


/* =========================================================
   GAME STATE
   ========================================================= */

let currentQuestion = 0;

let score = 0;

let streak = 0;

let bestStreak = 0;

let correctAnswers = 0;

let answered = false;


/*
   Stores the shuffled answers for the question currently
   being displayed.
*/
let currentAnswers = [];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const questionElement =
    document.getElementById("question");

const questionNumberElement =
    document.getElementById("question-number");

const progressBar =
    document.getElementById("progress-bar");

const progressText =
    document.getElementById("progress-text");

const answersContainer =
    document.getElementById("answers");

const feedbackElement =
    document.getElementById("feedback");

const nextButton =
    document.getElementById("next-btn");

const scoreElement =
    document.getElementById("score");

const sideScoreElement =
    document.getElementById("side-score");

const sideCorrectElement =
    document.getElementById("side-correct");

const sideStreakElement =
    document.getElementById("side-streak");

const streakElement =
    document.getElementById("streak");

const startGameButton =
    document.getElementById("start-game");

const restartGameButton =
    document.getElementById("restart-game");

const resultsSection =
    document.getElementById("results");

const finalScore =
    document.getElementById("final-score");

const finalCorrect =
    document.getElementById("final-correct");

const finalAccuracy =
    document.getElementById("final-accuracy");

const finalStreak =
    document.getElementById("final-streak");

const resultMessage =
    document.getElementById("result-message");

const challengeSection =
    document.getElementById("challenge");

const questionCategory =
    document.querySelector(".question-category");


/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */


/*
   Fisher-Yates shuffle.

   This randomly rearranges an array so the correct answer
   does not always appear in the same position.
*/
function shuffle(array) {

    const shuffled =
        [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}


/*
   Scrolls smoothly to an element.
*/
function scrollToElement(element) {

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   UPDATE GAME STATISTICS
   ========================================================= */

function updateStats() {

    /*
       Main XP display
    */
    if (scoreElement) {
        scoreElement.textContent = score;
    }


    /*
       Sidebar XP
    */
    if (sideScoreElement) {
        sideScoreElement.textContent = score;
    }


    /*
       Correct answers
    */
    if (sideCorrectElement) {

        sideCorrectElement.textContent =
            `${correctAnswers}/${challenges.length}`;
    }


    /*
       Best streak
    */
    if (sideStreakElement) {
        sideStreakElement.textContent = bestStreak;
    }


    /*
       Current streak
    */
    if (streakElement) {

        streakElement.textContent =
            `🔥 Streak: ${streak}`;
    }
}


/* =========================================================
   LOAD QUESTION
   ========================================================= */

function loadChallenge() {

    answered = false;


    const challenge =
        challenges[currentQuestion];


    /*
       Randomize the answers.

       Each answer becomes an object containing:
       - text
       - isCorrect
    */
    currentAnswers =
        shuffle(
            challenge.answers.map(answer => ({
                text: answer,
                isCorrect:
                    answer === challenge.correct
            }))
        );


    /*
       Question text
    */
    questionElement.textContent =
        challenge.question;


    /*
       Category
    */
    if (questionCategory) {

        questionCategory.textContent =
            challenge.category;
    }


    /*
       Question number
    */
    questionNumberElement.textContent =
        String(currentQuestion + 1)
            .padStart(2, "0");


    /*
       Progress
    */
    const progress =
        Math.round(
            ((currentQuestion + 1) /
                challenges.length) * 100
        );


    progressBar.style.width =
        `${progress}%`;


    progressText.textContent =
        `${progress}%`;


    /*
       Reset feedback
    */
    feedbackElement.textContent = "";

    feedbackElement.className =
        "feedback";


    /*
       Disable NEXT until an answer
       has been selected.
    */
    nextButton.disabled = true;


    nextButton.innerHTML =
        currentQuestion === challenges.length - 1
            ? `FINISH <span>✓</span>`
            : `NEXT <span>→</span>`;


    /*
       Clear old answers
    */
    answersContainer.innerHTML = "";


    /*
       Generate the shuffled answers
    */
    currentAnswers.forEach(
        (answer, index) => {

            const button =
                document.createElement("button");


            button.className =
                "answer";


            button.dataset.index =
                index;


            const letter =
                String.fromCharCode(
                    65 + index
                );


            button.innerHTML = `
                <span class="answer-letter">
                    ${letter}
                </span>

                <span>
                    ${answer.text}
                </span>
            `;


            button.addEventListener(
                "click",
                () => selectAnswer(index)
            );


            answersContainer.appendChild(
                button
            );
        }
    );


    /*
       Update dashboard
    */
    updateStats();
}


/* =========================================================
   SELECT ANSWER
   ========================================================= */

function selectAnswer(index) {

    /*
       Prevent multiple selections.
    */
    if (answered) {
        return;
    }


    answered = true;


    const selectedAnswer =
        currentAnswers[index];


    const buttons =
        document.querySelectorAll(".answer");


    /*
       Disable every answer after selection.
    */
    buttons.forEach(button => {

        button.classList.add(
            "disabled"
        );
    });


    /*
       CORRECT ANSWER
    */
    if (selectedAnswer.isCorrect) {

        buttons[index]
            .classList.add("correct");


        /*
           Increase streak.
        */
        streak++;


        /*
           Track correct answers.
        */
        correctAnswers++;


        /*
           Update best streak.
        */
        if (streak > bestStreak) {

            bestStreak =
                streak;
        }


        /*
           XP calculation.

           First correct answer:
           100 XP

           Second consecutive:
           125 XP

           Third consecutive:
           150 XP

           etc.
        */
        const streakBonus =
            (streak - 1) * 25;


        const earnedXP =
            100 + streakBonus;


        score += earnedXP;


        /*
           Feedback
        */
        feedbackElement.textContent =
            `✓ Correct! +${earnedXP} XP`;


        feedbackElement.classList.add(
            "correct"
        );


    } else {

        /*
           Mark selected answer as wrong.
        */
        buttons[index]
            .classList.add("wrong");


        /*
           Find and highlight the correct answer.
        */
        currentAnswers.forEach(
            (answer, answerIndex) => {

                if (answer.isCorrect) {

                    buttons[answerIndex]
                        .classList.add(
                            "correct"
                        );
                }
            }
        );


        /*
           Reset streak after incorrect answer.
        */
        streak = 0;


        /*
           Feedback
        */
        feedbackElement.textContent =
            `✕ Incorrect. The correct answer is "${currentAnswers.find(answer => answer.isCorrect).text}".`;


        feedbackElement.classList.add(
            "wrong"
        );
    }


    /*
       Update all score displays.
    */
    updateStats();


    /*
       Enable NEXT.
    */
    nextButton.disabled = false;
}


/* =========================================================
   NEXT QUESTION
   ========================================================= */

function nextChallenge() {

    /*
       Do nothing if the user has
       not answered yet.
    */
    if (!answered) {
        return;
    }


    /*
       More questions remain.
    */
    if (
        currentQuestion <
        challenges.length - 1
    ) {

        currentQuestion++;


        loadChallenge();


        scrollToElement(
            challengeSection
        );


    } else {

        /*
           No more questions.
           Show final results.
        */
        showResults();
    }
}


/* =========================================================
   SHOW RESULTS
   ========================================================= */

function showResults() {

    const accuracy =
        Math.round(
            (correctAnswers /
                challenges.length) * 100
        );


    /*
       Final score
    */
    finalScore.textContent =
        score;


    /*
       Correct answers
    */
    finalCorrect.textContent =
        `${correctAnswers}/${challenges.length}`;


    /*
       Accuracy
    */
    finalAccuracy.textContent =
        `${accuracy}%`;


    /*
       Best streak
    */
    finalStreak.textContent =
        bestStreak;


    /*
       Performance message
    */
    if (accuracy === 100) {

        resultMessage.textContent =
            "Perfect run. Your cloud knowledge is operating at full capacity.";

    } else if (accuracy >= 80) {

        resultMessage.textContent =
            "Excellent performance. Your Cloud Ops fundamentals are looking strong.";

    } else if (accuracy >= 60) {

        resultMessage.textContent =
            "Solid performance. Keep sharpening your cloud and DevOps knowledge.";

    } else if (accuracy >= 40) {

        resultMessage.textContent =
            "Good start. Review the fundamentals and run the challenge again.";

    } else {

        resultMessage.textContent =
            "The mission exposed some knowledge gaps. Keep learning and try again.";
    }


    /*
       Display results.
    */
    resultsSection.classList.remove(
        "hidden"
    );


    /*
       Scroll to results.
    */
    scrollToElement(
        resultsSection
    );
}


/* =========================================================
   START / RESTART GAME
   ========================================================= */

function startGame() {

    /*
       Reset everything.
    */
    currentQuestion = 0;

    score = 0;

    streak = 0;

    bestStreak = 0;

    correctAnswers = 0;

    answered = false;


    /*
       Hide previous results.
    */
    resultsSection.classList.add(
        "hidden"
    );


    /*
       Load first question.
    */
    loadChallenge();


    /*
       Scroll to game.
    */
    scrollToElement(
        challengeSection
    );
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */


/*
   NEXT button
*/
nextButton.addEventListener(
    "click",
    nextChallenge
);


/*
   START button
*/
startGameButton.addEventListener(
    "click",
    startGame
);


/*
   RESTART button
*/
restartGameButton.addEventListener(
    "click",
    startGame
);


/* =========================================================
   NAVIGATION
   ========================================================= */

const navLinks =
    document.querySelectorAll(".nav-link");


navLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            navLinks.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            link.classList.add(
                "active"
            );
        }
    );
});


/* =========================================================
   ACTIVE NAVIGATION WHILE SCROLLING
   ========================================================= */

const sections = [
    document.getElementById("home"),
    document.getElementById("challenge"),
    document.getElementById("architecture"),
    document.getElementById("tech-stack")
];


window.addEventListener(
    "scroll",
    () => {

        const scrollPosition =
            window.scrollY + 150;


        sections.forEach(
            section => {

                if (!section) {
                    return;
                }


                const sectionTop =
                    section.offsetTop;

                const sectionBottom =
                    sectionTop +
                    section.offsetHeight;


                if (
                    scrollPosition >= sectionTop &&
                    scrollPosition < sectionBottom
                ) {

                    navLinks.forEach(
                        link =>
                            link.classList.remove(
                                "active"
                            )
                    );


                    const matchingLink =
                        document.querySelector(
                            `.nav-link[href="#${section.id}"]`
                        );


                    if (matchingLink) {

                        matchingLink.classList.add(
                            "active"
                        );
                    }
                }
            }
        );
    }
);


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */


/*
   Allow ENTER or SPACE to advance after
   answering a question.
*/
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            if (
                !nextButton.disabled &&
                document.activeElement.tagName !== "BUTTON"
            ) {

                nextChallenge();
            }
        }
    }
);


/* =========================================================
   INITIALIZE GAME
   ========================================================= */

loadChallenge();
