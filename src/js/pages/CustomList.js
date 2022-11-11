// import { scrollBarFix } from "../function/fix.js";
import { scrollBarFix } from "../function/fix.js";
import { getCssVarValue } from "../function/helper.js";
import {
  listIsRemoving,
  nameIsEditing,
  nameSetting,
  removeList,
  removeListConfirm,
  saveNameSetting,
  todoIsEditing,
} from "../function/modal.js";
import { changeCheckbox, DATA, saveEditedTodo } from "../function/storage.js";
import {
  createEmptyMsg,
  emptyMsg,
  hasCompletedTodo,
  pageClickEvent,
} from "../function/ui.js";

export const CustomList = {
  mount: () => {
    scrollBarFix(".main__content-list");
  },

  render: (props) => {
    const pageData = DATA.custom.find((page) => page.id === props.id);
    const { name: pageName, content: pageContent, color } = pageData;
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
                  <i class="top ${top ? "fa-solid" : "fa-regular"} fa-star"></i> 
                </li>`;
      }).join("");

    const emptyMsgContent = createEmptyMsg(
      emptyMsg.customlist.msgText,
      emptyMsg.customlist.svgTag,
      getCssVarValue(`--color-type-${color}`)
    );

    return `
      <!-- 主內容區 - header -->
      <div class="main__content-header">
          <div class="container">
              <div class="main__name-wrapper">
                  <div class="main__color-block color-block-${color}"></div>
                  <p class="main__name">${pageName}</p>
                  <button class="main__clear-completed-btn remove-completed btn btn--primary btn--sm ${
                    hasCompletedTodo ? "" : "not-allowed"
                  }">清除完成事項</button>
                  <!-- list-option-btn -->
                  <button class="main__list-option-btn btn btn--list-option"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              </div>
              <!-- list-options -->
              <ul class="list-options">
                  <li class="list-option">
                    <a href="javascript:;" id="rename-list" class="list-option__link">列表名稱設定</a>
                  </li>
                  <li class="list-option">
                    <a href="javascript:;" id="remove-list" class="list-option__link">刪除列表</a>
                  </li>
                  <li class="list-option list-option--custom-list">
                    <a href="javascript:;" class="list-option__link remove-completed ${
                      hasCompletedTodo ? "" : "not-allowed"
                    }">清除完成事項</a>
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

      // * listOption > 編輯列表名稱
      // 開啟列表名稱設定
      if (e.target.id === "rename-list") {
        nameSetting();
      }
      // 當使用者在 「nameIsEditing 狀態下」 按下 editNameModal 內的 "完成按鈕"
      if (nameIsEditing && e.target.id === "edit-name-close") {
        saveNameSetting(e);
      }

      // * listOption > 刪除列表功能
      // 刪除列表 step1 - 偵測使用者是否有點擊 "刪除列表" 來決定是否開啟 "確認刪除 modal"
      if (e.target.id === "remove-list") {
        // 確認刪除過程
        removeListConfirm();
      }
      // 刪除列表 step2 - 確認目前是否為 listRemoving 狀態，並偵測使用者是否有點擊"確定刪除"
      if (listIsRemoving && e.target.id === "confirm-yes") {
        // 刪除列表在 DATA 中的資料
        removeList(e);
      }
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
