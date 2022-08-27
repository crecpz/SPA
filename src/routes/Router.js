// 引入路徑模組
import { NotFound } from '../pages/NotFound.js';
import { addListener, removeAllListeners } from '../utils/eventListerer.js';
import { Route } from './Route.js';
import { wrapper } from '../utils/variables.js';


/**
 * 
 * @param {*} path 從網址列中接收到的路徑
 * @param {*} routes 從./Route.js引入的路徑集合
 * @returns 若有找到匹配的路徑則返回該物件，若沒有的話則返回空物件。
 */
const getComponent = (path, routes) => {
  return routes.find(r => r.path.match(new RegExp(`^${path}$`))) || {};
}

export const Router = () => {
  if (!location.hash) {
    location.hash = '/';
  }

  // 得到目前路徑(對應route)
  const path = location.hash.slice(1).toLowerCase();


  // 找出對應頁面
  /* ES6 解構賦值: 提取getComponent(path, Route)返回值中的component屬性
      預設值: 當要獲取的屬性返回值是undefined時，將使用事先設定好的預設值。
  */
  const { component = NotFound } = getComponent(path, Route);


  // 將元件內容渲染至畫面
  wrapper.innerHTML = component.render();

  // 如果元件有 mount 屬性，則在 render 後呼叫 mount()
  'mount' in component
    ? component.mount()
    : null;

  // 刪除之前的所有已註冊的事件
  removeAllListeners();

  'listener' in component
    ? Object.keys(component['listener'])
      .forEach(type => {
        addListener(type, component.listener[type])
      })
    : null;
}