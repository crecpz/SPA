const wrapper = document.querySelector('#wrapper'),
  submitBtn = document.querySelector('#submit-btn'),
  todoList = document.querySelector('#todo'),
  LOCAL_DATA = {
    todos: JSON.parse(localStorage.getItem('todoData')) || [],
  };

let inputText = '';

export {
  wrapper,
  submitBtn,
  todoList,
  LOCAL_DATA,
  inputText,
};