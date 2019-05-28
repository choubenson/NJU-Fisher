// pages/detail/detail.js
var openId;
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    commodity:{

    },
    isLike: 0,
    likesrc: '/images/detail/heart_grey.png',
    isEmpty: false,
  },

  likeButtonTap: function(e){
    //获取云数据库
    const db = wx.cloud.database();
    //加入收藏记录
    if (this.data.isLike == 0){      
      db.collection('shoucang').add({
        data: {
          commodityId: this.data.commodity._id
        }
      });
      this.setData({ likesrc: '/images/detail/heart_red.png' });
    }
    //删除收藏记录
    else{
      wx.cloud.callFunction({
        name: 'removeSC',
        data: {
          commodityId: this.data.commodity._id,
          openId: this.data.openId
        }
      })
      this.setData({ likesrc: '/images/detail/heart_grey.png' });
    }
    this.setData({isLike: (1-this.data.isLike)});
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('id is ' + options._id)

    //获取云数据库
    const db = wx.cloud.database();
    var n = await db.collection("shangpin").where({ _id: options._id }).count()
    console.log(n.total)
    if(n.total==0){
      console.log('III')
      this.setData({isEmpty:true})
    }

    //获取用户openid
    var app = getApp();
    this.setData({openId: app.globalData.openId})
    // await wx.cloud.callFunction({
    //   name: 'getId',
    //   complete: res => {
    //     this.setData({openId: res.result.openid});
    //   }
    // });
    //加载商品信息和商品发布者的openid
    await db.collection('shangpin').doc(options._id).get().then(
      res => {
        this.setData({ commodity: res.data });
        var d = new Date(this.data.commodity.date);
        var dateStr = d.getFullYear() +
          '-' + (d.getMonth() + 1) +
          '-' + d.getDate() +
          ' ' + d.toTimeString().substring(0, 8);
        this.setData({ 'commodity.date': dateStr });
      }
    );
    //加载用户收藏信息
    var n = await db.collection('shoucang').where({
      _openid: this.data.openId,
      commodityId: this.data.commodity._id
    }).count();
    this.setData({ isLike: (n.total == 0 ? 0 : 1)});
    if (this.data.isLike==1)
      this.setData({ likesrc: '/images/detail/heart_red.png' });
    else
      this.setData({ likesrc: '/images/detail/heart_grey.png' }); 
    //加载该商品发布者已发布数量信息
    await db.collection('shangpin').where({
      _openid: this.data.commodity._openid
    }).count().then(
      res => {
        this.setData({
          hasSold: res.total
        });
      }
    ); 
    

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})