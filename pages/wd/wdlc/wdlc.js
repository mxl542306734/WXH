let app = getApp();
Page({
  data: {
    tabs: ["持有中", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    holdData: [],
    finishedData: [],
    holdPage: 1,
    finishedPage: 1,
    loading: true,
    noData: true
  },
  getHoldData: function (day) {
    let account = wx.getStorageSync(app.localStorageKeys.WD_jyzh_num);
    let curPage_hold = this.data.holdPage;
    let params = {
      "dataType": "json",
      "service": "A0200062",
      "lczt": '2',
      "jyzh": account,
      "dqys": day,      // 当前页数
      "mysl": "5"
    };
    app.api.callRZT(JSON.stringify(params),
      this.handleHold,
      function () {

      },
      false,
      true);
  },
  getFinishedData: function (day) {
    this.setData({ loading: true, noData: true });
    let account = wx.getStorageSync(app.localStorageKeys.WD_jyzh_num);
    let curPage_hold = this.data.finishedPage;
    let params = {
      "dataType": "json",
      "service": "A0200062",
      "lczt": '1',
      "jyzh": account,
      "dqys": day,      // 当前页数
      "mysl": "5"
    };
    app.api.callRZT(JSON.stringify(params),
      this.handleFinished,
      function () {

      },
      false,
      true);
  },
  handleHold: function (res) {
    let productList = res[0];
    let resData = [];
    let expire, ddzt, ddztsm;
    if (productList.length > 0) {
      productList.map(function (item) {
        expire = item['DQSJ'];
        ddzt = !isNaN(item['DDZT']) ? parseInt(item['DDZT']) : 0;
        ddztsm = item['DDZTSM'];
        switch (ddzt) {
          case 0:
          case 1:
          case 2:
            ddztsm = "投资处理中";
            break;
          case 3:
            ddztsm = "投资处理失败";
            break;
          case 4:
            ddztsm = "计息中";
            break;
          case 5:
          case 6:
          case 7:
          case 8:
            ddztsm = "投资处理失败";
            break;
          case 9:
            ddztsm = "还款中";
            break;
          case 10:
            ddztsm = "投资结束";
            break;
          case 11:
            ddztsm = "还款中";
            break;
          case 12:
            ddztsm = "投资结束";
            break;
          case 13:
            ddztsm = "还款中";
            break;
          case 14:
            ddztsm = "投资结束";
            break;
          case 15:
            ddztsm = "投资处理失败";
            break;
        }
        let timeUnit;
        switch (item['QXDW']) {
          case 'Y':
            timeUnit = "年";
            break;
          case 'S':
            timeUnit = "季";
            break;
          case 'M':
            timeUnit = "月";
            break;
          case 'D':
            timeUnit = "天";
            break;
        }
        resData.push({
          key: "product-" + item['CPDM'],
          productId: item['CPDM'],
          productName: item['CPMC'],
          expire: expire.substr(0, 4) + '-' + expire.substr(4, 2) + '-' + expire.substr(6, 2),
          yearRate: parseFloat((parseFloat(item['YJNH'])).toFixed(2)),
          money: (item['CYSL'] ? parseFloat(item['CYSL']).toFixed(2) : '0.00'),
          status: ddzt,
          statusMsg: ddztsm,
          timeLimit: item['CPQX'],
          timeUnit: timeUnit,
          occurrenceTime: item['FSSJ'],
          ksjxr: item['KSJXR'],
          yjsy: (item['YJSY'] ? parseFloat(item['YJSY']).toFixed(2) : '0.00'),
          ddid: item['DDID'],
        });
      });
      let holdData = this.data.holdData.concat(resData);
      if (holdData.length != this.data.holdData.length) {
        this.setData({
          holdData: holdData,
          loading: true,
          noData:true
        });
      } else {
        this.setData({
          holdData: holdData,
          loading: false,
          noData:false
        });
      }
    } else {
      this.setData({
        loading: true,
        noData: false
      });
    }
  },
  handleFinished: function (res) {
    let productList = res[0];
    let resData = [];
    let expire, ddzt, ddztsm;
    if (productList.length > 0) {
      productList.map(function (item) {
        expire = item['DQSJ'];
        ddzt = !isNaN(item['DDZT']) ? parseInt(item['DDZT']) : 0;
        ddztsm = item['DDZTSM'];
        switch (ddzt) {
          case 0:
          case 1:
          case 2:
            ddztsm = "投资处理中";
            break;
          case 3:
            ddztsm = "投资处理失败";
            break;
          case 4:
            ddztsm = "计息中";
            break;
          case 5:
          case 6:
          case 7:
          case 8:
            ddztsm = "投资处理失败";
            break;
          case 9:
            ddztsm = "还款中";
            break;
          case 10:
            ddztsm = "投资结束";
            break;
          case 11:
            ddztsm = "还款中";
            break;
          case 12:
            ddztsm = "投资结束";
            break;
          case 13:
            ddztsm = "还款中";
            break;
          case 14:
            ddztsm = "投资结束";
            break;
          case 15:
            ddztsm = "投资处理失败";
            break;
        }
        let timeUnit;
        switch (item['QXDW']) {
          case 'Y':
            timeUnit = "年";
            break;
          case 'S':
            timeUnit = "季";
            break;
          case 'M':
            timeUnit = "月";
            break;
          case 'D':
            timeUnit = "天";
            break;
        }
        resData.push({
          key: "finish-" + item['CPDM'],
          productId: item['CPDM'],
          productName: item['CPMC'],
          expire: expire.substr(0, 4) + '-' + expire.substr(4, 2) + '-' + expire.substr(6, 2),
          yearRate: parseFloat((parseFloat(item['YJNH'])).toFixed(2)),
          money: (item['CYSL'] ? parseFloat(item['CYSL']).toFixed(2) : '0.00'),
          status: ddzt,
          statusMsg: ddztsm,
          timeLimit: item['CPQX'],
          timeUnit: timeUnit,
          occurrenceTime: item['FSSJ'],
          ksjxr: item['KSJXR'],
          yjsy: (item['YJSY'] ? parseFloat(item['YJSY']).toFixed(2) : '0.00'),
          ddid: item['DDID'],
        });
      });
      let finishedData = this.data.finishedData.concat(resData);
      if (finishedData.length != this.data.finishedData.length) {
        this.setData({
          finishedData: finishedData,
          loading: false,
          noData: true
        });
      } else {
        this.setData({
          loading: true,
          noData: false
        });
      }
    } else {
      this.setData({
        loading: true,
        noData: false
      });
    }
  },
  onLoad: function () {
    this.getHoldData(1);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (this.data.activeIndex == 0) {
      this.setData({
        holdData: [], finishedData: [], holdPage: 1, finishedPage: 1, loading: true,
        noData: true
      });
      this.getHoldData(1)
    } else {
      this.setData({
        holdData: [], finishedData: [], holdPage: 1, finishedPage: 1, loading: true,
        noData: true
      });
      this.getFinishedData(1)
    }
  },
  //上拉
  onReachBottom: function () {
    if (this.data.activeIndex == 0) {
      let holdPage = this.data.holdPage + 1;
      this.setData({
        holdPage: holdPage,
        loading: false,
        noData: true
      });
      this.getHoldData(holdPage);
    } else {
      let finishedPage = this.data.finishedPage + 1;
      this.setData({
        finishedPage: finishedPage,
        loading: false,
        noData: true
      });
      this.getFinishedData(finishedPage);
    }
  },
  handleItemClick: function (e) {
    let holdData = this.data.holdData;
    let idx = e.currentTarget.id;
    if (holdData.length > 0) {
      wx.setStorageSync("wdlc_item", holdData[idx]);
      wx.navigateTo({
        url: 'wdgmxq/wdgmxq',
      })
    }
  },
  handleItem: function (e) {
    let holdData = this.data.finishedData;
    let idx = e.currentTarget.id;
    if (holdData.length > 0) {
      wx.setStorageSync("wdlc_item", holdData[idx]);
      wx.navigateTo({
        url: 'wdgmxq/wdgmxq',
      });
    }
  }
});