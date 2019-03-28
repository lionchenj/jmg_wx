import request from '../../config/requests.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    isSign: false,
    isFirst: false,
    isShow: false,
    content: '客服回复“1”，进入公众号关注',
    confirmText: '知道了',
    signday: 1,
    signnum: ['100', '100', '100', '150', '150', '150', '300'],
    page: 1,
    limit: 5,
    total_num: 1,
    newslist: [],
    notice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options && options.id) {
      wx.navigateTo({
        url: '/pages/article/article?id=' + options.id,
      })
    }
    this.getBanner();
    if (!wx.getStorageSync('isFirst')) {
      wx.setStorageSync('isFirst', 'true')
      this.setData({
        isFirst: true
      })
    }
    let that = this;
    let openid = wx.getStorageSync('openid') || '';
    if (openid) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                wx.setStorageSync('userinfo', res.userInfo);
                that.getSign();
                that.getNews();
                that.getNotice();
              }
            })
          } else {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
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
    // this.getNews();
    wx.showShareMenu({
      withShareTicket: true,
    });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.newslist.length >= this.data.total_num){
      return;
    }
    let that = this;
    request({
      push: 'newsList',
      method: 'POST',
      data: {
        page: that.data.page,
        limit: that.data.limit
      }
    }).then((res) => {
      let list = that.data.newslist;
      for (let i of res.data.list) {
        list.push(i)
      }
      wx.setStorageSync('newlist', list)
      let page = that.data.page;
      page++;
        that.setData({
          newslist: list,
          page: page
        })
    }, (error) => {})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

    let that = this;
    let id = res.target.dataset.data.id;
    var iv;
    var encryptedData;
    let session_key = wx.getStorageSync('session_key');
    if (res.from === 'button') {
      request({
        push: 'newsForward',
        method: 'POST',
        data: {
          newsid: id
        }
      }).then((res) => {
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
      }, (error) => {})
      return {
        title: res.target.dataset.data.title,
        imageUrl: res.target.dataset.data.cover,
        path: 'pages/index/index?id=' + res.target.dataset.data.id,
        desc: res.target.dataset.data.desc,
        id: res.target.dataset.data.id,
        // success: function (res) {
        //   if (res.shareTickets != undefined) {
        //     wx.getShareInfo({
        //       shareTicket: res.shareTickets,
        //       success: function (res) {
        //         request({
        //           push: 'newsForward',
        //           method: 'POST',
        //           data: {
        //             newsid: id,
        //             iv: res.iv,
        //             encryptedData: res.encryptedData,
        //             sessionKey: session_key
        //           }
        //         }).then((res) => {
        //           wx.showToast({
        //             title: res.errmsg,
        //             icon: 'none'
        //           })
        //         }, (error) => { })
        //       }, fail: function () {
        //         request({
        //           push: 'newsForward',
        //           method: 'POST',
        //           data: {
        //             newsid: id
        //           }
        //         }).then((res) => {
        //           wx.showToast({
        //             title: res.errmsg,
        //             icon: 'none'
        //           })
        //         }, (error) => { })
        //       }
        //     })
        //   } else {
        //     request({
        //       push: 'newsForward',
        //       method: 'POST',
        //       data: {
        //         newsid: id
        //       }
        //     }).then((res) => {
        //       wx.showToast({
        //         title: res.errmsg,
        //         icon: 'none'
        //       })
        //     }, (error) => { })
        //   }
        // },
        // fail: function (res) {
        //   wx.showToast({
        //     title: '分享失败',
        //     icon: 'none'
        //   })
        // }

      }
    }
  },
  //轮播
  getBanner: function() {
    let that = this;
    request({
      push: 'bannerList',
      method: 'POST',
      data: {}
    }).then((res) => {
      that.setData({
        imgUrls: res.data.list ? res.data.list : ['../../images/banner1.png']
      })
    }, (error) => {})
  },
  //打开签到
  showSign: function(e) {
    this.setData({
      isSign: !this.data.isSign
    })
    return false
  },
  //签到跳文章
  gotoNew: function() {
    let id = wx.getStorageSync('newlist')[0].id;
    this.showSign();
    wx.navigateTo({
      url: '/pages/article/article?id=' + id,
    })
  },
  //首次打开小程序出现
  showFirst: function(e) {
    this.setData({
      isFirst: !this.data.isFirst
    })
    return false
  },
  //打开客服
  showContact: function() {
    this.setData({
      isShow: !this.data.isShow
    })
    return false
  },
  //签到接口
  getSign: function() {
    let that = this;
    request({
      push: 'signIn',
      method: 'POST',
      data: {}
    }).then((res) => {
      if (res.data) {
        if (res.data.day != wx.getStorageSync('day')) {
          that.setData({
            isSign: true
          })
        }
        wx.setStorageSync('day', res.data.day);
        wx.setStorageSync('daylist', res.data.list);
        that.setData({
          signnum: res.data.list,
          signday: res.data.day,
        })
      } else {
        that.setData({
          signnum: wx.getStorageSync('daylist'),
          signday: wx.getStorageSync('day'),
        })

      }
    }, (error) => {})
  },
  //文章列表
  getNews: function() {
    let that = this;
    request({
      push: 'newsList',
      method: 'POST',
      data: {
        page: that.data.page,
        limit: that.data.limit
      }
    }).then((res) => {
      let list = that.data.newslist;
      for (let i of res.data.list) {
        // let listtime = i.time.split(' ')[0];
        // i.time = listtime;
        list.push(i)
      }
      wx.setStorageSync('newlist', list)
      let page = that.data.page;
      page++;
        that.setData({
          total_num: res.data.total_num,
          newslist: list,
          page: page
        })
    }, (error) => {})
  },
  //通知
  getNotice: function() {
    let that = this;
    request({
      push: 'notice',
      method: 'POST',
      data: {}
    }).then((res) => {
      that.setData({
        notice: res.data ? res.data.notice : ''
      })
    }, (error) => {})
  },
  //防冒泡
  catchcap: function(res) {
    return false
  }

})