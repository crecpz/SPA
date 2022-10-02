import {
  DATA,
  setStorage,
  getCurrentTodo,
  editName,
  saveEditedName,
} from "../utils/function.js";
import {
  clickToCloseListOption,
  removeList,
  openConfirmModal,
  closeModal,
  changeCheckbox,
  scrollBarFix,
} from "../layout/main.js";

export const CustomList = {
  state: {
    nameEditing: false,
  },

  mount: function () {
    scrollBarFix();
  },

  render: function (props) {
    const pageData = DATA.custom.find((page) => page.id === props.id);
    const { name: pageName, content: pageContent } = pageData;
    const todoContent = pageContent.map(({ id, checked, content, top }) => {
      return `
                <li id="${id}" class="todo__item">
                    <label class="todo__label">
                        <input type="checkbox" class="todo__checkbox" 
                        ${checked ? "checked" : ""}>
                        <span class="todo__checkmark"></span>
                        <p class="todo__content">${content}</p>
                    </label>
                    <i class="todo__top ${
                      top ? "fa-solid" : "fa-regular"
                    } fa-star"></i> 
                </li>
        `;
    });

    return `
        <!-- 主內容區 header -->
        <div class="main__content-header">
            <div class="container">
                <div class="main__name-wrapper">
                    <div class="main__color-block"></div>
                    <input type="text" class="main__name" value="${pageName}" readonly>
                </div>
                <!-- 清單選單按鈕 -->
                <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
                <!-- 清單選單 -->
                <ul class="list-options">
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link list-option__link--rename">重新命名</a>
                    </li>
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link">編輯</a>
                    </li>
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link">排序</a>
                    </li>
                    <li class="list-option">
                      <a href="javascript:;" class="list-option__link list-option__link--remove">刪除清單</a>
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
      // 點擊任意處來關閉 listOption
      clickToCloseListOption(e);

      // 判斷是否要開啟 listOption
      if (e.target.classList.contains("btn--list-option")) {
        // 監聽 listOption 按鈕來決定是否開啟 listOption
        const listOptions = document.querySelector(".list-options");
        listOptions.classList.toggle("list-options--open");
      }

      // 刪除清單 - 偵測使用者是否有點擊 "刪除清單" 來決定是否開啟「確認刪除 modal」
      if (e.target.classList.contains("list-option__link--remove")) {
        openConfirmModal();
      }

      // 刪除清單 - 偵測使用者是否有點擊"取消"
      if (e.target.classList.contains("btn--modal")) {
        closeModal(e);
      }

      // 刪除清單 - 偵測使用者是否有點擊"刪除"
      if (e.target.id === "confirm-yes") {
        removeList(e);
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

      // 清單重新命名
      if (e.target.classList.contains("list-option__link--rename")) {
        editName();
      }

      // 儲存已經改動的清單名稱
      if (
        // 如果目前處於編輯中
        CustomList.state.nameEditing &&
        // 且如果目前點擊的對象不是 list-option 內的「重新命名」
        !e.target.classList.contains("list-option__link--rename") &&
        // 且如果目前點擊的對象不是編輯輸入框本身
        !e.target.classList.contains("main__name")
      ) {
        // 就儲存已編輯的文字
        saveEditedName();
      }
    },

    change: (e) => {
      // 變更 checkbox 
      changeCheckbox(e);
    },

    keyup: (e) => {
      if (e.key === "Enter") {
        // 如果編輯模式下按 enter 則儲存編輯
        saveEditedName();
      }
    },
  },
};
