Page({

  /**
   * 页面的初始数据
   */
  data: {
    classArray:['数码','图书','美妆','游戏','服饰','生活','其他'],
    classIndex:0,
    contactArray:['选择联系方式','QQ','微信','电话号码'],
    contactIndex:0,
    imgArray:[],
    index:0
    
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

  addPicture: function(){
    console.log("添加图片")
    var that=this
    wx.chooseImage({
      
      success: function(res) {
        //向原来imgArray中添加新图片地址
        const array=that.data.imgArray
        const tempFilePaths=res.tempFilePaths
        for(var i=0;i<tempFilePaths.length;i++){
          array.push(tempFilePaths[i])
        }
        that.setData({
          imgArray:array
        })
      },
      fail:function(res){
        console.log(res.errMsg);
        wx.showToast({
          title: '未取得照片',
          icon:'none',
        })
      }
    })
    
  },
  deletePicture:function(e){
    var that=this
    console.log('删除图片')
    wx.showActionSheet({
      itemList: ["删除该图片"],
      success:function(res){
        console.log(res.tapIndex)
        var index = e.currentTarget.dataset.index
        console.log('要删除的图片下标是:' + index)
        const array = that.data.imgArray
        array.splice(index,1)
        that.setData({
          imgArray:array
        })
      },
      fail:function(res){
        console.log(res.errMsg)
      }
    })
    
  },
  onGotUserInfo:function(e){
    console.log(e.detail.userInfo)

    this.setData({
      userInfo:e.detail.userInfo
    })
  },

  formsubmit:function(e){
    
    var that=this
    console.log('用户点击确认发布')
    console.log(e.detail.value)
    var finalData=e.detail.value
    //获取用户id以及头像以及名字
    var app=getApp()
    console.log('这是全局useInfo对象：'+app.globalData.userInfo)
    

    //插入数据
    console.log('开始插入数据')
    const db=wx.cloud.database()
    var position;
    if(finalData.campus.length==2){
      position='仙林/鼓楼'
    }else{
      position=finalData.campus[0]+'校区'
    }
    db.collection('shangpin').add({
      //_id 由数据可自动分配
      data:{
        
        avatar:app.globalData.userInfo.avatarUrl,
        campus:position,
        commodityPictures:['1','2'],
        contactNumber:finalData.contactNumber,
        contactWay:that.data.contactArray[finalData.contactWay],
        date:new Date(),
        detail:finalData.detail,
        name:app.globalData.userInfo.nickName,
        originPrice:finalData.originPrice,
        presentPrice:finalData.presentPrice,
        state:0,
        title:finalData.title,
        type:that.data.classArray[finalData.type],
      },
      success:function(res){
        console.log(res)
        
        var item_id=res._id;
        //上传图片
        const array = that.data.imgArray
        const fileIdArray=[]
        console.log('开始上传图片')
        for (let i = 0; i < array.length; i++) {
          console.log(array[i])
          wx.cloud.uploadFile({
            cloudPath: 'images/' + item_id + '/' + i + '.jpg',
            filePath: array[i],
            success: function (res) {
              console.log(res.fileID)
              fileIdArray.push(res.fileID)
              
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })
        }
        //更新数据库中的图片地址
        
        console.log(item_id)
        console.log(fileIdArray)
        const _=db.command
        wx.cloud.database().collection('shangpin').doc(item_id).update({
          data: {
            commodityPictures: _.set({fileIdArray})
          },
          success: function (res) {
            console.log(fileIdArray)
            console.log(res.stats.updated)
          },
          fail: function (res) {
            console.log(fileIdArray)
            console.error(res)
          }
        })
        
      
      


        
      }
    })
  }
})