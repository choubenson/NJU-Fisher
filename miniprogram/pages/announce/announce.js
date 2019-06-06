
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
    index:0,
    title:'',
    detail:'',
    presentPrice:'',
    originPrice:'',
    contactNumber:'',
    xianlinchecked:false,
    gulouchecked:false,

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

  formsubmit:async function(e){
    var that = this
    const db = wx.cloud.database()
    var position;
    var finalData = e.detail.value
    var app = getApp()
    var errorMsg;
    var everythingFill=true;
    //校验表单数据
    if(finalData.title==''){
      console.log('标题为空')
      errorMsg='标题为空'
      everythingFill=false
    }else if(finalData.detail==''){
      console.log('详情为空')
      errorMsg='详情为空'
      everythingFill = false
    }else if(finalData.presentPrice==''){
      console.log('希望价格为空')
      errorMsg='希望价格为空'
      everythingFill = false
    }else if(finalData.originPrice==''){
      console.log('原价为空')
      errorMsg='原价为空'
      everythingFill = false
    } else if (finalData.contactWay == 0) {
      console.log('未选择联系方式种类')
      errorMsg='未选择联系方式种类'
      everythingFill = false
    }else if(finalData.contactNumber==''){
      console.log('未填写联系方式')
      errorMsg='未填写联系方式'
      everythingFill = false
    }
    else if(finalData.campus==''){
      console.log('未选择校区')
      errorMsg='为选择校区'
      everythingFill = false
    }
    
    if(everythingFill){
      wx.showModal({
        title: '确认发布',
        content: '确定要发布了吗？',
        success: async function (res) {
          if (res.confirm) {

            console.log('用户点击确认发布，现在进行提交！！！')
            //插入数据
            console.log('开始插入数据')
            if (finalData.campus.length == 2) {
              position = '仙林/鼓楼校区'
            } else {
              position = finalData.campus[0] + '校区'
            }

            await db.collection('shangpin').add({
              //_id 由数据可自动分配
              data: {

                avatar: app.globalData.userInfo.avatarUrl,
                campus: position,
                commodityPictures: [],
                contactNumber: finalData.contactNumber,
                contactWay: that.data.contactArray[finalData.contactWay],
                date: new Date(),
                detail: finalData.detail,
                name: app.globalData.userInfo.nickName,
                originPrice: finalData.originPrice,
                presentPrice: finalData.presentPrice,
                state: 0,
                title: finalData.title,
                type: that.data.classArray[finalData.type],
              },
              success: async function (res) {


                console.log(res)

                var item_id = res._id;
                //上传图片
                const array = that.data.imgArray
                if(array.length==0){
                  //如果未添加图片
                  await wx.cloud.database().collection('shangpin').doc(item_id).update({
                    data: {
                      commodityPictures:wx.cloud.database().command.unshift('cloud://benson-swllb.6265-benson-swllb/u=1782428337,2090066779&fm=26&gp=0.jpg')
                    },
                })
                }
                for (let i = 0; i < array.length; i++) {
                  console.log(array[i])
                  await wx.cloud.uploadFile({
                    cloudPath: 'images/' + item_id + '/' + i + '.jpg',
                    filePath: array[i],
                    success: async function (res) {
                      var id = res.fileID
                      console.log(item_id)
                      const _ = db.command
                      await wx.cloud.database().collection('shangpin').doc(item_id).update({
                        data: {
                          commodityPictures: _.unshift(id)
                        },
                        success: function (res) {
                          console.log('更新数据库图片地址成功')
                        },
                        fail: function (res) {
                          console.log("更新数据库图片地址失败")
                          console.error(res)
                        }
                      })
                      console.log("Finish Update!!!")
                    },
                    fail: function (res) {
                      console.log('上传图片失败')
                      console.log(res.errMsg)
                    }
                  })
                }
                //完成数据提交以及图片上传
                //显示toast以及清空页面
                wx.showToast({
                  title: '发布成功',
                  success: function (res) {
                    console.log('开始清空页面')
                    that.setData({
                      title: '',
                      detail: '',
                      originPrice: '',
                      presentPrice: '',
                      contactNumber: '',
                      xianlinchecked: false,
                      gulouchecked: false,
                      imgArray: [],
                      contactIndex: 0,
                      classIndex: 0,
                    })
                  },
                })
              }
            })



          } else if (res.cancel) {
            console.log("用户点击取消按钮")
          }
        },
        fail: function (res) {
          console.log('Modal接口调用失败!')
        }
      }) 
    }else{
      wx.showToast({
        title: errorMsg,
        icon:'none',
      })
    }
  },
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArray;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }

})