import request from '../../config/requests.js'
// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    headurl: '',
    nickname: '',
    score: '',
    ranklist: [],
    tasklist: [],
    type: '1',
    isShowwx:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userinfo = wx.getStorageSync('userinfo');
    this.setData({
      userinfo: userinfo,
      headurl: userinfo.avatarUrl,
      nickname: userinfo.nickName
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
    this.getmemberInfo();
    this.getTask();
    this.showRanklist(this.data.type);
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
  onPullDownRefresh: function () {
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
  //修改头像
  getImage() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        var size = res.tempFiles[0].size
        var sort = res.tempFiles[0].path.split(".")[res.tempFiles[0].path.split(".").length - 1]
        if (sort != 'png' && sort != 'jpg' && sort != 'jpeg' && sort != 'gif') {
          that.setData({
            dataText: "请上传正确格式的图片",
            isImgShow: false,
            showLoad: false,
            isTextShow: false
          })
          return
        }
        if (size > 5242880) {
          that.setData({
            dataText: "照片不能超过5M",
            isImgShow: false,
            showLoad: false,
            isTextShow: false
          })
          return
        }
        var tempFilePaths = res.tempFilePaths
        wx.setStorageSync('img', tempFilePaths);
        that.setData({
          imgloading: true,
          imgSRC: tempFilePaths,
          isImgShow: true
        })
        wx.uploadFile({
          url: '',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {

          }
        })
      }
    })
  },
  //谷粒数
  getmemberInfo: function() {
    let that = this;
    request({
      push: 'member_info',
      method: 'POST',
      data: {}
    }).then((res) => {
      wx.setStorageSync('member_info', res.data)
      that.setData({
        score: res.data.score
      })
    }, (error) => {})
  },
  //前三排行榜
  showRanklist: function(type) {
    let that = this;
    request({
      push: 'ranking',
      method: 'POST',
      data: {
        type: type,
        page: 1,
        limit: 3
      }
    }).then((res) => {
      that.setData({
        ranklist: res.data.list
      })
    }, (error) => {})
  },
  //任务
  getTask: function(type) {
    let that = this;
    request({
      push: 'task',
      method: 'POST',
      data: {}
    }).then((res) => {
      that.setData({
        tasklist: res.data
      })
    }, (error) => {})
  },
  //任务点击跳转
  taskGo: function(e) {
    switch (e.currentTarget.dataset.title) {
      case '每日签到':

        break;
      case '阅读加密谷文章':
        wx.switchTab({
          url: '/pages/index/index',
        })
        break;
      case '转发加密谷文章':
        wx.switchTab({
          url: '/pages/index/index',
        })
        break;
      case '关注公众号':
        wx.navigateTo({
          url: '/pages/share/share',
        })
        break;
      case '抽奖大转盘':
        wx.navigateTo({
          url: '/pages/taskTurntable/taskTurntable',
        })
        break;
      case '好友助力':
        wx.navigateTo({
          url: '/pages/invite-help/invite-help',
        })
        break;
    }
  },
  //关注公众号
  showFirst: function (e) {
    this.setData({
      isShowwx: !this.data.isShowwx
    })
    return false
  },
})