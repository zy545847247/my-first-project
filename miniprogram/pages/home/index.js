const { categories, words } = require('../../data/words');
const storage = require('../../services/storage');
Page({data:{categories,profile:{}},onShow(){this.setData({profile:storage.read()});},
 openCategory(e){wx.navigateTo({url:'/pages/category/index?id='+e.currentTarget.dataset.id});},
 start(){const id=this.data.profile.lastWord || words[0].id;wx.navigateTo({url:'/pages/card/index?id='+id});}
});
