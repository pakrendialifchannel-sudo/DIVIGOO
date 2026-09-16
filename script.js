const missions = [
  {
    title: "Temukan Pembagian",
    instruction: "Ada 24 apel. Bagikan sama rata kepada 6 kelompok.",
    type: "drag"
  },
  {
    title: "Papan Kapur Digital",
    instruction: "Gunakan papan di bawah untuk menunjukkan cara menghitung 36 ÷ 4.",
    type: "chalk"
  },
  {
    title: "Pilih Strategimu",
    instruction: "Bagaimana cara yang kamu pilih untuk menyelesaikan 48 ÷ 6?",
    type: "strategy"
  },
  {
    title: "Hubungkan",
    instruction: "Lengkapi hubungan perkalian dan pembagian.",
    type: "relation"
  },
  {
    title: "Buktikan!",
    instruction: "56 ÷ 8 = ? Setelah menjawab, buktikan bagaimana kamu tahu.",
    type: "proof"
  },
  {
    title: "Tantangan Kehidupan",
    instruction: "Ada 60 botol yang akan dibagi ke dalam 10 kelompok sama banyak.",
    type: "life"
  },
  {
    title: "Refleksi",
    instruction: "Pikirkan kembali perjalanan belajarmu hari ini.",
    type: "reflection"
  }
];

let currentMission = 0;
let score = 0;
let completed = false;

const homeScreen = document.getElementById("homeScreen");
const missionScreen = document.getElementById("missionScreen");
const resultScreen = document.getElementById("resultScreen");

const missionNumber = document.getElementById("missionNumber");
const missionTitle = document.getElementById("missionTitle");
const missionInstruction = document.getElementById("missionInstruction");
const missionContent = document.getElementById("missionContent");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(item => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
}

function startLearning() {
  currentMission = 0;
  score = 0;
  completed = false;

  showScreen(missionScreen);
  renderMission();
}

function goHome() {
  showScreen(homeScreen);
}

function updateProgress() {
  const total = missions.length;
  const current = Math.min(currentMission + 1, total);

  progressText.textContent = `Misi ${current}/${total}`;

  const percent = (currentMission / total) * 100;
  progressBar.style.width = `${percent}%`;
}

function renderMission() {

  const mission = missions[currentMission];

  missionNumber.textContent = `MISI ${currentMission + 1}`;
  missionTitle.textContent = mission.title;
  missionInstruction.textContent = mission.instruction;

  missionContent.innerHTML = "";
  feedback.classList.add("hidden");
  feedback.innerHTML = "";

  nextBtn.classList.add("hidden");

  updateProgress();

  if (mission.type === "drag") {
    renderDragMission();
  }

  if (mission.type === "chalk") {
    renderChalkMission();
  }

  if (mission.type === "strategy") {
    renderStrategyMission();
  }

  if (mission.type === "relation") {
    renderRelationMission();
  }

  if (mission.type === "proof") {
    renderProofMission();
  }

  if (mission.type === "life") {
    renderLifeMission();
  }

  if (mission.type === "reflection") {
    renderReflectionMission();
  }
}

/* =========================
   MISI 1
========================= */

function renderDragMission() {

  missionContent.innerHTML = `
    <div class="problem-box">
      <h3>🍎 24 apel</h3>
      <p>Bagikan kepada <strong>6 kelompok</strong> dengan jumlah yang sama.</p>
    </div>

    <div class="object-grid" id="objectGrid"></div>

    <div class="groups" id="groups">
      ${createDropZone(1)}
      ${createDropZone(2)}
      ${createDropZone(3)}
      ${createDropZone(4)}
      ${createDropZone(5)}
      ${createDropZone(6)}
    </div>

    <div class="answer-area">
      <button class="primary-btn" onclick="checkDragMission()">
        ✅ Saya sudah membagi
      </button>
    </div>
  `;

  const grid = document.getElementById("objectGrid");

  for (let i = 0; i < 24; i++) {

    const apple = document.createElement("div");

    apple.className = "object";
    apple.textContent = "🍎";
    apple.draggable = true;
    apple.id = `apple-${i}`;

    apple.addEventListener("dragstart", dragStart);

    grid.appendChild(apple);
  }

  document.querySelectorAll(".drop-zone").forEach(zone => {

    zone.addEventListener("dragover", event => {
      event.preventDefault();
    });

    zone.addEventListener("drop", dropApple);

  });
}

function createDropZone(number) {

  return `
    <div class="drop-zone" data-group="${number}">
      <strong>Kelompok ${number}</strong>
      <div class="zone-items"></div>
    </div>
  `;
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function dropApple(event) {

  event.preventDefault();

  const id = event.dataTransfer.getData("text/plain");
  const apple = document.getElementById(id);

  const items = event.currentTarget.querySelector(".zone-items");

  if (items.children.length < 4) {
    items.appendChild(apple);
  }
}

function checkDragMission() {

  const zones = document.querySelectorAll(".drop-zone");

  let correct = true;

  zones.forEach(zone => {

    const count = zone.querySelector(".zone-items").children.length;

    if (count !== 4) {
      correct = false;
    }

  });

  if (correct) {

    score += 10;

    showFeedback(
      "🎉 Benar! Setiap kelompok mendapatkan 4 apel. Jadi 24 ÷ 6 = 4."
    );

    showNextButton();

  } else {

    showFeedback(
      "Belum tepat. Coba pastikan setiap kelompok mendapatkan jumlah apel yang sama."
    );

  }
}

/* =========================
   MISI 2
========================= */

function renderChalkMission() {

  missionContent.innerHTML = `
    <div class="chalkboard">
      <canvas id="chalkCanvas"></canvas>
    </div>

    <div class="answer-area">

      <p>
        Tuliskan atau gambarkan caramu menyelesaikan:
        <strong>36 ÷ 4</strong>
      </p>

      <br>

      <input
        type="number"
        id="chalkAnswer"
        placeholder="Jawaban"
      >

      <br><br>

      <button class="primary-btn" onclick="checkChalkAnswer()">
        Periksa Jawaban
      </button>

      <button class="secondary-btn" onclick="clearCanvas()">
        🧹 Hapus Papan
      </button>

    </div>
  `;

  setupCanvas();
}

let canvas;
let ctx;
let drawing = false;

function setupCanvas() {

  canvas = document.getElementById("chalkCanvas");

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;

  ctx = canvas.getContext("2d");

  ctx.scale(
    window.devicePixelRatio,
    window.devicePixelRatio
  );

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth =
