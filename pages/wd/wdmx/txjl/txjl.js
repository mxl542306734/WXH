let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    noData:false,
    date:'',
    endDate:""
  },
  getOrderType: function (type) {
    type = parseInt(type);
    switch (type) {
      case 0: return '支付订单';
      case 1: return '订单退款';
      case 2: return '产品收益还款';
      case 3: return '账户充值';
      case 4: return '提现';
      default: return '';
    }
  },
  formatDateNum: function (num) {
    return (num >= 10) ? num : '0' + num;
  },
  getMoneySign: function (type) {
    type = parseInt(type);
    switch (type) {
      case 0: return '-';
      case 1: return '+';
      case 2: return '+';
      case 3: return '+';
      case 4: return '-';
      default: return '';
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEndDate();
    this.getRecord();
  },
  getRecord: function () {
    let account = wx.getStorageSync(app.localStorageKeys.WD_jyzh_num);
    let {date} =this.data;
    if (account) {
      const param = {
        "dataType": "json",
        "service": "A0200072",
        "jyzh": account,
        "lx": "4",
        "cxyf": date,
      };
      app.api.callRZT(JSON.stringify(param),
        this.onResponse, function () { }, false, true);
    }
  },
  onResponse: function (res) {
    let self = this;
    let monthMap = {};
    let key, money, orderType;
    let recordList = res[0];
    if (recordList.length > 0) {
      recordList.map(function (item) {
        key = '' + item['FSSJ'].substr(0, 7);
        money = parseFloat(item['JE']).toFixed(2);
        if (!monthMap[key]) {
          monthMap[key] = [];
        }
        monthMap[key].push({
          type: self.getOrderType(item['LX']),
          product: item['BZ'],
          bank: '',
          flow: self.getMoneySign(item['LX']) + money,
          date: item['FSSJ']
        });
      });
      this.setData({
        noData: false,
        recordList: monthMap
      });
    }else{
      this.setData({
        noData: true,
        recordList: []
      });
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  getEndDate:function(){
    let date = new Date();
    let endYear = date.getFullYear();
    let endMonth = date.getMonth() + 1;
    let endDate = endYear + "-" + this.formatDateNum(endMonth);
    this.setData({endDate});
  },
  formatDateNum : function(num) {
      return (num >= 10) ? num : '0'+num;
    },
  chooseDate: function (e) {
    this.setData({
      date: e.detail.value
    });

    this.getRecord();
  }
})