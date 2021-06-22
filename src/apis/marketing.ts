/*
 * @Descripttion: 营销平台接口集合
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-06-07 11:37:14
 */

import http from 'src/utils/http';

type HttpFunction = (param: Object) => Promise<any>;

/**
 * @Descripttion: 查询产品列表
 * @param {Object} param
 * @return {*}
 */
export const productList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/product/list', param);
};

/**
 * @Descripttion:查询产品配置列表
 * 配置类型：1-产品分类;2-家庭保障范围;3-保障对象;4-保障场景
 * @param {Object} param
 * @return {*}
 */
export const productConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/product/config', param);
};

/**
 * @Descripttion: 查询产品详情
 * @param {Object} param
 * @return {*}
 */
export const productDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/product/detail', param);
};

/**
 * @Descripttion:新增/编辑产品
 * @param {Object} param
 * @return {*}
 */
export const productEdit: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/product/edit', param);
};

/**
 * @Descripttion: 产品管理接口(上架/下架/删除)
 * @param {Object} param
 * @return {*}
 */
export const productManage: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/product/manage', param);
};

/**
 * @Descripttion: 查询产品精选列表
 * @param {Object} param
 * @return {*}
 */
export const productChoiceList: HttpFunction = (param: Object) => {
  return http.post('/api/product/choice/list', param);
};

/**
 * @Descripttion: 新增/编辑产品精选
 * @param {Object} param
 * @return {*}
 */
export const productChoiceEdit: HttpFunction = (param: Object) => {
  return http.post('/api/product/choice/edit', param);
};

/**
 * @Descripttion: 图片上传接口
 * @param {Object} param
 * @return {*}
 */
export const uploadImg: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/upload/img', param);
};

/**
 * @Descripttion:查询活动列表
 * @param {Object} param
 * @return {*}
 */
export const activityList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/activity/list', param);
};

/**
 * @Descripttion: 查询活动详情
 * @param {Object} param
 * @return {*}
 */
export const activityDetail: HttpFunction = (param: Object) => {
  return http.post('/api/activity/detail', param);
};

/**
 * @Descripttion: 新增/编辑活动
 * @param {Object} param
 * @return {*}
 */
export const activityEdit: HttpFunction = (param: Object) => {
  return http.post('/api/activity/edit', param);
};

/**
 * @Descripttion: 活动管理接口(上架/下架/删除)
 * @param {Object} param
 * @return {*}
 */
export const activityManage: HttpFunction = (param: Object) => {
  return http.post('/api/activity/manage', param);
};
