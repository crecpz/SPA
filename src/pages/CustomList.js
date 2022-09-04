const datas = JSON.parse(localStorage.getItem('todoData')) || {};


// let ul = 
//   `<li class="todo__item">
//       <label class="todo__label">
//           <input type="checkbox" class="todo__checkbox">
//           <span class="todo__checkmark"></span>
//           <p class="todo__content">${datas[0].content}</p>
//       </label>
//       <i class="todo__pin fa-solid fa-thumbtack"></i>
//     </li>`;


export const CustomList = {
  // content: ;
  state: {

  },

  mount: () => {

  },

  render: () => {
    return `
      
      <div class="container">
        <!-- 主內容區 header -->
        <div class="main__content-header">
            <h2 class="main__title">置頂</h2>
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

        <!-- main content list -->
        <ul id="todo" class="todo">
   
        </ul>
    </div>
  `;
  },

  listener: {
    click: e => {

    },
  },
}