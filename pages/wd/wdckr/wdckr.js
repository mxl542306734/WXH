let api = require("../../../common/ApiClient.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bank_list: ["请选择"],
    bank_list_index: 0,
    bank_name: "请选择",
    bank_code: "",
    province_list: ["请选择"],
    province_name: "请选择",
    province_code: '',
    province_list_index: 0,
    city_list: [{ DQMC: '请选择' }],
    city_list_index: 0,
    city_name: "请选择",
    city_code: '',
    isAgree: false,
  },
  //生成银行列表
  generBankList: function () {
    api.callRZT('{"service":"H0601611","ORGEN_ID":"2","dataType":"json"}', function (response) {
      console.log(response[0])
      if (response[0].length > 0) {
        this.setData({
          bank_list: response[0]
        });
      }
    }.bind(this), function () { }, false, false)
  },

  //生成省份列表
  generProvinces: function () {
    api.callRZT('{"service":"A1705001","dataType":"JSON"}', function (response) {
      if (response[0].length > 0) {
        this.setData({
          province_list: response[0]
        });
      }

    }.bind(this), function () { }, false, false)
  },
  generCities: function (value) {
    if (value) {
      api.callRZT('{"service":"A1705002","dataType":"JSON","PAR_REGION_ID":"' + value + '"}',
        function (response) {
          if (response[0].length > 0) {
            this.setData({
              city_list: response[0]
            });
          }
        }.bind(this), function () { }, false, false);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.generBankList();
    this.generProvinces();
  },
  //选择银行卡
  selectBankCard: function (e) {
    let bankList = this.data.bank_list;
    let index = e.detail.value;
    let bank_name = bankList[index].BANK_FNAME.length > 6 ? bankList[index].BANK_FNAME.substr(0, 6) + "..." : bankList[index].BANK_FNAME;
    let bank_code = bankList[index].BANK_CODE;
    this.setData({
      bank_list_index: e.detail.value,
      bank_name: bank_name,
      bank_code: bank_code
    });
  },
  //选择省份

  selectProvince: function (e) {
    let province = this.data.province_list;
    let index = e.detail.value;
    let province_name = province[index].SSMC;
    let province_code = province[index].SSDM;
    this.generCities(province_code);
    this.setData({
      province_list_index: e.detail.value,
      province_name: province_name,
      province_code: province_code,
      city_name: "请选择",
      city_code: '0'
    });
  },

  //选择城市
  selectCity: function (e) {
    let city = this.data.city_list;
    let index = e.detail.value;
    let city_name = city[index].DQMC;
    let city_code = city[index].DQDM;
    this.setData({
      city_list_index: e.detail.value,
      city_name: city_name,
      city_code: city_code
    });
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
    console.log("显示");

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
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  }
})