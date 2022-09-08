export function getLocalData(){
  return JSON.parse(localStorage.getItem('todoLocalData')) || {};
}

export function setLocalData(target, data){
  target = data;
}