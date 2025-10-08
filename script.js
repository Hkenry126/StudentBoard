// 定義基本課表結構
const days = ["一", "二", "三", "四", "五"];
const times = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00"
];

const timetableEl = document.getElementById("timetable");

// 讀取已儲存的課程資料
let courses = JSON.parse(localStorage.getItem("courses")) || {};

// 生成表頭
timetableEl.innerHTML = `<div class="header">時間</div>` + days.map(d => `<div class="header">${d}</div>`).join("");

// 生成格狀表格
times.forEach(time => {
  timetableEl.innerHTML += `<div class="time">${time}</div>`;
  days.forEach(day => {
    const key = `${day}-${time}`;
    const course = courses[key] || "";
    timetableEl.innerHTML += `<div class="cell" data-key="${key}">${course}</div>`;
  });
});

// 點擊編輯課程
document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", () => {
    const key = cell.dataset.key;
    const course = prompt("輸入課程名稱：", courses[key] || "");
    if (course !== null) {
      courses[key] = course.trim();
      cell.textContent = course;
      localStorage.setItem("courses", JSON.stringify(courses));
    }
  });
});
