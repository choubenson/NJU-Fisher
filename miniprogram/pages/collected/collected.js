// miniprogram/pages/collected/collected.js
var totalSize = 0;
var currentIndex = 0;

var temp = [];   //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
var app ;
var openId;
//var openId = 'o5UGL5QRV3DmkcH1GOHpjN4E2dQ8';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemDetailUrl: '/pages/detail/detail',
    items: [],
    loading: true,
    reachBottom: false,
    isEmpty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    app = getApp();
    openId = app.globalData.openId;
    console.log(options.itemType);
    currentIndex = 0;
    totalSize = 0;
    console.log(app)
    //openid = app.globalData.openId;
    console.log("openId1 is " + app.globalData.openId)
    console.log("openId2 is "+openId)
    
    temp = this.data.items;
    const MAX_LIMIT = 10;  //一次最多获取十条商品记录数据
    var shoucang=[];
    const db = wx.cloud.database();
    var ComIdArr=[];
    const _ = db.command

    console.log("openId is :"+openId);
    await db.collection('shoucang').where({ _openid: 'o5UGL5QRV3DmkcH1GOHpjN4E2dQ8' }).count().then(res => { //获取数据库中shoucang集合该用户收藏记录的总共数目
      totalSize = res.total;
    })

    console.log("totalSize is " + totalSize);

    // 计算需分几次取
    const batchTimes = Math.ceil(totalSize / 10);
    // 承载所有读操作的 promise 的数组
    console.log("batchTimes is " + batchTimes);
    for (i = 0; i < batchTimes; i++) {
      if (i != 0) {
        shoucang=[];
        ComIdArr=[];
        console.log("Here is if!")
        await db.collection('shoucang').where({ _openid: openId }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
          shoucang = res.data;

        })
        console.log(shoucang);
        for (let j = 0; j < shoucang.length; j++) {
          ComIdArr.push((shoucang)[j].commodityId);
        }
        console.log(ComIdArr);
        await db.collection("shangpin").where({ _id: _.in(ComIdArr) }).get().then(res => {
          console.log(res.data);
          temp.push(res.data);
        })
      }
      else {
        console.log("Here is else!")
        console.log(shoucang)
        await db.collection('shoucang').where({ _openid: openId }).limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
          console.log("In else openId is " + openId)
          shoucang=res.data;
          
        })
        console.log(shoucang);
        for (let j = 0; j < shoucang.length; j++) {
          ComIdArr.push((shoucang)[j].commodityId);
        }
        console.log(ComIdArr);
        await db.collection("shangpin").where({ _id: _.in(ComIdArr) }).get().then(res => {
          console.log(res.data);
          temp.push(res.data);
        })
        
      }
    }
    console.log("Here is outside for!")
    console.log(temp);
    console.log("currentIndex is " + currentIndex);
    if (temp.length != 0) {
      this.setData({
        items: temp[currentIndex],
        loading: false,
        
      })
    }
    else {
      this.setData({ isEmpty: true, loading: false })
    }
    
    currentIndex = currentIndex + 1;


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
  onReachBottom:async function () {
    const MAX_LIMIT = 10; //一次最多获取10条商品记录
    this.setData({ loading: true });

    var itemArr = this.data.items;  //要将之前的items里的数据一并放入，在之前items数据的基础上再增加新的商品记录

    if (temp[currentIndex] != null) {
      for (let i = 0; i < temp[currentIndex].length; i++) {
        itemArr.push(temp[currentIndex][i]);
      }

      console.log("Bottom currentIndex is " + currentIndex);

      this.setData({
        items: itemArr,
        loading: false
      })
      if (temp[currentIndex].length != MAX_LIMIT) {
        this.setData({
          reachBottom: true,
        })
      }
      currentIndex = currentIndex + 1;
    }
    else {
      this.setData({
        loading: false,
        reachBottom: true,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})