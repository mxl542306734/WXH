// pages/wd/wdlc/wdgmxq/wdgmxq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let data = wx.getStorageSync("wdlc_item");
    data.occurrenceTime = data.occurrenceTime ? data.occurrenceTime.substring(0, 10) : '';
    data.yqdf = (parseFloat(data.yjsy) + parseFloat(data.money)).toFixed(2);
    self.setData({item: data});
  }
})