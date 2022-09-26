import {  DATA, setStorage,getCurrentTodo } from "../utils/function.js";
import { openListOption, clickToCloseListOption, removeList, openConfirmModal, closeModal, checkbox } from "../layout/main.js";


/**
 * 找出所有頁面內的 todo。
 * 
 * 方法:
 * 找出在 DATA.default 與 DATA.custom 內每一個元素的 content 屬性內的 todo 資料。
 * (會排除 DATA.default 內 id 為 'all' 的元素)
 * @returns 一個包含所有 todo 的 Array
 */
const getAllTodos = () => {
  let allTodos = []
  for(let pageType in DATA) {
    DATA[pageType].forEach(page => {
      // 找出來自於「全部」內原生的 todo
      const ownTodos = page.content.filter(i => i.all === true);
      if(ownTodos.length !== 0){
        allTodos.push(ownTodos);
      }

      // 確認資料是否來自於 all 以外的頁面
      const todosIsFromOtherPage = page.id !== 'all';
      if(todosIsFromOtherPage){
        allTodos.push(page.content)
      }
    })
  }
  // 展開多維陣列
  return allTodos.reduce((arr, cur) => arr.concat(cur), [])
}



export const All = {
  render: function () {
    const dataOfAll = DATA.default.find(page => page.id === 'all');
    // all 的 JSON 資料中的 content 屬性放入所有的 todo
    dataOfAll.content = getAllTodos();
    const { name, content } = dataOfAll;
    const todoContent = content.map((li) => {
      return `
                <li id="${li.id}" class="todo__item">
                    <label class="todo__label">
                        <input type="checkbox" class="todo__checkbox" 
                        ${
                          li.checked ? "checked" : ""
                        }>
                        <span class="todo__checkmark"></span>
                        <p class="todo__content">${li.content}</p>
                    </label>
                    <i class="todo__top ${li.top ? "fa-solid" : "fa-regular"} fa-star"></i> 
                </li>
        `;
    });

    return `
        <!-- 主內容區 header -->
        <div class="main__content-header">
            <div class="container">
                <h2 class="main__title">
                    <div class="main__color-block"></div>
                    ${name}
                </h2>
                <!-- 清單選單按鈕 -->
                <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
                <!-- 清單選單 -->
                <ul class="list-options">
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link">編輯</a>
                    </li>
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link">排序</a>
                    </li>
                </ul>
            </div>
        </div>


        <!-- main content list -->
        <div class="main__content-list">
            <div class="container">
                <ul id="todo" class="todo">
                ${todoContent.join("")}
                </ul>
            </div>
        </div>
    `;
  },

  listener: {
    click: (e) => {
      // 選項(listOption): 刪除清單
      openListOption(e); // 監聽 listOption 按鈕來決定是否開啟 listOption
      clickToCloseListOption(e); // 點擊任意處來關閉 listOption
      openConfirmModal(e); // 偵測使用者是否有點擊 "刪除清單"
      closeModal(e) // 偵測使用者是否有點擊"取消"
      removeList(e) // 偵測使用者是否有點擊"刪除"

      
      // 置頂星號
      if(e.target.classList.contains('todo__top')){ 
        // 取得當前 todo
        const currentTodo = getCurrentTodo(e);
        currentTodo.top = !currentTodo.top;
        e.target.classList.toggle("fa-solid")
        e.target.classList.toggle("fa-regular")
        // 存進 localStorage
        setStorage(DATA);
      }
    },

    change: function(e){
      // checkbox 
      checkbox(e);
    },
  },
};
