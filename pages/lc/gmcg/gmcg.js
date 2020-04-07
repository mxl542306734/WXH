// pages/lc/gmcg/gmcg.js
let storageKey = require("../../../common/localStorageKeys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gmje: 0,
    yqsy: 0,
    yqdf: 0,
    sfhb: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var gmje = wx.getStorageSync(storageKey.LC_lcjy_gm)||0;
    var yqsy = wx.getStorageSync(storageKey.lc_lcjy_yqsy)||0;
    var yqdf = parseFloat(gmje) + parseFloat(yqsy);
    var lcgm_data = wx.getStorageSync(storageKey.LC_home_gm);
    this.setData({
      gmje: gmje,
      yqsy: yqsy,
      yqdf: yqdf,
      sfhb: lcgm_data["isGroup"]
    });
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
  
  },
  /**
   * 返回
   */
  onBtnBack:function(){
    if (this.data.sfhb=="1"){
      wx.navigateTo({
        url: '/pages/hb/hb',
      });
    } else {
      wx.switchTab({
        url: "/pages/lc/home/home"
      });
    }
  },
  /**
   * 购买详情
   */
  onDetailBtn:function(){
    wx.navigateTo({
      url: '/pages/wd/wdlc/wdlc',
    });
  },
})