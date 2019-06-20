// pages/released/released.js
var totalSize = 0;
var currentIndex = 0;

var temp = [];   //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
var app = getApp();
//var openId=app.globalData.openId;
var openId = 'o5UGL5TiQGhB9KF5sf9cvpRbjino';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    soldUrl: '/pages/sold/sold',
    itemDetailUrl: '/pages/detail/detail',
    items: [],
    loading: true,
    state:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    currentIndex = 0;
    totalSize = 0;
    temp = this.data.items;
    const MAX_LIMIT = 10;  //一次最多获取十条商品记录数据
    const db = wx.cloud.database();

    if(this.data.state==0){
      await db.collection('shangpin').where({_openid:openId,state:0}).count().then(res => { //获取数据库中shangpin集合记录的总共数目
        totalSize = res.total;
      })


      // 计算需分几次取
      const batchTimes = Math.ceil(totalSize / 10);
      // 承载所有读操作的 promise 的数组

      for (i = 0; i < batchTimes; i++) {
        if (i != 0) {
          await db.collection('shangpin').where({ _openid: openId, state:0 }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
            temp.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
          })
        }
        else {
          await db.collection('shangpin').where({ _openid: openId, state:0 }).limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
            temp.push(res.data);
          })
        }
      }
      this.setData({
        items: temp[currentIndex],
        loading: false
      })
      currentIndex = currentIndex + 1;
    }
    else{
      await db.collection('shangpin').where({ _openid: openId, state: 1 }).count().then(res => { //获取数据库中shangpin集合记录的总共数目
        totalSize = res.total;
      })


      // 计算需分几次取
      const batchTimes = Math.ceil(totalSize / 10);
      // 承载所有读操作的 promise 的数组

      for (i = 0; i < batchTimes; i++) {
        if (i != 0) {
          await db.collection('shangpin').where({ _openid: openId, state: 1 }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
            temp.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
          })
        }
        else {
          await db.collection('shangpin').where({ _openid: openId, state: 1 }).limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
            temp.push(res.data);
          })
        }
      }
      this.setData({
        items: temp[currentIndex],
        loading: false
      })
      currentIndex = currentIndex + 1;
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
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const MAX_LIMIT = 10; //一次最多获取10条商品记录
    this.setData({ loading: true });

    var itemArr = this.data.items;  //要将之前的items里的数据一并放入，在之前items数据的基础上再增加新的商品记录

    if (temp[currentIndex] != null) {
      for (let i = 0; i < temp[currentIndex].length; i++) {
        itemArr.push(temp[currentIndex][i]);
      }


      this.setData({
        items: itemArr,
        loading: false
      })

      currentIndex = currentIndex + 1;
    }
    else {
      this.setData({
        loading: false
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //跳转至已卖出的界面
  changeToSoldout:function(){
    this.setData( { state:1,} );
    this.onLoad();
  },

  //跳转至未卖出的界面
  changeToUnsold:function(){

  },

  //修改发布
  modify: function(){
    wx.navigateTo({
      url: "../modify/modify" })  
  },

  //商品下架
  deleteGoods: function(){
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        //用户点击了确定删除
        if (sm.confirm) {
                                
        } else if (sm.cancel) {
        }
      }
    })    
  }
})