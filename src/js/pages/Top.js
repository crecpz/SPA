// import { scrollBarFix } from "../function/fix.js";
import {
  getAllTodos,
  getCssVarValue,
  getCurrentPage,
  hide,
  unhide,
} from "../function/helper.js";
import {
  clearColorSelectorActive,
  closeConfirmModal,
  closeEditModal,
  closeEditNameModal,
  closeModalOverlay,
  createNewList,
  listIsAdding,
  listIsRemoving,
  removeTodoConfirm,
  todoEditing,
  todoIsEditing,
} from "../function/modal.js";
import { getCurrentTheme } from "../function/mode.js";
import {
  changeCheckbox,
  changeTopByEditModal,
  changeTopByTodoItem,
  DATA,
  removeCompleted,
  removeTodo,
  saveEditedTodo,
} from "../function/storage.js";
import {
  clickToCloseListOption,
  createEmptyMsg,
  emptyMsg,
  openListOption,
  pageClickEvent,
} from "../function/ui.js";

export const Top = {
  mount: function () {
    // scrollBarFix();
  },

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
                <li id="${id}" class="todo__item ${checked ? "todo__item--isChecked" : ""}">
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
        <!-- 主內容區 - header -->
        <div class="main__content-header">
          <div class="container">
            <div class="main__name-wrapper">
              <div class="main__color-block color-block--default"></div>
              <h2 class="main__name">${pageName}</h2>
              <!-- list-option-btn -->
              <button class="main__list-option-btn btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
            <!-- list-options -->
            <ul class="list-options">
                <li class="list-option">
                  <a href="javascript:;" class="list-option__link">編輯</a>
                </li>
                <li class="list-option">
                  <a href="javascript:;" class="list-option__link">排序</a>
                </li>
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
    click: function (e) {
      // * 各頁面通用的 click 事件函數
      pageClickEvent(e);

      // * listOption 開啟 & 關閉
      // 判斷是否要開啟 listOption
      openListOption(e);
      // 點擊任意處來關閉 listOption
      clickToCloseListOption(e);
    },

    change: function (e) {
      //* 變更 checkbox 狀態
      changeCheckbox(e);

      // * 偵測在 todoEditing 為 true 的狀態下 change 事件是否由 .modal__textarea 觸發
      if (todoIsEditing && e.target.classList.contains("modal__textarea")) {
        saveEditedTodo(e);
      }
    },
  },
};
