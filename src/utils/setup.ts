/**
 * @name setup 主动执行的代码
 * @author Lester
 * @date 2021-05-08 10:23
 */
import FastClick from 'fastclick';

(function (doc: Document, win: Window) {
  doc.title = '\u200E';

  // @ts-ignore 快速点击 解决移动端点击事件延迟300ms和点击穿透的问题
  FastClick.attach(doc.body);

  // 解决ios下输入框点击不唤起软键盘的bug
  doc.body.addEventListener('click', (event: MouseEvent) => {
    const ele: HTMLElement = event.target as HTMLElement;
    const { tagName } = ele;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || ele.getAttribute('contenteditable') === 'true') {
      ele.focus();
    }
  });

  // 调试器
  win.onload = () => {
    const erudaScript = doc.createElement('script');
    erudaScript.src = '//cdn.jsdelivr.net/npm/eruda';
    erudaScript.onload = () => {
      win.eruda.init();
    };
    doc.body.appendChild(erudaScript);
  };

  // 错误监控
  /* win.onerror = (msg, url, row, col, error) => {
    console.log(msg);
    console.log(url);
    console.log(row);
    console.log(col);
    console.log(error);
    return false;
  }; */
})(document, window);
