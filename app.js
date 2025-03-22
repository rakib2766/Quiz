// Check login status
if (!sessionStorage.getItem("loggedIn")) {
  window.location.href = "login.html";
}

// Load questions from JSON
let questions = [];
async function loadQuestions() {
  try {
    const response = await fetch("./questions.json");
    if (!response.ok) {
      throw new Error("Failed to load questions");
    }
    const data = await response.json();
    questions = data.questions;
    // Initialize question count after loading
    const totalQuestions = questions.length;
    totalQuestionsElement.textContent = totalQuestions;
    totalElement.textContent = totalQuestions;
    totalScoreElement.textContent = totalQuestions;
  } catch (error) {
    console.error("Error loading questions:", error);
    alert("Failed to load quiz questions. Please try again later.");
  }
}

// Load questions when page loads
document.addEventListener("DOMContentLoaded", loadQuestions);

// Display student info in navbar
document.getElementById("nav-student-name").textContent =
  sessionStorage.getItem("studentName");
document.getElementById("nav-student-batch").textContent =
  sessionStorage.getItem("studentBatch");

const studentId = sessionStorage.getItem("studentId");

// Add window event listener for tab close
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
});

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let totalTimeLeft = 30; // Total time for entire quiz

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const scoreContainer = document.getElementById("score-container");
const currentNumberElement = document.getElementById("current-number");
const timeElement = document.getElementById("time");
const totalElement = document.getElementById("total");
const totalQuestionsElement = document.getElementById("total-questions");
const totalScoreElement = document.getElementById("total-score");

const startButton = document.getElementById("start-btn");
const quizContent = document.getElementById("quiz-content");
const startSection = document.getElementById("start-section");

function startTimer() {
  timeElement.textContent = totalTimeLeft;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    totalTimeLeft--;
    timeElement.textContent = totalTimeLeft;

    if (totalTimeLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz("Time's up!");
    }
  }, 1000);
}

function finishQuiz(message = "Quiz Completed!") {
  clearInterval(timerInterval);
  questionElement.textContent = message;
  answersElement.innerHTML = "";
  nextButton.style.display = "none";
  scoreElement.textContent = score;

  // Format date and time
  const now = new Date();
  const dateOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dateString = now.toLocaleDateString("en-US", dateOptions);
  const timeString = now.toLocaleTimeString("en-US", timeOptions);
  document.getElementById(
    "display-datetime"
  ).textContent = `${dateString} at ${timeString}`;

  scoreContainer.style.display = "block";
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    finishQuiz();
    return;
  }
  currentNumberElement.textContent = currentQuestionIndex + 1;
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  answersElement.innerHTML = "";

  // Add image if present
  if (currentQuestion.image) {
    const imageElement = document.createElement("img");
    imageElement.src = currentQuestion.image;
    imageElement.className = "question-image";
    questionElement.appendChild(imageElement);
  }

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.addEventListener("click", () => {
      // Remove previous selections
      const buttons = answersElement.querySelectorAll("button");
      buttons.forEach((btn) => btn.classList.remove("selected"));
      // Add selected class to clicked button
      button.classList.add("selected");
      selectAnswer(index);
    });
    answersElement.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedIndex === currentQuestion.correct) {
    score++;
  }
  nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    nextButton.disabled = true;
  } else {
    finishQuiz();
  }
});

// Initialize total questions count on page load
document.addEventListener("DOMContentLoaded", () => {
  const totalQuestions = questions.length;
  totalQuestionsElement.textContent = totalQuestions;
  totalElement.textContent = totalQuestions;
  totalScoreElement.textContent = totalQuestions;
});

function initializeQuiz() {
  document.getElementById("display-name").textContent =
    sessionStorage.getItem("studentName");
  document.getElementById("display-batch").textContent =
    sessionStorage.getItem("studentBatch");

  startSection.style.display = "none";
  quizContent.style.display = "block";
  showQuestion();
  nextButton.disabled = true;
  startTimer();
}

startButton.addEventListener("click", initializeQuiz);

// Add window event listeners for page refresh and close
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "Are you sure you want to leave? Your progress will be lost!";
  return "Are you sure you want to leave? Your progress will be lost!";
});

// Prevent accidental reload using keyboard
document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey && e.key === "r") || e.key === "F5") {
    e.preventDefault();
    if (
      !confirm("Are you sure you want to refresh? Your progress will be lost!")
    ) {
      return false;
    }
  }
});
