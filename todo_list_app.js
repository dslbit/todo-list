/*
 * (C) Copyright 2022 Douglas Lima (https://github.com/dreamycreat) 
*/

// NOTE: Search for "run"

//
// Model section
//

let todos;
const todosKey = 'todos';

let todosDone;
const todosDoneKey = 'todosDone';

let savedTodos = JSON.parse(localStorage.getItem(todosKey));
let savedTodosDone = JSON.parse(localStorage.getItem(todosDoneKey));

if(Array.isArray(savedTodos)) {
	todos = savedTodos;
} else {
	todos = [];
}

if(Array.isArray(savedTodosDone)) {
	todosDone = savedTodosDone;
} else {
	todosDone = [];
}

function saveTodos() {
	localStorage.setItem(todosKey, JSON.stringify(todos));
	localStorage.setItem(todosDoneKey, JSON.stringify(todosDone));
}

// Creates a todo
function createTodo(title, dueDate, done, isEditing) {

	/* truquezinho para transformar um número para string */
	const id = '' + new Date().getTime();

	todos.push( {
		id,
		title,
		dueDate,
		done,
		isEditing
	});

	saveTodos();
}

// Deletes a todo
function deleteTodo(idToDelete, isTodoDone) {

	if(isTodoDone === 'false')	{
		todos = todos.filter(function (todo) {
			if(todo.id === idToDelete) {
				return false;
			} else {
				return true;
			}
		});
	} else {
		todosDone = todosDone.filter(function (todo) {
			if(todo.id === idToDelete) {
				return false;
			} else {
				return true;
			}
		});
	}

	saveTodos();
}

// NOTE: Verifica se uma tarefa foi marcada como "feita"
function todoCheck(checkbox) {

	if(checkbox.checked === true) {
		todos = todos.filter(function (arrObj) {
			if(arrObj.id === checkbox.dataset.todoId) {
				arrObj.done = checkbox.checked;
				todosDone.push(arrObj);
				return false;
			} else {
				return true;
			}
		});
	} else {
		todosDone = todosDone.filter(function (arrObj) {
			if(arrObj.id === checkbox.dataset.todoId) {
				arrObj.done = checkbox.checked;
				todos.push(arrObj);
				return false;
			} else {
				return true;
			}
		});
	}

	saveTodos();
}

function editTodo(idToEdit, isTodoDone) {

	if(isTodoDone === 'false') {
		todos.forEach(function (arrObj) {
			if(arrObj.id === idToEdit) {
				arrObj.isEditing = true;
			}
		});
	}	else {
		todosDone.forEach(function (arrObj) {
			if(arrObj.id === idToEdit) {
				arrObj.isEditing = true;
			}
		});
	}

}

function doneEditingTodo(newTitle, newDate, idDoneEditing, isTodoDone) {

	if(isTodoDone === 'false') {
		todos.forEach(function (arrObj) {
			if(arrObj.id === idDoneEditing) {
				arrObj.title = newTitle;
				arrObj.dueDate = newDate;
				arrObj.isEditing = false;
			}
		});
	} else {
		todosDone.forEach(function (arrObj) {
			if(arrObj.id === idDoneEditing) {
				arrObj.title = newTitle;
				arrObj.dueDate = newDate;
				arrObj.isEditing = false;
			}
		});
	}

	saveTodos();
}

function cancelEditingTodo(idToCancelEditing, isTodoDone) {

	if(isTodoDone === 'false') {
		todos.forEach(function (arrObj) {
			if(arrObj.id === idToCancelEditing) {
				arrObj.isEditing = false;
			}
		});
	} else {
		todosDone.forEach(function (arrObj) {
			if(arrObj.id === idToCancelEditing) {
				arrObj.isEditing = false;
			}
		});
	}
}

function clearAllTodosData() {
	todos = [];
	todosDone = [];
	saveTodos();
}



//
// View section
//

function createEditingTodoElements(arrObj) {
	let element = document.createElement('div');
	element.classList.add('todos-container');

	let editTextBox = document.createElement('input');
	editTextBox.type = 'text';
	editTextBox.maxLength = '25';
	editTextBox.value = arrObj.title;
	editTextBox.id = 'edit-text';
	editTextBox.classList.add('edit-todo-text');
	element.appendChild(editTextBox);

	let editDueDate = document.createElement('input');
	editDueDate.type = 'date';
	editDueDate.value = arrObj.dueDate;
	editDueDate.id = 'edit-date';
	editDueDate.classList.add('edit-todo-date');
	element.appendChild(editDueDate);

	let doneCancelButtonsDiv = document.createElement('div');
	doneCancelButtonsDiv.classList.add('done-cancel-buttons-container');

	let doneButton = document.createElement('button');
	doneButton.textContent = 'Done';
	doneButton.dataset.todoId = arrObj.id;
	doneButton.dataset.todoDone = arrObj.done;
	doneButton.onclick = doneButtonClick;
	doneButton.classList.add('done-editing-button');
	doneCancelButtonsDiv.appendChild(doneButton);
	element.appendChild(doneCancelButtonsDiv);

	let cancelEditingButton = document.createElement('button');
	cancelEditingButton.textContent = 'Cancel';
	cancelEditingButton.dataset.todoId = arrObj.id;
	cancelEditingButton.dataset.todoDone = arrObj.done;
	cancelEditingButton.onclick = cancelEditingTodoButton;
	cancelEditingButton.classList.add('cancel-editing-button');
	doneCancelButtonsDiv.appendChild(cancelEditingButton);
	element.appendChild(doneCancelButtonsDiv);

	return element;
}

