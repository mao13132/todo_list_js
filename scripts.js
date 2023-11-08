const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks'),
    count: document.getElementById('count')
}

const _test = document.querySelector('[id="new"]').addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {add_task();}
});

const tasks = JSON.parse(localStorage.getItem('list_task')) || [];

if (tasks) {taskRender(tasks);}

function add_task () {
    const task = dom.new.value;
    
    if (task) {
        addTask(task, tasks);
        dom.new.value = '';
    }
}

// Отслеживает клик по кнопке Добавить задачу
dom.add.onclick = () => {
    add_task()
}

// Проверка на существования задачи с таким же текстом
function _check_text (text) {
    return tasks.some( _task => _task.text === text)
}

// Функция добавления задачи
function addTask(text, list_tasks) {
    const timestamp = Date.now();

    checked = _check_text(text)

    if (checked) {
        alert('Задача уже существует')
        
        return true;
    }

    const task = {
        id: timestamp,
        text,
        isComplete: false,
    };

    list_tasks.push(task)

    taskRender(list_tasks)
}

function _render_html_row(task) {
    return `<div id="${task.id}" class="${task.isComplete ? 'todo__task todo_task_complete' : 'todo__task'}">
                        
                <label class="todo__checkbox">
                    <input type="checkbox"${task.isComplete ? ' checked' : ''}>
                    <div class="todo__checkbox-div"></div>
                </label>

                <div class="todo__task-text">${task.text}
                </div>

                <div class="todo_task-del">-</div>

            </div>`
}


//Смена статуса у задачи
function change_status(id_task, list_tasks) {
    list_tasks.map((task) => {
        if (task.id == id_task) {
            task.isComplete = !task.isComplete
        }        
    });
}

// Функция рендеринга списка задач
function taskRender(task_list) {
    const html_task_list = task_list.map(_render_html_row).join('');
    dom.tasks.innerHTML = html_task_list;
    renderTaskCount(tasks);
    save_local_task_list(tasks);
}

//Функциия отлова клика по родительскому классу
dom.tasks.onclick = (event) => {
    const target = event.target;

    //Проверка парентов на класс
/* if (target.parentNode.classList.contains('todo__checkbox')) {
    console.log(target.parentNode)
} */

//Проверка типа элемента
/* if (target.parentNode.tagName === "INPUT") {
    console.log(target.parentNode);
} */

//проверить кликнули по кнопке делит
if (target.classList.contains('todo_task-del')) {
    
    const task_row = target.parentElement;    // Два раза по предкам поднимаюсь выше
    
    const id_task = task_row.getAttribute('id');

    delete_task(id_task, tasks)

    taskRender(tasks)
}

//Поиск ключевого класса по клику на родителя
if (target.classList.contains('todo__checkbox-div')) {
    const task_status = target.previousElementSibling.checked;

    const task_row = target.parentElement.parentElement;    // Два раза по предкам поднимаюсь выше
    
    const id_task = task_row.getAttribute('id');

    change_status(id_task, tasks);

    taskRender(tasks);
    

    /* console.log(target.previousSibling); */ // Получить предыдущий эллемент включая текст
    
    /* console.log(target.previousElementSibling);     // Получить предыдущий эллемент без текста в dom
    
    console.log(target.previousElementSibling.checked);     // Получить состояния чекеда у предыдущий эллемент без текста в dom */
}

}

// Функция удаления task
function delete_task(id_task, list_task) {
    list_task.map((task, idx) => {
        if (task.id == id_task) {
            list_task.splice(idx, 1);
        }
    })
}

//render count
function renderTaskCount(list_task) {
    dom.count.innerHTML = list_task.length;
}

function save_local_task_list (list_task) {
    localStorage.setItem('list_task', JSON.stringify(list_task));
}