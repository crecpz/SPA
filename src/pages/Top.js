import {
  openListOption,
  clickToCloseListOption,
  checkbox,
  scrollBarFix,
} from "../layout/main.js";
import { DATA, getAllPage, getCurrentTodo, setStorage } from "../utils/function.js";

export const Top = {
  mount: function () {
    scrollBarFix();
  },

  render: function () {
    // 集成所有的頁面物件
    const allPages = getAllPage();

    // 找出所有 top 屬性帶有 true 的 todo Object，放入 pageContent 中
    const pageContent = allPages.map(pageObj => pageObj.content)
      .reduce((acc, pageContent) => acc.concat(pageContent), [])
      .filter(todo => todo.top === true);

    // 因為本頁的名稱確定不會做變動，所以這裡直接指定清單名稱
    const pageName = '置頂';

    // 遍歷 pageContent 先準備好所有會在 Top.js 會出現的 todoList
    const todoContent = pageContent.map(({ id, checked, content, top }) => {
      return `
        <li id="${id}" class="todo__item">
            <label class="todo__label">
                <input type="checkbox" class="todo__checkbox" 
                ${checked ? "checked" : ""}>
                <span class="todo__checkmark"></span>
                <p class="todo__content">${content}</p>
            </label>
            <i class="todo__top ${top ? "fa-solid" : "fa-regular"} fa-star"></i> 
        </li>
      `;
    }).join("");

    return `
        <!-- 主內容區 header -->
        <div class="main__content-header">
            <div class="container">
              <div class="main__name-wrapper">
                <div class="main__color-block"></div>
                <h2 class="main__name">${pageName}</h2>
              </div>
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
                ${todoContent}
                </ul>
            </div>
        </div>
    `;
  },

  listener: {
    click: function (e) {

      openListOption(e);
      clickToCloseListOption(e);

      // 新增新事項
      if (e.target.id === "todo-submit") {
        // // 此處要獲取當前頁面的 id，並用該 id 來辨識目前要渲染哪一頁
        // addTodo();
      }

      // 置頂星號
      if (e.target.classList.contains("todo__top")) {
        // 取得當前 todo
        const currentTodo = getCurrentTodo(e);
        currentTodo.top = !currentTodo.top;
        e.target.classList.toggle("fa-solid");
        e.target.classList.toggle("fa-regular");
        // 存進 localStorage
        setStorage(DATA);
      }
    },

    change: function (e) {
      // checkbox
      checkbox(e);
    },
  },
};
