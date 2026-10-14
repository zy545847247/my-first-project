const {words}=require('../../data/words');
const storage=require('../../services/storage');
const {createPlayer}=require('../../services/audio');
Page({data:{word:null,favorite:false,playing:false,active:false,index:0,total:0},
 onLoad(q){this.player=createPlayer(playing=>this.setData({playing}));this.showWord(q.id || words[0].id);},
 onShow(){if(this.data.word)this.setData({favorite:storage.read().favorites.includes(this.data.word.id)});},
 showWord(id){const word=words.find(w=>w.id===id);if(!word){wx.showToast({title:'词卡不存在',icon:'none'});return;}this.player.stop();this.list=words.filter(w=>w.category===word.category);const s=storage.markViewed(id);this.setData({word,favorite:s.favorites.includes(id),index:this.list.findIndex(w=>w.id===id),total:this.list.length,active:false});},
 listen(){if(!this.data.word)return;clearTimeout(this.timer);this.setData({active:false});this.setData({active:true});this.timer=setTimeout(()=>this.setData({active:false}),550);this.player.play(this.data.word);},
 favorite(){if(!this.data.word)return;try{const s=storage.toggleFavorite(this.data.word.id);this.setData({favorite:s.favorites.includes(this.data.word.id)});}catch(_){wx.showToast({title:'收藏未保存，请重试',icon:'none'});}},
 next(){if(!this.list)return;if(this.data.index===this.list.length-1){this.player.stop();wx.showModal({title:'这一组看完啦',content:'和宝宝在生活里找一找这些东西吧。',confirmText:'再看一遍',cancelText:'休息一下',success:r=>{if(r.confirm)this.showWord(this.list[0].id);else wx.navigateBack();}});return;}this.showWord(this.list[this.data.index+1].id);},
 previous(){if(this.data.index>0)this.showWord(this.list[this.data.index-1].id);},
 onHide(){this.player.stop();clearTimeout(this.timer);this.setData({active:false});},onUnload(){clearTimeout(this.timer);this.player.destroy();}
});
