let loadXML = require("./Tools.js");
let api = {
  menus: ["首页", "理财", "和宝", "我的"],
  NAV: {
    HOME: 0,
    INVEST: 1,
    BOND: 2,
    MYINFO: 3
  },

  Params: {
    // 服务器响应正确返回码
    "code": [0, "MP1B000000"],
    "appSignUrl": "https://a.139lc.com/v1/w/appSignCard.htm",
    "appAuthUrl": "https://a.139lc.com/v1/w/authConfig.htm",
    //"apiUrl": "https://120.25.73.35:21900/api/",      // 测试环境


    // 理财
    // "apiUrl": 'https://119.29.52.204:21900/api/',       // 云环境
    //"apiUrl": 'http://m.139lc.com:21800/api/',          // 客户域名 http
    "apiUrl": 'https://m.139lc.com/api/',       // 客户域名 https
    // appUrl:'https://m.139lc.com:21900/api/',
    //"apiUrl": 'http://119.29.155.61:21800/api/',
    //"apiUrl": 'https://119.29.155.61:21900/api/',

    // 中台
    //'getIP': 'http://m.139lc.com:21800/api/',
    //'getIP': 'http://119.29.155.61:21800/api/',
    //'getIP': 'http://120.25.73.35:21800/api/',
    'getRZT': 'https://a.139lc.com/v1/services/SoapService/',
    // 'getHSH':'https://m.139lc.com:21900/zhuce/',
    // 中台接口
    // 'getRZT': 'http://10.10.11.76:8080/Service/services/SoapService/'
    // 'getRZT': 'https://a.139lc.com/v1/services/SoapService/',
    // 'getRZT': 'https://a.139lc.com/v1/services/SoapService/'
    //'getRZT': 'http://10.10.11.3/account/services/SoapService/'
    // 'getRZT': 'https://m.139lc.com:21900/zhuce/'
    // 'getRZT': 'http://localhost/RZT/services/SoapService',
    //initHost: 'http://ak.kdsapp.mobi:21800/api/admin/data/config/init-config.json', // 测试环境中台初始化数据
    //              http://m.139lc.com:21800/api/admin/data/config/init-config.json     // 发布环境中台初始化数据

  },

  APIs: {
    // "ptjy/ptyw/wtxd": {
    //     name: ".....",
    //     id: ".....",
    //     desc: "......",
    //     input: {
    //         mmlb: "默认值",
    //         ......
    //     },
    // }
  },

  Data: {
    commonFields: {
      //登录信息
      ///"khbz":"310100000977",            // 中信
      ///"zjzh":"310100000977",            // ETF请求使用此字段(同khbz)
    }
  },

  //业务 (POST请求)
  call: function (module, apiId, request, responseHandler, errorHandler, bHideErrorDialog, showLoading) {
    let url = this.Params['apiUrl'] + module + "/" + apiId;
    api.doHttpRequest(url, request, function (response) {
      api.onResponse(response, responseHandler, errorHandler, bHideErrorDialog); // errorHandle第三方服务错误
    }, errorHandler, "POST", showLoading); // errorHandle network 错误
  },

  // 初始化请求业务(Get请求)
  callGet: function (module, apiId, request, responseHandler, errorHandler, bHideErrorDialog) {
    let url = this.Params['getIP'] + module + "/" + apiId;
    api.doHttpRequest(url, request, function (response) {
      api.onResponse(response, responseHandler, errorHandler, bHideErrorDialog); // errorHandle第三方服务错误
    }, errorHandler, "GET"); // errorHandle network 错误
  },
  callRZT: function (request, responseHandler, errorHandler, bHideErrorDialog, showLoading) {
    let url = this.Params['getRZT'];
    let datas = this.getPostData(request);
    api.doRZTHttpRequest(url, datas, function (response) {
      api.onRZTResponse(response, responseHandler, errorHandler, bHideErrorDialog); // errorHandle第三方服务错误
    }, errorHandler, "POST", showLoading);
  },
  callHSH: function (request, responseHandler, errorHandler, bHideErrorDialog, showLoading) {
    let url = this.Params['getHSH'];
    let datas = this.getPostData(request);
    api.doRZTHttpRequest(url, datas, function (response) {
      api.onRZTResponse(response, responseHandler, errorHandler, bHideErrorDialog); // errorHandle第三方服务错误
    }, errorHandler, "POST", showLoading);
  },
  getPostData: function (paramJson) {
    let postData;
    postData = '<?xml version="1.0" encoding="utf-8"?>';
    postData += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:Soapservice="http://soap.centms.com/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
    postData += '<soap:Body>';
    postData += '<Soapservice:doService>';
    postData += '<requestXml>';
    postData += '{"REQUESTS":[{"REQ_COMM_DATA":';
    postData += paramJson;
    postData += '}]}';
    postData += '</requestXml>';
    postData += '</Soapservice:doService>';
    postData += '</soap:Body>';
    postData += '</soap:Envelope>';
    return postData;
  },
  onResponse: function (response, responseHandler, errorHandler, bHideErrorDialog) {
    if (response.cljg) {        // 服务器返回的
      let code = response.cljg[0].code;
    } else if (response['active']) {    // 中台返回的格式与服务器不一致 yehao
      responseHandler(response);
      return;
    }
    if (this.Params.code.indexOf(code) != -1) {
      responseHandler(response);
      return;
    }

    // MT1B999999 由第三方应用服务程序返回的业务错误提示 (柜台返回的错误)
    let message = code == "MT1B999999" ? response.cljg[0].message : response.cljg[0].message;
    message = this.filterMessage(message);
    if (errorHandler) {
      errorHandler();  // 请求出错的逻辑处理
      if (bHideErrorDialog) return;  // 设置 bHideErrorDialog 则不显示请求出错提示框
    }
    // this.Msg.show(message, "提示信息");
    //api.toast(message);
    return;
  },
  // 中台数据返回处理
  onRZTResponse: function (response, responseHandler, errorHandler, bHideErrorDialog) {
    let code;
    if (response.ANSWERS[0].ANS_MSG_HDR) {        // 服务器返回的
      code = response.ANSWERS[0].ANS_MSG_HDR.MSG_CODE;
    }
    // 如果正确返回结果code = =0
    if (code == '0') {
      responseHandler(response.ANSWERS[0].ANS_COMM_DATA);
      return;
    } else {
        // MT1B999999 由第三方应用服务程序返回的业务错误提示 (柜台返回的错误)
        let message = response.ANSWERS[0].ANS_MSG_HDR.MSG_TEXT.replace(/\[.*?\]/g, "");
        wx.showModal({
          content: message,
          showCancel:false,
          confirmColor: "#ff4138",
          showCancel: false
        });

        if (errorHandler) {
          errorHandler();  // 请求出错的逻辑处理
        }
    }

    // // MT1B999999 由第三方应用服务程序返回的业务错误提示 (柜台返回的错误)
    // let message = response.ANSWERS[0].ANS_MSG_HDR.MSG_TEXT.replace(/\[.*?\]/g, "");
    // // message = this.filterMessage(message);
    // if (errorHandler) {
    //   // wx.showToast({
    //   //   title: message,
    //   //   mask:true
    //   // });
    //   wx.showModal({
    //     title: "错误提示",
    //     content: message,
    //     showCancel: false
    //   });
    //   errorHandler();  // 请求出错的逻辑处理
    //   // if (bHideErrorDialog) return;  // 设置 bHideErrorDialog 则不显示请求出错提示框
    // }
    // this.Msg.show(message, "提示信息");
    //    api.toast(message);
    return;
  },
  // 中台请求
  doRZTHttpRequest: function (url, datas, sucessCallback, failCallback, requestMethod, showLoading) {
    let self = this;
    if (showLoading){
      wx.showLoading({
        title:"请稍后...",
        mask:true
      });
    }
    wx.request({
      url: url,
      data: datas,
      method: requestMethod,
      header: { 'content-type':"text/xml;charset=UTF-8"},
      dataType: "XML",
      success: function (res) {
        if (res.statusCode == 200) {
          let filterData = loadXML(res.data);
          sucessCallback(filterData);
        }
      },
      fail: function (err) {
        let errorText = "";
        if (err.statusCode == 0) {
          if (err.errMsg == "timeout") {
            errorText = "您的网络不给力，请稍后再试。";
          } else {
            errorText = "网络请求失败，请稍后再试。";
          }
        } else if (request.statusCode == 400) {
          errorText = "网络连接失败。";
        } else if (request.statusCode == 404) {
          errorText = "网络连接失败。";
        } else if (request.statusCode == 500) {
          errorText = "服务器繁忙，请稍后再试。";
        } else if (request.statusCode == 502) {
          errorText = "服务器繁忙，请稍后再试。";
        } else {
          errorText = "网络请求失败，请稍后再试。";
        }
        if (failCallback) {
          wx.showModal({
            title: '错误信息',
            content: errorText,
            confirmColor: '#f35545',
          });
        }
      },
      complete:function(){
        wx.hideLoading();
      }

    })
    // showLoading = showLoading == undefined ? true : showLoading;
    // $.ajax({
    //   type: requestMethod,
    //   url: url,
    //   data: datas,
    //   timeout: 60 * 1000,
    //   ContentType: "text/xml;charset=UTF-8",
    //   dataType: "XML",
    //   async: true,
    //   cache: false,

    //   //application/x-www-form-urlencoded;
    //   beforeSend: function (requestHeader) { //请求之前加载
    //     if (showLoading) {
    //       api.loadding.run();
    //     };
    //   },
    //   success: function (response) {
    //     if (showLoading) {
    //       api.loadding.stop();
    //     };
    //     let result = $.parseJSON($(response).find("return").text());
    //     sucessCallback(result);
    //   },
    //   error: function (request, statusCode, error) {
    //     if (showLoading) {
    //       api.loadding.stop();
    //     };
    //     ////("[报错] " + request.statusCode + " " + request.statusCodeText);
    //     if (request.statusCode == 0) {
    //       if (request.statusCodeText == "timeout") {
    //         errorText = "您的网络不给力，请稍后再试。";
    //       } else {
    //         errorText = "网络请求失败，请稍后再试。";
    //       }
    //     } else if (request.statusCode == 400) {
    //       errorText = "网络连接失败。";
    //     } else if (request.statusCode == 404) {
    //       errorText = "网络连接失败。";
    //     } else if (request.statusCode == 500) {
    //       errorText = "服务器繁忙，请稍后再试。";
    //     } else if (request.statusCode == 502) {
    //       errorText = "服务器繁忙，请稍后再试。";
    //     } else {
    //       errorText = "网络请求失败，请稍后再试。";
    //     }
    //     if (failCallback) {
    //       failCallback();
    //       return;
    //     }
    //     api.toast(errorText);
    //   },
    //   complete: function (XHR, TS) {
    //     if (showLoading) {
    //       api.loadding.stop();
    //     };
    //   }
    // });
  },
  //网络
  doHttpRequest: function (url, datas, sucessCallback, failCallback, requestMethod, showLoading) {
    let self = this;
    wx.request({
      url: url,
      data: datas,
      method: requestMethod,
      header: { 'content-type': "text/xml;charset=UTF-8" },
      dataType: "XML",
      success: function (res) {
        if (res.statusCodeCode == 200) {
          let filterData = loadXML(res.data);
          sucessCallback(filterData);
        }
      }
    });
    // let api = this;
    // //("[请求] " + url);
    // //("[入参] " + JSON.stringify(request));
    // showLoading = showLoading == undefined ? true : showLoading;
    // $.ajax({
    //   type: requestMethod,
    //   url: url,
    //   data: JSON.stringify(request),
    //   timeout: 60 * 1000,
    //   contentType: "application/json;charset=utf-8;",
    //   dataType: "json",
    //   async: true,
    //   cache: false,

    //   //application/x-www-form-urlencoded;
    //   beforeSend: function (requestHeader) { //请求之前加载
    //     if (showLoading) {
    //       api.loadding.run();
    //     };
    //   },
    //   success: function (response) {
    //     if (showLoading) {
    //       api.loadding.stop();
    //     };
    //     //("[出参] " + JSON.stringify(response));
    //     sucessCallback(response);
    //   },
    //   error: function (request, statusCode, error) {
    //     if (showLoading) {
    //       api.loadding.stop();
    //     };
    //     ////("[报错] " + request.statusCode + " " + request.statusCodeText);
    //     if (request.statusCode == 0) {
    //       if (request.statusCodeText == "timeout") {
    //         errorText = "您的网络不给力，请稍后再试。";
    //       } else {
    //         errorText = "网络请求失败，请稍后再试。";
    //       }
    //     } else if (request.statusCode == 400) {
    //       errorText = "网络连接失败。";
    //     } else if (request.statusCode == 404) {
    //       errorText = "网络连接失败。";
    //     } else if (request.statusCode == 500) {
    //       errorText = "服务器繁忙，请稍后再试。";
    //     } else if (request.statusCode == 502) {
    //       errorText = "服务器繁忙，请稍后再试。";
    //     } else {
    //       errorText = "网络请求失败，请稍后再试。";
    //     }
    //     if (failCallback) {
    //       failCallback();
    //       return;
    //     }
    //     api.toast(errorText);
    //   },
    //   complete: function () {
    //     if (showLoading) {
    //       api.loadding.stop();
    //     };
    //   }
    // });
  },
  /*=================================================
   * 过滤过失败信息中不需要显示的内容
   * @param message 失败信息的内容
   =================================================*/
  filterMessage: function (message) {
    //let param_index0 = message.indexOf("流水号");
    //if(param_index0 >= 0)
    //{
    //    message.replace("流水号", "");
    //}
    //// 相关参数出现的位置
    //let param_index1 = message.indexOf("[相关参数");
    //// 只有当相关参数出现的位置不在第首位才过滤相关参数
    //if(param_index1 > 0)
    //{
    //    message = message.substring(0, param_index1);
    //}
    //return message;

    let find_index = message.indexOf(']');
    if (find_index >= 0) {
      message = message.substr(find_index + 1);
    }

    // 修改密码错误提示
    // find_index = message.indexOf("300006");
    // if(find_index >= 0) {
    //     message = "密码错误，请重新输入！";
    //     return message;
    // }

    find_index = message.indexOf("错误信息：");
    if (find_index >= 0) {
      message = message.substr(find_index + 5);
    }

    return message;
  }

};

module.exports = api;
