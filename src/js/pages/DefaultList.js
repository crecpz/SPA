import { todoIsEditing } from "../function/modal.js";
import { changeCheckbox, DATA, saveEditedTodo } from "../function/storage.js";
import {
  createEmptyMsg,
  emptyMsg,
  hasCompletedTodo,
  pageClickEvent,
} from "../function/ui.js";

export const DefaultList = {
  render: () => {
    // 找出此頁面 object
    const pageObj = DATA.default.find(({ id }) => id === "defaultlist");
    const { name: pageName, content: pageContent } = pageObj;

    const todoContent = pageContent
      .map(({ id, checked, content, top }) => {
        return `
                <li id="${id}" class="todo__item ${
          checked ? "todo__item--isChecked" : ""
        }">
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
                </li>`;
      })
      .join("");

    const emptyMsgContent = createEmptyMsg(
      emptyMsg.defaultlist.msgText,
      emptyMsg.defaultlist.svgTag,
      "#888"
    );

    return `
      <div class="container">
        <!-- head -->
        <div class="main__content-head">
          <div class="main__name-wrapper">
            <div class="main__color-block color-block--default"></div>
            <p class="main__name">${pageName}</p>
            <button class="main__clear-completed-btn remove-completed btn btn--primary btn--sm ${
              hasCompletedTodo ? "" : "not-allowed"
            }">
              清除完成事項
            </button>
            <!-- list-option-btn -->
            <button class="main__list-option-btn main__list-option-btn--default-list btn btn--list-option"><i class="fa-solid fa-ellipsis-vertical"></i></button>
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

    change: (e) => {
      //* 變更 checkbox 狀態
      changeCheckbox(e);

      // * 偵測在 todoEditing 為 true 的狀態下 change 事件是否由 .modal__textarea 觸發
      if (todoIsEditing && e.target.classList.contains("modal__textarea")) {
        saveEditedTodo(e);
      }
    },

    keyup: (e) => {
      // 如果按下 Enter，聚焦 input
      if (e.key === "Enter") {
        document.getElementById("todo-input").focus();
      }
    },
  },
};
