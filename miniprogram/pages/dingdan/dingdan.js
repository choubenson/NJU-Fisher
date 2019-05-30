// miniprogram/pages/dingdan/dingdan.js
var totalSize = 0;
var currentIndex = 0;

var temp = [];   //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
var totalSize2 = 0;
var currentIndex2 = 0;

var temp2 = [];

var app ;
var openId;
//var openId = 'o5UGL5TiQGhB9KF5sf9cvpRbjino';

Page({
  data: {
    // tab切换  
    currentTab: 0,
    itemDetailUrl: '/pages/detail/detail',
    items: [],
    items_soldout:[],
    loading: true,
    state: 0,
    windowHeight:0,
    reachBottom: false,
    isEmpty1: false,
    isEmpty2:false,
  },
  systemType() {  //获取手机屏幕高度
    wx.getSystemInfo({ 
      success: (res) => { 
        let windowHeight = res.windowHeight         
        this.setData({ windowHeight: windowHeight })         
        console.log(res) 
      } 
    })
 },

  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })

  },
  onLoad:async function (options) {
    // 生命周期函数--监听页面加载
    this.systemType()
    app = getApp()
    openId = app.globalData.openId
    console.log("openId is "+openId);
    currentIndex = 0;
    totalSize = 0;
    temp = [];
    const MAX_LIMIT = 10;  //一次最多获取十条商品记录数据
    const db = wx.cloud.database();
    await db.collection('shangpin').where({ _openid: openId, state: 0 }).count().then(res => { //获取数据库中shangpin集合记录的总共数目
      totalSize = res.total;

    })

    console.log("unSold totalSize is " + totalSize);

    // 计算需分几次取
    const batchTimes = Math.ceil(totalSize / 10);
    // 承载所有读操作的 promise 的数组

    for (i = 0; i < batchTimes; i++) {
      if (i != 0) {
        await db.collection('shangpin').where({ _openid: openId, state: 0 }).orderBy('date','desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
          temp.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
        })
      }
      else {
        await db.collection('shangpin').where({ _openid: openId, state: 0 }).orderBy('date', 'desc').limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
          temp.push(res.data);
        })
      }
      for (j = 0; j < temp[i].length; j++) {
        temp[i][j].commodityPictures.sort()
      }
    }
    console.log(temp);


    currentIndex2 = 0;
    totalSize2 = 0;
    temp2 = [];
    await db.collection('shangpin').where({ _openid: openId, state: 1 }).count().then(res => { //获取数据库中shangpin集合记录的总共数目
      totalSize2 = res.total;
    })

    console.log("Soldout totalSize2 is " + totalSize2);

    // 计算需分几次取
    const batchTimes2 = Math.ceil(totalSize2 / 10);
    // 承载所有读操作的 promise 的数组

    for (let j = 0; j < batchTimes2; j++) {
      if (j != 0) {
        await db.collection('shangpin').where({ _openid: openId, state: 1 }).orderBy('finishTime', 'desc').skip(j * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
          temp2.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
        })
      }
      else {
        await db.collection('shangpin').where({ _openid: openId, state: 1 }).orderBy('finishTime', 'desc').limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
          temp2.push(res.data);
        })
      }
      for (k = 0; k < temp[j].length; k++) {
        temp[j][k].commodityPictures.sort()
      }
    }
    console.log(temp2);
    if (temp.length != 0 && temp2.length != 0){
      console.log("I am Here!!!")
      this.setData({
        items: temp[currentIndex],
        items_soldout: temp2[currentIndex2],
        loading: false,

      })
    }
    else if (temp.length != 0 ) {
      this.setData({
        items: temp[currentIndex],
        isEmpty2:true,
        loading: false,
        
      })
    }
    else if (temp2.length != 0){
      this.setData({
        isEmpty1:true,
        items_soldout: temp2[currentIndex2],
        loading: false,

      })
    }
    else {
      console.log("Hii!!")
      this.setData({ isEmpty1: true,isEmpty2:true, loading: false })
    }

    
    currentIndex = currentIndex + 1;
    currentIndex2 = currentIndex2+1;

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh:async function () {
    // 页面相关事件处理函数--监听用户下拉动作
    var tabIndex=this.data.currentTab;
    this.systemType()
    app = getApp()
    openId = app.globalData.openId
    console.log("openId is " + openId);
    temp=this.data.items;
    temp2=this.data.items_soldout;
    currentIndex = 0;
    currentIndex2 = 0;
    const MAX_LIMIT = 10;  //一次最多获取十条商品记录数据
    const db = wx.cloud.database();
    console.log("tableIndex is "+tabIndex);
    
      console.log("tableIndex is " + tabIndex);
      temp = [];
      
      totalSize = 0;
    await db.collection('shangpin').where({ _openid: openId, state: 0 }).count().then(res => { //获取数据库中shangpin集合记录的总共数目
        totalSize = res.total;

      })

      console.log("unSold totalSize is " + totalSize);

      // 计算需分几次取
      const batchTimes = Math.ceil(totalSize / 10);
      // 承载所有读操作的 promise 的数组

      for (i = 0; i < batchTimes; i++) {
        if (i != 0) {
          await db.collection('shangpin').where({ _openid: openId, state: 0 }).orderBy('date', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
            temp.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
          })
        }
        else {
          await db.collection('shangpin').where({ _openid: openId, state: 0 }).orderBy('date', 'desc').limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
            temp.push(res.data);
          })
        }
      }
      
      
    
      console.log("tableIndex is " + tabIndex);
      totalSize2 = 0;
      temp2 = [];
      await db.collection('shangpin').where({ _openid: openId, state: 1 }).count().then(res => { //获取数据库中shangpin集合记录的总共数目
        totalSize2 = res.total;
      })

      console.log("Soldout totalSize2 is " + totalSize2);

      // 计算需分几次取
      const batchTimes2 = Math.ceil(totalSize2 / 10);
      // 承载所有读操作的 promise 的数组

      for (let j = 0; j < batchTimes2; j++) {
        if (j != 0) {
          await db.collection('shangpin').where({ _openid: openId, state: 1 }).orderBy('finishTime', 'desc').skip(j * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
            temp2.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
          })
        }
        else {
          await db.collection('shangpin').where({ _openid: openId, state: 1 }).orderBy('finishTime', 'desc').limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
            temp2.push(res.data);
          })
        }
      }
      
      
    
    console.log(temp);
    console.log(temp2);
    console.log("currentIndex is "+currentIndex)
    console.log("currentIndex2 is "+currentIndex2)
    
    if (temp.length != 0 && temp2.length != 0) {
      console.log("I am Here!!!")
      this.setData({
        items: temp[currentIndex],
        items_soldout: temp2[currentIndex2],
        loading: false,

      })
    }
    else if (temp.length != 0) {
      this.setData({
        items: temp[currentIndex],
        items_soldout:[],
        isEmpty2: true,
        loading: false,

      })
    }
    else if (temp2.length != 0) {
      this.setData({
        isEmpty1: true,
        items:[],
        items_soldout: temp2[currentIndex2],
        loading: false,

      })
    }
    else {
      console.log("Hii!!")
      this.setData({ isEmpty1: true, isEmpty2: true, loading: false, items:[],items_soldout:[]})
    }


    
    currentIndex = currentIndex + 1;
    currentIndex2 = currentIndex2 + 1;

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
    
  },
  ReachBottom:function(){
    const MAX_LIMIT = 10; //一次最多获取10条商品记录
    this.setData({ loading: true });

    var itemArr = this.data.items;  //要将之前的items里的数据一并放入，在之前items数据的基础上再增加新的商品记录
    var itemArr2=this.data.items_soldout;

    if (temp[currentIndex] != null ) {
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
    else if (temp2[currentIndex2] != null){
      for (let i = 0; i < temp2[currentIndex2].length; i++) {
        itemArr2.push(temp2[currentIndex2][i]);
      }

      console.log("Bottom currentIndex2 is " + currentIndex2);

      this.setData({
        items_soldout: itemArr2,
        loading: false
      })
      if (temp2[currentIndex2].length != MAX_LIMIT) {
        this.setData({
          reachBottom: true,
        })
      }
      currentIndex2 = currentIndex2 + 1;
    }
    else {
      this.setData({
        loading: false,
        reachBottom: true,
      })
    }
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },

  //修改发布
  modify: function () {
    wx.navigateTo({
      url: "../modify/modify"
    })
  },

//商品下架
  deleteGoods: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要下架该商品吗？',
      success: function (sm) {
        //用户点击了确定删除
        if (sm.confirm) {
          const db = wx.cloud.database();
          db.collection('shangpin').doc(e.currentTarget.id).remove();
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //完成订单交易
  finishTrade:function(e){
    wx.showModal({
      title: '提示',
      content: '已向买方确认，确定要完成该笔交易吗？',
      success: function (sm) {
        //用户点击了确定完成
        if (sm.confirm) {
          wx.cloud.callFunction({
            name: "confirmTrade",
            data: {
              commodityId: e.currentTarget.id
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }


})