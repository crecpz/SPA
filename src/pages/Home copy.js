import { navSwitcher } from '../layout/nav.js';
import { modeSwitcher } from '../utils/mode.js';
import { openListOption, clickToCloseListOption } from '../layout/main.js';

export const Home = {
    mount: () => {
        // removeAllListeners()
    },

    render: () => {
        return `
    <div class="body-overlay"></div>
    <!-- 側邊nav -->
    <nav id="nav" class="nav">

        <div class="nav__header">
            <!-- hamburger -->
            <button id="nav-hamburger" class="hamburger hamburger--nav">
                <div class="hamburger__bar"></div>
                <div class="hamburger__bar"></div>
                <div class="hamburger__bar"></div>
            </button>

            <!-- dark/light mode -->
            <div id="mode-btns" class="nav__mode-btns">
                <button id="light-mode-btn" class="btn mode-btn mode-btn--light mode-btn--active">Light</button>
                <button id="dark-mode-btn" class="btn mode-btn mode-btn--dark">Dark</button>
            </div>
        </div>

        <div class="nav__content">
            <!-- 預設列表 -->
            <ul class="nav__list default-list">
                <li class="default-list__item nav__list-item nav__list-item--active">總覽</li>
                <li class="default-list__item nav__list-item">置頂</li>
            </ul>
            <!-- 自訂列表 -->
            <div class="custom-list-wrapper">
                <h3 class="custom-list-title">
                    自訂列表
                </h3>
                <ul class="nav__list custom-list">
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        工作
                    </li>
                    <li class="custom-list__item nav__list-item">
                    <div class="custom-list__color"></div>
                    工作
                </li>
                <li class="custom-list__item nav__list-item">
                <div class="custom-list__color"></div>
                工作
            </li>
                    <li class="custom-list__item nav__list-item">
                    <div class="custom-list__color"></div>
                    工作
                    </li>
                    <li class="custom-list__item nav__list-item">
                    <div class="custom-list__color"></div>
                    工作
                    </li>
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        旅遊
                    </li>
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        休閒
                    </li>
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        書
                    </li>
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        目標
                    </li>
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        攝影
                    </li>
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        課業
                    </li>
                    <li class="custom-list__item nav__list-item">
                        <div class="custom-list__color"></div>
                        工作
                    </li>
                </ul>
                <button class="btn btn--add"><i class="fa-solid fa-plus"></i>新增自訂列表</button>
            </div>
        </div>
    </nav>



    <!-- 主內容區 -->
    <main id="main" class="main">
        <header id="main__header" class="main__header">
            <div class="main__container contaner contaner--full-width">
                <!-- hamburger -->
                <button id="main-hamburger" class="hamburger hamburger--main">
                    <div class="hamburger__bar"></div>
                    <div class="hamburger__bar"></div>
                    <div class="hamburger__bar"></div>
                </button>
                <!-- main title for mobile -->
                <h2 class="main__title main__title--mobile">置頂</h2>
                <!-- seach btn -->
                <button class="btn btn--search"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
        </header>
        <section class="main__content">
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
                    <li class="todo__item">
                        <label class="todo__label">
                            <input type="checkbox" class="todo__checkbox">
                            <span class="todo__checkmark"></span>
                            <p class="todo__content">今天看到布魯斯前端群在討論todolist</p>
                        </label>
                        <i class="todo__pin fa-solid fa-thumbtack"></i>
                    </li>

                    <li class="todo__item">
                        <label class="todo__label">
                            <input type="checkbox" class="todo__checkbox">
                            <span class="todo__checkmark"></span>
                            <p class="todo__content">
                                今天看到布魯斯前端群在討論todolist，今天看到布魯斯前端群在討論todolist今天看到布魯斯前端群在討論todolist今天看到布魯斯前端群在討論todolist
                            </p>
                        </label>
                        <i class="todo__pin fa-solid fa-thumbtack"></i>
                    </li>
                    <li class="todo__item">
                        <label class="todo__label">
                            <input type="checkbox" class="todo__checkbox">
                            <span class="todo__checkmark"></span>
                            <p class="todo__content">
                                原來馬斯洛的成長經歷是這樣的.....聽楊老師講完多少有被安慰到，因為他的這些原生家庭經歷除了貓咪那一段之外，其它提到的都跟我的相似，好難得聽到這種[
                                9/30開班！]《CIA通達力》初階班~全方位溝
                                通表達訓練(第38期)讓資源，帶你前往想去的地方。老師您好~聽了妳們很多集也購買了課程，在我心靈成長也很多的助力，謝謝你們，剛剛聽到家長會覺得不再被需要那邊，有師們關於這種想法出現時有甚麼辦法？
                            </p>
                        </label>
                        <i class="todo__pin fa-solid fa-thumbtack"></i>
                    </li>
                    <li class="todo__item">
                        <label class="todo__label">
                            <input type="checkbox" class="todo__checkbox">
                            <span class="todo__checkmark"></span>
                            <p class="todo__content">
                                原來馬斯洛的成長經歷是這樣的.....聽楊老師講完多少有被安慰到，因為他的這些原生家庭經歷除了貓咪那一段之外，其它提到的都跟我的相似，好難得聽到這種[
                                9/30開班！]《CIA通達力》初階班~全方位溝
                                通表達訓練(第38期)讓資源，帶你前往想去的地方。老師您好~聽了妳們很多集也購買了課程，在我心靈成長也很多的助力，謝謝你們，剛剛聽到家長會覺得不再被需要那邊，有師們關於這種想法出現時有甚麼辦法？
                            </p>
                        </label>
                        <i class="todo__pin fa-solid fa-thumbtack"></i>
                    </li>
                    <li class="todo__item">
                        <label class="todo__label">
                            <input type="checkbox" class="todo__checkbox">
                            <span class="todo__checkmark"></span>
                            <p class="todo__content">
                                原來馬斯洛的成長經歷是這樣的.....聽楊老師講完多少有被安慰到，因為他的這些原生家庭經歷除了貓咪那一段之外，其它提到的都跟我的相似，好難得聽到這種[
                                9/30開班！]《CIA通達力》初階班~全方位溝
                                通表達訓練(第38期)讓與資源，帶你前往想去的地方。老師您好~聽了妳們很多集也購買了課程，在我心靈成長也很多的助力，謝謝你們，剛剛聽到家長會覺得不再被需要那邊，有師們關於這種想法出現時有甚麼辦法？
                            </p>
                        </label>
                        <i class="todo__pin fa-solid fa-thumbtack"></i>
                    </li>
                    <li class="todo__item">
                        <label class="todo__label">
                            <input type="checkbox" class="todo__checkbox">
                            <span class="todo__checkmark"></span>
                            <p class="todo__content">
                                原來馬斯洛的成長經歷是這樣的.....聽楊老師講完多少有被安慰到，因為他的這些原生家庭經歷除了貓咪那一段之外，其它提到的都跟我的相似，好難得聽到這種[
                                9/30開班！]《CIA通達力》初階班~全方位溝
                                通表達訓練(第38期)讓原本的你成為自己的力量與資往想去的地方。老師您好~聽了妳們很多集也購買了課程，在我心靈成長也很多的助力，謝謝你要那邊，有想請問一下老師們關於這種想法出現時有甚麼辦法？
                            </p>
                        </label>
                        <i class="todo__pin fa-solid fa-thumbtack"></i>
                    </li>
                    <li class="todo__item">
                        <label class="todo__label">
                            <input type="checkbox" class="todo__checkbox">
                            <span class="todo__checkmark"></span>
                            <p class="todo__content">
                                原來馬斯洛的成長經歷是這樣的.....聽楊老師講完多少有被安慰到，因為他的這些原生家庭經歷除了貓咪那一段之外，其它跟我的相似，好難得聽到這種[
                                9/30開班！]《CIA通達力》初階班~全方位溝 通表達訓練(第38期)讓原本的你成為自己的力量與資源，帶你前往想去的地方。</p>
                        </label>
                        <i class="todo__pin fa-solid fa-thumbtack"></i>
                    </li>
                </ul>
            </div>
        </section>
    </main>
    `;
    },

    listener: {
        click: e => {
            // console.log(e.target)

            // 光線模式切換
            modeSwitcher(e);

            // 點擊漢堡鈕來開啟 nav
            if (e.target.id === 'main-hamburger'
                || e.target.id === 'nav-hamburger') {
                navSwitcher();
            }

            // 如果點按 body-overlay 時 nav 是開啟狀態的，調用 navSwitcher() 來關閉 nav
            if (e.target.classList.contains('body-overlay')
                && document.querySelector('#wrapper').classList.contains('nav-open')) {
                // 切換 nav 展開與收合
                navSwitcher();
            }

            // 控制 listOption 展開與收合
            if (e.target.classList.contains('btn--list-option')) {
                openListOption();
            }

            // 點擊任意處來關閉 listOption
            clickToCloseListOption(e)

        },
    },
}