// 引入路徑模組
import { NotFound } from "../pages/NotFound.js";
import { addListener, removeAllListeners } from "../function/eventListerer.js";
import { Route } from "./Route.js";
import { customlistIdNotFound } from "../function/helper.js";

/**
 * * 取得目前所在頁面的 component
 * @param {*} path 從網址列中接收到的路徑
 * @param {*} routes 從 ./Route.js 引入的路徑集合
 * @returns 若有找到匹配的路徑則返回該物件，若沒有的話則返回空物件。
 */
const getComponent = (path, routes) => {
  // STEP1:若路徑後有斜線,將斜線拿掉處理(排除#根目錄)
  if (path.slice(-1) === "/" && path.match(/\//g).length > 1) {
    path = path.slice(0, -1);
  }
  // STEP2:比對完全符合路徑
  let result =
    routes.find((route) => route.path.match(new RegExp(`^${path}$`))) ||
    undefined;
  // STEP3:若無比對完全符合路徑,判斷是否傳入參數
  if (!result) {
    //尋找符合條件的route
    result = routes.find((route) => {
      //找尋有設定參數的 path
      if (route.path.match(/\/:/g)) {
        //傳入參數初始化
        route.props = {};
        //當前routes路徑目錄陣列(filter去除無效值)
        let routesArr = route.path.split("/").filter((a) => a);
        //當前網址列路徑目錄陣列(filter去除無效值)
        let urlArr = path.split("/").filter((a) => a);
        //逐個比對是否符合路徑
        for (let i = 0; i < routesArr.length; i++) {
          //若有設定傳入參數
          if (routesArr[i].slice(0, 1) === ":") {
            //檢查當前路由是否設定傳入參數及正規表示法比對
            let regex = routesArr[i].match(/[^\:(.)^?]+/g);
            //解構路由陣列
            let [params] = regex;
            //設定傳遞參數值
            route.props[params] = urlArr[i] || ""; //將路徑參數導入組件
          } else {
            //若無設定傳入參數，比對是否完全相同
            if (routesArr[i] !== urlArr[i]) {
              return false;
            }
          }
        }
        return route;
      }
      // 若無使用參數，返回 false
      return false;
    });
  }
  // STEP4:返回結果
  return result || {};
};

export const Router = () => {
  // 如果無 hash 值，則補上斜線
  if (!location.hash) {
    location.hash = "/";
  }

  // 得到目前路徑
  const path = location.hash.slice(1).toLowerCase();

  // 找出對應頁面
  let { component = NotFound, props = {} } = getComponent(path, Route);

  // 檢查網址列 customlist 後的 id 參數是否存在於 DATA 中，
  // 如果頁面不存在，指定 component 為 NotFound
  if (customlistIdNotFound()) {
    component = NotFound;
  }

  // 渲染到指定位置
  const mainContent = document.querySelector(".main__content");

  // 將元件內容渲染至畫面
  mainContent.innerHTML = component.render(props);

  // 如果元件有 mount 屬性，則在 render 後呼叫 mount()
  "mount" in component ? component.mount() : null;

  // 刪除之前的所有已註冊的事件
  removeAllListeners();

  // 新增 listener
  "listener" in component
    ? Object.keys(component["listener"]).forEach((type) => {
        addListener(type, component.listener[type]);
      })
    : null;
};
