import request from '../../config/requests.js'
// pages/grain-record/grain-record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordlist: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRecord()
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

  },
  //获取谷粒记录
  getRecord() {
    let that = this;
    request({
      push: 'transaction',
      method: 'POST',
      data: {}
    }).then((res) => {
      that.formatList(res.data.list)
    }, (error) => {})
  },
  //重新日期排列 list:记录列表
  formatList: function(list) {
    let newList = [];
    let setList = [[]];
    for (let i in list) {
      let iYear = this.formatDate(list[i].time, 'year');
      let iMonth = this.formatDate(list[i].time, 'month');
      let iDay = this.formatDate(list[i].time, 'day');
      list[i].time = this.formatDate(list[i].time, 1);
      list[i].type = this.typelist(list[i].type)
      list[i].year = iYear;
      list[i].month = iMonth;
      list[i].day = iDay;
      list[i].is = true;
      newList.push(list[i]);
    }
    list = newList;
    let x = 0;
    let li = [];
    for (let j in list) {
      if (newList[j].is){
        li = [];
        setList[x] = { list: [], time: newList[j].time}
        for (let k in newList) {
          if (list[j].year == newList[k].year && list[j].month == newList[k].month && list[j].day == newList[k].day && newList[k].is) {
            li.push(newList[k]);
            newList[k].is = false;
          }
        }
        setList[x].list = li;
        x++;
      }
    }
    this.setData({
      recordlist: setList
    })
  },
  //日期格式化
  formatDate(date, n) {
    var newDate = new Date(date.replace(/-/g, "/"));
    var newYear = new Date().getFullYear();
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    switch (n) {
      case 1:
        return year + '年' + month + '月' + day + '日';
        break;
      case 'year':
        return year;
        break;
      case 'month':
        return month;
        break;
      case 'day':
        return day;
        break;
    }
  },
  //描述
  typelist: function(n) {
    switch (n) {
      case '1':
        return '签到';
        break;
      case '2':
        return '关注';
        break;
      case '3':
        return '阅读';
        break;
      case '4':
        return '转发';
        break;
      case '5':
        return '关注';
        break;
      case '6':
        return '好友助力';
        break;
      case '7':
        return '转盘获奖';
        break;
      case '8':
        return '兑换';
        break;
      case '9':
        return '购买抽奖次数';
        break;
      case '10':
        return '系统修改';
        break;
    }
  }
})