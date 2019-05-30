// miniprogram/pages/shouye/shouye.js
var index = 0;

var totalSize=0;
var currentIndex=0;


var temp=[];   //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemDetailUrl:'/pages/detail/detail',
    sousuoUrl:"/pages/fenlei/fenlei",
    items: [],
    loading:true,
    reachBottom:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    currentIndex = 0;
    totalSize = 0;
    temp = this.data.items;
    const MAX_LIMIT = 10;  //一次最多获取十条商品记录数据
    const db =  wx.cloud.database();

    await db.collection('shangpin').where({ state: 0 }).count().then(res => { //获取数据库中shangpin集合记录的总共数目
      totalSize=res.total;
    })
    
    console.log("totalSize is " + totalSize);

    // 计算需分几次取
    const batchTimes = Math.ceil(totalSize / 10);
    // 承载所有读操作的 promise 的数组
    
    for (var i = 0; i < batchTimes; i++) {
      if(i!=0){  
        await db.collection('shangpin').where({ state: 0 }).orderBy('date', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => { 
          temp.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
        })
      }
      else{  
        await db.collection('shangpin').where({ state: 0 }).orderBy('date', 'desc').limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
          temp.push(res.data);  
        })
      }
      for (j = 0; j < temp[i].length; j++) {
        temp[i][j].commodityPictures.sort()
      }
    }
    

    console.log(temp);
    this.setData({
      items: temp[currentIndex],
      loading:false
    })
    currentIndex=currentIndex+1;

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
  onPullDownRefresh:async function () {
    this.setData({ loading: false })

    currentIndex = 0;
    totalSize = 0;
    temp = [];
    const MAX_LIMIT = 10;  //一次最多获取十条商品记录数据
    const db = wx.cloud.database();

    await db.collection('shangpin').where({ state: 0 }).count().then(res => { //获取数据库中shangpin集合记录的总共数目
      totalSize = res.total;
    })

    console.log("totalSize is " + totalSize);

    // 计算需分几次取
    const batchTimes = Math.ceil(totalSize / 10);
    // 承载所有读操作的 promise 的数组

    for (var i = 0; i < batchTimes; i++) {
      if (i != 0) {
        await db.collection('shangpin').where({ state: 0 }).orderBy('date', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
          temp.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
        })
      }
      else {
        await db.collection('shangpin').where({ state: 0 }).orderBy('date', 'desc').limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
          temp.push(res.data);
        })
      }
      for (j = 0; j < temp[i].length; j++) {
        temp[i][j].commodityPictures.sort()
      }
    }
    
    console.log(temp);
    if(temp.length!=0){
      this.setData({
        items: temp[currentIndex],
        loading: false
      })
    }
    else{
      this.setData({
        items: [],
        loading: false
      })
    }

    
    currentIndex = currentIndex + 1;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:async function () {
    const MAX_LIMIT = 10; //一次最多获取10条商品记录
    this.setData({loading:true});

    var itemArr=this.data.items;  //要将之前的items里的数据一并放入，在之前items数据的基础上再增加新的商品记录

    if (temp[currentIndex] !=null){
      for (let i = 0; i <temp[currentIndex].length;i++){
        itemArr.push(temp[currentIndex][i]);
      }

      console.log("Bottom currentIndex is " + currentIndex);
      
      this.setData({
        items: itemArr,
        loading: false
      })
      
      
      if (temp[currentIndex].length !=MAX_LIMIT){
        this.setData({
          reachBottom: true,
        })
      }
      currentIndex = currentIndex + 1;
    }
    else{
      this.setData({
        loading: false,
        
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  

  myTap:function(){
    
    const db = wx.cloud.database();
    db.collection('shangpin').add({  //此处db是数据库对象引用，之后出现db也是
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        _id:index.toString(),
        avatar: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558549019684&di=c088a76717a4371831c8bcf8b7b6a230&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170629%2Ff5fb766788344a3eb900cda8b62d504a.png"
,
        campus:'鼓楼校区',
        commodityPictures: ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558549019684&di=c088a76717a4371831c8bcf8b7b6a230&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170629%2Ff5fb766788344a3eb900cda8b62d504a.png", "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558549019684&di=c088a76717a4371831c8bcf8b7b6a230&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170629%2Ff5fb766788344a3eb900cda8b62d504a.png"
],
        contactNumber:2027178562,
        contactWay:"QQ",
        date:new Date(),
        detail:'测试详情测试详情测试详情测试详情',
        name:"Benson",
        originPrice:79,
        presentPrice:30,
        state:0,
        title:"《Java从入门到精通》"+index,
        type:"图书"
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
    index=index+1;
    console.log('index is '+index);
  },
  sousuo: function () {
    wx.navigateTo({
      url: '/pages/sousuo/sousuo',
    })
  },

})




