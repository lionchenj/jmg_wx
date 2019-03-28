import request from '../../config/requests.js'
// pages/prize-take/prize-take.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    id: '',
    desc: '',
    cover: '',
    link: '',
    readText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let list = wx.getStorageSync('newlist');
    for (let i of list) {
      if (i.id == id) {
        this.setData({
          title: i.title,
          id: i.id,
          desc: i.desc,
          cover: i.cover,
          link: i.link
        })
      }
    }
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
    this.getNewRead();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'menu') {
      request({
        push: 'newsForward',
        method: 'POST',
        data: {
          newsid: this.data.id
        }
      }).then((res) => {
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
      }, (error) => { })
    }
    return {
      title: this.data.title,
      imageUrl: this.data.cover,
      path: 'pages/article/article?id=' + this.data.id,
      desc: this.data.desc,
      id: this.data.id,
      success: function (res) {
        if (res.shareTickets != undefined) {
          wx.getShareInfo({
            shareTicket: res.shareTickets,
            success: function (res) {
              request({
                push: 'newsForward',
                method: 'POST',
                data: {
                  newsid: id,
                  iv: res.iv,
                  encryptedData: res.encryptedData,
                  sessionKey: session_key
                }
              }).then((res) => {
                wx.showToast({
                  title: res.errmsg,
                  icon: 'none'
                })
              }, (error) => { })
            }
          })
        } else {
          console.log(id);
          request({
            push: 'newsForward',
            method: 'POST',
            data: {
              newsid: id
            }
          }).then((res) => {
            wx.showModal({
              content: res.errmsg,
              showCancel: false,
              confirmText: '知道了'
            })
          }, (error) => { })
        }
      },
    }
  },
  //阅读文章
  getNewRead: function (newsid) {
    let that = this;
    request({
      push: 'newsRead',
      method: 'POST',
      data: {
        newsid: this.data.id
      }
    }).then((res) => {
      wx.showToast({
        title: res.errmsg,
        icon: 'none'
      })
    }, (error) => { })
  },
})