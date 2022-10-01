import { DATA, setStorage, getCurrentTodo } from "../utils/function.js";

import {
  clickToCloseListOption,
  checkbox,
  scrollBarFix,
  dropdownSwitch,
  searchOriginTodo,
} from "../layout/main.js";

export const All = {
  mount: function () {
    scrollBarFix();
  },

  render: function () {
    //  將有頁面的物件資料放進 pageObjs
    let pageObjs = [];

    for (let pageType in DATA) {
      pageObjs.push(...DATA[pageType]);
    }

    const dropdownsContent = pageObjs
      .map(({ name, content }) => {
        // 判斷如果 content 沒任何內容，就渲染空字串就好
        if (content.length === 0) {
          return "";
        } else {
          return `
            <li class="dropdown">
              <div class="dropdown__name">
                <i class="dropdown__arrow fa-solid fa-chevron-right"></i>
                ${name}
              </div>
              <div class="dropdown__cover">
                <ul class="todo">
                  ${content
                    .map(({ id, checked, content, top }) => {
                      return `
                        <li id="${id}" class="todo__item">
                          <label class="todo__label">
                              <input type="checkbox" 
                                    class="todo__checkbox"
                                    ${checked ? "checked" : ""}
                              >
                              <span class="todo__checkmark"></span>
                              <p class="todo__content">${content}</p>
                          </label>
                          <i class="todo__top ${
                            top ? "fa-solid" : "fa-regular"
                          } fa-star"></i> 
                        </li>
                      `;
                    })
                    .join("")}
                </ul>
              </div>
            </li>
          `;
        }
      })
      .join("");

    return `
        <!-- 主內容區 header -->
        <div class="main__content-header">
          <div class="container">
            <div class="main__name-wrapper">
              <div class="main__color-block"></div>
              <h2 class="main__name">全部</h2>
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
            <ul class="dropdowns">
              ${dropdownsContent}
            </ul>
          </div>
        </div>
    `;
  },

  listener: {
    click: function (e) {
      // searchOriginTodo(e.target.closest('li').id)

      // 判斷是否要開啟 listOption
      if (e.target.classList.contains("btn--list-option")) {
        // 監聽 listOption 按鈕來決定是否開啟 listOption
        const listOptions = document.querySelector(".list-options");
        listOptions.classList.toggle("list-options--open");
      }

      // 點擊任意處來關閉 listOption
      clickToCloseListOption(e);

      // dropdown
      if (e.target.classList.contains("dropdown__name")) {
        dropdownSwitch(e);
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
