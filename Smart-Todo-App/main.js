const input = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineTime");
const button = document.getElementById("addBtn");
const tasks = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

/* LOCAL STORAGE */

function saveTasks() {
    const taskArray = [];

    document.querySelectorAll("#taskList li").forEach(li => {
        taskArray.push({
            text: li.querySelector("span").textContent,
            deadline: li.dataset.deadline || "",
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(taskArray)
    );
}

function loadTasks() {
    const storedTasks =
        JSON.parse(localStorage.getItem("todoTasks")) || [];

    storedTasks.forEach(task => {
        createTask(
            task.text,
            task.deadline,
            task.completed
        );
    });

    updateTaskCount();
}

/* CREATE TASK */

function createTask(
    taskText,
    deadline = "",
    completed = false
) {
    const li = document.createElement("li");

    if (completed) {
        li.classList.add("completed");
    }

    li.dataset.deadline = deadline;

    const taskContainer = document.createElement("div");

    const span = document.createElement("span");
    span.textContent = taskText;

    taskContainer.appendChild(span);

    if (deadline) {
        const deadlineSpan =
            document.createElement("small");

        deadlineSpan.classList.add("deadline");
        deadlineSpan.textContent = `Due: ${deadline}`;

        taskContainer.appendChild(deadlineSpan);
    }

    const deleteBtn =
        document.createElement("button");

    deleteBtn.textContent = "Delete";

    li.appendChild(taskContainer);
    li.appendChild(deleteBtn);

    tasks.appendChild(li);

    deleteBtn.addEventListener("click", () => {
        li.remove();
        updateTaskCount();
        saveTasks();
    });

    span.addEventListener("click", () => {

        li.classList.toggle("completed");

        if (li.classList.contains("completed")) {
            tasks.appendChild(li);
        } else {
            tasks.prepend(li);
        }

        updateTaskCount();
        saveTasks();
    });
}

/* ADD TASK */

button.addEventListener("click", () => {

    const taskText = input.value.trim();
    const deadline = deadlineInput.value;

    if (taskText === "") {
        alert("Enter Todo");
        return;
    }

    createTask(taskText, deadline);

    saveTasks();

    input.value = "";
    deadlineInput.value = "";

    updateTaskCount();
});

/* ENTER KEY */

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        button.click();
    }
});

/* TASK COUNT */

function updateTaskCount() {

    const completedTask =
        document.querySelectorAll(".completed").length;

    const totalTasks =
        document.querySelectorAll("#taskList li").length;

    const activeTasks =
        totalTasks - completedTask;

    taskCount.textContent =
        `Task Left : ${activeTasks}`;
}

/* REMINDER SYSTEM */

setInterval(() => {

    document.querySelectorAll("#taskList li")
        .forEach(task => {

            if (
                task.classList.contains("completed")
            ) return;

            const deadline =
                task.dataset.deadline;

            if (!deadline) return;

            const [hours, minutes] =
                deadline.split(":");

            const dueTime = new Date();

            dueTime.setHours(hours);
            dueTime.setMinutes(minutes);
            dueTime.setSeconds(0);
            dueTime.setMilliseconds(0);

            const now = new Date();

            if (
                now >= dueTime &&
                !task.dataset.alertShown
            ) {

                alert(
                    `⚠️ Reminder!\n\n"${task.querySelector("span").textContent}" task abhi tak complete nahi hua.`
                );

                task.classList.add("overdue");

                task.dataset.alertShown = "true";
            }
        });

}, 1000);

/* LOAD TASKS */

loadTasks();