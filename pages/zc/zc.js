var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qyysjhm:'',// 登录画面带过来的手机号码
    dlmm:'',//输入的登录密码
    sqm:'',//输入的邀请码
    zcsjyYx:false,// 注册的手机号码是否有效
    zcdlmmYx:false,// 登录密码是否有效
    yqmYx:true,// 邀请码是否有效
    sfxztyxy:false,//是否勾选同意协议
    xybANKY: 'disabled',// 下一步按钮是否可用
    zcsjhdbys: '1px solid #b9b9b9',// 登录手机号默认的底边样式
    zcdlmmdbys: '1px solid #b9b9b9',// 登录密码默认的底边样式
    zcyqmdbys: '1px solid #b9b9b9',// 注册邀请码的底边样式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // toast组件实例
    new app.ToastPannel();
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
   * 注册手机号数据控制
   */
  zcsjhChange:function(e){
    if (e.detail.value.length > 0) {
      if (app.comFun.isCellphone(e.detail.value)) {
        this.setData({ zcsjhdbys: '1px solid #1d82ff', zcsjyYx: true, qyysjhm:e.detail.value});
      } else {
        this.setData({ zcsjhdbys: '1px solid #f35545', zcsjyYx: false});
      }
    } else {
      this.setData({ zcsjhdbys: '1px solid #b9b9b9', zcsjyYx: false});
    }
    var disabled = (app.comFun.isCellphone(e.detail.value) && this.data.zcdlmmYx && this.data.yqmYx && this.data.sfxztyxy) ? '' : "disabled";
    this.setData({ xybANKY: disabled });
  },
  /**
   * 注册登录密码控制
   */
  zcdlmmChange: function (e) {
    if (e.detail.value.length > 0) {
      if (app.comFun.checkPassword(e.detail.value)) {
        this.setData({ zcdlmmdbys: '1px solid #1d82ff', zcdlmmYx:true});
      } else {
        this.setData({ zcdlmmdbys: '1px solid #f35545', zcdlmmYx: false});
      }
    } else {
      this.setData({ zcdlmmdbys: '1px solid #b9b9b9', zcdlmmYx: false});
    }
    var disabled = (app.comFun.checkPassword(e.detail.value) && this.data.zcdlmmYx && this.data.yqmYx && this.data.sfxztyxy) ? '' : "disabled";
    this.setData({ xybANKY: disabled, dlmm: e.detail.value});
  },
  /**
   * 邀请码输入控制
   */
  zcyqmChange:function(e){
    if (e.detail.value.length > 0) {
      this.setData({ zcyqmdbys: '1px solid #1d82ff', yqmYx: true });
    } else {
      this.setData({ zcyqmdbys: '1px solid #b9b9b9', yqmYx: false});
    }
    this.setData({yqm: e.detail.value});
  },
  /**
   * 是否同意协议控制
   */
  zcxyChange:function(e){
    this.setData({ sfxztyxy: e.detail.value[0] =="1" });
    var disabled = (this.data.zcsjyYx && this.data.zcdlmmYx && this.data.yqmYx && this.data.sfxztyxy) ? '' : "disabled";
    this.setData({ xybANKY: disabled });
  },
  /**
   * 点击注册下一步
   */
  toZcqr:function(){
    if (!this.data.zcsjyYx){
      this.tips("请输入正确的手机号码！");
      return;
    }
    if (!this.data.zcdlmmYx) {
      this.tips("请输入6~20位的登陆密码！");
      return;
    }
    if (!this.data.sfxztyxy) {
      this.tips("请勾选同意以下协议!");
      return;
    }
    var self = this;
    app.api.callRZT('{"service":"R0100141","dataType":"JSON","USER_NAME":"' + this.data.qyysjhm + '"}',
      function (response) {
        var fhxx = response[0][0];
        if (fhxx != null && fhxx != 'undefined' && fhxx.REGISTER_FLAG > 0) {
          self.tips("该手机号码已注册！");
          return;
        } else {
          wx.navigateTo({
            url: 'zcqr/zcqr?sjhm=' + self.data.qyysjhm + '&dlmm=' + self.data.dlmm + '&yqm=' + self.data.yqm
          })
        }
      }.bind(this), function () { }, false, false);
  },
  /**
   * 显示错误消息
   */
  tips:function(content){
    this.show(content, 1000);
  }
})