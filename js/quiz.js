let quizData = {};
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let userAnswers = []; // Store user answers for review
let startTime = 0;
let endTime = 0;

// Load JSON data
fetch("mcq/questions.json")
  .then(res => res.json())
  .then(data => {
    quizData = data;
    populateClassDropdown();
  })
  .catch(err => console.error("Error loading JSON:", err));

// Populate class dropdown
function populateClassDropdown() {
  const classSelect = document.getElementById("class-select");
  // Clear existing options except the first one
  classSelect.innerHTML = `<option value="">Select Class</option>`;
  
  Object.keys(quizData).forEach(cls => {
    let opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls.charAt(0).toUpperCase() + cls.slice(1); // Capitalize first letter
    classSelect.appendChild(opt);
  });
}

// Class change → load subjects
document.getElementById("class-select").addEventListener("change", function() {
  const subjectSelect = document.getElementById("subject-select");
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
  document.getElementById("chapter-select").innerHTML = `<option value="">Select Chapter</option>`;
  document.getElementById("difficulty-select").innerHTML = `<option value="">Select Difficulty</option>`;
  
  if (this.value) {
    Object.keys(quizData[this.value]).forEach(subject => {
      let opt = document.createElement("option");
      opt.value = subject;
      opt.textContent = subject.charAt(0).toUpperCase() + subject.slice(1); // Capitalize first letter
      subjectSelect.appendChild(opt);
    });
  }
});

// Subject change → load chapters
document.getElementById("subject-select").addEventListener("change", function() {
  const chapterSelect = document.getElementById("chapter-select");
  chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;
  document.getElementById("difficulty-select").innerHTML = `<option value="">Select Difficulty</option>`;
  
  const selectedClass = document.getElementById("class-select").value;
  if (this.value && selectedClass) {
    Object.keys(quizData[selectedClass][this.value]).forEach(chap => {
      let opt = document.createElement("option");
      opt.value = chap;
      opt.textContent = chap.toUpperCase(); // Show as CH1, CH2, etc.
      chapterSelect.appendChild(opt);
    });
  }
});

// Chapter change → load difficulty
document.getElementById("chapter-select").addEventListener("change", function() {
  const difficultySelect = document.getElementById("difficulty-select");
  difficultySelect.innerHTML = `<option value="">Select Difficulty</option>`;
  
  const selectedClass = document.getElementById("class-select").value;
  const selectedSubject = document.getElementById("subject-select").value;
  if (this.value && selectedClass && selectedSubject) {
    Object.keys(quizData[selectedClass][selectedSubject][this.value]).forEach(diff => {
      let opt = document.createElement("option");
      opt.value = diff;
      opt.textContent = diff.charAt(0).toUpperCase() + diff.slice(1); // Capitalize first letter
      difficultySelect.appendChild(opt);
    });
  }
});

// Start Quiz
document.getElementById("start-btn").addEventListener("click", function() {
  const cls = document.getElementById("class-select").value;
  const sub = document.getElementById("subject-select").value;
  const chap = document.getElementById("chapter-select").value;
  const diff = document.getElementById("difficulty-select").value;
  
  if (!cls || !sub || !chap || !diff) {
    alert("Please select all fields before starting the quiz!");
    return;
  }

  // Reset quiz variables
  currentQuestions = quizData[cls][sub][chap][diff];
  currentIndex = 0;
  score = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  userAnswers = [];
  startTime = Date.now();
  
  // Hide filters and result section, show quiz
  document.getElementById("filters").style.display = "none";
  document.getElementById("result-section").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  
  // Initialize quiz container structure
  initializeQuizContainer();
  loadQuestion();
});

