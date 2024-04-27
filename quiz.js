var addingQuizBody = document.querySelector(".addingQuizBody");
var Quiz = document.querySelector(".Quiz");
var savedQuiz = document.getElementById('saved-quiz');
var answerQuiz = document.getElementById('answer-quiz');
var playingQuizContainer = document.querySelector('.playingQuizContainer');

var quizTitleElement = document.querySelector(".quizTitles");
var subTitleElement = document.querySelector(".subTitle");


function addNewQuestion() {
    var quizContainer = document.getElementById('quiz-container');
    var newQuestion = document.createElement('div');
    newQuestion.className = 'quizInput';
    newQuestion.innerHTML = `
        <div>
            <label for="question">Question:</label>
            <input type="text" class="question" required>
        </div>
        <div>
            <label for="choice-a">Correct Answer:</label>
            <input type="text" class="choice correct" required>
        </div>
        <div>
            <label for="choice-b">Question Choice :</label>
            <input type="text" class="choice" required>
        </div>
        <div>
            <label for="choice-c">Question Choice :</label>
            <input type="text" class="choice" required>
        </div>
        <div>
            <label for="choice-d">Question Choice :</label>
            <input type="text" class="choice" required>
        </div>
        <span class="delete"><i class='bx bx-x'></i></span>
    `;
    quizContainer.appendChild(newQuestion);

    // Attach event listener to the delete button of the new question
    var deleteButton = newQuestion.querySelector('.delete');
    deleteButton.addEventListener('click', function() {
        quizContainer.removeChild(newQuestion);
    });
}

function addQuiz(title, subTitle, quiz, answer) {
    var quizContainer = document.createElement('div');
    quizContainer.classList.add('quizContainer');

    var quizTitle = document.createElement('h1');
    quizTitle.classList.add('quizTitle');
    quizTitle.innerHTML = title;

    var quizSubtitle = document.createElement('p');
    quizSubtitle.textContent = subTitle;

    var playButton = document.createElement('button');
    playButton.addEventListener("click", function () {
        ShowQuizLet(quiz, answer);
    });
    var playIcon = document.createElement('i');
    playIcon.classList.add('bx', 'bx-play');
    playButton.appendChild(playIcon);

    var deleteButton = document.createElement('span');
    deleteButton.classList.add('deleteQuiz');
    deleteButton.addEventListener("click", function () {
        playingQuizContainer.removeChild(quizContainer);
        // Remove the quiz from localStorage
        var savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes')) || [];
        var index = savedQuizzes.findIndex(function(savedQuiz) {
            return savedQuiz.title === title && savedQuiz.subTitle === subTitle;
        });
        if (index !== -1) {
            savedQuizzes.splice(index, 1);
            localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
        }
    });
    var deleteIcon = document.createElement('i');
    deleteIcon.classList.add('bx', 'bxs-trash');
    deleteButton.appendChild(deleteIcon);

    quizContainer.appendChild(quizTitle);
    quizContainer.appendChild(quizSubtitle);
    quizContainer.appendChild(playButton);
    quizContainer.appendChild(deleteButton);

    playingQuizContainer.appendChild(quizContainer);
}

function ShowQuizLet(quiz, answer) {
    Quiz.style.display = "none";
    addingQuizBody.style.display = "block";
    savedQuiz.innerHTML = quiz;
    answerQuiz.innerHTML = answer;
}

function clearForm() {
    var questions = document.querySelectorAll('.question');
    var choices = document.querySelectorAll('.choice');
    
    // Reset all input fields
    questions.forEach(function(question) {
        question.value = '';
    });
    
    choices.forEach(function(choice) {
        choice.value = '';
    });
    quizTitleElement.innerHTML = "";
    subTitleElement.innerHTML = "";
}

