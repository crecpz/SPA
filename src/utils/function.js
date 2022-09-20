import { Router } from "../routes/Router.js";

// 初次載入時取得 localStorage 中的資料並存進變量中
export const DATA = getStorage();

// mobile 100vh 的問題
export const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};

// 取得 localStorage 的資料
export function getStorage() {
  // 如果取得的 localStorage 資料為空，則返回一個基本的初始資料
  return (
    JSON.parse(localStorage.getItem("todoLocalData"))
    || {
        top: [],
        custom: [
          // {
          //   listId: "",
          //   listName: "未命名清單",
          //   listColor: "",
          //   listContent: [
          //     // {
          //     //   checked: false,
          //     //   content: "this is todo A.",
          //     //   top: false,
          //     // },
          //   ],
          // },
        ],
      }
  );
}

// 設定 localStorage 的資料
export function setStorage(data) {
  localStorage.setItem("todoLocalData", JSON.stringify(data));
}


/**
 * 取得網址列中的 hash，並利用 RegExp 過濾出網址列最後面的值，該值即為該頁面的 id。
 * @returns id 字符串
 */
export function getCurrentPageId(){
  const hash = window.location.hash;
  const currentPageId = hash.match(/[a-z0-9]*$/)[0] === '' 
    ? 'home' 
    : hash.match(/[a-z0-9]*$/)[0];
  return currentPageId;
}

/**
 * 產生一個隨機 id
 * @returns 一個獨一無二的亂數 id
 */
export function createUniqueId() {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
}


export function setTodo(){
  const todoInput = document.querySelector("#todo-input");

  if (todoInput.value.trim() !== "") {
    const todoValue = todoInput.value.trim();
    // 取得目前頁面的所在位置(取得頁面ID)
    const currentPageId = getCurrentPageId();

    const todo = {
      id: createUniqueId(),
      checked: false,
      content: todoValue,
      top: currentPageId === 'top' , // 凡是在 top 內的都是 true
    };

    DATA.custom.find(i => i.id === currentPageId).content.push(todo);
    setStorage(DATA);
    todoInput.value = "";
  }
  Router();
}

export function renderTodo(){

}

export function addTodo(todo) {
  setTodo();
  renderTodo();
}