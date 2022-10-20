import { getAllTodos } from "../function/helper.js";
import { searchPageUnmount, searchPageMount, createEmptyMsg, emptyMsg } from "../function/ui.js";

export const Search = {
  state: {
    isSearching: true,
  },

  mount: () => {
    searchPageMount();
    // const backBtn = document.getElementById('back-btn');
    // const searchBtn = document.getElementById('search-btn');
    // backBtn.classList.remove('hidden');
    // searchBtn.classList.add('hidden');
  },

  render: () => {
    // 準備空白訊息
    const emptyMsgContent = createEmptyMsg(
      emptyMsg.search.msgText,
      emptyMsg.search.svgTag,
      "#888"
    );

    const result = '';

    // <!-- 主內容區 - header -->
    // <div class="main__content-header">
    //     <div class="container">
    //       <div class="search">
    //         <form class="main__form search__form">
    //           <input type="text" id="search-input" class="search__input main__input" />
    //           <i class="fa-solid fa-magnifying-glass"></i>
    //         </form>
    //       </div>
    //     </div>
    // </div>
    return `

      <!-- 主內容區 - list -->
      <div class="main__search-result">
        <div class="container">
          ${emptyMsgContent}
        </div>
      </div>
    `;
  },

  listener: {
    click: (e) => {
      if (e.target.id === "back-btn") {
        searchPageUnmount();
        history.back();
      }
    },

    input: function (e) {
      if(e.target.id === "search-input"){
        const value = e.target.value;
        const allTodo = getAllTodos()
        console.log(
          allTodo.filter(todo => todo.content.includes(value))
        )
      }
    },
  }
};
