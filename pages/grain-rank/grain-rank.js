import request from '../../config/requests.js'
// pages/grain-rank/grain-rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '1',
    total:'',
    page:1,
    ranklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.showRanklist('1')
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
    if (100 > this.data.ranklist.length) {
      this.showRanklist()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //榜单选择
  showRanktab: function(e) {
    this.setData({
      page:1,
      type: e.currentTarget.dataset.type,
      ranklist:[]
    })
    this.showRanklist(e.currentTarget.dataset.type)
  },
  //排行榜列表 type:1总榜 2日榜 3月榜
  showRanklist: function() {
    let that = this;
    request({
      push: 'ranking',
      method: 'POST',
      data: {
        type: this.data.type,
        page: this.data.page,
        limit: 20
      }
    }).then((res) => {
      let list = that.data.ranklist
      for (let i of res.data.list) {
        if (list.length < 100) {
          list.push(i)
        }
      }
      that.setData({ 
        page:this.data.page + 1,
        ranklist:list,
        total:res.data.total_num
        })
    }, (error) => {})
  }
})