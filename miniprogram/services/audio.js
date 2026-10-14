// Add a local MP3 path or an approved HTTPS URL to a word's audio field.
function createPlayer(onState) {
  const context = wx.createInnerAudioContext();
  context.autoplay = false;
  context.onPlay(() => onState(true));
  context.onEnded(() => onState(false));
  context.onStop(() => onState(false));
  context.onError(() => { onState(false); wx.showToast({title:'声音暂时无法播放',icon:'none'}); });
  return {
    play(word) {
      context.stop();
      if (!word.audio) { wx.showToast({title:'示例词卡，录音待补充',icon:'none'}); return; }
      context.src = word.audio; context.play();
    },
    stop() { context.stop(); },
    destroy() { context.destroy(); }
  };
}
module.exports = { createPlayer };
