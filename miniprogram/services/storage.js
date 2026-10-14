// Only this service touches device storage. Unique viewed words are not a mastery assessment.
const KEY = 'baby-explorer:v1';
const { words } = require('../data/words');
const valid = id => words.some(w => w.id === id);
function fresh() { return { nickname:'小小探索家', favorites:[], viewed:[], days:[], lastWord:'' }; }
function read() {
  try {
    const s = wx.getStorageSync(KEY);
    if (!s || typeof s !== 'object') return fresh();
    return { nickname:typeof s.nickname === 'string' ? s.nickname : fresh().nickname,
      favorites:Array.isArray(s.favorites) ? [...new Set(s.favorites.filter(valid))] : [],
      viewed:Array.isArray(s.viewed) ? [...new Set(s.viewed.filter(valid))] : [],
      days:Array.isArray(s.days) ? [...new Set(s.days.filter(d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))] : [],
      lastWord:valid(s.lastWord) ? s.lastWord : '' };
  } catch (_) { return fresh(); }
}
function write(s) { wx.setStorageSync(KEY, s); return s; }
function dateKey(d) { return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); }
function markViewed(id, now = new Date()) {
  if (!valid(id)) return read();
  const s = read(), day = dateKey(now);
  if (!s.viewed.includes(id)) s.viewed.push(id);
  if (!s.days.includes(day)) s.days.push(day);
  s.lastWord = id; return write(s);
}
function toggleFavorite(id) {
  const s = read(); if (!valid(id)) return s;
  s.favorites = s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites,id];
  return write(s);
}
function rename(name) { const s = read(); s.nickname = String(name).trim().slice(0,16) || fresh().nickname; return write(s); }
module.exports = { read, markViewed, toggleFavorite, rename, dateKey };
