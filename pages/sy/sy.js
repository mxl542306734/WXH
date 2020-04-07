//获取应用实例
var app = getApp();
// 首页列表的key map
const ItemKeyMap = {
  cplx: {
    '1': 'lc',
    '2': 'jj',
    '3': 'bx',
    '4': 'jp',
  },
  bgImage: {
    'lc': '../../images/sy/sy_wjtz_bg.svg',
    'jj': '../../images/sy/sy_jxjj_bg.svg',
    'bx': '../../images/sy/sy_bxcp_bg.svg',
    'jp': '../../images/sy/sy_wjtz_bg.svg',
    'newer': '../../images/sy/sy_newer_bg.svg',
  },
  titImg: {
    'lc': '../../images/sy/sy_wjtz_title.svg',
    'jj': '../../images/sy/sy_jxjj_title.svg',
    'bx': '../../images/sy/sy_bxcp_title.svg',
    'jp': '../../images/sy/sy_wjtz_title.svg',
    'newer': '../../images/sy/sy_newer_title.svg',
  },
  valueDesc: {
    'lc': '预计年化',
    'jj': '七日年化收益率',
    'bx': '预计年化',
    'jp': '预计年化',
  }
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        link: '../../pages/ty/swiper/details?url=http://x.eqxiu.com/s/SVj0T6u8',
        url: 'http://huodong.139lc.com/ps//adv/1488962860121.jpg'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    page: 1,  // 请求第一页
    responseData:[],
    instListItems:[
      {
        id:'',
        isGroup:'',
        section_bjtp:'../../images/sy/sy_wjtz_bg.svg',
        section_head_image:'../../images/sy/sy_wjtz_title.svg',
        section_head_title:'',
        section_left_bgVal:'',
        section_left_valueDesc:'预计年化',
        section_left_smallValue:'',
        section_left_divDesc_qtje:'5000元起投',
        section_left_divDesc_qxts:'期限180天',
        section_right_image:'../../images/sy/sy_buy_btn.svg'
      }
    ],
    sy_inst_nums:0,//首页产品的总条数
    sy_inst_yjzsl:0,//首页已加载的产品条数
    foot_ljtze:[6,7,6,6,1,2,2], //累计投资人数
    foot_ljtzje: [6, 7, 6, 6, 1,8,8], // 累计投资金额
    hasNetwork:false,
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    // 检查网络情况
    this.initCheckNetWork();
    // 获取轮播图数据
    //this.initSwiperDatas();
    // 获取热销产品数据
    this.initInstListDatas(0);
    // 获取底部统计数据
    this.initFootTjDatas();
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
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 加载更多
    this.initInstListDatas(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '和掌柜分享',
      desc: '分享和掌柜!',
      path: '/page/user?id=123'
    }
  },
  // 获取轮播图数据
  initSwiperDatas:function(){
    app.api.callRZT('{"service":"A0000005","SHOW_TYPE_CODE":"5","dataType":"JSON"}', this.initRequestCallBack.bind(this),"",false,true)
  },
  // 设置轮播图的值
  initRequestCallBack: function (res) {
   var swiperArrays = res[0];
   var scrollImage = [];
   swiperArrays.map(function(item){
     let imgUrl = item.ADV_CONTENT;
     let imgLinked = item.ADV_LINKED;
     // 判断是否为url地址
     var urlReg = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
     if (urlReg.test(imgUrl) && urlReg.test(imgLinked)){
       scrollImage.push({ link:'../../pages/ty/swiper/details?url='+imgLinked,url:imgUrl});
     }
   });
   if (scrollImage.length > 0) {
     this.setData({
       imgUrls: scrollImage
     });
   } 
  },
  // 获取产品列表数据
  initInstListDatas: function (flag){
    var newPage = 1;
    var mysl = 10;
    if (flag == 1) {
        newPage = this.data.page + 1;
    } else {
        mysl = 200;
    }
    this.setData({ page: newPage });
    app.api.callRZT('{"service":"A0200060","rxbz" : "1","jpbz" : "0","dqys" : "' + newPage + '","mysl" : "' + mysl+'","jtkh" : "0",           "dataType":"JSON"}', this.initInstListCallBack.bind(this), "", false, true)
  },
  // 设置产品列表数据
  initInstListCallBack:function(res){
    var dataArray = res[0];
    var productList = [];
    if (this.data.page == 1) {
      // 设置总条数
      this.setData({ sy_inst_nums: dataArray.length});
      dataArray = dataArray.slice(0,10);
    } else {
      productList = this.data.instListItems;
    }
    if (this.data.sy_inst_yjzsl == this.data.sy_inst_nums){
      wx.showToast({
        title: '没有更多了',
        icon: 'success',
        duration: 1500
      });
    } else {
      var self = this;
      self.switchKey = self.switchKey ? false : true; // 每次key不同以确保控件被更新
      dataArray.map(function (item) {
        let type = item.CPLX;  //"cplx": "1",产品类型		理财/基金/保险/精品
        type = ItemKeyMap.cplx[type];   //类型缩写
        const productName = item.CPMC;   // "cpmc": "融证通产品0000",   产品名称
        const yjnh = parseFloat(item.YJNH).toFixed(1)/* * 100*/;        //"yjnh": "0.13"  预计年化
        const integerValue = parseInt(yjnh);   // 预计年化的 整数部分
        const decimalValue = (yjnh - integerValue).toFixed(1).split(".")[1]; // 预计年化的 小数部分
        var backgroundImg, titleImg;
        if (item.XSBZ == '1') {  // 新手专享
          backgroundImg = ItemKeyMap.bgImage['newer'];
          titleImg = ItemKeyMap.titImg['newer'];
        } else {
          backgroundImg = ItemKeyMap.bgImage[type];
          titleImg = ItemKeyMap.titImg[type];
        }
        var totalNum = parseFloat(item.ZSL);
        var leftNum = parseFloat(item.SYSL);
        let progress = (totalNum - leftNum) / totalNum;
        progress = isNaN(progress) ? '0' : '' + (parseInt(progress * 100));
        const upLabel = parseInt(item.QTJE) + '元起投';       //"qtje": "2344.00", 起投金额
        const downLabel = '期限' + item.CYQX + app.comFun.getHoldingUnit(item.CYQXDW);     // "cyqx": "233", 持有期限 + 持有期限单位
        productList.push({
          id: item.CPDM,
          isGroup: item.JTKH, //是否集团客户 0：非集团客户，1：集团客户
          section_bjtp: backgroundImg,
          section_head_image: titleImg,
          section_head_title: productName,
          section_left_bgVal: integerValue,
          section_left_smallValue: '.' + decimalValue + '%',
          section_left_valueDesc: '预计年化',
          section_left_divDesc_qtje: upLabel,
          section_left_divDesc_qxts: downLabel,
          section_right_image: self.getProductImage(item.CPZT)
        });
      });
      if (productList.length > 0) {
        if (productList.length > 10) {
          this.setData({ isShowBtn: true });
        }
        this.setData({
          instListItems: productList
        });
      } 
      this.setData({ sy_inst_yjzsl: (this.data.sy_inst_yjzsl + dataArray.length) });
    }
  },
  // 设置购买图标样式
  // 获取产品状态描述
	getProductImage: function (statusCode) {
    statusCode = parseInt(statusCode);
    switch (statusCode) {
      case 0: return '../../images/sy/sy_presell.svg';
      case 1: return '../../images/sy/sy_buy_btn.svg';
      case 2: return '../../images/sy/sy_sold_over.svg';
      case 3: return '../../images/sy/sy_over.svg';
      default: return '../../images/sy/sy_buy_btn.svg';
    }
  },
  // 获取轮播图数据
  initFootTjDatas: function () {
    app.api.callRZT('{"service":"A0200061","dataType":"json"}', this.initFootCallBack.bind(this), "", false, true)
  },
  // 设置底部的统计数据
  initFootCallBack:function(res){
    const result = res[0][0];
    // 用户总数
    const yhzs = app.comFun.formatNumToArray(result['ZYHS']);
    // 总投资金额
    const ztzje = app.comFun.formatNumToArray(result['ZTZJE']);
    this.setData({ foot_ljtze: yhzs, foot_ljtzje: ztzje});
  },
  /**
   * 购买详情
   */
  buyDetail: function (e) {
    if (this.data.hasNetwork){
      wx.setStorage({
        key: "LC_HOME_GM",
        data: e.currentTarget.dataset.product
      });
      wx.navigateTo({
        url: "/pages/lc/lcgm/lcgm"
      });
    }
  },
  initCheckNetWork:function(){
    var self = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        self.setData({ hasNetwork: res.networkType!=="none"});
        console.log(self.data.hasNetwork);
      }
    })
  }
})