function createTodoElements(arrObj) {
	let element = document.createElement('div');
	element.classList.add('todos-container');

	let textLabel = document.createElement('label');
	textLabel.textContent = arrObj.title;
	if(arrObj.done)	{
		textLabel.classList.add('done-text-label');
	} else {
		textLabel.classList.add('todo-text-label');
	}

	let textLabelSpan = document.createElement('span');
	textLabelSpan.textContent = ' (' + arrObj.dueDate + ')';
	textLabel.appendChild(textLabelSpan);

	element.appendChild(textLabel);

	let labelCheckbox = document.createElement('label');
	labelCheckbox.classList.add('todo-checkbox-container');

	let todoCheckbox = document.createElement('input');
	todoCheckbox.type = 'checkbox';
	todoCheckbox.classList.add('todo-checkbox');
	todoCheckbox.onchange = checkTodo;
	todoCheckbox.dataset.todoId = arrObj.id;
	todoCheckbox.checked = arrObj.done;
	labelCheckbox.prepend(todoCheckbox);
	element.prepend(labelCheckbox);

	const editDeleteButtonsDiv = document.createElement('div');
	editDeleteButtonsDiv.classList.add('edit-delete-buttons-container');

	const editButtonContainer = document.createElement('div');
	editButtonContainer.classList.add('todo-edit-button-container');
	
	const editButtonIcon = document.createElement('img');
	editButtonIcon.classList.add('edit-button-icon');
	editButtonIcon.src = 'icons/edit-icon.svg';
	editButtonContainer.appendChild(editButtonIcon);

	const editButton = document.createElement('button');
	editButton.textContent = '';
	editButton.classList.add('todo-edit-button');
	editButton.dataset.todoId = arrObj.id;
	editButton.dataset.todoDone = arrObj.done;
	editButton.onclick = editTodoButton;
	editButtonContainer.appendChild(editButton);
	editDeleteButtonsDiv.appendChild(editButtonContainer);
	element.appendChild(editDeleteButtonsDiv);

	const deleteButtonContainer = document.createElement('div');
	deleteButtonContainer.classList.add('todo-delete-button-container');

	const deleteButtonIcon = document.createElement('img');
	deleteButtonIcon.classList.add('edit-button-icon');
	deleteButtonIcon.src = 'icons/delete-icon.svg';
	deleteButtonContainer.appendChild(deleteButtonIcon);

	const deleteButton = document.createElement('button');
	deleteButton.textContent = '';
	deleteButton.classList.add('todo-delete-button');
	deleteButton.onclick = removeTodo;
	deleteButton.id = arrObj.id;
	deleteButton.dataset.todoDone = arrObj.done;
	deleteButtonContainer.appendChild(deleteButton);
	editDeleteButtonsDiv.appendChild(deleteButtonContainer);
	element.appendChild(editDeleteButtonsDiv);

	return element;
}

function render() {
	document.getElementById('todo-list').innerHTML = '';
	document.getElementById('todo-checked-list').innerHTML = '';

	todos.forEach(function (arrObj) {
		if(arrObj.isEditing === false) {
			let todoList = document.getElementById('todo-list');
			todoList.appendChild(createTodoElements(arrObj));
		} else {
			let todoList = document.getElementById('todo-list');
			todoList.appendChild(createEditingTodoElements(arrObj));
		}
	});

	todosDone.forEach(function (arrObj) {
		if(arrObj.isEditing === false) {
			let todoCheckedList = document.getElementById('todo-checked-list');
			todoCheckedList.appendChild(createTodoElements(arrObj));
		} else {
			let todoCheckedList = document.getElementById('todo-checked-list');
			todoCheckedList.appendChild(createEditingTodoElements(arrObj));
		}
		
	});
}



//
// Controller section
//

function addTodo() {
	let textbox = document.getElementById('todo-title');
	let title = textbox.value;

	let date = document.getElementById('due-date');
	let dueDate = date.value;

	let done = false;
	let isEditing = false;

	if(title === '') {
		alert('Sorry, the title cannot be empty. Try it again, this time writing a title.');
	} else if (dueDate === '') {
		alert('Sorry, the date cannot be empty. Try it again, this time selecting a date.');
	} else {
		textbox.value = '';
		textbox.setAttribute('placeholder', 'Done');
		date.value = '';

		createTodo(title, dueDate, done, isEditing);

		render();
	}
}

function clearAllTodos() {
	clearAllTodosData();
	
	render();
}

function removeTodo(event) {
	const deleteButton = event.target;
	const idToDelete = deleteButton.id;
	const isTodoDone = deleteButton.dataset.todoDone;

	deleteTodo(idToDelete, isTodoDone);

	render();
}

function checkTodo(event) {
	let checkbox = event.target;

	todoCheck(checkbox);
	render();
}

function editTodoButton(event) {
	const button = event.target;
	const idToEdit = button.dataset.todoId;
	const isTodoDone = button.dataset.todoDone;

	editTodo(idToEdit, isTodoDone);
	render();
}

function doneButtonClick(event) {
	let editTextBox = document.getElementById('edit-text');
	let newTitle = editTextBox.value;

	let editDate = document.getElementById('edit-date');
	let newDate = editDate.value;

	if(newTitle === '') {
		alert('the edit title cannot be empty');
	} else if (newDate === '') {
		alert('new date cannot be empty');
	} else {
		let button = event.target;
		const idDoneEditing = button.dataset.todoId;
		const isTodoDone = button.dataset.todoDone;

		doneEditingTodo(newTitle, newDate, idDoneEditing, isTodoDone);
		render();
	}
}

function cancelEditingTodoButton(event) {
	let button = event.target;
	const idCancelEditing = button.dataset.todoId;
	const isTodoDone = button.dataset.todoDone;

	cancelEditingTodo(idCancelEditing, isTodoDone);
	render();
}

/* run */
render();
