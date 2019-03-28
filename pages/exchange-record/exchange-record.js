import request from '../../config/requests.js'
// pages/exchange-record/exchange-record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangelist: [],
    page: 1,
    total: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getExchangelist()
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
    if (this.data.total > this.data.exchangelist.length) {
      this.getExchangelist()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //兑换记录
  getExchangelist: function() {
    let that = this;
    request({
      push: 'exchange_list',
      method: 'POST',
      data: {
        page: this.data.page,
        limit: 10
      }
    }).then((res) => {
      let list = that.data.exchangelist
      for (let i of res.data.list) {
        list.push(i)
      }
      that.setData({
        exchangelist: list,
        page: that.data.page * 1 + 1,
        total: res.data.total_num
      })
    }, (error) => {})
  }
})