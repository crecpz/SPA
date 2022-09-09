export function getLocalData(){
  return JSON.parse(localStorage.getItem('todoLocalData')) || {};
}

export function setLocalData(target, data){
  target = data;
}



// 取得 localStorage 的資料
export function getStorage(){
  return JSON.parse(localStorage.getItem('todoLocalData'));
}

// 設定 localStorage 的資料
export function setStorage(data) {
  localStorage.setItem('todoLocalData', JSON.stringify(data));
}








export function addTodo(todo) {
  const todoInput = document.querySelector('#todo-input');


  if(todoInput.value.trim() !== ''){
    const data = getStorage();
    // console.log(this)
    


    
    todoInput.value = '';
  }
}