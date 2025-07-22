alert("js loaded success");
const subjectData = {
  class9: {
    maths: {
      ch1: "Number Systems",
      ch2: "Polynomials"
    },
    science: {
      ch1: "Matter in Our Surroundings",
      ch2: "Atoms and Molecules"
    }
  },
  class10: {
    maths: {
      ch1: "Real Numbers",
      ch2: "Quadratic Equations"
    },
    science: {
      ch1: "Chemical Reactions",
      ch2: "Acids, Bases and Salts"
    }
  }
};

const classSelect = document.getElementById("class-select");
const subjectSelect = document.getElementById("subject-select");
const chapterSelect = document.getElementById("chapter-select");
const difficultySelect = document.getElementById("difficulty-select");
const loadBtn = document.getElementById("load-quiz-btn");

classSelect.addEventListener("change", () => {
  const selectedClass = "class" + classSelect.value;

  subjectSelect.innerHTML = "<option value=''>Select Subject</option>";
  subjectSelect.disabled = true;
  chapterSelect.innerHTML = "<option value=''>Select Chapter</option>";
  chapterSelect.disabled = true;
  difficultySelect.innerHTML = "<option value=''>Select Difficulty</option>";
  difficultySelect.disabled = true;
  loadBtn.disabled = true;

  if (subjectData[selectedClass]) {
    for (let subject in subjectData[selectedClass]) {
      const option = document.createElement("option");
      option.value = subject;
      option.textContent = subject;
      subjectSelect.appendChild(option);
    }
    subjectSelect.disabled = false;
  }
});

subjectSelect.addEventListener("change", () => {
  const selectedClass = "class" + classSelect.value;
  const selectedSubject = subjectSelect.value;

  chapterSelect.innerHTML = "<option value=''>Select Chapter</option>";
  chapterSelect.disabled = true;
  difficultySelect.innerHTML = "<option value=''>Select Difficulty</option>";
  difficultySelect.disabled = true;
  loadBtn.disabled = true;

  if (subjectData[selectedClass][selectedSubject]) {
    for (let chapterKey in subjectData[selectedClass][selectedSubject]) {
      const option = document.createElement("option");
      option.value = chapterKey;
      option.textContent = subjectData[selectedClass][selectedSubject][chapterKey];
      chapterSelect.appendChild(option);
    }
    chapterSelect.disabled = false;
  }
});

chapterSelect.addEventListener("change", () => {
  difficultySelect.innerHTML = `
    <option value="">Select Difficulty</option>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
  `;
  difficultySelect.disabled = false;
  loadBtn.disabled = true;
});

difficultySelect.addEventListener("change", () => {
  loadBtn.disabled = false;
});

// Load quiz
loadBtn.addEventListener("click", () => {
  const selectedClass = "class" + classSelect.value;
  const selectedSubject = subjectSelect.value;
  const selectedChapter = chapterSelect.value;
  const selectedDifficulty = difficultySelect.value;

  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      const questions = data?.[selectedClass]?.[selectedSubject]?.[selectedChapter]?.[selectedDifficulty];

      if (!questions || questions.length === 0) {
        document.getElementById("question-container").innerHTML = "<p>This section is coming soon!</p>";
        return;
      }

      document.getElementById("question-container").innerHTML = "<pre>" + JSON.stringify(questions, null, 2) + "</pre>";
    });
});
