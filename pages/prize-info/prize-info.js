import request from '../../config/requests.js'
// pages/prize-info/prize-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weixinid: '',
    mobile: '',
    money_address: '',
    address: '',
    types: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let types = options.type;

    this.setData({
      types: types
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
    this.getmemberInfo()
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
    if (this.data.types == 'exchange'){
      wx.redirectTo({
        url: '/pages/exchange/exchange',
      })
    }
    if (this.data.types == 'LuckInfo') {
      wx.redirectTo({
        url: '/pages/taskTurntable/taskTurntable',
      })
    }
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
  //获取信息
  getmemberInfo: function() {
    let that = this;
    request({
      push: 'member_info',
      method: 'POST',
      data: {}
    }).then((res) => {
      wx.setStorageSync('member_info', res.data)
      that.setData({
        weixinid: res.data.weixinid,
        mobile: res.data.mobile,
        money_address: res.data.money_address,
        address: res.data.address
      })
    }, (error) => {})
  },
  //收货地址
  chooseAddress:function(){
    let that = this;
    wx.chooseAddress({
      success:function(res){
        request({
          push: 'member_info_update',
          method: 'POST',
          data: {
            address: res.userName + ',' + res.detailInfo + ',' + res.postalCode + ',' + res.telNumber
          }
        }).then((res) => {
          that.getmemberInfo()
        }, (error) => { })
      }
    })
  }
})