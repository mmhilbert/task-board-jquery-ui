// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const taskFormEl = $('#addTaskForm');
const taskTitleInputEl = $('#taskTitle');
const taskDateInputEl = $('#taskDate');
const taskDescriptionInputEl = $('#taskDescription');

// Lists
const todoEl = $("#todo-cards")
const inProgressEl = $("#in-progress-cards") 
const doneEl = $("#done-cards") 

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let currentId = 1

    if (nextId) {
        currentId = nextId
    } 

    nextId = Number(currentId) + 1
    localStorage.setItem("nextId", nextId)

    return currentId
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $(`
    <div class="card draggable" data-id="${task.id}" data-status="${task.status}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.date}</p>
        <p class="card-text">${task.description}</p>
        <button class="btn btn-danger delete-card">Delete</button>
      </div>
    </div>
  `)
  return card
}

function getTasksFromLocalStorage() {
    const taskList = JSON.parse(localStorage.getItem('tasks')) || []
    return taskList
}

function saveTaskstoLocalStorage(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList))
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const savedTasks = getTasksFromLocalStorage()

    todoEl.empty()
    inProgressEl.empty()
    doneEl.empty()
 
    for (const task of savedTasks) {
        const cardEl = createTaskCard(task)

        if (task.status === 'todo') {
            todoEl.append(cardEl)
        } else if (task.status === 'in-progress') {
            inProgressEl.append(cardEl)
        } else {
            doneEl.append(cardEl)
        }
    }

    $('.draggable').draggable({
        stack: '.swim-lanes'
      })
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
 event.preventDefault()

 const taskTitle = taskTitleInputEl.val()
 const taskDate = taskDateInputEl.val()
 const taskDescription = taskDescriptionInputEl.val()

 // get task list from local storage
    let taskList = getTasksFromLocalStorage()

 const newTaskObject = {
    id: generateTaskId(),
    title: taskTitle,
    date: taskDate,
    description: taskDescription,
    status: "todo" 
 }
 // add to task list
taskList.push(newTaskObject)

saveTaskstoLocalStorage(taskList)

renderTaskList()

taskTitleInputEl.val('')
taskDateInputEl.val('')
taskDescriptionInputEl.val('')

var myModalEl = document.getElementById('formModal');
var modal = bootstrap.Modal.getInstance(myModalEl)
modal.hide();

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    console.log("DELETE")
    console.log(event.target.closest('.card'))
    const taskId = $(event.target).closest('.card').data('id') 
    
    // get saved tasks from local storage
    const tasks = getTasksFromLocalStorage()
    // loop through tasks 
    // // remove task with id of the onlick card
    const tasksToKeep = tasks.filter(function(task) {
        return task.id !== taskId
    })

    // save tasklist to local storage
    saveTaskstoLocalStorage(tasksToKeep)

    // render task list
    renderTaskList()
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    console.log(ui)
    console.log(event)
    const targetListId = event.target.id.replace('-cards', '')
    const card = ui.draggable[0]
    const taskId = $(card).data('id')

    const tasks = getTasksFromLocalStorage() 
    for (const taskData of tasks) {
         
        if(taskData.id === taskId) {
            taskData.status = targetListId
        }
    } 
    saveTaskstoLocalStorage(tasks)


    renderTaskList()

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    taskFormEl.on("submit", handleAddTask)
    renderTaskList()

    $('.swim-lane').droppable({
        drop: handleDrop
    })

    $('.swim-lanes').on('click', '.delete-card', handleDeleteTask)
});
