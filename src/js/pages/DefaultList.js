// import { scrollBarFix } from "../function/fix.js";
import { scrollBarFix } from "../function/fix.js";
import { todoIsEditing } from "../function/modal.js";
import { changeCheckbox, DATA, saveEditedTodo } from "../function/storage.js";
import {
  createEmptyMsg,
  emptyMsg,
  pageClickEvent,
} from "../function/ui.js";

export const DefaultList = {
  mount: () => {
    scrollBarFix(".main__content-list");
  },

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
                </li>
        `;
      })
      .join("");

    const emptyMsgContent = createEmptyMsg(
      emptyMsg.defaultlist.msgText,
      emptyMsg.defaultlist.svgTag,
      "#888"
    );

    return `
        <!-- 主內容區 - header -->
        <div class="main__content-header">
            <div class="container">
                <div class="main__name-wrapper">
                  <div class="main__color-block color-block--default"></div>
                  <h2 class="main__name">${pageName}</h2>
                  <button id="remove-completed" class="main__clear-completed-btn btn btn--primary btn--sm">
                            清除完成事項
                  </button>
                  <!-- list-option-btn -->
                  <button class="main__list-option-btn main__list-option-btn--default-list btn btn--list-option"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
                <!-- list-options -->
                <ul class="list-options">
                  <li class="list-option">
                    <a href="javascript:;" id="remove-completed" class="list-option__link">清除完成事項</a>
                  </li>
                </ul>
            </div>
        </div>

        <!-- 主內容區 - list -->
        <div class="main__content-list">
            <div class="container">
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
  },
};