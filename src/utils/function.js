// mobile 100vh 的問題
export const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};



// 取得 localStorage 的資料
export function getStorage(){
  return JSON.parse(localStorage.getItem('todoLocalData')) || {};
}

// 設定 localStorage 的資料
export function setStorage(data) {
  localStorage.setItem('todoLocalData', JSON.stringify(data));
}

/**
 * 產生一個隨機 id
 * @returns 一個獨一無二的亂數 id
 */
export function createUniqueId(){
  return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36);
}








export function addTodo(todo) {
  const todoInput = document.querySelector('#todo-input');

  if(todoInput.value.trim() !== ''){
    const data = getStorage();
    const todoValue = todoInput.value.trim();
    
    const todo = {
      id: createUniqueId(),
      content: todoInput.value.trim(),
      pin: false,
    };
    
    todoInput.value = '';
  }
}