//var $ = require('jquery');

var ComFuns = {


	/**
	 *
	 * @descrition: 判断输入的参数是否是一个合格的身份证号码。这个函数对输入的参数检查时候是合格的身份证号码，其身份证有效性无法判断。检测的颗粒度可以定制。
	 * @param->str : 待验证的参数
	 * @return : true是合格的身份证   false为不合法的身份证
	 *
	 */
	checkIdCard:function (num) {
		num = num.toUpperCase();

		var cityCode = {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 "};

		if(!cityCode[num.substr(0,2)]){
			//alert("地址编码错误");
			return false;
		}
		//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
		if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
			//alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
			return false;
		}
		//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
		//下面分别分析出生日期和校验位
		var len, re;
		len = num.length;
		if (len == 15) {
			re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
			var arrSplit = num.match(re);

			//检查生日日期是否正确
			var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
			var bGoodDay;
			bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bGoodDay) {
				//alert('输入的身份证号里出生日期不对！');
				return false;
			}
			else {
				//将15位身份证转成18位
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0, k;
				num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
				for (k = 0; k < 17; k++) {
					nTemp += num.substr(k, 1) * arrInt[k];
				}
				num += arrCh[nTemp % 11];
				return true;
			}
		}
		if (len == 18) {
			re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
			var arrSplit = num.match(re);

			//检查生日日期是否正确
			var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
			var bGoodDay;
			bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bGoodDay) {
				//alert(dtmBirth.getYear());
				//alert(arrSplit[2]);
				//alert('输入的身份证号里出生日期不对！');
				return false;
			}
			else {
				//检验18位身份证的校验码是否正确。
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var valnum;
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0, k;
				for (k = 0; k < 17; k++) {
					nTemp += num.substr(k, 1) * arrInt[k];
				}
				valnum = arrCh[nTemp % 11];
				if (valnum != num.substr(17, 1)) {
					//alert('18位身份证的校验码不正确！应该为：' + valnum);
					return false;
				}
				return true;
			}
		}
		return false;
	},
  formatNumToArray:function(str){
    var result = [];
    if (/^\d{1,}$/.test(str)){
      for(var i=0;i<str.length;i++){
        result.push(str[i]);
      }
    }
    return result;
  },
  formatStr:function(str){
    if (!str) return '';
    str = '' + str;
    return str.replace(/<|>/ig, '');
  },
  /**
   * 画面初始化的网络监测
   */
  initNetWorkCheck:function(){
    wx.onNetworkStatusChange(function (res) {
        // 如果有网络连接，则跳转回上一画面
        if (!res.isConnected) {
          wx.navigateTo({
            url: "../ty/wwllj/wwllj"
          });
        }
    });
  },
	/**
	 *
	 * @descrition:判断输入的参数是否是个合格的手机号码，不能判断号码的有效性，有效性可以通过运营商确定。
	 * @param:str ->待判断的手机号码
	 * @return: true表示合格输入参数
	 *
	 */
	isCellphone: function(str) {
		/**
		 *@descrition:手机号码段规则
		 * 13段：130、131、132、133、134、135、136、137、138、139
		 * 14段：145、147
		 * 15段：150、151、152、153、155、156、157、158、159
		 * 17段：170、176、177、178
		 * 18段：180、181、182、183、184、185、186、187、188、189
		 *
		 */
		var pattern =  /^1\d{10}$/;
		return pattern.test(str);
	},

	//判断字符串是否由数字组成,
	isNumberString: function(str) {
		var re =/^\d{1,}$/;
		//var re = /^[0-9]+.?[0-9]*$/;   //若判断正整数，则后边是：/^[1-9]+[0-9]*]*$/
		return re.test(str);
	},

	// 判断是字符串中是否含有空格
	isHaveSpace: function(str) {
		var reg = /\s/;
		return reg.exec(str);
	},

	/**
	* 判断是否是6-20位的数字或英文
	* @param: password
	*/
	checkPassword: function(password){
		//6-20至少有一个英文
		//var pattern = /^(?!(?:\d*$))[A-Za-z0-9]{6,20}$/;
		var pattern = /^[A-Za-z0-9]{6,20}$/;
		return pattern.test(password);
	},
	/**
	* 判断交易密码为6位纯数字
	* @param: password
	*/
	checkJyPassword: function(password){
		//6为纯数字
		var pattern = /^\d{6}$/;
		return pattern.test(password);
	},
  /**
  * 判断验证码为6位纯数字
  * @param: password
  */
  checkYzmPassword: function (yzm) {
      //6为纯数字
      var pattern = /^\d{6}$/;
      return pattern.test(yzm);
    },
	// 转换秒数时间展示
	convertSecondsToDateStr: function(seconds) {
		var sec  = seconds % 60;
		var min  = parseInt(seconds / 60) % 60;
		var hour = parseInt(seconds / 3600) % 24;
		var day  = parseInt(seconds / 86400);
		return day+'天'+hour+'时'+min+'分'+sec+'秒';
	},

	// @Desc: 将数字(除去小数点)每3个逗号分段
	// @param strNum：数字
	// @param partLen：每部分的长度
	// @param sep：分隔符
	splitStrToParts: function (strNum, partLen, sep) {
		if (strNum === 0 || strNum === '0') return '0';
		if (!strNum) return '';
		strNum = ''+strNum;
		partLen = partLen || 3;
		sep = sep || ',';

		var index = strNum.indexOf('.'); // 小数点
		var strLeft = strNum;
		var strRight = '';
		if (index != -1) {
			strLeft = strNum.substring(0, index);
			strRight = strNum.substring(index);
		}

		var len = strLeft.length;
		if (len <= partLen) return (strLeft+strRight);

	    var startIndex = len % partLen;
	    var result = startIndex ? strLeft.substr(0, startIndex) : "";
	    for(var i = startIndex; i < len; i += partLen )
	    {
	    	result += (sep + strLeft.substr(i, partLen) );
	    }
	    result = (startIndex ? result : result.substr(1) ) + strRight;
	    return result;
	},

	// 去除字符串前后空格
	trim: function(str) {
		if (!str) return '';
		str = '' + str;
		return str.replace(/^\s+|\s+$/g,'');
	},

	// 判断字符串是否为数字(正整数/小数)
	isNum: function(str) {
		if (!str) return false;
		str = '' + str;
		str = this.trim(str); // 去空格
		//str = str.trim();	// TODO: trim 方法使用有误
		var index = str.indexOf('.');
		if (index == -1) {
			return (/^\d+$/.test(str) );
		} else { // 有带'.' 可能是小数
			var integar = str.substr(0, index);
			var decimal = str.substr(index+1);
			var isIntNum = /^\d+$/.test(integar);
			var isDecNum = /^\d+$/.test(decimal);
			return (isIntNum && isDecNum);
		}
	},

	// 判断字符串是否全是中文
	isChinese: function(str) {
		if (!str) return false;
		if (/[^\u4e00-\u9fa5]/.test(str) ) {
			return false;
		} else {
			return true;
		}
	},
	// 判断字符串是否为空
	isNotEmpty:function(str){
		return (this.trim(str) !=null && this.trim(str) != "" && this.trim(str) != "undefined");
	},
	// 计算剩余秒数(倒计时使用)
	// @date: 形如"2016-01-31 10:12:03.0" date - date2
    getLeftSeconds: function(date, date2) {
    	if (!date) return 0;
    	var t = date.split(/[- :]/);
		var tempDate1 = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

    	var tempDate2;
    	if (!date2) { //若未下发系统时间，则取本机当前时间
    		tempDate2 = new Date();
    	} else {
			var temp = date2.split(/[- :]/);
			tempDate2 = new Date(temp[0], temp[1]-1, temp[2], temp[3], temp[4], temp[5]);
    	}
        var sec = (Date.parse(tempDate1) / 1000 - Date.parse(tempDate2) / 1000);

        return sec < 0 ? 0 : sec;
    },

    // 获取产品状态描述
    getProductStatus: function(statusCode) {
    	statusCode = parseInt(statusCode);
    	switch (statusCode) {
    		case 0: return '预售';
    		case 1: return '购买';
    		case 2: return '售罄';
    		case 3: return '已结束';
    		default: return '';
    	}
    },
    // 理财列表获取持有期限单位描述
    getHoldingUnit: function(unit) {
    	switch(unit) {
    		case 'Y': return '年';
    		case 'M': return '个月';
    		case 'D': return '天';
    		case 'S': return '季度';
    		default:  return '天';
    	}
    },

    // 是否不能购买(0  预售 2  售罄 3  已结束) // 按钮灰色
  	isProductCanBuy: function(statusCode) {
  		return (statusCode == '0' || statusCode == '1');
  	},
  	// 是否结束 ( 2 售罄 / 3 已结束 ) // 显示 "累计" 金额 ;  否则显示 “剩余”
  	isProductOver: function(statusCode) {
  		return (statusCode == '2') || (statusCode == '3');
  	},

  	/**
  	* 从href中获得参数
  	* @param href 当前页面地址
  	* @parm argName 参数名称
  	*/
    getParamsFromHref: function(href, argName){
        var args = href.split("?");
        if (args[0] == href) {
            return "";
        };
        var str = args[1];
        args = str.split("&");
        for (var i = 0; i < args.length; i++) {
            var temp = args[i];
            var arg = temp.split("=");
            if (arg.length <= 1) {
                continue;
            };
            if (arg[0] == argName) {
                return arg[1];
            };
        };
    },

};

module.exports = ComFuns;

