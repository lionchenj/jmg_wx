import request from '../../config/requests.js'
// pages/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: '',
    list: [],
    page: 1,
    total: 1,
    avatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options && options.scene) {
      let scene = decodeURLComponent(options.scene);
      console.log(scene);
      this.setData({
        source: options.scene.openid
      });
      wx.stopPullDownRefresh()
      wx.setStorageSync('source', options.scene.openid);
    } else
    if (options && options.openid) {
      this.setData({
        source: options.openid
      });
      wx.stopPullDownRefresh()
      wx.setStorageSync('source', options.openid)
    } else {
      let source = wx.getStorageSync('source')
      this.setData({
        source: source
      });
      wx.stopPullDownRefresh()
    }
    let openid = wx.getStorageSync('openid') || '';
    let that = this;
    if (openid) {
      this.getSharelist();
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                wx.setStorageSync('userinfo', res.userInfo);
                wx.stopPullDownRefresh()
                that.getUserinfo();
              }
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/login?type=help',
            })
          }
        }
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login?type=help',
      })
    }
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
    let that = this;
    // wx.startPullDownRefresh({
      // success: function() {
        that.getSharelist();
        wx.stopPullDownRefresh();
      // }
    // })
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
  //跳转首页
  goIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //为他助力
  nextPage: function() {
    if (this.data.total > this.data.list.length) {
      this.getSharelist()
    }
  },
  //调用助力
  getShare: function() {
    let that = this;
    let opid = wx.getStorageSync('openid')
    if (this.data.source == opid) {
      wx.showModal({
        title: '请不要给自己助力',
        showCancel: false,
        confirmText: '知道了',
      })
      return;
    }
    request({
      push: 'share',
      method: 'POST',
      data: {
        source: this.data.source
      }
    }).then((res) => {
      console.log(res)
      wx.showModal({
        title: '助力成功',
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }, (error) => {})
  },
  //助力名单
  getSharelist: function() {
    let that = this;
    request({
      push: 'share_list',
      method: 'POST',
      data: {
        openid: this.data.source,
        page: this.data.page,
        limit: 100
      }
    }).then((res) => {
      let list = res.data.list
      // for (let i of res.data.list) {
      //   list.push(i)
      // }
      that.setData({
        list: list,
        // page: that.data.page * 1 + 1,
        total: res.data.total_num
      })
    }, (error) => {})
  },
  //获取他头像
  getUserinfo() {
    let that = this;
    request({
      push: 'member_info',
      method: 'POST',
      data: {
        openid: this.data.source
      }
    }).then((res) => {
      console.log(res)
      that.setData({
        avatarurl: res.data.avatarurl
      })
    }, (error) => {})
  }
})