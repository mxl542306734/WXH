import { ToastPannel } from "common/component/toast/toast";
let comFun = require("common/ComFuns.js");
var api = require("common/ApiClient.js");
var localStorageKeys = require("common/localStorageKeys.js");
var WxParse = require('common/plugins/wxParse/wxParse.js');
var keyMaps = require("common/yhkKeyMap.js");
var app = getApp();
App({
  ToastPannel,
  /**
  * 生命周期函数--监听页面加载 
  */
  onLoad: function (options) {
    // 监测网络
    comFun.initNetWorkCheck();
  },
  onLaunch: function () {
    // 监测网络
    comFun.initNetWorkCheck();
  },
  globalData: {
    userInfo: null
  },
  api: api,
  keyMaps,
  comFun: comFun,
  localStorageKeys: localStorageKeys,
  WxParse: WxParse
})