function initializeQuizContainer() {
  const quizContainer = document.getElementById("quiz-container");
  // Initialize userAnswers array
  userAnswers = new Array(currentQuestions.length).fill(null);
  
  quizContainer.innerHTML = `
    <div class="quiz-header">
      <div class="question-counter">
        Question <span id="current-question">1</span> of <span id="total-questions">${currentQuestions.length}</span>
      </div>
      <div class="quiz-progress">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
      </div>
    </div>
    <div class="question-container">
      <h3 id="question-text"></h3>
      <div id="options"></div>
    </div>
    <div class="quiz-navigation">
      <button id="prev-btn" style="display:none;">Previous</button>
      <button id="finish-btn" style="display:none;">Finish Quiz</button>
      <button id="next-btn" style="display:none;">Next</button>
    </div>
  `;
  
  // Add event listeners for navigation
  document.getElementById("prev-btn").onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      loadQuestion();
    }
  };
  
  document.getElementById("next-btn").onclick = () => {
    if (currentIndex < currentQuestions.length - 1) {
      currentIndex++;
      loadQuestion();
    }
  };
  
  document.getElementById("finish-btn").onclick = () => {
    finishQuiz();
  };
}

function loadQuestion() {
  const qObj = currentQuestions[currentIndex];
  document.getElementById("question-text").textContent = qObj.question;
  document.getElementById("current-question").textContent = currentIndex + 1;
  
  // Update progress bar
  const progress = ((currentIndex + 1) / currentQuestions.length) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";
  
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  
  let selectedOption = null;
  
  qObj.options.forEach(option => {
    let optionContainer = document.createElement("div");
    optionContainer.className = "option-container";
    
    let btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";
    btn.onclick = () => {
      // Remove previous selection
      document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedOption = option;
      document.getElementById("select-answer-btn").disabled = false;
    };
    
    optionContainer.appendChild(btn);
    optionsDiv.appendChild(optionContainer);
  });
  
  // Add Select Answer button
  const selectButtonContainer = document.createElement("div");
  selectButtonContainer.className = "select-button-container";
  selectButtonContainer.innerHTML = `
    <button id="select-answer-btn" disabled>Select This Answer</button>
  `;
  optionsDiv.appendChild(selectButtonContainer);
  
  // Handle answer selection
  document.getElementById("select-answer-btn").onclick = () => {
    if (selectedOption) {
      selectAnswer(selectedOption);
    }
  };
  
  // Restore previous answer if exists
  if (userAnswers[currentIndex]) {
    const savedAnswer = userAnswers[currentIndex].userAnswer;
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach(btn => {
      if (btn.textContent === savedAnswer) {
        btn.classList.add("selected");
        selectedOption = savedAnswer;
        document.getElementById("select-answer-btn").disabled = false;
      }
    });
  }
  
  // Update navigation buttons
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const finishBtn = document.getElementById("finish-btn");
  
  // Show/hide previous button
  prevBtn.style.display = currentIndex > 0 ? "block" : "none";
  
  // Show/hide next and finish buttons
  if (currentIndex === currentQuestions.length - 1) {
    nextBtn.style.display = "none";
    finishBtn.style.display = "block";
  } else {
    nextBtn.style.display = "block";
    finishBtn.style.display = "none";
  }
}

function finishQuiz() {
  // Calculate final score
  score = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  
  userAnswers.forEach(answer => {
    if (answer && answer.isCorrect) {
      score++;
      correctAnswers++;
    } else if (answer) {
      incorrectAnswers++;
    }
  });
  
  endTime = Date.now();
  showResults();
}

function selectAnswer(selected) {
  // Store/update user answer for current question
  userAnswers[currentIndex] = {
    question: currentQuestions[currentIndex].question,
    userAnswer: selected,
    correctAnswer: currentQuestions[currentIndex].answer,
    explanation: currentQuestions[currentIndex].explanation,
    isCorrect: selected === currentQuestions[currentIndex].answer
  };
  
  // Show confirmation message
  const confirmMsg = document.createElement("div");
  confirmMsg.className = "answer-confirmed";
  confirmMsg.textContent = "Answer recorded!";
  document.querySelector(".select-button-container").appendChild(confirmMsg);
  
  setTimeout(() => {
    if (confirmMsg.parentNode) {
      confirmMsg.remove();
    }
  }, 2000);
  
  // Update navigation buttons
  updateNavigationButtons();
}

