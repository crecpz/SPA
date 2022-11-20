import { getAllTodos } from "../function/helper.js";
import { todoIsEditing } from "../function/modal.js";
import { changeCheckbox, DATA, saveEditedTodo } from "../function/storage.js";
import {
  createEmptyMsg,
  emptyMsg,
  hasCompletedTodo,
  pageClickEvent,
} from "../function/ui.js";

export const Top = {
  render: function () {
    // 找出此頁面 object
    const pageObj = DATA.default.find(({ id }) => id === "top");

    // 提取出 pageName
    const { name: pageName } = pageObj;

    // 找出所有 todo 物件中 top 屬性是 true 的元素，存入 pageContent 中
    const pageContent = getAllTodos().filter((todo) => todo.top === true);

    // 遍歷 pageContent: 準備好所有會在 Top.js 會出現的 todoList
    const todoContent = pageContent
      .map(({ id, checked, content, top }) => {
        return `
          <li id="${id}" class="todo__item ${
          checked ? "todo__item--isChecked" : ""}">
            <label class="todo__checkbox checkbox">
              <input type="checkbox" class="checkbox__input" ${
                checked ? "checked" : ""
              }>
              <div class="checkbox__appearance"></div>
            </label>
            <p class="todo__content">${content}</p>
            <i class="top ${
              top ? "fa-solid" : "fa-regular"
            } fa-star"></i> 
          </li>
        `;
      })
      .join("");

    const emptyMsgContent = createEmptyMsg(
      emptyMsg.top.msgText,
      emptyMsg.top.svgTag,
      "#888"
    );

    return `
        <div class="container">
          <!-- head -->
          <div class="main__content-head">
            <div class="main__name-wrapper">
              <div class="main__color-block color-block--default"></div>
              <p class="main__name">${pageName}</p>
              <!-- list-option-btn -->
              <button class="main__list-option-btn main__list-option-btn--default-list btn btn--list-option"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <button class="main__clear-completed-btn remove-completed btn btn--primary btn--sm ${
                hasCompletedTodo ? "" : "not-allowed"
              }">清除完成事項</button>
              <!-- list-options -->
              <ul class="list-options">
                <li class="list-option">
                  <a href="javascript:;" class="list-option__link remove-completed ${
                    hasCompletedTodo ? "" : "not-allowed"
                  }">清除完成事項</a>
                </li>
              </ul>
            </div>
            <!-- 輸入 -->
            <form class="main__form todo-form">
              <input type="text" id="todo-input" class="main__input todo-form__input" placeholder="輸入待辦事項..."><button id="todo-submit" class="btn todo-form__submit"><i class="fa-solid fa-plus"></i></button>
            </form>
          </div>
          <!-- list -->
          <div class="main__content-list">
            <ul id="todo" class="todo">
              ${pageContent.length === 0 ? emptyMsgContent : todoContent}
            </ul>
          </div>
        </div>
    `;
  },

  listener: {
    click: (e) => {
      // * 各頁面通用的 click 事件函數
      pageClickEvent(e);
    },

    change: function (e) {
      //* 變更 checkbox 狀態
      changeCheckbox(e);

      // * 偵測在 todoEditing 為 true 的狀態下 change 事件是否由 .modal__textarea 觸發
      if (todoIsEditing && e.target.classList.contains("modal__textarea")) {
        saveEditedTodo(e);
      }
    },

    keyup: (e) => {
      if (e.key === "Enter") {
        document.getElementById("todo-input").focus();
      }
    },
  },
};
