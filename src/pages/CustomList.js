const datas = JSON.parse(localStorage.getItem('todoData')) || {};


export const CustomList = {
  // content: ;
  state: {
    a: 'a',
    b: 'b',
    c: 'c'
  },

  mount: () => {

  },

  render: function(){

    return this.state.b;
    // return `
    //     <!-- 主內容區 header -->
    //     <div class="main__content-header">
    //         <div class="container">
    //             <h2 class="main__title">
    //                 <div class="main__color-block"></div>
    //                 置頂
    //             </h2>
    //             <!-- 清單選單按鈕 -->
    //             <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
    //             <!-- 清單選單 -->
    //             <ul class="list-option">
    //                 <li class="list-option__item">
    //                     <a href="#" class="list-option__link">重新命名</a>
    //                 </li>
    //                 <li class="list-option__item">
    //                     <a href="#" class="list-option__link">編輯</a>
    //                 </li>
    //                 <li class="list-option__item">
    //                     <a href="#" class="list-option__link">排序</a>
    //                 </li>
    //                 <li class="list-option__item">
    //                     <a href="#" class="list-option__link">刪除清單</a>
    //                 </li>
    //             </ul>
    //         </div>
    //     </div>


    //     <!-- main content list -->
    //     <div class="main__content-list">
    //         <div class="container">
    //             <ul id="todo" class="todo">
    //                 <li class="todo__item">
    //                     <label class="todo__label">
    //                         <input type="checkbox" class="todo__checkbox">
    //                         <span class="todo__checkmark"></span>
    //                         <p class="todo__content">
    //                             原來馬斯洛的成長經歷是這樣的.....聽楊老師講完多少有被安慰到，因為他的這些原生家庭經歷除了貓咪那一段之外，其它提到的都跟我的相似，好難得聽到這種[
    //                             9/30開班！]《CIA通達力》初階班~全方位溝
    //                             通表達訓練(第38期)讓原本的你成為自己的力量與資往想去的地方。老師您好~聽了妳們很多集也購買了課程，在我心靈成長也很多的助力，謝謝你要那邊，有想請問一下老師們關於這種想法出現時有甚麼辦法？
    //                         </p>
    //                     </label>
    //                     <i class="todo__pin fa-solid fa-thumbtack"></i>
    //                 </li>
    //                 <li class="todo__item">
    //                     <label class="todo__label">
    //                         <input type="checkbox" class="todo__checkbox">
    //                         <span class="todo__checkmark"></span>
    //                         <p class="todo__content">
    //                             原來馬斯洛的成長經歷是這樣的.....聽楊老師講完多少有被安慰到，因為他的這些原生家庭經歷除了貓咪那一段之外，其它跟我的相似，好難得聽到這種[
    //                             9/30開班！]《CIA通達力》初階班~全方位溝 通表達訓練(第38期)讓原本的你成為自己的力量與資源，帶你前往想去的地方。</p>
    //                     </label>
    //                     <i class="todo__pin fa-solid fa-thumbtack"></i>
    //                 </li>
    //             </ul>
    //         </div>
    //     </div>
    // `;
  },

  listener: {
    click: e => {

    },
  },
}