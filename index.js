document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página (HTML)
    const newTaskForm = document.getElementById('new-task-form');
    const taskNameInput = document.getElementById('task-name-input');
    const taskLabelInput = document.getElementById('task-label-input');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');
    
    let tasks = JSON.parse(localStorage.getItem('tasks-board')) || [];

    
    function saveTasks() {
    
        localStorage.setItem('tasks-board', JSON.stringify(tasks));
    }

    
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: #9ca3af;">Nenhuma tarefa ainda!</p>';
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id;
            if (task.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <div class="task-info">
                    <p class="task-title">${task.name}</p>
                    <div class="task-meta">
                        ${task.label ? `<span class="task-tag">${task.label}</span>` : ''}
                        <span class="task-date">Criado em: ${task.date}</span>
                    </div>
                </div>
                <div>
                    <button class="complete-btn">Concluir</button>
                    <div class="checkmark">✓</div>
                </div>
            `;
            taskList.appendChild(li);
        });
        
        addEventListenersToButtons();
        updateCounter();
    }

    
    function addEventListenersToButtons() {
        document.querySelectorAll('.complete-btn, .checkmark').forEach(button => {
            button.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.id;
                toggleTaskCompletion(parseInt(taskId));
            });
        });
    }

    
    function addTask(e) {
        e.preventDefault();
        const taskName = taskNameInput.value.trim();
        if (taskName === '') return;

        const taskLabel = taskLabelInput.value.trim();
    
        const newId = Date.now();
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

        const newTask = {
            id: newId,
            name: taskName,
            label: taskLabel,
            date: formattedDate,
            completed: false
        };

        tasks.push(newTask);
        
        saveTasks();
        
        taskNameInput.value = '';
        taskLabelInput.value = '';

        renderTasks();
    }

    
    function toggleTaskCompletion(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
        
            saveTasks();
            renderTasks();
        }
    }

    function updateCounter() {
        const completedCount = tasks.filter(task => task.completed).length;
        const taskWord = completedCount === 1 ? 'tarefa' : 'tarefas';
        const verbWord = completedCount === 1 ? 'concluída' : 'concluídas';
        taskCounter.textContent = `${completedCount} ${taskWord} ${verbWord}`;
    }

    newTaskForm.addEventListener('submit', addTask);

    renderTasks();
});