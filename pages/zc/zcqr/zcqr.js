// pages/zc/zcqr/zcqr.js
var kms_api = require("../../../common/ApiClient.js");
let comFun = require("../../../common/ComFuns.js");
var app = getApp();
var tempTime = 60;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    zcqr_tsxx:'短信验证码已发送到您的手机，请输入验证码',// 注册信息上的提示信息
    zcqr_hqyzmts:'获取验证码',//获取验证码按钮上的文字
    zcqr_yzm_sj:60,//验证码的间隔时间
    zcqr_sjhm:'',
    zcqr_dlmm:'',// 注册时输入的登录密码
    zcqr_vipCode:'',// 注册时输入的授权码
    yzmsfyx:false,// 输入的验证码是否有效
    yzm_disabled:'disabled',//获取验证码按钮
    qr_disabled: 'disabled',//确认按钮
    zcqryzmdbys:'1px solid #b9b9b9',//验证码的底边样式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (comFun.isCellphone(options.sjhm)){
      this.setData({ zcqr_sjhm: options.sjhm, zcqr_dlmm: options.dlmm});
    }
    if (options.sqm){
      this.setData({zcqr_vipCode: options.sqm});
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    tempTime = this.data.zcqr_yzm_sj;
    this.startTick('0');
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
   * 验证码输入控制
   */
  yzmChange:function(e){
    if (e.detail.value.length > 0){
      if (comFun.checkYzmPassword(e.detail.value)) {
        this.setData({ zcqryzmdbys: '1px solid #1d82ff', yzmsfyx: true });
      } else {
        this.setData({ zcqryzmdbys: '1px solid #f35545', yzmsfyx: false });
      }
    } else {
      this.setData({ zcqryzmdbys: '1px solid #b9b9b9', yzmsfyx: false });
    }
    var qr_disabled = comFun.checkYzmPassword(e.detail.value) && comFun.isCellphone(this.data.zcqr_sjhm);
    this.setData({ qr_disabled: qr_disabled ? '' :'disabled'});
  },
  startTick: function (type) {
    if (type == '0' 
        && this.data.yzm_disabled =='disabled'){
        this.interval = setInterval(this.tick, 1000);
    } else if (this.data.yzm_disabled == ''){
        this.setData({yzm_disabled: 'disabled'});
        this.interval = setInterval(this.tick, 1000);
    };
  },
  /**
   * 验证码的倒计时
   */
  tick: function () {
    tempTime -=1;
    if (tempTime <= 0) {
      this.endTick();
    } else {
      this.setData({ zcqr_hqyzmts: tempTime + "秒"});
    }
  },
  /**
   * 结束倒计时
   */
  endTick: function () {
    clearInterval(this.interval);
    this.setData({ zcqr_hqyzmts: '获取验证码', yzm_disabled:''});
    tempTime = this.data.zcqr_yzm_sj;
  },
  /**
  * 显示错误消息
  */
  tips: function (title,content) {
    wx.showModal({
      title: title==""?"提示":title,
      content: content,
      showCancel: false
    })
  },
  /**
   * 注册
   */
  zc:function(){
    if (!comFun.isCellphone(this.data.zcqr_sjhm)) {
      this.tips("","手机号码未填写！");
      return;
    }
    if (!comFun.checkPassword(this.data.zcqr_dlmm)) {
      this.tips("","登录密码未填写！");
      return;
    }
    if (!this.data.yzmsfyx && !comFun.checkJyPassword(this.data.yzmsfyx)) {
      this.tips("", "验证码不正确！");
      return;
    }
    kms_api.callRZT('{"service":"R0100121","dataType":"JSON","IS_THIRD":"2","THIRD_TYPE":"5",,"REG_FROM":"5","USER_NAME":"' + this.data.zcqr_sjhm + '","AUTH_CODE":"' + this.data.zcqr_vipCode + '","USER_PWD":"' + this.data.zcqr_dlmm + '"}',
      function (response) {
        var fhxx = response[0];
        if (fhxx != null && fhxx != 'undefined') {
          this.tips("恭喜你","注册成功！")
          return;
        } else {
          this.tips("提示","注册失败！")
          return;
        }
      }.bind(this), function () {
      }, false, false);
  }
})