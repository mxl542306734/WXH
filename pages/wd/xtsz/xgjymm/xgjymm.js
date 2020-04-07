// pages/wd/xtsz/xgjymm/xgjymm.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPwd: "",
    newPwd: "",
    confirmPwd: '',
    newPwdMsg: '',
    confirmPwd: '',
    confirmPwdMsg: '',
    oldPwdInput: true,
    newPwdInput: true,
    confirmPwdInput: true
  },
  validate: function (value, status) {
    switch (status) {
      case "0": {
        if (value.length > 0 && app.comFun.checkJyPassword(value)) {
          this.setData({
            oldPwdInput: true,
            oldPwd: value,
            oldPwdMsg: '',
          });
        } else if (value.length == 0) {
          this.setData({
            oldPwdInput: false,
            oldPwd: value,
            oldPwdMsg: '请输入原交易密码!'
          });
        } else {
          this.setData({
            oldPwdInput: false,
            oldPwd: value,
            oldPwdMsg: '密码为6-20位的字母或数字，请重新输入!'
          });
        }
        break;
      }
      case "1": {
        if (value.length > 0 && app.comFun.checkJyPassword(value) && this.data.oldPwd != value) {
          this.setData({
            newPwdInput: true,
            newPwd: value
          });
        } else if (value.length == 0) {
          this.setData({
            newPwdInput: false,
            newPwd: value,
            newPwdMsg: '请输入新的交易密码!'
          });
        } else if (!app.comFun.checkJyPassword(value)) {
          this.setData({
            newPwdInput: false,
            newPwd: value,
            newPwdMsg: '密码为6位纯数字，请重新输入!'
          });
        } else {
          this.setData({
            newPwdInput: false,
            newPwd: value,
            newPwdMsg: '新的交易密码与原交易密码相同，请重新输入!'
          });
        }
        break;
      }
      case "2": {
        if (value.length > 0 && app.comFun.checkJyPassword(value) && this.data.newPwd == value) {
          this.setData({
            confirmPwdInput: true,
            confirmPwd: value
          });
        } else if (value.length == 0) {
          this.setData({
            confirmPwdInput: false,
            confirmPwd: value,
            confirmPwdMsg: '请输入确认交易密码!'
          });
        } else if (!app.comFun.checkJyPassword(value)) {
          this.setData({
            confirmPwdInput: false,
            confirmPwd: value,
            confirmPwdMsg: '交易密码为6位纯数字，请重新输入!'
          });
        } else {
          this.setData({
            confirmPwdInput: false,
            confirmPwd: value,
            confirmPwdMsg: '两次新交易密码输入不一致!'
          });
        }
      }
        break;
    }
  },
  handleSubmit: function () {
    let { oldPwd, newPwd, confirmPwd } = this.data;
    this.validate(oldPwd, "0");
    this.validate(newPwd, "1");
    this.validate(confirmPwd, "2");
    let { oldPwdInput, newPwdInput, confirmPwdInput, confirmPwdMsg, newPwdMsg, oldPwdMsg } = this.data;
    if (oldPwdInput && newPwdInput && confirmPwdInput) {
      this.changePwd();
    } else if (!oldPwdInput) {
      this.tips(oldPwdMsg);
    } else if (!newPwdInput) {
      this.tips(newPwdMsg);
    } else {
      this.tips(confirmPwdMsg);
    }

  },
  changePwd: function () {
    let account = wx.getStorageSync(app.localStorageKeys.Login_Account);
    let { oldPwd, newPwd } = this.data;
    if (account) {
      app.api.callRZT('{"service":"A0200074","dlzh":"' + account + '","jmm":"' + oldPwd + '","xmm":"' + newPwd + '","dataType":"json"}', this.onSuccess, () => { }, false, true);
    }
  },
  onSuccess: function (res) {
    wx.showModal({
      title: '提示信息',
      content: '修改密码成功',
      confirmColor: "#f35545",
      success: (confirm, cancel) => {
        if (confirm) {
          wx.navigateBack({
            delta:2
          });
        }
      }
    });
  },

  //输入
  handleInput: function (e) {
    this.validate(e.detail.value, e.currentTarget.id);
  },
  onLoad: function (options) {
    new app.ToastPannel();
  },
  //显示错误信息
  tips: function (content) {
    this.show(content, 1000);
  },
})