const demo = {
  overview:{
    // 總覽
    // 還沒想到要根據什麼呈現在上面?
  },

  // 存取所有 todo 內 top 值為 ture 的物件
  top: [
      {
        checked: false,
        content: "this is todo A.",
        top: true, // 凡是在 top 內的都是 true
      },
  ],

  // 未來應該會新增
  completed:[
    {
      checked: true, // 凡是完成的都是 true
      content: "this is todo A.",
      top: true,
    },
  ],

  // 存取自訂清單
  custom: [
    {
      listId: "",
      listName: "未命名清單",
      listColor: "",
      listContent: [
        {
          checked: false,
          content: "this is todo A.",
          top: false,
        },
      ],
    },
  ],
};