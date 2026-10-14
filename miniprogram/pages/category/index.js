const {categories,words}=require('../../data/words');
const storage=require('../../services/storage');
Page({data:{category:{},items:[]},onLoad(q){this.id=q.id;const category=categories.find(c=>c.id===q.id);if(!category){wx.showToast({title:'分类不存在',icon:'none'});return;}this.setData({category});wx.setNavigationBarTitle({title:category.name});},onShow(){const s=storage.read();this.setData({items:words.filter(w=>w.category===this.id).map(w=>({...w,viewed:s.viewed.includes(w.id)}))});},open(e){wx.navigateTo({url:'/pages/card/index?id='+e.currentTarget.dataset.id});}});
