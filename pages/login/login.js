import request from '../../config/requests.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gourl: 'index'
  },
  onLoad: function(options) {
    let type = options.type;
    if (type == 'help') {
      this.setData({
        gourl: 'help'
      })
    }
    if (type == 'prize') {
      this.setData({
        gourl: 'prize'
      })
    }
  },
  //判断有否授权-有获取信息-否跳登陆授权页面
  goGetUserInfo: function(res) {
    let that = this;
    let session_key = '';
    let avatarUrl = res.detail.userInfo.avatarUrl;
    let nickName = res.detail.userInfo.nickName;
    if (res.detail.errMsg.indexOf('ok') != -1) { //允许
      wx.login({
        success: function(res) {
          let data = {
            code: res.code,
            avatarurl: avatarUrl,
            nickname: nickName
          }
          request({
            push: 'login',
            method: 'POST',
            data
          }).then((res) => {
            wx.setStorageSync('openid', res.data.openid);
            wx.setStorageSync('session_key', res.data.session_key);
            session_key = res.data.session_key;
            wx.getUserInfo({
              withCredentials: true,
              success: function(res) {
                wx.setStorageSync('userinfo', res.userInfo);
                let data = {
                  sessionKey: session_key,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                }
                request({
                  push: 'getUserInfo',
                  method: 'POST',
                  data
                }).then((res) => {
                }, (error) => {})
                if (that.data.gourl == 'help') {
                  wx.redirectTo({
                    url: '/pages/help/help?openid=' + wx.getStorageSync('source'),
                  })
                }
                if (that.data.gourl == 'prize'){
                  wx.redirectTo({
                    url: '/pages/prize-take/prize-take?type=2'
                  })
                }
                if (that.data.gourl == 'index') {
                  wx.switchTab({
                    url: '/pages/index/index',
                    success: function(e) {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onLoad();
                    }
                  })
                }
              }
            })
          }, (error) => {})
        }
      })
    } else { //拒绝
      wx.showToast({
        title: '用户拒绝授权',
        icon: 'none'
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})