function saveQuiz() {
    var questions = document.querySelectorAll('.question');
    var choices = document.querySelectorAll('.choice');

    // Shuffle the questions array
    var shuffledQuestions = shuffle(Array.from(questions));

    var quizHTML = '<ol>';
    var answerHTML = '<ol>';

    for (var i = 0; i < shuffledQuestions.length; i++) {
        var index = Array.from(questions).indexOf(shuffledQuestions[i]);
        var choicesForQuestion = [
            choices[index * 4].value,
            choices[index * 4 + 1].value,
            choices[index * 4 + 2].value,
            choices[index * 4 + 3].value
        ];

        // Shuffle the choices for each question
        var shuffledChoices = shuffle(choicesForQuestion);

        var questionNumber = i + 1; // Increment to get 1-based index

        quizHTML += `
            <li>
                <div>
                    <p>${questionNumber}. ${shuffledQuestions[i].value}</p>
                    <p>a. ${shuffledChoices[0]}</p>
                    <p>b. ${shuffledChoices[1]}</p>
                    <p>c. ${shuffledChoices[2]}</p>
                    <p>d. ${shuffledChoices[3]}</p>
                </div>
            </li>
        `;

        // Find the index of correct answer
        var correctIndex = index * 4;
        var correctChoice = choices[correctIndex].value;

        // Determine which choice is the correct answer
        var correctLetter = '';
        switch (shuffledChoices.indexOf(correctChoice)) {
            case 0:
                correctLetter = 'A';
                break;
            case 1:
                correctLetter = 'B';
                break;
            case 2:
                correctLetter = 'C';
                break;
            case 3:
                correctLetter = 'D';
                break;
            default:
                correctLetter = 'Unknown';
                break;
        }

        answerHTML += `
            <li>
                <div>
                    <p>${questionNumber}. ${shuffledQuestions[i].value}</p>
                    <p>Correct Answer: ${correctLetter}. ${correctChoice}</p>
                </div>
            </li>
        `;
    }

    quizHTML += '</ol>';
    answerHTML += '</ol>';

    var quizTitle = quizTitleElement.textContent.trim();
    var subTitle = subTitleElement.textContent.trim();

    if (quizTitle === "") {
        quizTitle = "Untitled";
    }

    if (subTitle === "") {
        subTitle = "Untitled";
    }

    addQuiz(quizTitle, subTitle, quizHTML, answerHTML);

    // Save the quiz data to localStorage
    var savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes')) || [];
    savedQuizzes.push({ title: quizTitle, subTitle: subTitle, quizHTML: quizHTML, answerHTML: answerHTML });
    localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
    
    // Clear the form fields
    clearForm();
}


// Function to shuffle an array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function ShowAnswer() {
    var savedQuiz = document.getElementById('saved-quiz');
    var answerQuiz = document.getElementById('answer-quiz');
    if (answerQuiz.style.display === "block") {
        savedQuiz.style.display = "block";
        answerQuiz.style.display = "none";
    } else {
        savedQuiz.style.display = "none";
        answerQuiz.style.display = "block";
    }
}

function exitQuiz() {
    Quiz.style.display = "block";
    addingQuizBody.style.display = "none";
    savedQuiz.innerHTML = '';
    answerQuiz.innerHTML = '';
}

// Function to validate the form before submission
function validateForm() {
    var form = document.getElementById("quiz-form");
    if (form.checkValidity()) {
        // If the form is valid, submit the form
        saveQuiz();
    } else {
        // If the form is invalid, display an error message or perform other actions
        alert("Please fill in all required fields.");
    }
}

// Add an event listener to the "Save Quiz" button
var saveButton = document.querySelector(".save");
saveButton.addEventListener("click", validateForm);

// Load saved quizzes when the page loads
window.addEventListener('load', function() {
    var savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes')) || [];
    savedQuizzes.forEach(function(savedQuiz) {
        addQuiz(savedQuiz.title, savedQuiz.subTitle, savedQuiz.quizHTML, savedQuiz.answerHTML);
    });
});
