import request from '../../config/requests.js'
// pages/prize-info-change/prize-info-change.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isType: '1',
    weixinid: '',
    mobile: '',
    money_address: '',
    address: '',
    nickname: '',
    PStext: '',
    data: {
      name: '',
      mobile: '',
      address: '',
      postal: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let isType = options.type;
    let weixinid = options.weixinid || '',
      mobile = options.mobile || '',
      money_address = options.money_address || '',
      address = options.address || '',
      nickname = options.nickname,
      PStext = this.setPStext(isType)
    this.setData({
      weixinid,
      mobile,
      money_address,
      isType: isType,
      PStext: PStext
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //判断内容
  setwxid: function(e) {
    if (e.detail.value.weixinid) {
      this.setData({
        weixinid: e.detail.value.weixinid
      });
    } else
    if (e.detail.value.mobile) {
      this.setData({
        mobile: e.detail.value.mobile
      });
    } else
    if (e.detail.value.money_address) {
      this.setData({
        money_address: e.detail.value.money_address
      });
    } else
    if (e.detail.value.nickname) {
      this.setData({
        nickname: e.detail.value.nickname
      });
    } else {
      wx.showToast({
        title: '请填写完整内容',
      });
      return;
    }
    this.setInfoupdate();
  },
  //修改信息
  setInfoupdate: function() {
    let that = this;
    request({
      push: 'member_info_update',
      method: 'POST',
      data: {
        weixinid: this.data.weixinid,
        mobile: this.data.mobile,
        money_address: this.data.money_address,
        address: this.data.address,
        nickname: this.data.nickname
      }
    }).then((res) => {
      wx.navigateBack({
        delta: -1
      })
    }, (error) => {})
  },
  //获取手机号码，需要后台解密
  getPhoneNumber: function(e) {
    let that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    let session_key = wx.getStorageSync('session_key')
    request({
      push: 'wx_decode',
      method: 'POST',
      data: {
        sessionKey: session_key,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }
    }).then((res) => {
      console.log(res)
      if (res.data){
        that.setData({
          mobile: res.data.phoneNumber
        })
      }else{
        wx.clearStorageSync();
        wx.navigateTo({
          url: '/pages/login/login?type=prize',
        })
      }
      that.setInfoupdate()
    }, (error) => { })
  },
  setPStext: function(types) {
    switch (types) {
      case '1':
        wx.setNavigationBarTitle({
          title: "微信号"
        })
        return '填写你的微信号';
        break;
      case '2':
        wx.setNavigationBarTitle({
          title: "手机号"
        })
        break;
      case '3':
        wx.setNavigationBarTitle({
          title: "收款地址"
        })
        return '请填写其他领奖必要信息';
        break;
      case '5':
        wx.setNavigationBarTitle({
          title: "收货地址"
        })
        break;
      default:
        return '';
    }
  }
})