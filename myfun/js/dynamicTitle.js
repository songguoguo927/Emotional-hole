//<!-- 标题动态切换代码 Start -->
window.onload = function () {
  // let hour = new Date().getHours()
  function c () {
    document.title = document[a] ? '死鬼去哪啦！' : d
  }

  let a = document.title
  // let b = document.title
  let d = document.title
  typeof document.hidden !== 'undefined' ? (a = 'hidden', b = 'visibilitychange')
    : typeof document.mozHidden !== 'undefined' ? (a = 'mozHidden', b = 'mozvisibilitychange')
    : typeof document.webkitHidden !== 'undefined' && (a = 'webkitHidden', b = 'webkitvisibilitychange')
  typeof document.addEventListener === 'undefined' && typeof document[a] === 'undefined' || document.addEventListener(b, c, !1)
}
// <!-- 标题动态切换代码 End -->
