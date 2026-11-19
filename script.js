const lessons = {
  "Animals": [["🐶","Dog","Perro"],["🐱","Cat","Gato"],["🐰","Rabbit","Conejo"],["🦁","Lion","León"],["🐘","Elephant","Elefante"],["🐼","Panda","Panda"],["🐸","Frog","Rana"],["🦋","Butterfly","Mariposa"]],
  "Colors": [["🔴","Red","Rojo"],["🔵","Blue","Azul"],["🟡","Yellow","Amarillo"],["🟢","Green","Verde"],["🟣","Purple","Morado"],["🩷","Pink","Rosado"],["🟠","Orange","Naranja"],["⚫","Black","Negro"]],
  "Numbers": [["1️⃣","One","Uno"],["2️⃣","Two","Dos"],["3️⃣","Three","Tres"],["4️⃣","Four","Cuatro"],["5️⃣","Five","Cinco"],["6️⃣","Six","Seis"],["7️⃣","Seven","Siete"],["8️⃣","Eight","Ocho"]],
  "Fruits": [["🍎","Apple","Manzana"],["🍌","Banana","Banano"],["🍇","Grapes","Uvas"],["🍓","Strawberry","Fresa"],["🍊","Orange","Naranja"],["🍍","Pineapple","Piña"],["🍉","Watermelon","Sandía"],["🥭","Mango","Mango"]],
  "Family": [["👩","Mother","Mamá"],["👨","Father","Papá"],["👧","Sister","Hermana"],["👦","Brother","Hermano"],["👵","Grandmother","Abuela"],["👴","Grandfather","Abuelo"],["👶","Baby","Bebé"],["👨‍👩‍👧‍👦","Family","Familia"]],
  "Parts of the House": [["🛋️","Living room","Sala"],["🛏️","Bedroom","Habitación"],["🍳","Kitchen","Cocina"],["🛁","Bathroom","Baño"],["🚪","Door","Puerta"],["🪟","Window","Ventana"],["🏡","Garden","Jardín"],["🪜","Stairs","Escaleras"]],
  "Parts of the Body": [["👀","Eyes","Ojos"],["👂","Ears","Orejas"],["👃","Nose","Nariz"],["👄","Mouth","Boca"],["🖐️","Hand","Mano"],["🦶","Foot","Pie"],["💪","Arm","Brazo"],["🦵","Leg","Pierna"]],
  "School Objects": [["✏️","Pencil","Lápiz"],["📚","Books","Libros"],["📏","Ruler","Regla"],["✂️","Scissors","Tijeras"],["🎒","Backpack","Mochila"],["🖍️","Crayon","Crayón"],["🖊️","Pen","Bolígrafo"],["📓","Notebook","Cuaderno"]]
};

const topicGrid = document.getElementById("topicGrid");
const lessonSection = document.getElementById("lessonSection");
const lessonTitle = document.getElementById("lessonTitle");
const wordGrid = document.getElementById("wordGrid");
const starCount = document.getElementById("starCount");
const quizCard = document.getElementById("quizCard");
const toast = document.getElementById("toast");
let stars = 0;
let questions = [];
let questionIndex = 0;
let answered = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function openTopic(topic) {
  lessonTitle.textContent = topic;
  wordGrid.innerHTML = lessons[topic].map(([emoji, english, spanish]) =>
    `<article class="word-card"><span aria-hidden="true">${emoji}</span><strong>${english}</strong><small>${spanish}</small></article>`
  ).join("");
  lessonSection.hidden = false;
  lessonSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

topicGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-topic]");
  if (card) openTopic(card.dataset.topic);
});
document.getElementById("backToTopics").addEventListener("click", () => {
  lessonSection.hidden = true;
  document.getElementById("topics").scrollIntoView({ behavior: "smooth" });
});

const quizPool = [
  {emoji:"🐶", question:"What animal is this?", answer:"Dog", options:["Dog","Cat","Lion","Rabbit"]},
  {emoji:"🍎", question:"What fruit is this?", answer:"Apple", options:["Banana","Apple","Mango","Grapes"]},
  {emoji:"🔵", question:"What color is this?", answer:"Blue", options:["Red","Green","Blue","Yellow"]},
  {emoji:"✏️", question:"What school object is this?", answer:"Pencil", options:["Book","Ruler","Pencil","Bag"]},
  {emoji:"👀", question:"What part of the body is this?", answer:"Eyes", options:["Nose","Eyes","Ears","Mouth"]},
  {emoji:"3️⃣", question:"How do you say 3 in English?", answer:"Three", options:["One","Two","Three","Four"]},
  {emoji:"🍌", question:"What fruit is yellow?", answer:"Banana", options:["Strawberry","Grapes","Banana","Apple"]},
  {emoji:"👩", question:"How do you say mamá in English?", answer:"Mother", options:["Sister","Mother","Father","Baby"]}
];

function startGame() {
  questions = [...quizPool].sort(() => Math.random() - .5).slice(0, 5);
  questionIndex = 0;
  quizCard.hidden = false;
  renderQuestion();
  quizCard.scrollIntoView({ behavior: "smooth", block: "center" });
}
function renderQuestion() {
  answered = false;
  const q = questions[questionIndex];
  document.getElementById("questionCount").textContent = `Question ${questionIndex + 1} of ${questions.length}`;
  document.getElementById("quizVisual").textContent = q.emoji;
  document.getElementById("quizQuestion").textContent = q.question;
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
  document.getElementById("nextQuestion").hidden = true;
  document.getElementById("answerGrid").innerHTML = q.options.map(option =>
    `<button class="answer-btn" type="button">${option}</button>`
  ).join("");
}
document.getElementById("answerGrid").addEventListener("click", (event) => {
  const button = event.target.closest(".answer-btn");
  if (!button || answered) return;
  answered = true;
  const correct = button.textContent === questions[questionIndex].answer;
  [...document.querySelectorAll(".answer-btn")].forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === questions[questionIndex].answer) btn.classList.add("correct");
  });
  const feedback = document.getElementById("feedback");
  if (correct) {
    stars += 1;
    starCount.textContent = stars;
    feedback.textContent = "Amazing! That’s correct! ⭐";
    feedback.classList.add("good");
  } else {
    button.classList.add("wrong");
    feedback.textContent = `Good try! The answer is ${questions[questionIndex].answer}.`;
    feedback.classList.add("try");
  }
  document.getElementById("nextQuestion").hidden = false;
});
document.getElementById("nextQuestion").addEventListener("click", () => {
  questionIndex += 1;
  if (questionIndex < questions.length) renderQuestion();
  else {
    document.getElementById("quizQuestion").textContent = "You finished the challenge!";
    document.getElementById("quizVisual").textContent = "🎉";
    document.getElementById("answerGrid").innerHTML = "";
    document.getElementById("feedback").textContent = `You earned ${stars} star${stars === 1 ? "" : "s"} in total. Great job!`;
    document.getElementById("feedback").className = "feedback good";
    document.getElementById("questionCount").textContent = "Challenge complete";
    document.getElementById("nextQuestion").textContent = "Play again ↻";
    document.getElementById("nextQuestion").hidden = false;
    document.getElementById("nextQuestion").onclick = startGame;
  }
});
document.getElementById("startQuiz").addEventListener("click", startGame);

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
