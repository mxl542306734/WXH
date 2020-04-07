/**
 * LocalStroge 的key 值定义
 *
 * 由于 LocalStroge 使用 key:value的方式存储,所以在这里统一定义,防止重复定义;
 * 使用value时,统一在这里通过key取;
 *
 *  TODO: 在账号退出时,除了必须存的 历史数据,如:登录下拉框,最好都清空一遍
 */

const KeyMaps =  {

    CurrentBrowserType: 'CurrentBrowserType',

    //  首页
    // 轮播图跳转地址
    Home_Scroll_JumpAddress: 'Home_Scroll_JumpAddress',
    // 跳转的轮播图标题
    Home_Scroll_JumpTitle: 'Home_Scroll_JumpTitle',

    //  理财
    //  理财首页
    // 理财首页界面-购买
    LC_home_gm: 'LC_HOME_GM',
    // 理财购买界面-购买
    LC_lcgm_gm: 'LC_LCGM_GM',
    // 理财交易界面-购买
    LC_lcjy_gm: 'LC_lcjy_gm',

    //  我的
    // 我的银行卡
    // 我的银行卡列表
    WD_yhk_lb:  'WD_yhk_lb',
    // 持卡人姓名
    WD_ckr_name: 'WD_ckr_name',
    // 持卡人银行卡号
    WD_ckr_num: 'WD_ckr_num',
    // 身份证号
    WD_khxx_idCard: 'WD_khxx_idCard',
    // 预留手机号
    WD_khxx_phone: 'WD_khxx_phone',
    // 用户选择银行卡对应的银行码
    WD_bank_capital_bank_code:'WD_bank_capital_bank_code',
    // 新增银行卡银行名称
    WD_yh_name: 'WD_yh_name',
    // 新增银行卡银行编号
    WD_yh_code: 'WD_yh_code',
    // 新增银行卡银行标识
    WD_yh_symbol: 'WD_yh_symbol',
    // 新增银行卡银行所在省
    WD_yh_province: 'WD_yh_province',
    // 新增银行卡银行所在市
    WD_yh_city: 'WD_yh_city',
    // 新增银行卡银行所在省编号
    WD_yh_province_code: 'WD_yh_province_code',
    // 新增银行卡银行所在市编号
    WD_yh_city_code: 'WD_yh_city_code',
    // 从协议页面跳回添加银行卡页面
    WD_yh_jump_from_agreement: 'WD_yh_jump_from_agreement',
    // 是否同意协议
    WD_yh_AgreeProtocol: 'WD_yh_AgreeProtocol',
    // 当前点击的银行卡
    WD_ckr_Click_Card: 'WD_ckr_Click_Card',
    // 我的交易账号
    WD_jyzh_num: 'WD_jyzh_num',
    // 是否需要mo宝开户
    WD_MoBao_state: 'WD_MoBao_state',  //区分新老用户 0 和 1 (是否需要mo宝开户) (1是yes)
    //我的分销
    // 我的专属产品
    WD_zscp_item: 'WD_zscp_item',
    // 我的客户列表_账号
    WD_khxq_zh: 'WD_khxq_zh',
    // 消息中心 (缓存广播消息/个人消息)
    // 广播消息
    Msg_type_public: 'Msg_type_public',
    // 个人消息
    Msg_type_private: 'Msg_type_private',
    //  登陆
    // 登录成功后跳转地址
    Login_Success_Jump: 'LOGIN_SUCCESS_JUMP',
    // 归属地
    Login_gsd: 'Login_gsd',
    // 登录密码
    Login_Password: 'Login_Password',
    // 原生需要用到的用户个人信息:
    // 用户昵称
    Login_UserName: 'Login_UserName',
    // 登录账号
    Login_Account: 'Login_Account',
    // 用户状态
    Login_Account_State:'Login_Account_State',// 客户状态（0:在摩宝和富友都未注册 1:在墨宝注册但未在富有注册；2:在富友注册未在摩宝注册;3:在富友和摩宝都注册）
    // 用户头像地址
    Login_UserHeaderImage: 'Login_UserHeaderImage',
    // 登录状态标识
    Login_State: 'Login_State',      // 0 和 1 (1是yes)
    // 是否自动登录
    Login_isAuto: 'Login_isAuto',     // 0 和 1
    // 我的邀请码
    Login_MyInvitationCode: 'Login_MyInvitationCode',
    // 客户经理标识
    Login_isManager: 'Login_isManager',
    // 客户经理名称
    Login_ManagerName: 'Login_ManagerName',
    // 客户经理手机号码
    Login_ManagerPhone: 'Login_ManagerPhone',
    // 客户经理邀请码
    Login_ManagerCode: 'Login_ManagerCode',
    // 客户经理邀请码
    Login_NewManagerCode: 'Login_NewManagerCode',
    // 重置登录密码成功后跳转地址
    Reset_Password_Success_Jump: 'Reset_Password_Success_Jump',
    // 登录账号历史列表
    Login_Account_Histroy: 'Login_Account_Histroy',
    // 登陆账户的墨宝余额
    Login_Account_Mobo_YE:'Login_Account_Mobo_YE',
    // 是否设置手势密码
    Login_isSetGestureLock: 'Login_isSetGestureLock',
    // 是否开启手势密码登录
    Login_isLoginByGesture: 'Login_isLoginByGesture',
    // 轮播图片缓存
    scrollImageCache: 'scrollImageCache',
    //客户端留痕信息
    // 客户端类型
    Client_Type: 'Client_Type',
    // 客户端型号
    Client_Device_Model: 'Client_Device_Model',
    // 客户端版本号
    Client_Version: 'Client_Version',
    // 设备唯一标识
    Client_Device_Id: 'Client_Device_Id',
    // 充值成功后跳转地址
    Recharge_Success_Jump: 'Recharge_Success_Jump',
    // 我的理财产品项
    WD_LCCP_Item: 'WD_LCCP_Item',
    // 和宝界面宝码
    HeBao_Code: 'HeBao_Code',
    // 获取验证码手机号码
    Get_VerifyCode_Histroy: 'Get_VerifyCode_Histroy',
    // 是否签约
    Login_account_isSign:'Login_account_isSign',
    // 是否授权委托提现
    Login_account_isAuthWithdraw:'Login_account_isAuthWithdraw',
    // 是否授权委托充值
    Login_account_isAuthCharge:'Login_account_isAuthCharge',
    // 签约授权地址
    Login_account_sign_auth_addr:'Login_account_sign_auth_addr',
    // 授权类型
    Login_Account_auth_type:'Login_Account_auth_type',// 1：充值，2：提现
    // 授权返回地址
    Login_Account_auth_back_url:'Login_Account_auth_back_url',
    // 签约返回地址
    Login_Account_sign_back_url:'Login_Account_sign_back_url',
    is_Login_Account_Mobo_YE_Tip:false, // 是否提示过用户提现
    is_Bind_Card_Tip:false,// 是否提示过用户绑卡
    is_Login_account_isSign_Tip:false,//是否提示过用户去签约
    is_Login_account_Card_Select_Tip:false,//是否提示过用户去选卡开户
    // 购买预期收益
    lc_lcjy_yqsy:'lc_lcjy_yqsy',
    LC_GM_CPMS:'LC_GM_CPMS',
    Login_user_isNew: 'Login_user_isNew',// 是否是新手（2：否，1：是）
    Login_user_3rdSessionKey: 'Login_user_3rdSessionKey',// 用户登录凭证


    // 主动获得的用户信息
    Login_user_nickName:'Login_user_nickName',// 用户的昵称
    Login_user_province: 'Login_user_province',// 用户的省份
    Login_user_city: 'Login_user_city',// 用户的城市
    Login_user_Phone_brand: 'Login_user_Phone_brand',// 用户手机的品牌
    Login_user_Phone_model: 'Login_user_Phone_model',// 用户手机型号
    Login_user_Phone_screenWidth: 'Login_user_Phone_screenWidth',// 用户屏幕宽度
    Login_user_Phone_screenHeight: 'Login_user_Phone_screenHeight',// 用户屏幕高度
    Login_user_Phone_system: 'Login_user_Phone_system',// 用户操作系统版本
    Login_user_Phone_fontSizeSetting: 'Login_user_Phone_fontSizeSetting',// 用户字体大小
    Login_user_Phone_newWork: 'Login_user_Phone_newWork',// 用户手机的网络类型
    Login_user_Location_latitude:'Login_user_Location_latitude',// 用户位置维度
    Login_user_Location_longitude: 'Login_user_Location_longitude',// 用户位置经度
    Login_user_Location_speed: 'Login_user_Location_speed',// 用户移动速度

};

module.exports = KeyMaps;
