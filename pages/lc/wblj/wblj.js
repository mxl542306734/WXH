// pages/lc/wblj/wblj.js
let api = require("../../../common/ApiClient.js");
let commFunc = require("../../../common/ComFuns.js");
let storageKey = require("../../../common/localStorageKeys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jump_url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var contentms = wx.getStorageSync(storageKey.LC_GM_CPMS);
    wx.setNavigationBarTitle({
      title: contentms.DETAIL_TITLE,
    })
    this.setData({ jump_url: contentms.DETAIL_URL });
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