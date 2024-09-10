import fs from 'fs';
import inquirer from 'inquirer';

function loadTasks() {
  try {
    const data = fs.readFileSync('tasks.json');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks));
}
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Add a task', 'List tasks', 'Update a task', 'Delete a task', 'Exit']
        }
    ]).then(answers => {
        switch (answers.action) {
            case 'Add a task':
                addTask();
                break;
            case 'List tasks':
                listTasks();
                break;
            case 'Update a task':
                updateTasks();
                break;
            case 'Delete a task':
                deleteTasks();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
                break;
        }
    });
}


function addTask(){
    inquirer.prompt([
        {
        type: 'input',
        name: 'description',
        message: 'Enter the task description'
        }
    ]).then(answers => {
        const tasks = loadTasks();
        tasks.push({description : answers.description, status : 'todo'});
        saveTasks(tasks);
        console.log('Task added successfully');
    }).finally(() => mainMenu());
}

function listTasks(){
    const tasks = loadTasks();
    if(tasks.length === 0){
        console.log('No tasks');
        return;
    }
    console.log("\nTo Do:");
    tasks.filter(task => task.status === 'todo').forEach(task =>
         console.log(`- ${task.description}`));

    console.log("\nIn Progress:");
    tasks.filter(task => task.status === 'inProgress').forEach(task =>
         console.log(`- ${task.description}`));

    console.log("\nCompleted:");
    tasks.filter(task => task.status === 'completed').forEach(task =>
         console.log(`- ${task.description}`));
    
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select an option',
            choices: ['Exit', 'Main menu'],
        }
    ]).then(answers => {
        if(answers.action === 'Main menu'){
            mainMenu();
        }
    });

}

function updateTasks(){
    const tasks = loadTasks();
    inquirer.prompt([{
        type: 'list',
        name: 'task',
        message: 'Select the task to update',
        choices: tasks.map(task => task.description)
    },{
        type: 'list',
        name: 'status',
        message: 'Select the new status',
        choices: ['todo', 'inProgress', 'completed']
    }]).then(answers =>{
        const task = tasks.find(task => task.description === answers.task);
        task.status = answers.status;
        saveTasks(tasks);
        console.log('Task updated successfully');
    }).finally(() => mainMenu());
 
}

function deleteTasks(){
    const tasks = loadTasks();
    inquirer.prompt([{
        type: 'list',
        name: 'task',
        message: 'Select the task to delete',
        choices: tasks.map(task => task.description)
    }]).then(answers =>{
        const updatedTasks = tasks.filter(task => task.description !== answers.task);
        saveTasks(updatedTasks);
        console.log('Task deleted successfully');
    }).finally(() => mainMenu());
}

inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['Add task', 'List tasks', 'Update task', 'Delete task', 'Exit']
}]).then(answers => {
    switch(answers.action){
        case 'Add task':
            addTask();
            break;
        case 'List tasks':
            listTasks();
            break;
        case 'Update task':
            updateTasks();
            break;
        case 'Delete task':
            deleteTasks();
            break;
        case 'Exit':
            break;
    }
});