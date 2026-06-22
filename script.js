let player = "";
let score = 0;
let time = 90;
let hints = 3;
let clueIndex = 0;
let current = 0;
let interval;

let shuffledQuestions = [];

const questions = [
  {
    answer: "empilhadeira",
    img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    accept: ["empilhadeira"],
    clues: ["Levanto cargas","Tenho garfos","Armazéns","Elétrica ou combustão"]
  },
  {
    answer: "transpaleteira",
    img: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    accept: ["transpaleteira", "paleteira"],
    clues: ["Movimento pallets","Baixa altura","Corredores","Manual ou elétrica"]
  },
  {
    answer: "esteira transportadora",
    img: "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
    accept: ["esteira transportadora", "esteira"],
    clues: ["Fluxo automático","Sem operador","Linha produção","Contínuo"]
  },
  {
    answer: "agv",
    img: "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
    accept: ["agv"],
    clues: ["Sou robô","Sem motorista","Sensores","Moderno"]
  },
  {
    answer: "ponte rolante",
    img: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
    accept: ["ponte rolante"],
    clues: ["Suspensa","Pesado","Trilhos","Fábrica"]
  }
];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(t) {
  return t.toLowerCase().trim().replace(/[\s-]/g, "");
}

function startGame() {
  player = document.getElementById("player").value || "Jogador";

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  shuffledQuestions = shuffle([...questions]);

  current = 0;
  score = 0;
  time = 90;
  hints = 3;

  document.getElementById("score").innerText = score;
  document.getElementById("hints").innerText = hints;
  document.getElementById("time").innerText = time;

  loadQuestion();
  interval = setInterval(timer, 1000);
}

function loadQuestion() {
  clueIndex = 0;

  let q = shuffledQuestions[current];

  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("feedback").className = "";

  document.getElementById("clue").innerText = q.clues[0];
  document.getElementById("img").src = q.img;
}

function nextQuestion() {
  current++;
  if (current >= shuffledQuestions.length) return endGame();
  loadQuestion();
}

function skipQuestion() {
  score -= 3;
  nextQuestion();
}

function checkAnswer() {
  let ans = normalize(document.getElementById("answer").value);
  let q = shuffledQuestions[current];

  let ok = q.accept.some(a => normalize(a) === ans);

  let fb = document.getElementById("feedback");
  let card = document.getElementById("card");

  if (ok) {
    score += (4 - clueIndex) * 10;
    fb.innerText = "✔ Correto! " + q.answer;
    fb.className = "correct";
    document.getElementById("score").innerText = score;
    setTimeout(nextQuestion, 800);
  } else {
    score -= 5;
    fb.innerText = "❌ Errado! Era " + q.answer;
    fb.className = "wrong";
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 300);
    document.getElementById("score").innerText = score;
    setTimeout(nextQuestion, 1200);
  }
}

function nextClue() {
  let q = shuffledQuestions[current];

  if (clueIndex < q.clues.length - 1) {
    clueIndex++;
    document.getElementById("clue").innerText = q.clues[clueIndex];
  }
}

function useHint() {
  if (hints <= 0) return;
  hints--;
  document.getElementById("hints").innerText = hints;
  let q = shuffledQuestions[current].answer;
  alert("Começa com: " + q[0].toUpperCase());
}

function timer() {
  time--;
  document.getElementById("time").innerText = time;
  if (time <= 0) endGame();
}

function endGame() {
  clearInterval(interval);

  document.getElementById("game").classList.add("hidden");
  document.getElementById("end").classList.remove("hidden");

  document.getElementById("final").innerText =
    `${player}, você fez ${score} pontos!`;

  saveRanking();
}

function saveRanking() {
  let data = JSON.parse(localStorage.getItem("ranking")) || [];
  data.push({ name: player, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem("ranking", JSON.stringify(data));
  loadRanking();
}

function loadRanking() {
  let data = JSON.parse(localStorage.getItem("ranking")) || [];
  let list = document.getElementById("ranking");

  list.innerHTML = "";

  data.forEach((p, i) => {
    let li = document.createElement("li");
    li.innerText =
      i === 0 ? "🥇 " + p.name + " - " + p.score :
      i === 1 ? "🥈 " + p.name + " - " + p.score :
      i === 2 ? "🥉 " + p.name + " - " + p.score :
      p.name + " - " + p.score;

    list.appendChild(li);
  });
}

function clearRanking() {
  localStorage.removeItem("ranking");
  loadRanking();
}

loadRanking();