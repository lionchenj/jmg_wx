// pages/invite-help/invite-help.js
import request from '../../config/requests.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.getCode();
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
    return {
      title: '好友助力',
      imageUrl: '../../images/help.jpeg',
      path: 'pages/help/help?openid=' + wx.getStorageSync('openid'),
    }
  },
  //保存二维码
  saveImg: function() {
    wx.previewImage({
      current: this.data.qrcode,
      urls: [this.data.qrcode],
      success:function(res){
        wx.showToast({
          title: '长按图片保存',
          icon: 'none'
        })
      }
    })
    // wx.saveImageToPhotosAlbum({
    //   filePath: this.data.qrcode,
    //   success: function() {
    //     wx.showToast({
    //       title: '保存成功',
    //     })
    //   },
    //   complete: function (res) {
    //     console.log(res)
    //   }
    // })
  },
  shareImg: function() {
    wx.showModal({
      title: '分享给好友',
      content: '请保存二维码图片后，通过发送图片分享好友',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  //获取二维码图片
  getCode: function() {
    let that = this;
    let openid = wx.getStorageSync('openid');
    request({
      push: 'getWxCode',
      method: 'POST',
      data: {
        path: "pages/help/help?openid=" + openid
      }
    }).then((res) => {
      that.setData({
        qrcode: res
      })
    }, (error) => {})
    request({
      push: 'wx_decode',
      method: 'POST',
      data: {}
    }).then((res) => {
      console.log(res)
      that.setData({
        number: res.number
      })
    }, (error) => { })
  }
})