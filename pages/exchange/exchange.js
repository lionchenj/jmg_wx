import request from '../../config/requests.js'
// pages/exchange/exchange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guli: 1000,
    page: 1,
    exchangeList: [],
    weixinid: '',
    mobile: '',
    money_address: '',
    address: '',
    score: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getExchange();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getmemberInfo();
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
  //兑换列表
  getExchange: function() {
    let that = this;
    request({
      push: 'exchangeList',
      method: 'POST',
      data: {
        page: this.data.page,
        limit: 10
      }
    }).then((res) => {
      that.setData({
        exchangeList: res.data
      })
    }, (error) => {})
  },
  //兑换完
  showError: function() {
    wx.showModal({
      showCancel: false,
      title: '',
      content: '奖品已兑完',
      confirmText: '知道了'
    })
  },
  //兑换弹窗
  showExchange: function(e) {
    let that = this;
    console.log(e)
    wx.showModal({
      title: e.currentTarget.dataset.data.title,
      content: '本次兑换' + e.currentTarget.dataset.data.desc,
      confirmText: '兑换',
      cancelText: '我再想想',
      success: function(res) {
        if (res.confirm == true) {
          that.goChange(e.currentTarget.dataset.data.id)
        }
      }
    })
  },
  //兑换 id:兑换id
  goChange: function(id) {
    let that = this;
    request({
      push: 'exchange',
      method: 'POST',
      data: {
        id: id,
        weixinid: this.data.weixinid,
        mobile: this.data.mobile,
        money_address: this.data.money_address,
        address: this.data.address
      }
    }).then((res) => {
      if(res.errno != 0){
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '兑换成功',
        })
      }
    }, (error) => {})
  },
  //可用谷粒
  getmemberInfo: function () {
    let that = this;
    request({
      push: 'member_info',
      method: 'POST',
      data: {}
    }).then((res) => {
      wx.setStorageSync('member_info', res.data)
      that.setData({
        score: res.data.score,
        weixinid: res.data.weixinid,
        mobile: res.data.mobile,
        money_address: res.data.money_address,
        address: res.data.address
      })
    }, (error) => { })
  }
})