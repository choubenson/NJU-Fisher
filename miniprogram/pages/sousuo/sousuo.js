// miniprogram/pages/sousuo/sousuo.js

var totalSize = 0;
var currentIndex = 0;

var temp = [];   //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemDetailUrl: '/pages/detail/detail',
    items: [],
    loading: false,
    result: false,
    inputValue: "", //存放输入的字符串
    inputEle: [], //将输入拆解为数组储存起来
    isEmpty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
  
   
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
  onReachBottom:  function () {
    const MAX_LIMIT = 10; //一次最多获取10条商品记录
    this.setData({ loading: true });

    var itemArr = this.data.items;  //要将之前的items里的数据一并放入，在之前items数据的基础上再增加新的商品记录

    if (temp[currentIndex] != null) {
      for (let i = 0; i < temp[currentIndex].length; i++) {
        if (temp[currentIndex][i] != null) { 
          itemArr.push(temp[currentIndex][i]);
        }        
      }

      this.setData({
        items: itemArr,
        loading: false
      })

      currentIndex = currentIndex + 1;
    }
    else {
      this.setData({
        loading: false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //去除关键词所有空格
  Trim: function(str){
    return str.replace(/\s/g, "");
  },
  
  //将正则表达式转换为字符串
  replace: function (str) {
    return str.replace(/(^.)|(.$)/g, "");
  },
  
  //获取输入
  getInput: function(e){
    this.setData({
      inputValue: this.Trim(e.detail.value),
      result: false,
    })
  },

  //点击搜索
  clickButton: function(){
    if (this.data.inputValue != "") {
      var str = "" + this.data.inputValue;
      this.setData({
        inputEle: str.split(""),
      })
      this.search();  //每次有效输入都会进行搜索
    }
    else {
      this.setData({
        items: [],
      })
    } 
  },

  //进行搜索
  search: async function(){
    this.setData({
      loading: true,
      items: [],
    })
    currentIndex = 0;
    
    const db = wx.cloud.database();
    const MAX_LIMIT = 10;  //一次最多获取十条商品记录数据
    temp = [];
    
    //关键词进行搜索的格式,含有输入字符串的项将会被搜索到(可以不连续)，大小写不敏感
    if(this.data.inputEle.length != 1){
      var key = new RegExp(".*" + this.data.inputEle[0]);
      for (i = 1; i < this.data.inputEle.length; i++) {
        var key_1 = key + "";
        key_1 = this.replace(key_1);
        if (i != this.data.inputEle.length - 1) {
          key = new RegExp(key_1 + ".*" + this.data.inputEle[i]);
        }
        else {
          key = new RegExp(key_1 + ".*" + this.data.inputEle[i] + ".*", "i");
        }
      }
    }
    else{
      var key = new RegExp(".*" + this.data.inputEle[0], "i");
    }
    

    await db.collection('shangpin').count().then(res => { //获取数据库中shangpin集合记录的总共数目
      totalSize = res.total;
    })

    // 计算需分几次取
    const batchTimes = Math.ceil(totalSize / 10);
    for (i = 0; i < batchTimes; i++) {
      if (i != 0) {
        await db.collection('shangpin').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
          temp.push(res.data);  //把数据库shangpin集合里的所有数据以十条为单位放入temp数组里，即temp里每个元素又是一个个长度为10的数组，其中最后一个长度可能不为10
        })
      }
      else {
        await db.collection('shangpin').limit(MAX_LIMIT).get().then(res => { //若是第一次从数据库拿数据，则不需要跳过前10条，因此没有skip()，该函数参数不能为0
          temp.push(res.data);
        })
      }
      for (j = 0; j < temp[i].length; j++) {
        temp[i][j].commodityPictures.sort()
      }
    }
    
    var temp_2 = [];    //将匹配项存入该数组
    var match = false;  //有无匹配项
    for (i = 0; i < temp.length; i++) {
      for (j = 0; j < temp[i].length; j++) {
        if (key.test(temp[i][j].title)) {
          temp_2.push(temp[i][j]);
          match = true;
        }
      }
    }

    var arr = new Array();  //转回二维数组
    var s = 0;
    for (var i = 0; i < Math.ceil(temp_2.length / 10); i++) {
      arr[i] = new Array(i);
      for (var j = 0; j < MAX_LIMIT; j++) {
        if (s < temp_2.length) {
          arr[i][j] = temp_2[s];
          s++
        }
      }
    }
    temp = arr;

    if(match){  //有匹配项
      this.setData({
        items: temp[currentIndex],
        loading: false,
        result: true,
        isEmpty:false
      }) 
    }
    else{  //无匹配项
      this.setData({
        items: [],
        loading: false,
        result: true,
        isEmpty:true
      }) 
    }
    currentIndex = currentIndex + 1;   
  }
})