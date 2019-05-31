// pages/modify/modify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactArray: ['选择联系方式', 'QQ', '微信', '电话号码'],
    classArray: ['数码', '图书', '美妆', '游戏', '服饰', '生活', '其他'],
    classIndex:0,
    contactIndex:0,
    itemId:'',
    title:'',
    detail:'',
    presentPrice:'',
    originPrice:'',
    xianlinchecked:false,
    gulouchecked:false,
    contactNumber:'',
    imgArray:[],
    originFileIdArray:[],
    localPicturePathArray:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    this.setData({
      itemId:options._id,
    })

    //获取数据库中原本的数据
    const db=wx.cloud.database()
    db.collection('shangpin').doc(options._id).get({
      success:async function(res){
        console.log(res.data)
        var itemData=res.data
        

        //将所有图片的fileID转换为本地地址
        var pictureTempPathArray = []
        for (let i = 0; i <itemData.commodityPictures.length;i++){
          wx.cloud.downloadFile({
            fileID:itemData.commodityPictures.sort()[i],
            success:function(res){
              pictureTempPathArray.push(res.tempFilePath)
            },
            fail:function(res){
              console.log('第'+i+'张图片转换本地地址失败')
              console.log(res.errMsg)
            }
          })
        }
        
        
        //开始恢复数据
        that.setData({
          title: itemData.title,
          detail: itemData.detail,
          originPrice: itemData.originPrice,
          presentPrice: itemData.presentPrice,
          contactNumber: itemData.contactNumber,
          imgArray:itemData.commodityPictures.sort(),
          localPicturePathArray:pictureTempPathArray,
          originFileIdArray: itemData.commodityPictures.sort(),
        })
        console.log(that.data.localPicturePathArray)
        
        //恢复校区
        if(itemData.campus=='仙林/鼓楼校区'){
          that.setData({
            xianlinchecked:true,
            gulouchecked:true,
          })
        }else if(itemData.campus=='仙林校区'){
          that.setData({
            xianlinchecked:true,
            gulouchecked:false,
          })
        }else if(itemData.campus=='鼓楼校区'){
          that.setData({
            xianlinchecked:false,
            gulouchecked:true,
          })
        }
        //恢复物品种类
        var typeIndex=0
        for(let i=0;i<that.data.classArray.length;i++){
          if(itemData.type==that.data.classArray[i]){
            typeIndex=i
            break
          }
        }
        that.setData({
          classIndex:typeIndex,
        })
        //恢复联系方式种类
        var contactIndex=0
        for(let i=0;i<that.data.contactArray.length;i++){
          if(itemData.contactWay==that.data.contactArray[i]){
            contactIndex=i
            break
          }
        }
        that.setData({
          contactIndex:contactIndex,
          pictureTempPathArray:pictureTempPathArray,
          
        })
        //第一次打印临时地址
        
        console.log(that.data.imgArray)
        console.log(that.data.originFileIdArray)
      

      },
      fail:function(res){
        console.log('获取数据库信息失败')
      }
    })
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
  addPicture: function () {
    
    var that = this
    wx.chooseImage({

      success: function (res) {
        //向原来imgArray中添加新图片地址
        const array = that.data.imgArray
        const tempFilePaths = res.tempFilePaths
        const tempArray=that.data.localPicturePathArray
        for (var i = 0; i < tempFilePaths.length; i++) {
          array.push(tempFilePaths[i])
          tempArray.push(tempFilePaths[i])
        }
        that.setData({
          imgArray: array,
          localPicturePathArray:tempArray,
        })
      },
      fail: function (res) {
        console.log(res.errMsg);
        wx.showToast({
          title: '未取得照片',
          icon: 'none',
        })
      }
    })

  },
  deletePicture: function (e) {
    var that = this
    
    wx.showActionSheet({
      itemList: ["删除该图片"],
      success: function (res) {
        
        var index = e.currentTarget.dataset.index
        //同时删除两个地址数组里对应的图片地址
        const array = that.data.imgArray
        array.splice(index, 1)
        const tempArray=that.data.localPicturePathArray
        tempArray.splice(index,1)
        that.setData({
          imgArray: array,
          localPicturePathArray:tempArray,
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  bindPickerClassChange: function (e) {
    
    this.setData({
      classIndex: e.detail.value
    })
  },
  bindPickerContactChange: function (e) {
    
    this.setData({
      contactIndex: e.detail.value
    })
  },
  formsubmit:function(e){
    const db=wx.cloud.database()
    var that=this
    var finalData=e.detail.value
    console.log(finalData)
    //校验表单数据
    var errorMsg;
    var everythingFill = true;
    if (finalData.title == '') {
      console.log('标题为空')
      errorMsg = '标题为空'
      everythingFill = false
    } else if (finalData.detail == '') {
      console.log('详情为空')
      errorMsg = '详情为空'
      everythingFill = false
    } else if (finalData.presentPrice == '') {
      console.log('希望价格为空')
      errorMsg = '希望价格为空'
      everythingFill = false
    } else if (finalData.originPrice == '') {
      console.log('原价为空')
      errorMsg = '原价为空'
      everythingFill = false
    } else if (finalData.contactWay == 0) {
      console.log('未选择联系方式种类')
      errorMsg = '未选择联系方式种类'
      everythingFill = false
    } else if (finalData.contactNumber == '') {
      console.log('未填写联系方式')
      errorMsg = '未填写联系方式'
      everythingFill = false
    }
    else if (finalData.campus == '') {
      console.log('未选择校区')
      errorMsg = '为选择校区'
      everythingFill = false
    }
    

    wx.showModal({
      title: '确认发布',
      content: '确定要修改信息吗？',
      success:async function(res){
        if(res.confirm){
              //删除原有图片
          console.log(that.data.originFileIdArray)
          await wx.cloud.deleteFile({
            fileList: that.data.originFileIdArray,
            success: function (res) {
              console.log(that.data.originFileIdArray)
              for (let i = 0; i < that.data.originFileIdArray.length; i++) {
                if (res.fileList[i].status != 0) {
                  console.log('删除第' + i + '张图片失败')
                  console.log(res.fileList[i].errMsg)
                }
              }             
            },
            fail: function (res) {
              console.log('删除原有图片失败')
              console.log(res.errMsg)
            }
          })
          //删除数据库中的图片fileID
          await wx.cloud.database().collection('shangpin').doc(that.data.itemId).update({
            data:{
              commodityPictures:[],
            }
          })
          //上传图片
          var fileIdArray = []
          for (let i = 0; i < that.data.localPicturePathArray.length; i++) {
            await wx.cloud.uploadFile({
              cloudPath: 'images/' + that.data.itemId + '/' + i + '.jpg',
              filePath: that.data.localPicturePathArray[i],
              success:async function (res) {
                fileIdArray.push(res.fileID)
                await db.collection('shangpin').doc(that.data.itemId).update({
                  data:{
                    commodityPictures:db.command.unshift(res.fileID)
                  }
                })

                
              },
              fail: function (res) {
                console.log(res.errMsg)
              }
            })
          }
          console.log(fileIdArray)
          //校区
          var position
          if (finalData.campus.length == 2) {
            position = '仙林/鼓楼'
          } else if (finalData.campus[0] == '仙林') {
            position = '仙林'
          } else if (finalData.campus[0] == '鼓楼') {
            position = '鼓楼'
          }
          position = position + '校区'

          //更新数据库
          const db = wx.cloud.database()
          await db.collection('shangpin').doc(that.data.itemId).update({
            data: {
              title: finalData.title,
              detail: finalData.detail,
              originPrice: finalData.originPrice,
              presentPrice: finalData.presentPrice,
              contactNumber: finalData.contactNumber,
              type: that.data.classArray[finalData.type],
              contactWay: that.data.contactArray[finalData.contactWay],
              campus: position,
              //commodityPictures: fileIdArray,
            },
            success: function (res) {
              wx.showToast({
                title: '发布成功',
                success: function (res) {
                  wx.navigateBack({
                    delta: 1,
                  })
                },
                fail: function (res) {
                  console.log('调用toast接口失败')
                }
              })
            },
          })
           

          
          


          
          
        }else if(res.cancel){
          
          console.log('用户点击取消')
        }
      },
      fail:function(res){
        console.log('调用modal接口失败！')
      }
    })
    
  },
  
})