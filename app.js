App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    if (wx.getStorageSync('day')) {
      // console.log('1------------------')
    } else {
      wx.setStorageSync('day', 1);
      wx.setStorageSync('daylist', ['100', '100', '100', '150', '150', '150', '300']);
    }
    //存一个过期时间
    var timestamp = new Date().getDate();
    if (wx.getStorageSync("index_data_expiration")) {
      if (wx.getStorageSync("index_data_expiration") != timestamp) {
        wx.setStorageSync('Lotterynum', '1');
        wx.setStorageSync("index_data_expiration", timestamp);
      }
    }else{
      wx.setStorageSync("index_data_expiration", timestamp);
    }


  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },
})