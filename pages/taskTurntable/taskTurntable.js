import request from '../../config/requests.js'
var a = getApp();
Page({
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 1500,
    vertical: true,
    circular: true,
    lucknum: 0,
    sliderDisabled: "",
    awardsList: {},
    animationData: {},
    btnDisabled: "",
    actNum: "",
    nickname: '',
    Lotterynum: 1,
    awardsLen: 0,
    prizeList: [],
    prizelevel: [],
    luckid: ''
  },
  onLoad: function() {
    let that = this;
    let lucknumber = 0;
    request({
      push: 'member_info',
      method: 'POST',
      data: {}
    }).then((res) => {
      console.log(res.data);
      wx.setStorageSync('member_info', res.data);
      if (res.data.score >= res.data.LUCK_SCORE) {
        lucknumber = parseInt(res.data.score / res.data.LUCK_SCORE);
      } else {
        lucknumber = 0;
      }
      wx.setStorageSync('Lotterynum', lucknumber)
      that.setData({
        LUCK_SCORE: res.data.LUCK_SCORE
      })
    }, (error) => {})
  },
  //分享
  onShareAppMessage: function() {
    return {
      title: '大转盘抽奖',
      path: 'pages/help/help?openid=' + wx.getStorageSync('openid'),
    }
  },
  //更改个数
  slider4change: function(e) {
    console.log("sliderindex发生 change 事件，携带值为", e.detail.value);
    var n = e.detail.value,
      t = [];
    if (2 == n)
      for (i = 0; i < 4; i++) t.push({
        index: i,
        title: i % n + 1
      });
    else if (3 == n)
      for (i = 0; i < 6; i++) t.push({
        index: i,
        title: i % n + 1
      });
    else
      for (var i = 0; i < n; i++) t.push({
        index: i,
        title: i + 1
      });
    a.awardsConfig = {
      chance: !0,
      awards: t
    }, this.initAdards();
  },
  initAdards: function() {
    var e = this,
      n = a.awardsConfig.awards,
      t = n.length,
      i = 360 / t,
      s = i - 90,
      r = [],
      d = 1 / t;
    e.setData({
      btnDisabled: a.awardsConfig.chance ? "" : "disabled"
    });
    wx.createCanvasContext("lotteryCanvas");
    //绘制板块
    for (var o = 942.47778 / t, g = 0; g < t; g++) {
      console.log(d + ":turnNum");
      var l = "rgba(255,203,30,0.5)";
      if (t % 2 == 0) l = 1 == (u = g % 2) ? "rgba(228,55,14,0.5)" : 2 == u ? "rgba(228,155,14,0.5)" : "rgba(255,203,30,0.5)";
      else {
        var u = g % 2;
        l = g == t - 1 ? "rgba(228,155,14,0.5)" : 1 == u ? "rgba(228,55,14,0.5)" : "rgba(255,203,30,0.5)";
      }
      r.push({
        k: g,
        itemWidth: o + "px",
        item2BgColor: l,
        item2Deg: g * i + 90 - i / 2 + "deg",
        item2Turn: g * d + d / 2 + "turn",
        ttt: "",
        tttSkewX: 4 * t + "deg",
        afterDeg: s + "deg",
        turn: g * d + "turn",
        lineTurn: g * d + d / 2 + "turn",
        award: n[g].title,
        imgurl: n[g].cover
      });
    }
    e.setData({
      awardsLen: r.length,
      awardsList: r
    });
  },
  //点击开始
  getLottery: function() {
    var e = this,
      n = a.awardsConfig,
      t = n.awards.length;
    request({
      push: 'LuckSuccess',
      method: 'POST',
      data: {}
    }).then((res) => {
      wx.setStorageSync('luckid', res.data.id);
      console.log(res)
      let it = '';
      let list = e.data.prizeList;
      let types = res.data.type;
      //if (res.data.type == '4') {
      //it = 8
      //} else {
      for (let i in list) {
        if (res.data.luckid == list[i].id) {
          it = i
          wx.setStorageSync('lottery', list[i].title);
        }
      }
      // }
      console.log(it)
      e.setData({
        Lotterynum: 0,
        lucknum: it
      })
      a.runDegs = a.runDegs || 0;
      a.runDegs = a.runDegs + (360 - a.runDegs % 360) + (2160 - it * (360 / t));
      var s = wx.createAnimation({
        duration: 4e3,
        timingFunction: "ease"
      });
      e.animationRun = s, s.rotate(a.runDegs).step(), e.setData({
        animationData: s.export(),
        btnDisabled: "disabled",
        sliderDisabled: "disabled"
      }), setTimeout(function() {
        let lottery = wx.getStorageSync('lottery')
        e.setData({
          nickname: lottery
        })
        wx.showModal({
          showCancel: false,
          content: lottery == '谢谢参与' ?'谢谢参与':'获得' + lottery,
          confirmText: '好的',
          success: function() {
            e.setData({
              animationData: s.export(),
              btnDisabled: "false",
              sliderDisabled: "false"
            })
            e.getLuckList();
            request({
              push: 'LuckInfo',
              method: 'POST',
              data: {
                id: wx.getStorageSync('luckid')
              }
            }).then((res) => {
              console.log(res)
              if (res.errno == '30002') {
                wx.showToast({
                  title: res.errmsg,
                  icon: 'none'
                })
              }
              if (res.errno == '31000' && types == '2') {
                wx.navigateTo({
                  url: '/pages/prize-info/prize-info?type=LuckInfo',
                })
              }
            }, (error) => {})
          }
        })
      }, 4e3);
    }, (error) => {})

  },
  onReady: function(e) {
    this.showRanklist();
    // this.getLuckInfo();
    this.getLuckList();
    //进入页面判断是否已抽奖
    /*let lotteryno = wx.getStorageSync('Lotterynum');
    if (lotteryno == '0') {
      let lottery = wx.getStorageSync('lottery');
      this.setData({
        Lotterynum: 0,
        sliderDisabled: "disabled",
        nickname: lottery
      })
      wx.showModal({
        showCancel: false,
        title: '今天已获得',
        content: lottery,
        confirmText: '知道了',
      })
    }*/
  },
  //获取奖品列表 8个不足不全空位
  showRanklist: function() {
    let that = this;
    request({
      push: 'LuckSetup',
      method: 'POST',
      data: {
        type: 1
      }
    }).then((res) => {
      let list = res.data.list;
      let num = 8 - list.length;
      let num2 = list.length;
      let lists = []
      for (let i = 0; i < num; i++) {
        list.push({
          id: i + num2 + 1,
          title: '谢谢惠顾',
          cover: ''
        })
      }
      for (let i = 0; i < 8; i++) {
        lists.push({
          index: i,
          id: list[i].id,
          title: list[i].title,
          cover: list[i].cover
        })
      }
      console.log(list)
      that.setData({
        prizeList: list
      })
      if (wx.getStorageSync('Lotterynum') == '0') {
        a.awardsConfig = {
          chance: 0,
          awards: lists
        }, this.initAdards(that)
      } else {
        a.awardsConfig = {
          chance: !0,
          awards: lists
        }, this.initAdards(that)
      };
    }, (error) => {})
  },
  //发送中奖id
  getLuckInfo: function() {
    let that = this;
    request({
      push: 'LuckInfo',
      method: 'POST',
      data: {
        id: '0'
      }
    }).then((res) => {
      console.log(res)
    }, (error) => {})
  },
  //获取中奖名单
  getLuckList: function() {
    let that = this;
    request({
      push: 'LuckList',
      method: 'POST',
      data: {}
    }).then((res) => {
      console.log(res.data)
      that.setData({
        prizelevel: res.data
      })
    }, (error) => {})
  },
  //禁止滑动
  catchTouchMove: function(res) {
    return false
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
});