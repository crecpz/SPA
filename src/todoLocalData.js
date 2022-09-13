export default {
  // 用來存取目前的頁面資訊
  // - 會出現的 pageId: "overview" 、 "top" 、 "{各種亂數 id}"
  // - 會出現的 path: "/" 、 "/top" 、 "/customlist"
  currentPageInfo: {
    pageId: "",
    path: "",
  },

  // 存取所有 todo 內 pin 值為 ture 的物件
  pin: [],

  // 存取自訂清單
  custom: [
    {
      listId: "",
      listName: "未命名清單",
      listColor: "",
      listContent: [
        // {
        //   checked: false,
        //   content: "this is todo A.",
        //   pin: false,
        // },
      ],
    },
  ],
};