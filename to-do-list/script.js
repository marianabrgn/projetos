const inputTask = document.querySelector(".campo-preenche-tarefa");
const inputButton = document.querySelector(".botao-adiciona-tarefa");
const taskList = document.querySelector(".lista-de-tarefas");

function adicionarTarefa() {
    const isTaskValid = taskValidation();
    const tasksLimit = determinarLimiteLista();

    if (!isTaskValid) {
        if(tasksLimit < 9){
            const taskContainer = document.createElement("div");    // div que contém a tarefa e icones
            taskContainer.classList.add("task-item");

            const taskText = document.createElement("p");
            taskText.innerText = inputTask.value;
            
            const iconsContainer = document.createElement("div");
            iconsContainer.classList.add("icon-container");

            const completeItem = document.createElement("span");    //item de checkbox;
            completeItem.classList.add("icon-item");
            const deleteItem = document.createElement("span");      //item de deleção;
            deleteItem.classList.add("icon-item");

            taskContainer.appendChild(taskText);
            iconsContainer.appendChild(completeItem);
            iconsContainer.appendChild(deleteItem);
            taskContainer.appendChild(iconsContainer);
            taskList.appendChild(taskContainer);

            completeItem.addEventListener("click", function(){concluirTarefa(taskText)});
            deleteItem.addEventListener("click", function(){removerTarefa(taskContainer)});
        } else {
            alert("Limite de lista atingido. Para adicionar mais tarefas, exclua alguma.")
        }
    }
    inputTask.value = "";
}

function determinarLimiteLista(){
    const taskNumber = document.querySelectorAll(".task-item");
    return taskNumber.length;
}

function callback(testTask) {
    return testTask == " "; 
}

function taskValidation() {
    let task = inputTask.value;
    let testTask = task.split("");

    return testTask.every(callback); 
}

function concluirTarefa(task) {
    task.classList.toggle("check-task");
}

function removerTarefa(task) {
    taskList.removeChild(task);
}

inputButton.addEventListener("click", adicionarTarefa);
