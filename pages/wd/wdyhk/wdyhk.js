let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    noCard:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.generCardList();
  },
  //生成银行卡列表
  generCardList: function () {
    let account = wx.getStorageSync(app.localStorageKeys.WD_jyzh_num);
    if (account) {
      app.api.callRZT('{"service":"A0000003","ACCOUNT_CODE":"' + account + '","MOBAO_VALIDATE":"' + 1 + '","dataType":"json"}', this.onBankCardResponse,
        function () {}, false, true);
    }
  },
  onBankCardResponse: function (res) {
    let cardList = res[0];
    const BankCardMap = app.keyMaps;
    let filter_cardList;
    if (cardList.length > 0) {
      let filter_cardList = cardList.map(function (item) {
        let yhdm = item['BANK_CODE'];
        let cardNum = item['BANK_CARD_NUM'];
        let mapItem = BankCardMap[yhdm];
        if(mapItem){
          const tailNum = cardNum.substring(cardNum.length - 4);
          
          return { bgColor: mapItem[1], BANK_FNAME: item["BANK_FNAME"], BANK_ICON:mapItem[2], BANK_CARD_NUM: tailNum };
        }
      });
      this.setData({ cardList: filter_cardList,noCard:false});
    }else{
      this.setData({
        noCard: true
      });
    }
  },
})