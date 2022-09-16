import { getStorage } from "../utils/function.js";
import { DATA } from "../index.js";

export const CustomList = {
  state: {},

  mount: function () {},

  render: function (props) {
    const pageData = DATA.custom.find((page) => page.id === props.id);
    const { id, name, content } = pageData;

    // console.log(pageData);
    // console.log(id, name, content);
    const lis = content.map((li) => {
      return `
                <li class="todo__item">
                    <label class="todo__label">
                        <input type="checkbox" class="todo__checkbox" checked="${li.checked}">
                        <span class="todo__checkmark"></span>
                        <p class="todo__content">${li.content}</p>
                    </label>
                    <i class="todo__pin fa-solid fa-thumbtack"></i>
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
                <ul class="list-option">
                    <li class="list-option__item">
                        <a href="#" class="list-option__link">重新命名</a>
                    </li>
                    <li class="list-option__item">
                        <a href="#" class="list-option__link">編輯</a>
                    </li>
                    <li class="list-option__item">
                        <a href="#" class="list-option__link">排序</a>
                    </li>
                    <li class="list-option__item">
                        <a href="#" class="list-option__link">刪除清單</a>
                    </li>
                </ul>
            </div>
        </div>


        <!-- main content list -->
        <div class="main__content-list">
            <div class="container">
                <ul id="todo" class="todo">
                ${lis}
                </ul>
            </div>
        </div>
    `;
  },

  listener: {
    click: (e) => {},
  },
};
