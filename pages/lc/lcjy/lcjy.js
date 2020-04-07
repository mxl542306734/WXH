// pages/lc/lcjy/lcjy.js
let api = require("../../../common/ApiClient.js");
let commFunc = require("../../../common/ComFuns.js");
let storageKey = require("../../../common/localStorageKeys.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyBtnDisable: true,//按钮是否可用，true：不可用，false：可用；
    balance: 0,
    isBalanceEnough: false,//余额是否足够，true：不足，false：充足；
    gmje: "",
    predictIncome:0,
    jymm: "",
    agreement: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    //获取初始数据
    this.getBaseInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //获取初始数据
    this.refresh();
    wx.stopPullDownRefresh();
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  buyOnclick: function () {
    var isNothingWrong = this.checkDataBeforeSubmit();
    if (!isNothingWrong) return;
    var order = this.newOrder;
    wx.showModal({
      title: '提示',
      content: '产品名称：' + this.data.title + "\r\n" + "购买金额：" + this.data.gmje + "元",
      cancelText: "取消",
      confirmColor: "#ff4138",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          order();
        }
      }
    })
  },
  newOrder: function () {
    // 请求下单
    var param = {
      "service": "F1705011",
      "dataType": "json",
      "dlzh": wx.getStorageSync(storageKey.Login_Account),
      "jymm": this.data.jymm,
      "sjje": this.data.gmje,
      "cpdm": this.data.productId,
    };
    api.callRZT(
      JSON.stringify(param),
      this.onPurchaseResponse,
      null, false, true
    );
  },
  onPurchaseResponse: function () {
    wx.setStorageSync(storageKey.LC_lcjy_gm, this.data.gmje);
    wx.setStorageSync(storageKey.lc_lcjy_yqsy, this.data.predictIncome);
    wx.navigateTo({
      url: '/pages/lc/gmcg/gmcg',
    })
  },
  getBaseInfo: function () {
    wx.showNavigationBarLoading();
    var loginId = wx.getStorageSync(storageKey.Login_Account);
    if (!loginId) {
      wx.showModal({
        title: '提示',
        content: '您还未登录，现在前往登录？',
        cancelText: "取消",
        confirmColor: "#ff4138",
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync(storageKey.Recharge_Success_Jump, "/pages/lc/lcgm/lcgm");
            wx.navigateTo({
              url: "/pages/dl/dl"
            });
          }
        }
      });
    }
    var lccp_data = wx.getStorageSync(storageKey.LC_lcgm_gm);
    var productId = lccp_data["id"] || '';
    var title = lccp_data["title"] || '';
    var leftMoney = parseFloat(lccp_data["leftMoney"] || 0).toFixed(0);
    var totalMoney = parseFloat(lccp_data["totalNum"] || 0).toFixed(0);
    wx.setNavigationBarTitle({
      title: title,
    })
    var progress = parseFloat((totalMoney - leftMoney) / totalMoney).toFixed(2);
    progress = isNaN(progress) ? '0' : parseInt(progress * 100);
    this.setData({
      productId: productId,
      title: lccp_data["title"],
      showRate: lccp_data["showRate"],
      rate: lccp_data["rate"],
      progress: progress,
      qtje: lccp_data["money"],
      cyqx: lccp_data["first"],
      leftMoney: leftMoney,
      purchaseRange: lccp_data["purchaseRange"],
      maxLimitMoney: lccp_data["maxLimitMoney"] ? parseInt(lccp_data["maxLimitMoney"]) : 0,

    });
    // 请求余额
    if (loginId) {
      var param = {
        "service": "F1705004",
        "dataType": "json",
        "dlzh": wx.getStorageSync(storageKey.Login_Account),
      };
      api.callRZT(JSON.stringify(param), this.onBalanceResponse, function () { }, false, true);
    }
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  /**
   * 获取余额
   */
  onBalanceResponse: function (response) {
    var result = response[0][0];
    var balance = result['YE_FUIOU'] || 0;
    this.setData({ balance: balance });
  },
  refresh:function(){

    var lccp_data = wx.getStorageSync(storageKey.LC_lcgm_gm);
    var productId = lccp_data["id"] || '';
    var params = {
      "service": "A0200160",
      "cpdm": productId,
      "dataType": "JSON"
    };
    api.callRZT(JSON.stringify(params), this.onQueryResponse, null, false, true);
  },
  onQueryResponse: function (response){
    var product = response[0][0];
    var value = {
      'id': product.CPDM,
      'kind': product.CPLX,
      'title': product.CPMC,
      'type': 'lc',
      'first': product.CYQX,
      'rate': product.YJNH,
      'money': product.QTJE,
      'expire': product.DQSJ,
      'maxLimitMoney': product.DCGMSX,
      'managerRate': product.BDKHJLEWZJSY,
      'leftMoney': product.SYSL,
      'totalNum': product.ZSL,
      'purchaseRange': product.GMJEJC,
      'status': product.CPZT,
      'holdingUnit': product.CYQXDW,
      'showRate': product.XSYJNH,
      'interestStartDay': product.SXR,

      'interestType': product.JXFS,
      'period': product.N,
      'interestDay': product.JXR,
      'orderFlag': product.PXBZ,
      'isGroup': product.JTKH,
    };
    wx.setStorageSync(storageKey.LC_lcgm_gm, value);
    this.getBaseInfo();
  },
  /**
   * 输入购买金额
   */
  inputgmje: function (e) {
    var gmje = e.detail.value;

    if (gmje) {
      gmje = gmje.replace(/[^0-9\.]+/g, '');
      gmje = parseFloat(gmje);
    }
    var rate = parseFloat(this.data.rate) / 100;//预计年化收益
    var period = parseInt(this.data.cyqx);    // 产品周期
    var predictIncome = (gmje * rate / 365 * period).toFixed(2) + '';

    var enoughBalance = false;
    if (parseFloat(gmje) > parseFloat(this.data.balance)) {
      // 余额不足
      enoughBalance = true;
    }

    this.setData({
      isBalanceEnough: enoughBalance,
      gmje: gmje,
      predictIncome: predictIncome
    });
    this.isDisabled();
  },
  /**
   * 输入密码
   */
  inputjymm: function (e) {
    var jymm = e.detail.value;
    this.setData({
      jymm: jymm,
    });
    this.isDisabled();
  },
  /**
   * 认购合同勾选框点击事件
   */
  checkboxChange: function (e) {
    this.setData({
      agreement: e.detail.value[0]
    });
    this.isDisabled();
  },

  /**
   * 设置按钮是否可点击
   */
  isDisabled: function () {

    if (!this.data.isBalanceEnough && parseFloat(this.data.gmje) > 0 && this.data.jymm && this.data.jymm.length == 6 && this.data.agreement == "1") {

      this.setData({
        buyBtnDisable: false
      });
    } else {
      this.setData({
        buyBtnDisable: true
      });
    }
  },
  /**
   * 跳转到充值画面
   */
  jumpToCharge: function () {
    wx.navigateTo({
      url: '/pages/wd/cz/cz',
    })
  },
  checkDataBeforeSubmit: function () {

    var isNothingWrong = false;

    // 条件1：购买金额是否为空
    // 条件2：购买金额格式是否正确
    // 条件3：购买金额是否小于单次最小购买金额  ---  (提示：起投金额为 XXX 元)
    //        (再判断：当剩余金额小于最小购买金额时，若购买金额大于剩余金额，提示：剩余金额为 XXX 元，请重新输入, 否则 可以购买)
    // 条件4：购买金额是否大于单次最大购买金额  ---  (提示：单次最大购买金额为 XXX 元)
    // 条件5：购买金额是否大于余额  ---  (提示：余额不足，请重新输入购买金额)
    // 条件6：若有购买级差，(购买金额-起投金额)是否为级差的倍数  ---  (提示：购买金额应是 XXX 的倍数)

    var balance = parseFloat(this.data.balance); // 余额
    balance = balance ? balance : 0;
    var inputValue = this.data.gmje; // 输入金额值
    var purchase = parseFloat(inputValue);  // 购买金额
    var dotIndex = (inputValue + "").indexOf('.');

    // 起投金额
    var minMoney = parseFloat(this.data.qtje);

    // 购买级差条件
    var rangeDividedNum = 0;
    if (this.data.purchaseRange > 0) {
      //只取两位小数，由于购买金额减去起投金额得到的结果不准确
      rangeDividedNum = (parseFloat(purchase) - minMoney).toFixed(2) / this.data.purchaseRange;
    }

    // 判断输入格式
    if (commFunc.trim(inputValue) === '') {
      this.show("请输入购买金额", 2000);
      return isNothingWrong;
    } else if (!commFunc.isNum(inputValue)) {
      this.show("输入金额格式不正确", 2000);
      return isNothingWrong;
    } else if (parseFloat(this.data.leftMoney) < minMoney) { // 剩余金额 < 最小购买金额
      if (purchase > this.data.leftMoney) { // 购买金额 > 剩余金额
        this.show("输入金额已超过可购金额", 2000);
        return isNothingWrong;
      }
    }

    // 继续判断
    if (purchase < minMoney) {
      if (parseFloat(this.data.leftMoney) >= minMoney) { // 剩余金额 >= 最小购买金额
        this.show("认购金额应大于 " + minMoney + " 元", 2000);
      } else { // 剩余金额 < 最小购买金额
        if (purchase > this.data.leftMoney) { // 购买金额 > 剩余金额
          this.show("输入金额已超过可购金额", 2000);
        } else { // 否则可以购买!!!
          isNothingWrong = true;
        }
      }
    } else if (this.data.maxLimitMoney > 0 && purchase > this.data.maxLimitMoney) {
      this.show("单笔最多可认购 " + this.data.maxLimitMoney + " 元", 2000);
    } else if (purchase > balance) {
      //this.refs.messageBox.show("余额不足，请重新输入购买金额！");
      wx.showModal({
        title: '提示',
        content: "您的可用余额不足，请前往充值",
        cancelText: "取消",
        confirmColor: "#ff4138",
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/wd/cz/cz"
            });
          }
        }
      });
    } else if (rangeDividedNum - parseInt(rangeDividedNum) > 0) {
      this.show("请输入 " + this.data.purchaseRange + " 元的整数倍", 2000);
    } else if (dotIndex != -1) {
      // 有'.'
      var rightStr = inputValue.substr(dotIndex + 1);
      var leftStr = inputValue.substring(0, dotIndex);
      if (isNaN(parseInt(rightStr))) { // 后段不为数字
        this.show("输入金额格式不正确", 2000);
      } else {
        if (isNaN(parseInt(leftStr))) { // 前段不为数字
          this.show("输入金额格式不正确", 2000);
        } else {
          isNothingWrong = true;
        }
      }
    } else {
      isNothingWrong = true;
    }

    return isNothingWrong;
  },
  /**
   * 点击认购合同
   */
  onBtnContract: function () {
    var param = {
      "service": "R0200888",
      "dataType": "json",
      "INST_INCODE": this.data.productId
    };
    api.callRZT(JSON.stringify(param), this.onProtoResponse, null, false, true);
  },
  /**
   * 获取认购合同数据
   */
  onProtoResponse: function (response) {
    var info = response[0] || [];
    info = info[0];
    if (!info) {
      info = {
        'bt': "产品协议",
        'nr': '',
      };
    }

    var pageTitle = info.AGT_TITLE;
    var pageContent = info.AGT_CONTEXT;
    var value = {
      'DETAIL_TITLE': pageTitle,
      'DETAIL_CONTEXT': pageContent,
    };
    wx.setStorageSync(storageKey.LC_GM_CPMS, value);
    wx.navigateTo({
      url: '/pages/lc/cpms/cpms',
    });
  }
})