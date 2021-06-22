/*
 * @Descripttion: 添加好友管理模块接口列表
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-25 15:36:51
 */

import http from 'src/utils/http';

type HttpFunction = (param: Object) => Promise<any>;
type HttpUploadFunction = (param: Object, fn: Function) => Promise<any>;

/**
 * @Descripttion: 上传名单文件接口
 * @param {Object} param
 * @return {*}
 */

export const uploadFile: HttpUploadFunction = (param: Object, fn: Function) => {
  return http.post('/tenacity-manage/api/friend/upload', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: [
      function (data: any) {
        return data;
      }
    ],
    onUploadProgress: (progressEvent: any) => {
      const persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; // 上传进度百分比
      fn(persent);
      console.log('persent', persent);
    }
  });
};

/**
 * @Descripttion: 下载任务表格文件
 * @param {Object} param
 * @return {*}
 */
export const downloadExcel: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/friend/download_excel', param, { headers: { responseType: 'arraybuffer' } });
};
/**
 * @Descripttion: 查询加好友任务列表接口
 * @param {Object} param
 * @return {*}
 */
export const getExcelList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/client_batch/excel_list', param);
};

/**
 * @Descripttion: 分发接口，执行分发批量添加好友
 * @param {Object} param
 * @return {*}
 */
export const distribute: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/friend/distribute', param);
};
/**
 * @Descripttion: 获取待加好友客户列表
 * @param {Object} param
 * @return {*}
 */
export const getFriendList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/friend/excel_list', param);
};

/**
 * @Descripttion:获取客户识别码
 * @param {Object} param
 * @return {*}
 */
export const getHashcode: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/friend/hashcode', param);
};
