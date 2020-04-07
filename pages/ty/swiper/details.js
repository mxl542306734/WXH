var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'jxcat',
    // serverUrl: app.globalData.ajaxUrl,
    // baseUrl: app.globalData.baseUrl,
    title: "和掌柜活动",
    article_title: "",
    article_content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var result;
    wx.request({
      url: app.globalData.ajaxUrl,
      data: {
        m: 'api',
        c: 'article',
        a: 'info',
        aid: options.aid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          article_title: res.data.article_title,
          article_content: app.WxParse.wxParse('article_content', 'html', res.data.article_content, that, 5)
        })
      }
    })
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