function showResults() {
  // Hide quiz container
  document.getElementById("quiz-container").style.display = "none";
  
  // Calculate time taken
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Update result displays
  document.getElementById("score-display").textContent = `${score}/${currentQuestions.length}`;
  document.getElementById("correct-display").textContent = correctAnswers;
  document.getElementById("incorrect-display").textContent = incorrectAnswers;
  document.getElementById("time-display").textContent = timeString;
  
  // Show result section
  document.getElementById("result-section").style.display = "block";
  
  // Create detailed results
  createDetailedResults();
}

function createDetailedResults() {
  // Remove any existing detailed results
  const existingResults = document.getElementById("detailed-results");
  if (existingResults) {
    existingResults.remove();
  }
  
  // Create detailed results section
  const detailedResults = document.createElement("div");
  detailedResults.id = "detailed-results";
  detailedResults.innerHTML = `
    <h3>Question Review & Explanations</h3>
    <div id="question-review"></div>
  `;
  
  const questionReview = detailedResults.querySelector("#question-review");
  
  userAnswers.forEach((answer, index) => {
    // Handle unanswered questions
    const isAnswered = answer !== null;
    const displayAnswer = isAnswered ? answer : {
      question: currentQuestions[index].question,
      userAnswer: "Not Answered",
      correctAnswer: currentQuestions[index].answer,
      explanation: currentQuestions[index].explanation,
      isCorrect: false
    };
    
    const reviewItem = document.createElement("div");
    reviewItem.className = `review-item ${displayAnswer.isCorrect ? 'correct' : 'incorrect'}`;
    reviewItem.innerHTML = `
      <div class="review-header">
        <span class="question-number">Q${index + 1}</span>
        <span class="result-icon">${displayAnswer.isCorrect ? '✅' : '❌'}</span>
      </div>
      <div class="review-question">${displayAnswer.question}</div>
      <div class="review-answers">
        <div class="user-answer">Your answer: <strong class="${!isAnswered ? 'not-answered' : ''}">${displayAnswer.userAnswer}</strong></div>
        ${!displayAnswer.isCorrect ? `<div class="correct-answer-text">Correct answer: <strong>${displayAnswer.correctAnswer}</strong></div>` : ''}
      </div>
      <div class="explanation">
        <strong>Explanation:</strong> ${displayAnswer.explanation}
      </div>
    `;
    questionReview.appendChild(reviewItem);
  });
  
  // Insert detailed results after result section
  document.getElementById("result-section").after(detailedResults);
}

// Retake Test button
document.getElementById("retake-btn").addEventListener("click", function() {
  // Reset and restart the same quiz
  currentIndex = 0;
  score = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  userAnswers = [];
  startTime = Date.now();
  
  document.getElementById("result-section").style.display = "none";
  const detailedResults = document.getElementById("detailed-results");
  if (detailedResults) {
    detailedResults.remove();
  }
  
  document.getElementById("quiz-container").style.display = "block";
  initializeQuizContainer();
  loadQuestion();
});

// New Test button
document.getElementById("newtest-btn").addEventListener("click", function() {
  // Reset everything and show filters
  document.getElementById("result-section").style.display = "none";
  const detailedResults = document.getElementById("detailed-results");
  if (detailedResults) {
    detailedResults.remove();
  }
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("filters").style.display = "block";
  
  // Reset dropdowns
  document.getElementById("class-select").value = "";
  document.getElementById("subject-select").innerHTML = `<option value="">Select Subject</option>`;
  document.getElementById("chapter-select").innerHTML = `<option value="">Select Chapter</option>`;
  document.getElementById("difficulty-select").innerHTML = `<option value="">Select Difficulty</option>`;
});