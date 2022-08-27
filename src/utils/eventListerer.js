export const eventHandlers = {};

//對body增加監聽事件
export const addListener = (type, handler, capture = false) => {
  //判斷若沒該事件類型,則新增事件屬性並賦予陣列初始值
  if (!(type in eventHandlers)) {
    eventHandlers[type] = [];
  }

  //註冊handlers
  eventHandlers[type].push({
    handler: handler,
    capture: capture,
  })

  //對body新增監聽
  document.querySelector('body').addEventListener(type, handler, capture);
}


//移除body所有監聽事件
export const removeAllListeners = () => {
  if (Object.keys(eventHandlers).length) {

    //逐個對eventHandlers內的事件類型處理handler
    Object.keys(eventHandlers).forEach((type) => {

      //逐個對事件類型註冊的handler做處理
      eventHandlers[type].forEach(({ handler, capture }) => {
        //移除監聽
        document.querySelector('body').removeEventListener(type, handler, capture)
      })

      //將eventHandlers裡的事件回復成初始值
      eventHandlers[type] = [];
    })
  }
}