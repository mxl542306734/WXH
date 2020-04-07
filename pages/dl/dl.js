// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    encryptedData: '',
    iv: '',
    wxcode: '',
    login_url:'../../images/dl/dl_login_user.svg',
    userName:'',// 登录手机号输入的值
    passWord:'',// 登录密码输入的值
    disabled:'disabled',// 登录按钮是否可用
    loginInputBottomStyleUserName:'1px solid #b9b9b9',// 登录手机号默认的底边样式
    loginInputBottomStylePassWord: '1px solid #b9b9b9',// 登录密码默认的底边样式
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
    this.getUserInfo();
    this.getSysTemInfoSync();
    this.getNetworkType();
    this.initUserCode();
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
  userNameChange:function(e){
    this.setData({ userName: e.detail.value });
    var disabled = (app.comFun.isCellphone(e.detail.value) && this.data.passWord != "") ? '' : "disabled";
    this.setData({ disabled: disabled });
    if (e.detail.value.length > 0){
      if(app.comFun.isCellphone(e.detail.value)){
        this.setData({ loginInputBottomStyleUserName: '1px solid #1d82ff' });
      } else {
        this.setData({ loginInputBottomStyleUserName: '1px solid #f35545' });
      }
    } else {
      this.setData({ loginInputBottomStyleUserName: '1px solid #b9b9b9' });
    }
  },
  passWordChange: function (e) {
    this.setData({ passWord: e.detail.value });
    var disabled = (app.comFun.isCellphone(this.data.userName) && this.data.passWord != "") ? '' : "disabled";
    this.setData({ disabled: disabled });
    if (e.detail.value.length > 0) {
      if (app.comFun.checkPassword(e.detail.value)) {
        this.setData({ loginInputBottomStylePassWord: '1px solid #1d82ff' });
      } else {
        this.setData({ loginInputBottomStylePassWord: '1px solid #f35545' });
      }
    } else {
      this.setData({ loginInputBottomStylePassWord: '1px solid #b9b9b9' });
    }
  },
  /**
   * 用户的登录操作
   */
  handleLoginButtonClick:function(){
    // 登录账号的密码不能为空
    if (this.data.userName == '') {
      this.tips('登录账号不能为空!');
      return;
    } else if (!app.comFun.isCellphone(this.data.userName)){
      this.tips('请输入正确手机号!');
      return;
    }
    if (this.data.passWord == '') {
      this.tips('登录密码不能为空!');
      return;
    } else if (!app.comFun.checkPassword(this.data.passWord)) {
      this.tips('密码为6-20位的字母或数字，请重新输入!');
      return;
    }
    // 手机品牌
    var phoneBrand = this.getLocalData(app.localStorageKeys.Login_user_Phone_brand);
    // 手机型号
    var phoneModel = this.getLocalData(app.localStorageKeys.Login_user_Phone_model);
    // 手机屏幕宽度
    var phoneCreenWidth = this.getLocalData(app.localStorageKeys.Login_user_Phone_screenWidth);
    // 手机屏幕高度
    var phoneCreenHeight = this.getLocalData(app.localStorageKeys.Login_user_Phone_screenHeight);
    // 手机系统
    var phoneSystem = this.getLocalData(app.localStorageKeys.Login_user_Phone_system);
    // 手机字体大小
    var phoneFontSize = this.getLocalData(app.localStorageKeys.Login_user_Phone_fontSizeSetting);
    // 手机品牌
    var phoneNetWork = this.getLocalData(app.localStorageKeys.Login_user_Phone_newWork);
    // 调用登陆接口
    app.api.callRZT('{"service":"WX1711012","dataType":"JSON","IS_THIRD":"2","USER_NAME":"' + this.data.userName + '","USER_PWD":"' + this.data.passWord + '","PHONE_BRAND":"' + phoneBrand + '","PHONE_MODEL":"' + phoneModel + '","PHONE_CREEN_WIDTH":"' + phoneCreenWidth + '","PHONE_CREEN_HEIGHT":"' + phoneCreenHeight + '","PHONE_SYSTEM":"' + phoneSystem + '","PHONE_FONT_SIZE":"' + phoneFontSize + '","PHONE_NETWORK_TYPE":"' + phoneNetWork + '"}', this.loginResponse, function () { }, false, false);
  },
  /**
   * 登录回调方法
   */
  loginResponse: function (response){
    var fhxx = response[0][0];
    this.loginInfo = fhxx;
    // 保存登录状态、账号、是否客户经理、交易账号、是否自动登录
    // 保存登录状态、账号、是否客户经理、交易账号、是否自动登录
    this.setLocalData(app.localStorageKeys.Login_State, 1);
    this.setLocalData(app.localStorageKeys.Login_Account, fhxx.USER_NAME);
    // 1为客户经理，2为普通用户
    this.setLocalData(app.localStorageKeys.Login_isManager, fhxx.USER_TYPE);
    if (app.comFun.isNotEmpty(fhxx.TRANS_ACCT)) {
      this.setLocalData(app.localStorageKeys.WD_jyzh_num, fhxx.TRANS_ACCT);
    } else {
      this.setLocalData(app.localStorageKeys.WD_jyzh_num, "");
    }
    this.setLocalData(app.localStorageKeys.Login_MyInvitationCode, fhxx.AUTH_CODE);
    this.setLocalData(app.localStorageKeys.Login_gsd, fhxx.REGION_ID);
    this.loginSuccess(fhxx);
  },
  /**
   * 页面跳转
   */
  loginSuccess: function (fhxx) {
    var jumpAddress = this.getLocalData(app.localStorageKeys.Login_Success_Jump);
    if (jumpAddress == "" || jumpAddress == 'undefined') {
      this.setLocalData(app.localStorageKeys.Login_Success_Jump, "/pages/wd/wd");
      jumpAddress = "/pages/wd/wd";
    }
    wx.switchTab({
      url: jumpAddress,
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  /**
 * 显示错误消息
 */
  tips: function (content) {
    this.show(content,1000);
  },
  /**
   * 设置本地数据(同步)
   */
  setLocalData:function(key,value){
    wx.setStorageSync(key,value);
  },
  /**
   * 获取本地数据(同步)
   */
  getLocalData:function(key){
    return wx.getStorageSync(key);
  },
  /**
   * 获取用户信息
   */
  getUserInfo:function(){
    var self = this;
    if (this.getLocalData(app.localStorageKeys.Login_UserHeaderImage) == "") {
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;
          console.log(userInfo);
          var avatarUrl = userInfo.avatarUrl
          if(avatarUrl != ""){
            self.setData({ login_url: avatarUrl});
            // 设置昵称
            self.setLocalData(app.localStorageKeys.Login_UserName, userInfo.nickName);
            self.setLocalData(app.localStorageKeys.Login_user_nickName, userInfo.nickName);
            // 设置微信头像
            self.setLocalData(app.localStorageKeys.Login_UserHeaderImage, userInfo.avatarUrl);
            // 设置省份
            self.setLocalData(app.localStorageKeys.Login_user_province, userInfo.province);
            // 设置城市
            self.setLocalData(app.localStorageKeys.Login_user_city, userInfo.city);
          }
        }
      })
    }
  },
  /**
   * 获取系统信息
   */
  getSysTemInfoSync:function(){
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        // 设置手机的品牌
        self.setLocalData(app.localStorageKeys.Login_user_Phone_brand, app.comFun.formatStr(res.brand));
        // 设置手机型号
        self.setLocalData(app.localStorageKeys.Login_user_Phone_model, app.comFun.formatStr(res.model));
        // 设置手机的屏幕宽度
        self.setLocalData(app.localStorageKeys.Login_user_Phone_screenWidth, app.comFun.formatStr(res.screenWidth));
        // 设置手机屏幕高度
        self.setLocalData(app.localStorageKeys.Login_user_Phone_screenHeight, app.comFun.formatStr(res.screenHeight));
        // 设置手机的操作系统版本
        self.setLocalData(app.localStorageKeys.Login_user_Phone_screenWidth, app.comFun.formatStr(res.system));
        // 设置手机字体大小
        self.setLocalData(app.localStorageKeys.Login_user_Phone_fontSizeSetting, app.comFun.formatStr(res.fontSizeSetting));
      }
    });
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     var speed = res.speed;
    //     // 设置用户位置维度
    //     self.setLocalData(app.localStorageKeys.Login_user_Location_latitude, latitude);
    //     // 设置用户位置经度
    //     self.setLocalData(app.localStorageKeys.Login_user_Location_longitude, longitude);
    //     // 设置用户移动速度
    //     self.setLocalData(app.localStorageKeys.Login_user_Location_speed, speed);
    //   }
    // })
  },
  /**
   * 获取用户的网络类型
   */
  getNetworkType:function(){
    var self =this;
    wx.getNetworkType({
      success: function (res) { 
        // 设置用户手机的网路类型
        self.setLocalData(app.localStorageKeys.Login_user_Phone_newWork, res.networkType);
      }
    })
  },
  initUserCode:function(){
    var self = this;
    wx.login({
      success: function (res) {
        //微信js_code
        self.setData({ wxcode: res.code });
        //获取用户信息
        wx.getUserInfo({
          success: function (res) {
            //获取用户敏感数据密文和偏移向量
            self.setData({ encryptedData: res.encryptedData })
            self.setData({ iv: res.iv })
          }
        })
      }
    });
  }
})