// pages/lc/lcgm/lcgm.js
let api = require("../../../common/ApiClient.js");
let commFunc = require("../../../common/ComFuns.js");
let storageKey = require("../../../common/localStorageKeys.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bodyDisplay: "none",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
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
    this.getBaseInfo();
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
  getBaseInfo:function(){
    var params = wx.getStorageSync(storageKey.LC_home_gm);

    var productCode = params['id']; 		// 产品代码
    var isGrounp = params['isGroup']; //是否集团客户

    // A0200065 产品描述和产品协议
    api.callRZT('{"service":"A0200165","instIncode" : "' + productCode + '","dataType":"JSON"}', this.onDetailResponse, null, false, true);

    var hcode = "";
    if (isGrounp == "1") {
      hcode = wx.getStorageSync(storageKey.HeBao_Code);
    }
    var params = {
      "service": "A0200160",
      "cpdm": productCode,
      "dataType": "JSON"
    };
    api.callRZT(JSON.stringify(params), this.onQueryResponse, null, false, true);
  },
  /**
   * 产品信息查询数据
   */
  onQueryResponse: function (response) {
    var item = response[0][0];
    this.setProductInfo(item);


    // 产品额度
    var totalNumDesc;
    var totalNum = parseFloat(item.ZSL).toFixed(2);
    var totalNumStr = '' + (totalNum ? totalNum : '');

    if (totalNumStr.length >= 8) {
      //totalNumStr = totalNumStr.substr(0, totalNumStr.length-4);
      totalNumStr = (totalNum / 10000).toFixed(2);
      totalNumDesc = '万';
    } else {
      totalNumDesc = '元';
    }

    // 计算已购买进度条数据
    var leftNum = item.SYSL ? parseFloat(item.SYSL).toFixed(0) : 0;
    var progress = parseFloat((totalNum - leftNum) / totalNum).toFixed(2);
    progress = isNaN(progress) ? '0' : parseInt(progress * 100);
    if (progress < 0) progress = 0;
    else if (progress > 100) progress = 100;
    // 起投金额
    var minMoney = parseFloat(item.QTJE);

    // 倒计时
    this.leftSeconds = commFunc.getLeftSeconds(item.JZSJ, item.XTSJ);
    this.leftSeconds = this.leftSeconds ? this.leftSeconds : 0;

    // 记录新手专享标识
    this.isNewerProduct = (item.XSBZ == '1' ? true : false);

    // 持有期限单位
    this.holdingUnit = item.CYQXDW;

    // 看看有无售罄时间
    var soldOutTime = item.SQSJ;
    var timeStr;
    var timerText = '结束时间';
    if (soldOutTime) { // 售罄
      timeStr = ' ' + soldOutTime.substr(0, 10);
    } else if (item.CPZT == '3') { // 已结束
      timeStr = ' ' + item.JZSJ.substr(0, 10);
    } else {
      if (item.CPZT == '0') { 	// 预售
        timerText = '开始时间';
        this.leftSeconds = commFunc.getLeftSeconds(item.QSSJ, item.XTSJ); // 起售时间
        this.leftSeconds = this.leftSeconds ? this.leftSeconds : 0;
      }
      timeStr = commFunc.convertSecondsToDateStr(this.leftSeconds);

      this.startTimer(); // 启动倒计时
    }


    var moneyStr;
    // 根据产品状态显示不同的金额描述
    if (commFunc.isProductOver(item.CPZT)) { // 2 售罄 3 已结束
      var sumNum = (parseFloat(totalNum) - parseFloat(leftNum)).toFixed(0);
      moneyStr = "累计：" + commFunc.splitStrToParts(sumNum) + "元";
    } else if (item.CPZT == '0') { 				// 0 预售
      moneyStr = "总额：" + commFunc.splitStrToParts(leftNum) + "元";
    } else { 													// 1 购买
      moneyStr = "剩余：" + commFunc.splitStrToParts(leftNum) + "元";
    }
    // 计息开始日
    var interstStartDate = item.SXR;
    // 计息结束日
    var interstendDate = item.JXR;
    // 预期兑付日
    var expireDate = item.DQSJ;
    if (interstStartDate != null && interstStartDate != '' && interstStartDate.length == 8) {
      interstStartDate = interstStartDate.substr(0, 4) + "年" + interstStartDate.substr(4, 2) + "月" + interstStartDate.substr(6, 2) + "日";
    }
    if (interstendDate != null && interstendDate != '' && interstendDate.length == 8) {
      interstendDate = interstendDate.substr(0, 4) + "年" + interstendDate.substr(4, 2) + "月" + interstendDate.substr(6, 2) + "日";
    }
    if (expireDate != null && expireDate != '' && expireDate.length == 8) {
      expireDate = expireDate.substr(0, 4) + "年" + expireDate.substr(4, 2) + "月" + expireDate.substr(6, 2) + "日";
    }

    // 是否是分销产品  =1 是 ; 2 不是
    var isDistribute = item.FXBZ == '1';

    wx.setNavigationBarTitle({
      title: item.CPMC
    });
    var buyBtn = null;
    var btnClass = "btn-buy-disable";
    if (commFunc.isProductCanBuy(item.CPZT)) {
      buyBtn = "onBtnBuy";
      btnClass = "btn-buy";
    }
    var btnName = commFunc.getProductStatus(item.CPZT);
    // 更新
    this.setData({
      isQueryOK: true,
      productId: item.CPDM,
      productName: item.CPMC,
      rate: (parseFloat(item.YJNH)).toFixed(1),
      expire: item.DQSJ,
      progress: progress,
      leftMoney: leftNum, //commFunc.splitStrToParts(leftNum),
      managerRate: parseFloat(item.BDKHJLEWZJSY).toFixed(2),
      maxLimitMoney: item.DCGMSX,
      buyIncrement: item.GMJEJC,
      totalNum: totalNum, //commFunc.splitStrToParts(totalNum),
      totalNumStr: totalNumStr,
      totalNumDesc: totalNumDesc,
      cyqx: item.CYQX,
      qtje: minMoney,
      productStatus: item.CPZT,
      timeStr: timeStr,
      timerText: timerText,
      isDistribute: isDistribute,
      showRate: item.XSYJNH,
      isLstLimit: item.FXDJ,//是否限制最后一笔将全部产品买完（0:不限制；1：限制）
      moneyStr: moneyStr,
      interestStartDay: interstStartDate,
      interestDay: interstendDate,
      expire: expireDate,
      onBuyCallback: buyBtn,// 请求后才能点击
      btnClass: btnClass,
      btnName: btnName,
      bodyDisplay: "block",
      isNewerProduct: item.XSBZ,
    });
  },
  /**
   * 产品协议数据
   */
  onDetailResponse: function (response) {

    var details = response[0] || [];
    details.sort(function (a, b) {
      return parseInt(a.DETAIL_SEQ) > parseInt(b.DETAIL_SEQ); // 按序号排序
    });
    details.push({ DETAIL_TITLE: "最近购买", JUMP_URL: "/pages/lc/zjgm/zjgm" })
    this.setData({ detailList: details });
  },
  setProductInfo: function (product) {
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
    wx.setStorageSync(storageKey.LC_lcgm_gm,value);
  },
  // 倒计时
  startTimer: function () {
    //停止倒计时
    clearInterval(this.interval);
    var self = this;
    var refreshTime=0;
    this.interval = setInterval(function () {
      self.leftSeconds -= 1;
      if (self.leftSeconds < 0) {
        clearInterval(self.interval);
        //请求产品详情，更新界面
        var params = wx.getStorageSync(storageKey.LC_lcgm_gm);
        //console.log(refreshTime);
        if (refreshTime > 3) {
          return;
        };
        var params = {
          "service": "A0200160",
          "cpdm": params['id'],
          "dataType": "JSON"
        };
        api.callRZT(JSON.stringify(params), this.onQueryResponse, null, false, false);
        refreshTime++;
      } else {
        self.setData({
          timeStr: commFunc.convertSecondsToDateStr(self.leftSeconds)
        });
      }
    },
      1000
    );
  },
  jumpDetail: function (e) {
    var detail = e.currentTarget.dataset.detail;
    var url = "/pages/lc/wblj/wblj";
    wx.setStorageSync(storageKey.LC_GM_CPMS, detail);
    if (detail.JUMP_URL) {
      url = detail.JUMP_URL;
    }
    wx.navigateTo({
      url: url
    });
  },
  onBtnBuy: function () {
    if (this.data.productStatus == '0') {
      this.show("募集还未开始，请稍后再试",2000);
      return;
    }
    var dlzh = wx.getStorageSync(storageKey.Login_Account);
    // 开户标志
    var sfkh = wx.getStorageSync(storageKey.Login_Account_State);
    // 签约标志
    var sfqy = wx.getStorageSync(storageKey.Login_account_isSign);

    // 新手标志
    var sfxs = wx.getStorageSync(storageKey.Login_user_isNew);
    // 判断用户是否登录
    if (!dlzh) {
      wx.showModal({
        title: '提示',
        content: '您还未登录，现在前往登录？',
        cancelText: "取消",
        confirmColor: "#ff4138",
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("LOGIN_SUCCESS_JUMP", "/pages/lc/lcgm/lcgm");
            wx.navigateTo({
              url: "/pages/dl/dl"
            });
          }
        }
      });
      return ;
    } 
    if (sfkh != '2' && sfkh!='3') {
      // 判断是否在存管开户
      this.show("您还未开通存管账户", 2000);
      return;
    }
    if (sfqy != "1") {
      // 判断是否签约
      this.show("您还未签约", 2000);
      return;
    }
    if (this.data.isNewerProduct == "1") {
      // 产品为新手专享，判断客户是否是新手
      if (sfxs == "0") {
        this.show("亲，您已是平台老用户咯，赶快把这个福利分享给您的朋友吧！", 2000);
        return;
      }
    } else {
      wx.navigateTo({
        url: "/pages/lc/lcjy/lcjy"
      });
    }
  }
})