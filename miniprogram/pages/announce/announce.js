Page({

  /**
   * 页面的初始数据
   */
  data: {
    classArray:['数码','图书','美妆','游戏','服饰','生活','其他'],
    classIndex:0,
    contactArray:['选择联系方式','QQ','微信','电话号码'],
    contactIndex:0,
    

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
  bindPickerClassChange: function(e){
    console.log('classPicker发送选择改变，携带值为',e.detail.value)
    this.setData({
      classIndex:e.detail.value
    })
  },
  bindPickerContactChange:function(e){
    console.log('contactPicker发送选择改变，携带值为',e.detail.value)
    this.setData({
      contactIndex:e.detail.value
    })
  },

  useCamera: function(){
    console.log("添加图片")
    wx.showActionSheet({
      itemList: ['从手机相册选择','拍照'],
      success: function(res){
        console.log(res.tapIndex)
        if(res.tapIndex===0){
          wx.chooseImage({
            success: function(res) {
              
            },
          })
        } 
         
      },
      fail: function(res){
        console.log(res.errMsg)
      }
    })
    
  }
})