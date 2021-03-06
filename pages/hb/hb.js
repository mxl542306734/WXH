// pages/lc/home/home.js
let api = require("../../common/ApiClient.js");
let commFunc = require("../../common/ComFuns.js");
let storageKey = require("../../common/localStorageKeys.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasHebao: false, // 是否输入和宝码
    hidden: false,
    page: 1,
    loadOver: false,
    pullDownRefresh: false,
    responseData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    var hcode = wx.getStorageSync(storageKey.HeBao_Code);
    if (hcode) {
      this.setData({
        hasHebao: true,
        hidden: true,
        responseData: []
      });
      this.getProductList();
    }
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
    if (!this.data.hidden) {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
      return false;
    }
    wx.showNavigationBarLoading();
    this.setData({
      page: 1,
      pullDownRefresh: true,
    });
    // 获取理财列表数据
    this.getProductList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pullDownRefresh) {
      return;
    }
    if (this.data.loadOver) {
      this.show('没有更多了', 1500);
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      return false;
    }
    wx.stopPullDownRefresh();
    wx.showNavigationBarLoading();
    // 获取理财列表数据
    this.getProductList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showProduct: function () {
    if (!this.data.hbm) {
      wx.showToast({
        title: '请输入和宝码',
        icon: "none"
      })
    } else {
      wx.setStorageSync(storageKey.HeBao_Code, this.data.hbm);
      // 获取理财列表数据
      this.getProductList();
    }
  },
  /**
   * 和宝输入控制
   */
  handleInputChange: function (e) {
    if (e.detail.value != null && e.detail.value.length > 0) {
      this.setData({
        hasHbm: true,
        hbm: e.detail.value,
      });
    } else {
      this.setData({
        hasHbm: false,
      });
    }
  },
  /**
   * 获取理财列表
   */
  getProductList: function () {

    var params = {
      "service": "A0200060",
      "rxbz": "0",
      "jpbz": "0",
      "dqys": this.data.page,
      "mysl": "10",
      "jtkh": "1",
      "bm": wx.getStorageSync(storageKey.HeBao_Code),
      "dataType": "JSON"
    };
    api.callRZT(JSON.stringify(params), this.onProductListResponse, this.responseError, false, true)

  },
  onProductListResponse: function (response) {
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
    var productArray = response[0];
    if (productArray == null || productArray == 'undefined' || productArray.length == 0) {
      this.setData({
        loadOver: true,
        hidden: true,
      });
      if (parseInt(this.data.page) == 1) {
        wx.showModal({
          title: '提示信息',
          showCancel: false,
          content: '您输入的和宝码不存在，请重新输入',
          confirmColor: "#ff4138",
        })
      }
      return false;
    }
    var responseData;
    if (this.data.page == 1) { // 请求第一页数据 / 重新刷新
      responseData = []; // 清空数据
    } else if (this.data.page > 1) {
      responseData = this.data.responseData;
    }
    var secondsBeforeEnd, money, progress, totalNum, leftNum, soldOutTime, secondsBeforeSell, timerStr;
    var self = this;
    self.switchKey = self.switchKey ? false : true; // 每次key不同确保控件被更新

    productArray.map(function (item) {

      secondsBeforeEnd = commFunc.getLeftSeconds(item.JZSJ, item.XTSJ);
      secondsBeforeSell = commFunc.getLeftSeconds(item.QSSJ, item.XTSJ);
      soldOutTime = item.SQSJ;
      totalNum = parseFloat(item.ZSL);
      leftNum = parseFloat(item.SYSL);
      // progress = (totalNum - leftNum) / totalNum;
      // progress = isNaN(progress) ? '0' : ''+(parseInt(progress*100) );
      var progress = parseFloat((totalNum - leftNum) / totalNum).toFixed(2);
      progress = isNaN(progress) ? '0' : parseInt(progress * 100);
      if (progress < 0) progress = 0;
      else if (progress > 100) progress = 100;
      var timerText = "结束时间";
      if (item.CPZT == "0") {
        timerText = "开始时间";
      }
      var moneyStr = "";
      // 2 售罄 3 已结束
      if (commFunc.isProductOver(item.CPZT)) {
        var sumNum = totalNum - parseFloat(leftNum);
        moneyStr = "累计：" + commFunc.splitStrToParts("" + sumNum, 3, ',') + "元";
      } else if (item.CPZT == '0') {
        // 0 预售
        moneyStr = "总额：" + commFunc.splitStrToParts("" + leftNum, 3, ',') + "元";
      } else { // 1 购买
        moneyStr = "剩余：" + commFunc.splitStrToParts("" + (leftNum ? leftNum : 0), 3, ',') + "元";
      }

      if (soldOutTime) {
        timerStr = soldOutTime.substr(0, 10);
      } else if (item.CPZT == '3') {
        timerStr = item.JZSJ.substr(0, 10);
      } else {
        timerStr = commFunc.convertSecondsToDateStr(secondsBeforeEnd ? secondsBeforeEnd : 0);
      }
      responseData.push({
        key: item.CPDM + secondsBeforeEnd + (self.switchKey ? 0 : 1), // key标识
        type: 'lc',
        title: item.CPMC,
        expireTime: item.DQSJ,
        newerDesc: (item.XSBZ == '1' ? "新手专享" : null),
        leftSeconds: secondsBeforeEnd ? secondsBeforeEnd : 0,
        leftMoney: leftNum ? leftNum : 0,
        risk: item.FXDJ, //(item["fxdj"] == "1" ? "low" : "high"),
        values: [
          (parseFloat(item.YJNH) /* * 100*/).toFixed(2),
          item.CYQX,
          item.QTJE
        ],
        totalNum: totalNum,
        leftNum: leftNum,
        id: item.CPDM,
        kind: item.CPLX,
        progress: isNaN(progress) ? '0' : progress,
        maxLimitMoney: item.DCGMSX,
        managerRate: item.DBKHJLEWZYSY,
        purchaseRange: item.GMJEJC ? parseFloat(item.GMGEJC) : 0, //购买金额级差
        status: item.CPZT, // 产品状态
        soldOutTime: soldOutTime, // 售罄时间
        endTime: item.JZSJ, // 截止时间
        holdingUnit: item.CYQXDW,  // 持有期限单位
        showRate: item.XSYJNH, // 显示预计年化
        startSeconds: secondsBeforeSell ? secondsBeforeSell : 0,  // 起售时间
        interestType: item.JXFS, //计息方式
        period: item.N,      // 周期 单位天
        interestDay: item.JXR,       //结息日
        orderFlag: item.PXBZ, //排序标志  TODO:
        isGroup: item.JTKH, //是否集团客户 0：非集团客户，1：集团客户
        moneyStr: moneyStr,
        timerStr: timerStr,
        timerText: timerText,
        buyBtnName: commFunc.getProductStatus(item.CPZT),
      });

    });
    this.setData({
      "responseData": responseData,
      page: this.data.page + 1,
      hidden: true,
      pullDownRefresh:false,
    });
    clearInterval(this.interval);
    this.startTimer();
  },
  responseError: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  // 开始倒计时(若设置了计时)
  startTimer: function () {
    var dataList = this.data.responseData;
    var that = this;
    this.interval = setInterval(function () {
      dataList.map(function (item) {
        if (item.leftSeconds > 0) {
          item.leftSeconds -= 1;
          if (item.status == '0') {
            item.timerStr = commFunc.convertSecondsToDateStr(item.startSeconds)
          } else if (item.status == '1') {
            item.timerStr = commFunc.convertSecondsToDateStr(item.leftSeconds)
          }
        }
      });
      that.setData({ "responseData": dataList });
    },
      1000
    );
  },

  /**
   * 购买详情
   */
  buyDetail: function (e) {
    wx.setStorageSync("DLZH", "17608002503");
    var accountCode = wx.getStorageSync("DLZH");
    // 判断用户是否登录
    if (!accountCode) {
      wx.showModal({
        title: '提示信息',
        content: '您还未登录，现在前往登录？',
        cancelText: "取消",
        confirmColor: "#ff4138",
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("LOGIN_SUCCESS_JUMP", "/pages/lc/home/home");
            wx.navigateTo({
              url: "/pages/dl/dl"
            });
          }
        }
      });
      return;
    } else {
      wx.setStorageSync(storageKey.LC_home_gm, e.currentTarget.dataset.product);
      wx.navigateTo({
        url: "/pages/lc/lcgm/lcgm"
      });
    }
  },
  /**
   * 更换和宝码
   */
  changeHeCode: function () {
    wx.removeStorageSync(storageKey.HeBao_Code);
    this.setData({
      hasHebao: false,
      hidden: false,
      page: 1,
      loadOver: false,
      responseData: [],
    });
    clearInterval(this.interval);

  }
})