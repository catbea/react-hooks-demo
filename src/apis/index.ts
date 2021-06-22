/**
 * @name index
 * @author Lester
 * @date 2021-05-20 10:13
 */

import http from 'src/utils/http';

type HttpFunction = (param: Object) => Promise<any>;

/**
 * 微信授权登录
 * @param param
 */
export const loginAuth: HttpFunction = (param: Object) => {
  return http.post('/tenacity-manage/api/user/authorize', param);
};

/**
 * 查询用户信息
 */
export const queryUserInfo: () => Promise<any> = () => {
  return http.post('/tenacity-manage/api/user/getuserdetail', {});
};

/**
 * 根据手机号获取识别码
 * @param param
 */
export const getPhoneIdentifier: HttpFunction = (param: Object) => {
  return http.get('/auth-service/api/wechat/get_mobile_hashcode', param);
};
