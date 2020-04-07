// pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jsCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // toast组件实例
    new app.ToastPannel();
    this.wxyhkjdl();
    this.getNetworkType();
    this.getSysTemInfoSync();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({ jsCode: res.code});
        }
      }
    })
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
   * 用户点击微信快速登录
   */
  wxLoginClick: function (encryptedData,iv){
   var that = this;
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
   if (this.data.jsCode) {
          // 调用登陆接口
     app.api.callRZT('{"service":"WX1711011","dataType":"JSON","js_code":"' + this.data.jsCode + '","encryptedData":"' + encryptedData + '","iv":"' + iv + '","PHONE_BRAND":"' + phoneBrand + '","PHONE_MODEL":"' + phoneModel + '","PHONE_CREEN_WIDTH":"' + phoneCreenWidth + '","PHONE_CREEN_HEIGHT":"' + phoneCreenHeight + '","PHONE_SYSTEM":"' + phoneSystem + '","PHONE_FONT_SIZE":"' + phoneFontSize + '","PHONE_NETWORK_TYPE":"' + phoneNetWork + '"}', that.loginResponse, function () {
          that.show('获取用户信息失败!');
          return;
        }, false, false);
    } else {
      that.show('获取用户信息失败!');
      return;
    }
  },
  /**
   * 获取用户的手机号
   */
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '你未授权，点击确定使用账号密码登陆！',
        success: function (res) {
          wx.navigateTo({
            url: '/pages/dl/dl',
          })
        }
      })
    } else { // 同意授权D
      console.log(e.detail.encryptedData);
      that.getUserInfo();
      that.wxLoginClick(e.detail.encryptedData, e.detail.iv);
  }
},
  /**
     * 登录回调方法
     */
  loginResponse: function (response) {
    var fhxx = response[0][0];
    this.loginInfo = fhxx;
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
    if (fhxx.SESSION_KEY != "" 
        && fhxx.SESSION_KEY != undefined){
      this.setLocalData(app.localStorageKeys.Login_user_3rdSessionKey, fhxx.SESSION_KEY);
    }
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
 * 设置本地数据(同步)
 */
  setLocalData: function (key, value) {
    wx.setStorageSync(key, value);
  },
  /**
   * 获取本地数据(同步)
   */
  getLocalData: function (key) {
    return wx.getStorageSync(key);
  },
  /**
   * 已登录过的用户快捷登录 
   */
  wxyhkjdl:function(){
    var that = this;
    // 获取本地登录凭证
    var rdSessionKey = this.getLocalData(app.localStorageKeys.Login_user_3rdSessionKey);
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
    if (rdSessionKey != ""
      && rdSessionKey != undefined) {
      app.api.callRZT('{"service":"WX1711011","dataType":"JSON","3rdSessionKey":"' + rdSessionKey + '","PHONE_BRAND":"' + phoneBrand + '","PHONE_MODEL":"' + phoneModel + '","PHONE_CREEN_WIDTH":"' + phoneCreenWidth + '","PHONE_CREEN_HEIGHT":"' + phoneCreenHeight + '","PHONE_SYSTEM":"' + phoneSystem + '","PHONE_FONT_SIZE":"' + phoneFontSize + '","PHONE_NETWORK_TYPE":"' + phoneNetWork + '"}', that.loginResponse,
       function () {
         that.show('获取用户信息失败!');
        return;
      }, false, true);
    }
  },
  /**
   * 获取用户的网络类型
   */
  getNetworkType: function () {
    var self = this;
    wx.getNetworkType({
      success: function (res) {
        // 设置用户手机的网路类型
        self.setLocalData(app.localStorageKeys.Login_user_Phone_newWork, app.comFun.formatStr(res.networkType));
      }
    })
  },
  /**
  * 获取系统信息
  */
  getSysTemInfoSync: function () {
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
        self.setLocalData(app.localStorageKeys.Login_user_Phone_system, app.comFun.formatStr(res.system));
        // 设置手机字体大小
        self.setLocalData(app.localStorageKeys.Login_user_Phone_fontSizeSetting, app.comFun.formatStr(res.fontSizeSetting));
      }
    })
  },
  getUserInfo: function () {
    var self = this;
    if (this.getLocalData(app.localStorageKeys.Login_UserHeaderImage) ==""){
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;
          console.log(userInfo);
          var avatarUrl = userInfo.avatarUrl
          if (avatarUrl != "") {
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
})