let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userName: "开启我的和掌柜",    //用户名称
    userIconUrl: "/images/wd/dl_login_user.png",
    userLevel: "",       //用户等级
    userLevelImg: "",    //用户等级图片
    yhye: '0.00', //用户余额
    yesterdayIncome: '0.00', //昨日收益
    totalAssets: '0.00', //总资产
    totalIncome: '0.00', //总收益
    isSetGestureLock: 0, //是否设置手势密码登录
    InvestmentingMoney: '0.00',
    expectedMoney: '0.00',
    cancelText: '取消',
    SFQY: "",  //是否签约,  0 未签约   1签约
    SFSQTX: "",//是否授权提现,
    SFSQCZ: "",//是否授权充值
    userState: "0",
    accountCode: '',
    noCard: false,
    userType:"0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getUserType:function(){
    let userType = wx.getStorageSync(app.localStorageKeys.Login_isManager);
    this.setData({ userType})
  },
  onLoad: function (options) {
    this.getUserType();
    this.getBaseInfo();
    this.generCardList();
  },
  generCardList: function () {
    let account = wx.getStorageSync(app.localStorageKeys.WD_jyzh_num);
    if (account) {
      app.api.callRZT('{"service":"A0000003","ACCOUNT_CODE":"' + account + '","MOBAO_VALIDATE":"' + 1 + '","dataType":"json"}', this.onBankCardResponse,
        function () { }, false, true);
    } else {
      this.setData({
        noCard: true
      });
    }
  },
  onBankCardResponse: function (res) {
    let cardList = res[0];
    if (cardList.length > 0) {
      this.setData({ noCard: false });
    } else {
      this.setData({
        noCard: true
      });
    }
  },
  getBaseInfo() {
    let account = this.getLocalData(app.localStorageKeys.Login_Account);
    if (account) {
      this.setData({ isLogin: true, })
      app.api.callRZT('{"service":"A0200063","dlzh":"' + account + '","dataType":"json"}', this.onResponse,
        function () {

        }, false, true);
    } else {
      this.setData({ isLogin: false, })
    }
  },
  onResponse: function (res) {
    let userInfo = res[0][0];
    if (userInfo) {
      let userName = userInfo.YHM;
      if (userName != null && userName.length >= 11) {
        userName = userName.substring(0, 3) + "****" + userName.substring(7, userName.length);
      };
      this.setData({
        userName: userName,
        userIconUrl: this.getLocalData(app.localStorageKeys.Login_UserHeaderImage),
        yhye: userInfo.KYYE,
        yesterdayIncome: userInfo.ZRSY,
        totalAssets: userInfo.ZZC,
        totalIncome: userInfo.LJSY,
        InvestmentingMoney: userInfo.DHKBJ,
        expectedMoney: userInfo.DHKLX,
        SFSQCZ: userInfo.SFSQCZ,
        SFSQTX: userInfo.SFSQTX,
        SFQY: userInfo.SFQY,
        userState: userInfo.USER_STATE,
        accountCode: userInfo.ACCOUNT_CODE
      });
      this.handleUserState();
      this.setLocalData(app.localStorageKeys.Login_user_isNew, userInfo.SFXS);
      this.setLocalData(app.localStorageKeys.Login_Account_Mobo_YE, userInfo.YE);
      this.setLocalData(app.localStorageKeys.Login_ManagerName, userInfo.KHJLMC);
      this.setLocalData(app.localStorageKeys.Login_ManagerPhone, userInfo.KHJLSJH);
      this.setLocalData(app.localStorageKeys.Login_ManagerCode, userInfo.KHJLYQM);
      this.setLocalData(app.localStorageKeys.Login_UserName, userInfo.NC);
      this.setLocalData(app.localStorageKeys.WD_khxx_idCard, userInfo.SFZHM);
      this.setLocalData(app.localStorageKeys.Login_account_isSign, userInfo.SFQY);
      this.setLocalData(app.localStorageKeys.Login_account_isAuthCharge, userInfo.SFSQCZ);
      this.setLocalData(app.localStorageKeys.Login_account_isAuthWithdraw, userInfo.SFSQTX);
      this.setLocalData(app.localStorageKeys.Login_Account_State, userInfo.USER_STATE);
    }
  },

  handleLogout: function () {
    this.setData({
      userName: "开启我的和掌柜",    //用户名称
      userIconUrl: "/images/wd/dl_login_user.png",
      userLevel: "",       //用户等级
      userLevelImg: "",    //用户等级图片
      yhye: '0.00', //用户余额
      yesterdayIncome: '0.00', //昨日收益
      totalAssets: '0.00', //总资产
      totalIncome: '0.00', //总收益
      InvestmentingMoney: '0.00',
      expectedMoney: '0.00',
      isLogin: false,
    });
    let rdSessionKey = this.getLocalData(app.localStorageKeys.Login_user_3rdSessionKey);
    let imageUrl = this.getLocalData(app.localStorageKeys.Login_UserHeaderImage);
    wx.clearStorage();
    if (rdSessionKey) {
      this.setLocalData(app.localStorageKeys.Login_user_3rdSessionKey, rdSessionKey);
    }
    this.setLocalData(app.localStorageKeys.Login_UserHeaderImage, imageUrl)
    this.jumpToLogin();
  },
  jumpToLogin: function () {
    wx.redirectTo({
      url: '/pages/dl/dl',
    });
  },

  handleCall: function () {j
    wx.makePhoneCall({
      phoneNumber: '4000200178',
    });
  },
  handleUserState: function () {
    let { isLogin, userState, SFQY, SFSQTX, SFSQCZ } = this.data;
    if (isLogin) {
      if (userState == "0") {
        this.showTips('您还未开户，请先去开户!');
      } else if (userState == "1") {
        this.showTips('和掌柜已升级为银行存管，请先激活！');
      } else if ((userState == "3" && SFQY == "0") || (userState == "2" && SFQY == "0")) {
        this.showTips('您还未签约第三方银行存管，请先签约！');
      }
    }
  },
  onHide: function () {

  },
  //提示信息
  showTips: function (info) {
    wx.showModal({
      title: '提示信息',
      content: info,
      confirmColor: '#f35545',
    });
  },
  handleCZ: function () {
    // this.jumpToCZ();
    this.validate("0");

  },
  validate: function (status) {
    let { isLogin, userState, SFQY, noCard, SFSQTX, SFSQCZ } = this.data;
    if (isLogin) {
      switch (status) {
        case "0": {
          if (SFQY == "0") {
            this.showTips("您还未签约第三方银行存管，请先签约!");
          }
          else if (SFSQCZ == "0") {
            this.showTips("您还未授权委托充值，请先授权!");
          } else if (noCard) {
            this.showTips("您未绑定银行卡，请先绑定!");
          } else {
            this.jumpToCZ();
          }
        } break;
        case "1": {
          if (SFQY == "0") {
            this.showTips("您还未签约第三方银行存管，请先签约!");
          }
          else if (SFSQTX == "0") {
            this.showTips("您还未授权委托提现，请先授权!");
          } else if (noCard) {
            this.showTips("您未绑定银行卡，请先绑定!");
          } else {
            this.jumpToTX();
          }

        } break;
        default: { }
      }
    }
  },
  handleTX: function () {
    // this.jumpToCZ();
    this.validate("1");
  },
  jumpToCZ: function () {
    wx.navigateTo({
      url: '/pages/wd/cz/cz',
    });
  },
  jumpToTX: function () {
    wx.navigateTo({
      url: '/pages/wd/tx/tx',
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  //

  handleInAccount: function () {
    this.jumpToLogin();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取本地数据(同步)
   */
  setLocalData: function (key, value) {
    return wx.setStorageSync(key, value);
  },
  getLocalData: function (key) {
    return wx.getStorageSync(key);
  },
})