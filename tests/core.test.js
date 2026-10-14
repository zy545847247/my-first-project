const {test,beforeEach}=require('node:test');
const assert=require('node:assert/strict');
const {categories,words}=require('../miniprogram/data/words');
const storage=require('../miniprogram/services/storage');
let saved;
beforeEach(()=>{saved=undefined;global.wx={getStorageSync:()=>saved,setStorageSync:(_,s)=>{saved=JSON.parse(JSON.stringify(s));}};});
test('50 unique words, 10 per category, readable pinyin',()=>{
  assert.equal(words.length,50);assert.equal(new Set(words.map(w=>w.id)).size,50);
  for(const c of categories)assert.equal(words.filter(w=>w.category===c.id).length,10);
  for(const w of words){assert.ok(w.name&&w.pinyin&&w.description);assert.ok(categories.some(c=>c.id===w.category));}
});
test('repeat views do not inflate count; local calendar days are distinct',()=>{
  storage.markViewed(words[0].id,new Date(2026,9,14,23,59));
  storage.markViewed(words[0].id,new Date(2026,9,14,23,59));
  storage.markViewed(words[1].id,new Date(2026,9,15,0,1));
  assert.equal(storage.read().viewed.length,2);assert.deepEqual(storage.read().days,['2026-10-14','2026-10-15']);
});
test('favorites persist, toggle off, reject unknown IDs',()=>{
  storage.toggleFavorite(words[0].id);assert.deepEqual(storage.read().favorites,[words[0].id]);
  storage.toggleFavorite(words[0].id);assert.deepEqual(storage.read().favorites,[]);
  storage.toggleFavorite('unknown');assert.deepEqual(storage.read().favorites,[]);
});
test('corrupt stored data recovers to valid state',()=>{
  saved={favorites:['unknown',words[0].id,words[0].id],viewed:'bad',days:[null],nickname:4};
  assert.deepEqual(storage.read().favorites,[words[0].id]);assert.deepEqual(storage.read().viewed,[]);assert.equal(storage.read().nickname,'小小探索家');
});
test('audio stops before switching; missing/error states are explicit; destroy cleans up',()=>{
  const events=[],callbacks={};
  global.wx={createInnerAudioContext:()=>({onPlay:f=>callbacks.play=f,onEnded:f=>callbacks.end=f,onStop:f=>callbacks.stop=f,onError:f=>callbacks.error=f,stop:()=>events.push('stop'),play:()=>events.push('play'),destroy:()=>events.push('destroy')}),showToast:o=>events.push(o.title)};
  const {createPlayer}=require('../miniprogram/services/audio');const player=createPlayer(s=>events.push(s));
  player.play({audio:''});assert.equal(events[1],'示例词卡，录音待补充');
  player.play({audio:'/assets/audio/cat.mp3'});assert.deepEqual(events.slice(-2),['stop','play']);
  callbacks.play();callbacks.error();assert.deepEqual(events.slice(-3),[true,false,'声音暂时无法播放']);
  player.destroy();assert.equal(events.at(-1),'destroy');
});
test('card advances within category and stops at completion',()=>{
  let page,modal=false;
  global.Page=p=>page=p;
  Object.assign(global.wx,{createInnerAudioContext:()=>({onPlay(){},onEnded(){},onStop(){},onError(){},stop(){},destroy(){},play(){}}),showModal:()=>modal=true,showToast(){}});
  require('../miniprogram/pages/card/index');
  page.data={...page.data};page.setData=function(p){Object.assign(this.data,p);};
  page.onLoad({id:'animals-09'});page.next();assert.equal(page.data.word.id,'animals-10');
  page.next();assert.equal(modal,true);assert.equal(page.data.word.id,'animals-10');page.onUnload();
});
