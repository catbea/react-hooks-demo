/**
 * @name base
 * @author Lester
 * @date 2021-05-29 17:29
 */
import { message } from 'antd';
import { getQueryParam } from 'lester-tools';
import { ClipboardItem, write } from 'clipboard-polyfill';

type commonFC = (...args: any) => any;

/**
 * 下载图片
 * @param url
 * @param name
 */
export const downloadImage: commonFC = (url: string, name: string) => {
  const hrefEle = document.createElement('a');
  hrefEle.href = url;
  hrefEle.setAttribute('download', name);
  hrefEle.click();
};

/**
 * 获取指定Url参数
 * @param key
 */
export const getUrlQueryParam: (key: string) => string = (key: string) => {
  const queryParam: any = JSON.parse(window.localStorage.getItem('queryParam') || '{}');
  return getQueryParam(key) || queryParam[key];
};

/**
 * base64转Blob
 * @param b64Url
 * @param contentType
 * @param sliceSize
 */
export const b64toBlob: commonFC = (b64Url: string, contentType = 'image/png', sliceSize = 512) => {
  const byteCharacters: string = window.atob(b64Url.split(',')[1]);
  const byteArrays: any[] = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};

/**
 * 复制base64格式的图片
 * @param b64Url
 * @param tips
 */
export const copyBase64Img: commonFC = (b64Url: string, tips?: boolean) => {
  const copyItem = new ClipboardItem({
    'image/png': b64toBlob(b64Url)
  });
  write([copyItem]);
  // const ele = document.getElementById('copyImg');
  // // @ts-ignore
  // const selection = window.getSelection();
  // const range = document.createRange();
  // // @ts-ignore
  // range.selectNode(ele);
  // // @ts-ignore
  // selection.addRange(range);
  // document.execCommand('copy');
  // // @ts-ignore
  // selection.removeAllRanges();
  console.log('复制完成');
  if (tips) {
    message.success('复制成功');
  }
};

/**
 * 获取cookie
 * @param key
 */
export const getCookie: (key: string) => string = (key: string) => {
  if (!document.cookie || !window.navigator.cookieEnabled) {
    return '';
  }
  const regExe = new RegExp(`${key}=([\\w]+)`);
  const res = document.cookie.match(regExe) || [];
  return res[1];
};
