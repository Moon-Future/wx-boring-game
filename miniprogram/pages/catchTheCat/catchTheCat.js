// miniprogram/pages/catchTheCat/catchTheCat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: '',
    height: 300,
    ctx: null,
    circle: {r: 10},
    cols: 11,
    rows: 11,
    space: 5,
    posMap: {},
    center: {},
    catPos: {},
    activePos: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sysinfo = wx.getSystemInfoSync();
    let r = Math.floor((sysinfo.windowWidth - this.data.space * (this.data.cols - 1)) / (this.data.cols + 1) / 2)
    this.ctx = wx.createCanvasContext('catch-the-cat');
    this.setData({
      width: sysinfo.windowWidth,
      height: this.data.rows * r * 2 + this.data.rows * this.data.space,
      'circle.r': r
    });
    this.drawGrid();
    this.drawRandom();
    this.ctx.drawImage('../../images/money.png', this.data.center.x1, this.data.center.y1, this.data.center.r * 2, this.data.center.r * 2);
    this.ctx.draw(true);

    console.log(this.data.catPos, this.data.activePos);
  },

  drawCircle: function(x, y, r, fillStyle) {
    let ctx = this.ctx;
    this.clear(x - r, y - r, 2 * r, 2 * r);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.setFillStyle(fillStyle);
    ctx.fill();
  },

  drawGrid: function() {
    let r = this.data.circle.r;
    let space = this.data.space;
    let posMap = {},x1, x2, y1, y2;
    for (let i = 0; i < this.data.rows; i++) {
      let y = 2 * r * i + r + space * (i + 1);
      for (let j = 0; j < this.data.cols; j++) {
        let x = 2 * r * j + r + space * (j + 1) + (i % 2 === 0 ? 0 : r);
        this.drawCircle(x, y, r, '#b3d9ff');
        x1 = x - r;
        x2 = x + r;
        y1 = y - r;
        y2 = y + r;
        posMap[i + '_' + j] = { x, y, r, x1, x2, y1, y2 };
        if (i === 5 && j === 5) {
          this.setData({
            center: { x, y, r, x1, x2, y1, y2 },
            catPos: { x, y, r, x1, x2, y1, y2, key: i + '_' + j }
          })
        }
      }
    }
    this.setData({
      posMap: posMap
    })
    this.ctx.draw();
  },

  drawRandom: function() {
    let num = this.getRandom(7, 8);
    let arr = ['5_5'], activePos = {};
    for (let i = 0; i < num; i++) {
      let x = this.getRandom(0, 10);
      let y = this.getRandom(0, 10);
      let key = x + '_' + y;
      while (arr.indexOf(key) !== -1) {
        x = this.getRandom(0, 10);
        y = this.getRandom(0, 10);
        key = x + '_' + y;
      }
      arr.push(key);
      let data = this.data.posMap[key];
      this.drawCircle(data.x, data.y, data.r, '#036');
      activePos[key] = this.filterPos(data)
    }
    this.ctx.draw(true);
    this.setData({
      activePos: activePos
    })
  },

  clear: function(x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);
  },

  getRandom: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  filterPos: function(data) {
    let x = data.x,
      y = data.y,
      r = data.r,
      x1 = x - r,
      x2 = x + r,
      y1 = y - r,
      y2 = y + r;
    return { x, y, r, x1, x2, y1, y2 }
  },

  bindtap: function (e) {
    console.log('e', e)
    let posMap = this.data.posMap;
    let x = e.detail.x, y = e.detail.y;
    for (let key in posMap) {
      let data = posMap[key];
      if (this.data.activePos[key] || this.data.catPos.key === key) {
        continue;
      }
      if (x > data.x1 && x < data.x2 && y > data.y1 && y < data.y2) {
        this.drawCircle(data.x, data.y, this.data.circle.r, '#036');
        this.ctx.draw(true);
        let activeKey = 'activePos.' + key;
        this.setData({
          [activeKey]: this.filterPos(data)
        })
        console.log(this.data.activePos);
        return;
      }
    } 
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})