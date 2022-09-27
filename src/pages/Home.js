import { DATA, setStorage, getCurrentTodo } from "../utils/function.js";

export const Home = {
    mount: () => {
        // removeAllListeners()
    },

    render: () => {
        const overviewData = [];

        for (let pageType in DATA) {
            DATA[pageType].forEach(page => {
                overviewData.push(page)
            });
        }

        console.log(overviewData)

        const overviewCards = overviewData.map(({name, content}) => {
            const pageName = name;
            const all = content.length
            const unCompleted = content.filter(todo => !todo.checked).length;
            const completed = content.filter(todo => todo.checked).length;
            const progress = isNaN(Math.round(completed / all * 100)) 
                                ? 0 
                                : Math.round(completed / all * 100);

            // href="#/customlist/l8i4wjei1hzozzxso"
            // href="#/top"
            
            return `
                    <a href="#" class="overview__link">
                        <div class="overview__header">${pageName}</div>
                        <div class="overview__content">
                            <div class="overview__text overview__text--column">待完成
                                <span class="overview__number overview__number--lg">${unCompleted}</span>
                            </div>
                            <div class="overview__group">
                                <div class="overview__text">全部
                                    <span class="overview__number overview__number--sm">${all}</span>
                                </div>
                                <div class="overview__text">已完成
                                    <span class="overview__number overview__number--sm">${completed}</span>
                                </div>
                            </div>
                            <div class="overview__progress-bar progress">
                                <span class="progress__value">${progress}%
                                </span>
                                <div class="progress__outer">
                                    <div class="progress__inner"></div>
                                </div>
                            </div>
                        </div>
                    </a>
                `
        }).join('')



        return `
        <!-- 主內容區 header -->
        <div class="main__content-header">
            <div class="container">
                <h2 class="main__title">
                    <div class="main__color-block"></div>
                </h2>
                <!-- 清單選單按鈕 -->
                <button class="btn btn--list-option"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
        </div>


        <!-- main content list -->
        <div class="main__content-list">
            <div class="container">
                <div class="overview">
                ${overviewCards}
                </div>
            </div>
        </div>
    `;
    },

    listener: {
        click: (e) => { },
    },
};

