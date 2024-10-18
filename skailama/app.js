// Utility Functions
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Authentication Logic
function signUp() {
    const username = document.getElementById('sign-up-username').value;
    const password = document.getElementById('sign-up-password').value;

    if (username && password) {
        let users = getFromLocalStorage('users') || [];
        if (users.find(user => user.username === username)) {
            alert('User already exists!');
        } else {
            users.push({ username, password });
            saveToLocalStorage('users', users);
            alert('User registered successfully! Please sign in.');
            clearAuthForm();
        }
    } else {
        alert('Please enter a username and password.');
    }
}

function signIn() {
    const username = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;

    if (username && password) {
        const users = getFromLocalStorage('users') || [];
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            saveToLocalStorage('session', { loggedIn: true, username });
            loadDashboard();
        } else {
            alert('Invalid username or password.');
        }
    } else {
        alert('Please enter a username and password.');
    }
}

function signOut() {
    localStorage.removeItem('session');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
}

// Task Management Logic
function createTask() {
    const title = document.getElementById('task-title').value;
    const dueDate = document.getElementById('task-due').value;
    const session = getFromLocalStorage('session');
    if (session && title && dueDate) {
        let tasks = getFromLocalStorage('tasks') || [];
        tasks.push({ title, dueDate, completed: false, username: session.username });
        saveToLocalStorage('tasks', tasks);
        loadTasks();
        clearTaskForm();
    } else {
        alert('Please fill out the task title and due date.');
    }
}

function completeTask(index) {
    let tasks = getFromLocalStorage('tasks');
    tasks[index].completed = true;
    saveToLocalStorage('tasks', tasks);
    loadTasks();
}

function deleteTask(index) {
    let tasks = getFromLocalStorage('tasks');
    tasks.splice(index, 1);
    saveToLocalStorage('tasks', tasks);
    loadTasks();
}

// Load tasks based on session and populate pending/completed lists
function loadTasks() {
    const session = getFromLocalStorage('session');
    if (session) {
        let tasks = getFromLocalStorage('tasks') || [];
        const userTasks = tasks.filter(task => task.username === session.username);
        const pendingTasks = userTasks.filter(task => !task.completed);
        const completedTasks = userTasks.filter(task => task.completed);

        const pendingList = document.getElementById('pending-tasks');
        const completedList = document.getElementById('completed-tasks');

        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        pendingTasks.forEach((task, index) => {
            pendingList.innerHTML += `<li>${task.title} (Due: ${new Date(task.dueDate).toLocaleString()}) 
                                        <button onclick="completeTask(${index})">Complete</button> 
                                        <button onclick="deleteTask(${index})">Delete</button></li>`;
        });

        completedTasks.forEach((task, index) => {
            completedList.innerHTML += `<li class="completed">${task.title} 
                                        <button onclick="deleteTask(${index})">Delete</button></li>`;
        });
    }
}

// Clear forms
function clearAuthForm() {
    document.getElementById('sign-up-username').value = '';
    document.getElementById('sign-up-password').value = '';
    document.getElementById('sign-in-username').value = '';
    document.getElementById('sign-in-password').value = '';
}

function clearTaskForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-due').value = '';
}

// Load the dashboard if the user is already logged in
function loadDashboard() {
    const session = getFromLocalStorage('session');
    if (session && session.loggedIn) {
        document.getElementById('username-display').textContent = session.username;
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        loadTasks();
    }
}

// Initialize App on Page Load
window.onload = function () {
    loadDashboard();
};
