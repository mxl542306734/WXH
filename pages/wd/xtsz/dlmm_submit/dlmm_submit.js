const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDown: 60,
    clicked: true,
    password: '',
    pwdInput: true,
    pwdMsg: '',
    confirmPwd: '',
    confirmPwdInput: true,
    confirmPwdMsg: '',
    code: '',
    codeInput: true,
    codeMsg: '',
    phone:''
  },
  handleCode: function () {
    this.handleCountDown();
    this.sendCode();
  },
  //发送验证码
  sendCode: function () {
    let {phone} =this.data;
    if (phone) {
      app.api.call("trade", "yzmhq",
        {
          sjhm: phone,
        }, function () {

        });
    }
  },
  //确定按钮
  onLoad: function (options) {
    new app.ToastPannel();
    console.log(options);
    if(options.phone){
      this.setData({ phone: options.phone});
    }
  },
  //显示错误信息
  tips: function (content) {
    this.show(content, 1000);
  },
  handleOK: function () {
    let { password, confirmPwd, code } = this.data;
    this.validate(password, "0");
    this.validate(confirmPwd, "1");
    this.validate(code, "2");
    let { pwdInput, confirmPwdInput, codeInput, pwdMsg, confirmPwdMsg, codeMsg } = this.data;
    if (pwdInput && confirmPwdInput && codeInput) {
      this.changePwd();
    } else if (!pwdInput) {
      this.tips(pwdMsg);
    } else if (!confirmPwdInput) {
      this.tips(confirmPwdMsg);
    } else {
      this.tips(codeMsg);
    }
  },

  changePwd: function () {
    let { phone } = this.data;
    let { password, code } = this.data;
    if (phone) {
      app.api.callRZT('{"service":"R0100182","dataType":"JSON","USER_PWD":"' + password + '","yzm":"' + code + '","USER_NAME":"' + phone + '"}',
        this.handleRes, () => { }, false, false);
    }
  },
  handleRes: function (res) {
    wx.showModal({
      title: '提示信息',
      content: '修改密码成功',
      confirmColor: "#f35545",
      success: (confirm, cancel) => {
        if (confirm) {
         wx.navigateBack({
           delta:5
         });
        }
      }
    });
  },
  //校验规则
  validate: function (value, status) {
    switch (status) {
      case "0": {
        if (value.length > 0 && app.comFun.checkPassword(value)) {
          this.setData({
            pwdInput: true,
            password: value,
            pwdMsg: ''
          });
        } else if (value.length == 0) {
          this.setData({
            pwdInput: false,
            password: value,
            pwdMsg: '请输入登录密码!'
          });
        } else {
          this.setData({
            pwdInput: false,
            password: value,
            pwdMsg: '登录密码为6-20位的字母或数字，请重新输入!'
          });
        }

      } break;
      case "1": {
        if (value.length > 0 && app.comFun.checkPassword(value) && this.data.password == value) {
          this.setData({
            confirmPwdInput: true,
            confirmPwd: value,
            confirmPwdMsg: ''
          });
        } else if (value.length == 0) {
          this.setData({
            confirmPwdInput: false,
            confirmPwd: value,
            confirmPwdMsg: '请输入确认登录密码!'
          });
        } else if (!app.comFun.checkPassword(value)) {
          this.setData({
            confirmPwdInput: false,
            confirmPwd: value,
            confirmPwdMsg: '登录密码为6-20位的字母或数字，请重新输入!'
          });
        } else {
          this.setData({
            confirmPwdInput: false,
            confirmPwd: value,
            confirmPwdMsg: '两次新登录密码输入不一致!'
          });
        }
      } break;
      case "2": {
        if (value.length > 0 && app.comFun.checkJyPassword(value)) {
          this.setData({
            codeInput: true,
            code: value,
            codeMsg: ''
          });
        } else if (value.length == 0) {
          this.setData({
            codeInput: false,
            code: value,
            codeMsg: '请输入验证码!'
          });
        }
        else {
          this.setData({
            codeInput: false,
            code: value,
            codeMsg: '验证码格式不正确!'
          });
        }
      }
        break;
    }
  },

  //验证码倒计时
  handleCountDown: function () {
    let { countDown } = this.data;
    let time = setInterval(() => {
      if (countDown > 0) {
        this.setData({
          countDown: countDown--,
          clicked: false,
        });
      } else {
        clearInterval(time);
        this.setData({
          countDown: 60,
          clicked: true
        });
      }
    }, 1000);
  },
  //输入框输入
  handleInput(e) {
    this.validate(e.detail.value, e.currentTarget.id);
  }
})