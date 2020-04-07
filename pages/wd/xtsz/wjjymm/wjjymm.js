// pages/wd/xtsz/xgjymm/wjjymm/wjjymm.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idCard: '',
    idCardInput: true,
    phone: '',
    phoneInput: true,
    idErrMsg: '',
    phoneErrMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
  },
  //显示错误信息
  tips: function (content) {
    this.show(content, 1000);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //文本输入
  handleInput: function (e) {
    this.validate(e.detail.value, e.currentTarget.id);
  },
  //正则校验
  validate: function (value, status) {
    let id = wx.getStorageSync(app.localStorageKeys.WD_khxx_idCard);
    let tel = wx.getStorageSync(app.localStorageKeys.Login_Account);
    switch (status) {
      case "0": {
        if (value.length > 0 && app.comFun.checkIdCard(value) && id == value) {
          this.setData({
            idCard: value,
            idCardInput: true,
            idErrMsg: ''
          });
        } 
        else if (value.length == 0) {
          this.setData({
            idCard: value,
            idCardInput: false,
            idErrMsg: '请输入身份证号'
          });
        } else if (!app.comFun.checkIdCard(value)) {
          this.setData({
            idCard: value,
            idCardInput: false,
            idErrMsg: '身份证号格式不正确!'
          });
        } 
        else {
          this.setData({
            idCard: value,
            idCardInput: false,
            idErrMsg: '请输入当前登录用户的身份证!'
          });
        }
        break;
      }
      case "1": {
        if (value.length > 0 && app.comFun.isCellphone(value) && tel==value) {
          this.setData({
            phone: value,
            phoneInput: true,
            phoneErrMsg:''
          })
        } else if (value.length==0) {
          this.setData({
            phone: value,
            phoneInput: false,
            phoneErrMsg:'请输入手机号!'
          });
        }
        else if (!app.comFun.isCellphone(value)) {
          this.setData({
            phone: value,
            phoneInput: false,
            phoneErrMsg:'手机号格式不正确!'
          });
        }else{
          this.setData({
            phone: value,
            phoneInput: false,
            phoneErrMsg: '请输入当前登录用户的手机号!'
          });
        }
        break;
      }

    }
  },
  nextStep: function () {
    let { idCard, phone } = this.data;
    this.validate(idCard, "0");
    this.validate(phone, "1");
    let id = wx.getStorageSync(app.localStorageKeys.WD_khxx_idCard);
    let tel = wx.getStorageSync(app.localStorageKeys.Login_Account);

    let { idCardInput, phoneInput, phoneErrMsg, idErrMsg } = this.data;
    if (idCardInput && phoneInput) {
      this.jumpTo();
      
    } else if (!idCardInput){
      this.tips(idErrMsg);
    }else{
      this.tips(phoneErrMsg);
    }
  },
  jumpTo: function () {
    wx.navigateTo({
      url: '../jymm_submit/jymm_submit',
    });
  }

})