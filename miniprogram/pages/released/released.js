// pages/released/released.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectedUrl: '/pages/collected/collected',
    itemDetailUrl: '/pages/detail/detail',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
          console.log('用户点击取消')
        }
      }
    })    
  }
})