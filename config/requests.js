const DEBUG = true;
/** 通讯域名 */
const host = DEBUG ? 'crv.cryptovalleylive.com' : 'dev110.weibanker.cn';
const basePath = DEBUG ? '/api':'/shadow/crv/api';
module.exports = (options) => {
  let openid = wx.getStorageSync('openid');
  if (!options.data['openid']) {
    options.data['openid'] = openid ? openid : '';
  }
  return new Promise((resolve, reject) => {
    wx.showLoading({
      mask: true
    });
    options = Object.assign(
      options, {
        url: DEBUG ? `https://${host}${basePath}?url=${options.push}`:`http://${host}${basePath}?url=${options.push}`,
        header: {
          "Accept": "application/json",
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(result) {
          // console.log(options.push + ": ")
          // console.log(result)
          // console.log('--------------------')
          wx.hideLoading();
          if (result.statusCode === 200 || result.statusCode === 201) {
            if (result.data && result.data.errno == 0) {
              if (result.data.errmsg == '你已阅读过这篇文章，未获得积分'){
                return;
              }
              if (options.push == 'member_info') {
                let score = result.data.data.score;
                score = score.split('.')[0]
                result.data.data.score = score;
              }
              resolve(result.data);
            } else if (options.push == 'exchange' && result.data.errno == 31000) {
              wx.showToast({
                title: result.data.errmsg,
              });
              wx.navigateTo({
                url: '/pages/prize-info/prize-info?type=exchange',
              })
            } else if (options.push == 'exchange' && result.data.errno == 30002) {
              resolve(result.data);
            } else if (options.push == 'LuckInfo') {
              resolve(result.data);
            } else if (options.push == 'LuckSuccess' && result.data.errno == 30041) {
              wx.setStorageSync('Lotterynum', '0')
            } else if (options.push != 'newsRead'&& result.data.errno == 30002) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            } else {
              if (options.push == 'signIn') {
                resolve(result.data);
              } else if (options.push == 'getWxCode') {
                resolve(result.data);
              } else {
                wx.showToast({
                  title: result.data.errmsg,
                  icon: 'none'
                })
              }
            }
          } else {
            resolve(result);
          }
        },
        fail: reject
      });
    wx.request(options);
  });
};

Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};