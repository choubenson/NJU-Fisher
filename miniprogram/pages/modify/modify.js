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
        var itemData=res.data
        

        
        
        //开始恢复数据
        that.setData({
          title: itemData.title,
          detail: itemData.detail,
          originPrice: itemData.originPrice,
          presentPrice: itemData.presentPrice,
          contactNumber: itemData.contactNumber,
          imgArray:itemData.commodityPictures.sort(),

          
        })
        

        
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
        })
        
        
        

      

      },
      fail:function(res){
        console.error(res)
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
    //校验表单数据
    var errorMsg;
    var everythingFill = true;
    if (finalData.title == '') {
      errorMsg = '标题为空'
      everythingFill = false
    } else if (finalData.detail == '') {
      errorMsg = '详情为空'
      everythingFill = false
    } else if (finalData.presentPrice == '') {
      errorMsg = '希望价格为空'
      everythingFill = false
    } else if (finalData.originPrice == '') {
      errorMsg = '原价为空'
      everythingFill = false
    } else if (finalData.contactWay == 0) {
      errorMsg = '未选择联系方式种类'
      everythingFill = false
    } else if (finalData.contactNumber == '') {
      errorMsg = '未填写联系方式'
      everythingFill = false
    }
    else if (finalData.campus == '') {
      errorMsg = '为选择校区'
      everythingFill = false
    }
    

    wx.showModal({
      title: '确认发布',
      content: '确定要修改信息吗？',
      success:async function(res){
        if(res.confirm){

          
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
                  console.error(res)
                }
              })
            },
          }) 
          
        }else if(res.cancel){
        }
      },
      fail:function(res){
        console.error(res)
      }
    })
    
  },
  previewImg: function (e) {
    var index = e.currentTarget.dataset.index.substring(0,1);
    var imgArr = this.data.imgArray;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
})