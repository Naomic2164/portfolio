let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedNum = 5;

document.getElementById("startQuiz").addEventListener("click", async () => {
  selectedNum = parseInt(document.getElementById("numQuestions").value);
  await loadQuestions(selectedNum);
  startQuiz();
});

document.getElementById("resetQuiz").addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("quizContainer").innerHTML = "";
  document.getElementById("scoreContainer").innerHTML = "";
});

async function loadQuestions(num) {
  const res = await fetch("questions.json");
  const data = await res.json();
  questions = shuffleArray(data).slice(0, num);
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("scoreContainer").innerHTML = "";
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  if (currentQuestionIndex >= questions.length) {
    const finalScore = `${score}/${questions.length}`;
    document.getElementById("scoreContainer").innerHTML = `🎉 You scored ${finalScore}!`;
    saveScore(finalScore);
    showLeaderboard();
    return;
  }

  const q = questions[currentQuestionIndex];
  const questionEl = document.createElement("div");
  questionEl.className = "question";
  questionEl.innerHTML = `<h3>Q${currentQuestionIndex + 1}: ${q.question}</h3>`;

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === q.answer) score++;
      currentQuestionIndex++;
      showQuestion();
    };
    questionEl.appendChild(btn);
  });

  container.appendChild(questionEl);
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function saveScore(scoreText) {
  const name = prompt("Enter your name for the leaderboard:");
  if (!name) return;

  const leaderboard = JSON.parse(localStorage.getItem("randomQuizLeaderboard")) || [];
  leaderboard.push({ name, score: scoreText });
  leaderboard.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  localStorage.setItem("randomQuizLeaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("randomQuizLeaderboard")) || [];
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";

  leaderboard.slice(0, 5).forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    list.appendChild(li);
  });
}
