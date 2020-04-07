const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDown: 60,
    clicked: true,
    money: '',
    money_input: true,
    moneyMsg: '',
    passsword: '',
    pwdMsg: '',
    passsword_input: true,
    code: '',
    code_input: true,
    codeMsg: '',
    bankName: '',
    bankNum: '',
    balance:0
  },
  getCardInfo: function () {
    const jyzh = wx.getStorageSync(app.localStorageKeys.WD_jyzh_num);
    if (app.comFun.isNotEmpty(jyzh)) {
      const request = {
        service: "A0000003",
        dataType: "JSON",
        ACCOUNT_CODE: jyzh,
        MOBAO_VALIDATE: 1
      };
      app.api.callRZT(JSON.stringify(request), this.handleCardRes
        , function () { }, false, false);

    }
  },
  onLoad: function (options) {
    new app.ToastPannel();
    this.getBalance();
    this.getCardInfo();
  },
  tips: function (content) {
    this.show(content, 1000);
  },
  handleCardRes: function (res) {
    let cardInfo = res[0][0];
    let bankName = cardInfo.BANK_FNAME ? cardInfo.BANK_FNAME : '中国银行';
    let bankNum = cardInfo.BANK_CARD_NUM ? "(" + cardInfo.BANK_CARD_NUM.substring(cardInfo.BANK_CARD_NUM.length - 4) + ")" : '(0000)';
    this.setData({
      bankName,
      bankNum,
    });
  },
  handleCode: function () {
    this.handleCountDown();
    this.sendCode();
  },
  //发送验证码
  sendCode: function () {
    let phone = wx.getStorageSync(app.localStorageKeys.Login_Account);
    if (phone) {
      app.api.call("trade", "yzmhq",
        {
          sjhm: phone,
        }, function () {

        });
    }
  },
  //确定按钮
  handleOK: function () {
    let { money, passsword, code } = this.data;
    this.validate(money, "0");
    this.validate(passsword, "1");
    this.validate(code, "2");
    let { money_input, passsword_input, code_input, moneyMsg, pwdMsg, codeMsg } = this.data;
    if (money_input && passsword_input && code_input) {
      this.handleTX();
    } else if (!money_input) {
      this.tips(moneyMsg);
    } else if (!passsword_input) {
      this.tips(pwdMsg);
    } else {
      this.tips(codeMsg);
    }
  },
  //获得余额
  getBalance:function(){
    let phone = wx.getStorageSync(app.localStorageKeys.Login_Account);
    if(phone){
      var param = {
        "service": "F1705004",
        "dataType": "json",
        "dlzh": phone,
      };
     app.api.callRZT(JSON.stringify(param), this.onBalanceResponse, function () { }, false, false);
    }
  },
  onBalanceResponse:function(response){
    let res = response[0][0];
    if(res){
      this.setData({
        balance:res['YE_FUIOU']
      });
    }
  },
  //提现  
  handleTX: function () {
    let phone = wx.getStorageSync(app.localStorageKeys.Login_Account);
    let { money, passsword, code } = this.data;
    if (phone) {
      let header = {
        "dataType": "json",
        "service": "F1705019",
        "dlzh": phone,
        "jymm": passsword,
        "txje": money,
        "yzm": code,
      };
      app.api.callRZT(JSON.stringify(header), this.onResponse, () => { }, false, true);
    }
  },
  onResponse: function (res) {
    wx.showModal({
      title: '提示信息',
      content: '提现成功！',
      confirmColor: '#f35545',
      success: (confirm, cancel) => {
        if (confirm) {
          let pages = getCurrentPages();
          let currPage = pages[pages.length - 1];   //当前页面
          let prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.onLoad();
          this.jumpSuccessAddress();
        }
      }
    });
  },
  jumpSuccessAddress: function () {
    wx.navigateBack({});
  },
  handleAll:function(){
    let {balance} = this.data;
    this.setData({
      money: balance
    });
  },
  handleTxInput:function(e){
    this.setData({
      money: e.detail.value
    });
    this.validate(this.data.money,"0");
  },
  //校验规则
  validate: function (value, status) {
    const {balance} = this.data;
    switch (status) {
      case "0": {
        if (value.length > 0 && app.comFun.isNum(value) && parseFloat(value) <= balance) {
          this.setData({
            money_input: true,
          
          });
        }

        else if (value.length == 0) {
          this.setData({
            money_input: false,
            moneyMsg: '输入提现金额!'
          });
        }
        else if (!app.comFun.isNum(value)) {
          this.setData({
            money_input: false,
            moneyMsg: '输入金额的格式不正确!'
          });
        }
      
        else {
          this.setData({
            money_input: false,
            moneyMsg: '您的余额不足!'
          });
        }
        break;
      }
      case "1": {
        if (value.length > 0 && app.comFun.checkJyPassword(value)) {
          this.setData({
            passsword_input: true,
            passsword: value
          });
        }
        else if (value.length == 0) {
          this.setData({
            passsword_input: false,
            passsword: value,
            pwdMsg: '请输入交易密码!'
          });
        }
        else {
          this.setData({
            passsword_input: false,
            passsword: value,
            pwdMsg: '交易密码由6为数字组成!'
          });
        }
        break;
      }
      case "2": {
        if (value.length > 0 && app.comFun.checkYzmPassword(value)) {
          this.setData({
            code_input: true,
            code: value
          });
        } else if (value.length == 0) {
          this.setData({
            code_input: false,
            code: value,
            codeMsg: '请输入验证码!'
          });
        }
        else {
          this.setData({
            code_input: false,
            code: value,
            codeMsg: '验证码由6为数字组成!'
          });
        }
      }
        break;
    }
  },

  //验证码倒计时
  handleCountDown: function () {
    let { countDown } = this.data;
    let time = setInterval(() => {
      if (countDown > 0) {
        this.setData({
          countDown: countDown--,
          clicked: false,
        });
      } else {
        clearInterval(time);
        this.setData({
          countDown: 60,
          clicked: true
        });
      }
    }, 1000);
  },
  //输入框输入
  handleInput(e) {
    this.validate(e.detail.value, e.currentTarget.id);
  }
})