// pages/wd/xtsz/xgdlmm/wjdlmm/wjdlmm.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneInput:true,
    phone:'',
    errMsg:''
  },
  onLoad: function (options) {
    new app.ToastPannel();

  },
  //显示错误信息
  tips: function (content) {
    this.show(content, 1000);
  },
  nextStep: function () {
    this.validate(this.data.phone);
    let { errMsg, phoneInput} = this.data;
    if (phoneInput){
      wx.navigateTo({
        url: '../dlmm_submit/dlmm_submit?phone=' + this.data.phone,
      });
    }else{
      this.tips(errMsg);
    }
  },
  handleInput:function(e){
    this.validate(e.detail.value);
  },
  validate:function(value){
    let phone = wx.getStorageSync(app.localStorageKeys.Login_Account);
    if (value.length > 0 && app.comFun.isCellphone(value)){
      if (phone.length > 0 && value != phone) {
        this.setData({ phoneInput: false, phone: value, errMsg: '输入的手机号与注册时的不一致' });
      }else{
        this.setData({ phoneInput: true, phone: value, errMsg: '' });
      }
      // this.setData({ phoneInput: true, phone: value, errMsg: '' });
    } else if (value.length==0){
      this.setData({ phoneInput: false, phone: value,errMsg:'请输入手机号'});
    }
    else{
      this.setData({ phoneInput: false, phone: value, errMsg: '手机号的格式有误' });
    }
  }
})