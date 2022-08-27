// import {
//   submitBtn,
//   todoList,
//   LOCAL_DATA,
//   inputText,
// } from './variables.js';


// export function addNewTodo() {
//   const todoInput = document.querySelector('#input')
//   let inputText = todoInput.value.trim();

//   if (inputText !== '') {
//     let todoItem = {
//       content: inputText,
//       status: 'pending',
//     };

//     LOCAL_DATA.todos.unshift(todoItem);
//     localStorage.setItem('todoData', JSON.stringify(LOCAL_DATA.todos));
//     renderTodo();
//     todoInput.value = '';
//   }
// }

// export function renderTodo() {
//   let lis = '',
//     checked = '';

//   LOCAL_DATA.todos.forEach((todo, id) => {
//     checked = todo.status === 'pending'
//       ? ''
//       : 'checked';

//     lis += `
//       <li id="${id}" class="todo__item" data-status="${todo.status}">
//         <label class="todo__label">
//           <input type="checkbox" class="todo__checkbox" ${checked}>
//           <span class="todo__text">${todo.content}</span>
//         </label>
//         <button class="todo__option-btn">
//           <i class="fa-solid fa-ellipsis-vertical"></i>
//         </button>
//         <div class="todo__option">
//           <button class="btn todo__edit-btn">Edit</button>
//           <button class="btn todo__delete-btn">Delete</button>
//         </div>
//       </li>
//     `;
//   });

//   return lis;
// }


