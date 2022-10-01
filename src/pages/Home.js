import { scrollBarFix } from "../layout/main.js";
import { DATA, fillZero, getAllPage } from "../utils/function.js";

export const Home = {
    mount: function () {
        scrollBarFix();
    },

    render: function () {
        // 將 DATA 拿過來之後，替換掉 all 的資料，因為在總覽頁面當中，「全部」的這張卡片
        // 應該要顯示的是所有(全站) todo 的數量，而非僅只有 all 本身的 todo。

        // 抓取所有的 todo Obj 放入 allTodos 這個陣列當中
        const allTodos = getAllPage()
            .map(({ content }) => content)
            .reduce((acc, cur) => acc.concat(cur), []);

        // // 為「 全部 」這個總覽卡片重新寫一個 Object，其中，content 放入 allTodos(所有的 todo)
        // const pageObjOfAll = {
        //     id: 'all',
        //     name: '全部',
        //     content: allTodos,
        // }

        // 準備將要顯示的內容
        const contentsWillBedisplayed = getAllPage();
        // 將 all 這個 page Object 內的 content 屬性替換成 allTodos
        contentsWillBedisplayed.find(({id}) => id === 'all').content = allTodos;


        // // 其餘的物件資料保持不變
        // const pageObjsOfOther = getAllPage()
        //     .filter(({ id }) => id !== 'all');


        // console.log(allTodos, pageObjsOfOther)

        // 將 DATA 內的所有 pageObj 資料拉進 overviewData Array 中
        // 每一張卡片都將會利用此 overviewData 來渲染。
        // const overviewData = [{}, pageObjsOfOther];
        // console.log(overviewData)


        DATA.custom.forEach((page) => {
            page.isCustom = true;
            // console.log(page)
        });





        // 利用 map 遍歷 overviewData
        const overviewCards = contentsWillBedisplayed
            .map(({ name: pageName, content, isCustom, id }) => {
                // 以下分別為: 全部數量、未完成數量、已完成數量、完成百分比
                const all = content.length;
                const unCompleted = content.filter((todo) => !todo.checked).length;
                const completed = content.filter((todo) => todo.checked).length;
                const percentage = isNaN(Math.round((completed / all) * 100))
                    ? "0"
                    : fillZero(Math.round((completed / all) * 100));


                return `
                    <a href="#/${isCustom ? "customlist/" + id : id}" class="overview__link">
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
                                <span class="progress__value">${percentage}%
                                </span>
                                <div class="progress__outer">
                                    <div class="progress__inner" style="width:${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
            }).join("");

        return `
            <!-- 主內容區 header -->
            <div class="main__content-header">
                <div class="container">
                    <div class="main__name-wrapper">
                        <div class="main__color-block"></div>
                        <h2 class="main__name">總覽</h2>
                    </div>
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
        // click: (e) => { },
    },
};
