function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
  tasks.forEach(task => renderTask(task));
  checkReminders(tasks);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      name: li.dataset.name,
      subject: li.dataset.subject,
      topic: li.dataset.topic,
      deadline: li.dataset.deadline,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const topic = document.getElementById('topic').value.trim();
  const deadlineInput = document.getElementById('deadline').value;
  const deadline = new Date(deadlineInput);
  const today = new Date();

  if (!name || !subject || !topic) {
    alert("❗ Please fill in all fields.");
    return;
  }

  if (deadline < today) {
    alert("⏳ Deadline must be in the future.");
    return;
  }

  const task = { name, subject, topic, deadline: deadlineInput, completed: false };
  renderTask(task);
  saveTasks();
  this.reset();
  alert("✅ Task added successfully!");
});

function renderTask(task) {
  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');

  if (task.completed) li.classList.add('completed');

  li.dataset.name = task.name;
  li.dataset.subject = task.subject.toLowerCase();
  li.dataset.topic = task.topic;
  li.dataset.deadline = task.deadline;

  li.innerHTML = `
    <div>
      <strong>${task.subject}:</strong> ${task.topic}<br/>
      <small>Deadline: ${task.deadline} | ${task.name}</small>
    </div>
    <div class="task-buttons">
      <button onclick="toggleDone(this)">✅</button>
      <button onclick="deleteTask(this)">❌</button>
    </div>
  `;

  taskList.appendChild(li);
}

function toggleDone(button) {
  const li = button.closest('li');
  li.classList.toggle('completed');
  saveTasks();
  alert("✔️ Task marked as completed!");
}

function deleteTask(button) {
  const li = button.closest('li');
  li.remove();
  saveTasks();
  alert("🗑️ Task deleted.");
}

document.getElementById('filterInput').addEventListener('input', function () {
  const filter = this.value.toLowerCase();
  document.querySelectorAll('#taskList li').forEach(li => {
    const subject = li.dataset.subject.toLowerCase();
    li.style.display = subject.includes(filter) ? '' : 'none';
  });
});

document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

function checkReminders(tasks) {
  const todayStr = new Date().toISOString().split("T")[0];
  const dueToday = tasks.filter(task => task.deadline === todayStr && !task.completed);
  if (dueToday.length > 0) {
    alert(`📢 You have ${dueToday.length} task(s) due today!`);
  }
}

loadTasks();
