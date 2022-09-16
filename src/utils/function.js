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
        currentPageInfo: {
          pageId: "home",
          path: "/",
        },
        pin: [],
        custom: [
          // {
          //   listId: "",
          //   listName: "未命名清單",
          //   listColor: "",
          //   listContent: [
          //     // {
          //     //   checked: false,
          //     //   content: "this is todo A.",
          //     //   pin: false,
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

export function addTodo(todo) {
  setTodo();
  renderTodo();
}

export function setTodo(){
  const todoInput = document.querySelector("#todo-input");

  if (todoInput.value.trim() !== "") {
    const todoValue = todoInput.value.trim();

    const todo = {
      id: createUniqueId(),
      content: todoValue,
      pin: false, // 如果是在 top 頁面則可將其預設 true (之後有空處裡)
    };

    todoInput.value = "";
  }
}

export function renderTodo(){

}



