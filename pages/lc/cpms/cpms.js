// pages/lc/cpxy/cpxy.js
var WxParse = require('../../../common/plugins/wxParse/wxParse.js');
let storageKey = require("../../../common/localStorageKeys.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var contentms = wx.getStorageSync(storageKey.LC_GM_CPMS);
    wx.setNavigationBarTitle({
      title: contentms.DETAIL_TITLE,
    })
    var that = this;
    this.setData({ contentms: WxParse.wxParse('contentms', 'html', contentms.DETAIL_CONTEXT, that, 5)});
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
  
  }
})