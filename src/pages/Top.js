import {
  openListOption,
  clickToCloseListOption,
  checkbox,
  scrollBarFix,
} from "../layout/main.js";
import { DATA } from "../utils/function.js";

export const Top = {
  mount: function () {
    scrollBarFix();
  },

  render: function () {
    const { name: pageName, content: pageContent } = DATA.default.find(
      (page) => page.id === "top"
    );
    const todoContent = pageContent.map(({ id, checked, content, top }) => {
      return `
        <li id="${id}" class="todo__item">
            <label class="todo__label">
                <input type="checkbox" class="todo__checkbox" 
                ${checked ? "checked" : ""}>
                <span class="todo__checkmark"></span>
                <p class="todo__content">${content}</p>
            </label>
            <i class="todo__top ${ top ? "fa-solid" : "fa-regular" } fa-star"></i> 
        </li>
      `;
    });

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
                ${todoContent.join("")}
                </ul>
            </div>
        </div>
    `;
  },

  listener: {
    click: function (e) {
      openListOption(e);
      // 點擊任意處來關閉 listOption
      clickToCloseListOption(e);

      // 新增新事項
      if (e.target.id === "todo-submit") {
        // // 此處要獲取當前頁面的 id，並用該 id 來辨識目前要渲染哪一頁
        // addTodo();
      }
    },

    change: function (e) {
      // checkbox
      checkbox(e);

      // Uncaught TypeError: currentPage is undefined function.js:84:23
      // 因為 function.js:82 的 currentPage 是來自於 getCurrentCustomPage()
      // getCurrentCustomPage() 只取得 CustomPage ， 沒有取得 top ，所以獲到 undefined
      // 要如何更改 getCurrentCustomPage() ，讓這個函數透過網址列 id ，就可以獲取到無論是
      // 預設清單的內容還是自訂清單的內容?

      // 如果寫出這個函數，就可以去更改 getCurrentCustomPage()，這個弄好，我的 checkbox 就
      // 可以到處通用了
    },
  },
};
