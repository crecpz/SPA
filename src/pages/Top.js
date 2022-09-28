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
    const { name, content } = DATA.default.find(page => page.id === 'top');
    const todoContent = content.map((li) => {
      return `
                <li id="${li.id}" class="todo__item">
                    <label class="todo__label">
                        <input type="checkbox" class="todo__checkbox" 
                        ${li.checked ? "checked" : ""}>
                        <span class="todo__checkmark"></span>
                        <p class="todo__content">${li.content}</p>
                    </label>
                    <i class="todo__top ${
                      li.top ? "fa-solid" : "fa-regular"
                    } fa-star"></i> 
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
