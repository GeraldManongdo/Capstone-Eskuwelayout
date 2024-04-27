var aiChatContainer = document.querySelector(".aiChatContainer");
var todoContainer = document.querySelector(".todoContainer");
var notesBodyContainer = document.querySelector(".notesBodyContainer");
var calendarSection = document.querySelector(".calendarSection");
var quizSection = document.querySelector(".quizSection");
var addingNotesBody = document.querySelector(".addingNotesBody");
var navbar = document.querySelector(".navbar");
var settingContainer = document.querySelector(".settingContainer");
var UserSettings = document.querySelector(".UserSettings");
var aboutUs = document.querySelector(".aboutUs");
var addingQuizContainer = document.querySelector(".addingQuizContainer");



function showAiChatNavigation() {
    if (aiChatContainer.style.display === "none" || aiChatContainer.style.display === "" || todoContainer.style.display === "block") {
        aiChatContainer.style.display = "block";
        todoContainer.style.display = "none"; 
        addingQuizContainer.style.display = "none";
    } else {
        aiChatContainer.style.display = "none";
    }
    localStorage.setItem('todoDisplay', todoContainer.style.display);
    localStorage.setItem('aiChatDisplay', aiChatContainer.style.display);
}

function exitAiChatNavigation(){
    aiChatContainer.style.display = "none";
    localStorage.setItem('aiChatDisplay', aiChatContainer.style.display);
}

function showAddQuiz(){
    aiChatContainer.style.display = "none";
    todoContainer.style.display = "none"; 
    addingQuizContainer.style.display = "block";
}
function exitAddQuiz(){
    addingQuizContainer.style.display = "none";
}


function showTodoContainer() {
    if (aiChatContainer.style.display === "block" || aiChatContainer.style.display === "" || todoContainer.style.display === "" || todoContainer.style.display === "none") {
        aiChatContainer.style.display = "none";
        todoContainer.style.display = "block"; 
        addingQuizContainer.style.display = "none";
    } else {
        todoContainer.style.display = "none";
    }
    localStorage.setItem('aiChatDisplay', aiChatContainer.style.display);
    localStorage.setItem('todoDisplay', todoContainer.style.display); // Fixed localStorage key
}

function exitTodoContainer(){
    todoContainer.style.display = "none";
    localStorage.setItem('todoDisplay', todoContainer.style.display); // Fixed localStorage key
}

function showNavigationHeaderContainer(){
    if (navbar.style.display === "none" || navbar.style.display === "") {
        navbar.style.display = "block";
    } else {
        navbar.style.display = "none";
    }
    localStorage.setItem('navbarDisplay', navbar.style.display);
}

function exitNavigationHeaderContainer(){
    navbar.style.display = "none";
    localStorage.setItem('navbarDisplay', navbar.style.display);
}

function showCalendarContainer() {
        notesBodyContainer.style.display = "none";
        calendarSection.style.display = "flex"; 
        quizSection.style.display = "none";
        addingNotesBody.style.display = "none"; 
}


function showqQuizContainer() {
    notesBodyContainer.style.display = "none";
    calendarSection.style.display = "none"; 
    quizSection.style.display = "block";
    addingNotesBody.style.display = "none";
    exitQuiz();
}

function showNotesContainer() {
    notesBodyContainer.style.display = "block";
    calendarSection.style.display = "none"; 
    quizSection.style.display = "none"; 
    addingNotesBody.style.display = "none"; 
}
function showSettings(){
    settingContainer.style.display = "flex";
    navbar.style.display = "none";
}
function closeSettings(){
    settingContainer.style.display = "none";
}
function showAboutUs(){
    UserSettings.style.display = "none";
    aboutUs.style.display = "block";
}
function showPersonal(){
    UserSettings.style.display = "block";
    aboutUs.style.display = "none";
}

window.onload = function() {
    var aiChatDisplay = localStorage.getItem('aiChatDisplay');
    if (aiChatDisplay) {
        aiChatContainer.style.display = aiChatDisplay;
    }
    
    var navbarDisplay = localStorage.getItem('navbarDisplay');
    if (navbarDisplay) {
        navbar.style.display = navbarDisplay;
    }
    var todoDisplay = localStorage.getItem('todoDisplay');
    if (todoDisplay) {
        todoContainer.style.display = todoDisplay;
    }
};


function copyEmail() {
    // Select the email address
    var email = "ipoglang@example.com";
    var dummyElement = document.createElement("textarea");
    document.body.appendChild(dummyElement);
    dummyElement.value = email;
    dummyElement.select();
    
    // Copy the email address to the clipboard
    document.execCommand("copy");
    
    // Remove the textarea element
    document.body.removeChild(dummyElement);
    
    // Alert the user
    alert("Email address copied to clipboard: " + email);
    }
    function copyPhoneNo() {
    // Select the email address
    var email = "09562184010";
    var dummyElement = document.createElement("textarea");
    document.body.appendChild(dummyElement);
    dummyElement.value = email;
    dummyElement.select();
    
    // Copy the email address to the clipboard
    document.execCommand("copy");
    
    // Remove the textarea element
    document.body.removeChild(dummyElement);
    
    // Alert the user
    alert("Phone No. copied to clipboard: " + email);
    }
            //SCROLLING ANIMATION
            $(document).ready(function() {
      // Smooth scrolling when clicking on links
      $('a[href^="#"]').on('click', function(event) {
          var target = $($(this).attr('href'));

          if (target.length) {
              event.preventDefault();
              $('html, body').animate({
                  scrollTop: target.offset().top
              }, 1000); // Adjust the duration as needed
          }
      });
    });

    function exitQuiz() {
        var addingQuizBody = document.querySelector(".addingQuizBody");
        var Quiz = document.querySelector(".Quiz");
        Quiz.style.display = "block";
        addingQuizBody.style.display = "none";
        savedQuiz.innerHTML = '';
        answerQuiz.innerHTML = '';
    }