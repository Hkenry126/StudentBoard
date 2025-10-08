const days = ["一", "二", "三", "四", "五"];
const times = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + Math.floor((10 + i * 60) / 60);
  const minute = (10 + i * 60) % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
});

const timetable = document.getElementById("timetable");
const dialog = document.getElementById("courseDialog");
const form = document.getElementById("courseForm");
const courseTableBody = document.querySelector("#courseTable tbody");

// 儲存資料
let courses = JSON.parse(localStorage.getItem("courses")) || [];

// 建立表頭
timetable.innerHTML = `<div class="header">時間</div>` + days.map(d => `<div class="header">${d}</div>`).join("");

// 建立格狀結構
times.forEach((t, i) => {
  timetable.innerHTML += `<div class="time">${t}</div>`;
  days.forEach((day, dIndex) => {
    const key = `${day}-${i}`;
    timetable.innerHTML += `<div class="cell" data-day="${dIndex}" data-index="${i}" data-key="${key}"></div>`;
  });
});

// 渲染課表
function render() {
  document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
  courses.forEach(c => {
    for (let i = 0; i < c.duration; i++) {
      const cell = document.querySelector(`.cell[data-day="${c.day}"][data-index="${c.startIndex + i}"]`);
      if (cell) {
        cell.style.backgroundColor = c.color || "#A8DADC";
        cell.textContent = i === 0 ? c.name : "";
      }
    }
  });

  // 渲染課程列表
  courseTableBody.innerHTML = courses.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.credit}</td>
      <td>${c.type}</td>
    </tr>
  `).join("");
}

render();

// 點擊格子新增課程
document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", () => {
    form.dataset.day = cell.dataset.day;
    form.dataset.index = cell.dataset.index;
    dialog.showModal();
  });
});

// 對話框提交
form.addEventListener("submit", e => e.preventDefault());
form.addEventListener("close", () => {
  if (dialog.returnValue === "confirm") {
    const name = document.getElementById("courseName").value.trim();
    const duration = parseInt(document.getElementById("duration").value);
    const credit = parseInt(document.getElementById("credit").value);
    const type = document.getElementById("type").value;
    const day = parseInt(form.dataset.day);
    const startIndex = parseInt(form.dataset.index);
    const color = ["#A8DADC","#FFD6A5","#FDFFB6","#CAFFBF","#9BF6FF"][Math.floor(Math.random()*5)];

    if (name) {
      courses.push({ name, duration, credit, type, day, startIndex, color });
      localStorage.setItem("courses", JSON.stringify(courses));
      render();
    }
  }
  form.reset();
});

