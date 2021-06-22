/**
 * @name PosterCard
 * @author Lester
 * @date 2021-05-29 13:59
 */

import React, { useContext, useState, useEffect, useImperativeHandle, MutableRefObject } from 'react';
import QRCode from 'qrcode.react';
import Dom2Img from 'dom-to-image';
import { Context } from 'src/store';
import { downloadImage, copyBase64Img } from 'src/utils/base';
import style from './style.module.less';

interface PosterCardProps {
  cardRef?: MutableRefObject<any>;
}

const PosterCard: React.FC<PosterCardProps> = ({ cardRef }) => {
  const { userInfo } = useContext(Context);
  const [postUrl, setPostUrl] = useState<string>('');

  /**
   * dom转换成图片
   */
  const domToImage = async () => {
    const postEle = document.getElementById('post-card');
    const url: string = await Dom2Img.toPng(postEle!);
    setPostUrl(url);
  };

  useImperativeHandle(cardRef, () => ({
    downloadImage: () => downloadImage(postUrl, '名片'),
    copyImg: () => copyBase64Img(postUrl, true)
  }));

  useEffect(() => {
    domToImage();
  }, []);

  return (
    <div className={style.cardWrap}>
      <div style={{ display: postUrl ? 'none' : 'block' }} className={style.postCard} id="post-card">
        <div className={style.cardContent}>
          <div className={style.infoWrap}>
            <img className={style.avatar} src={require('src/assets/images/bg.jpg')} alt="" />
            <div className={style.info}>
              <div className={style.name}>{userInfo.name}</div>
              <div className={style.moreInfo}>18820186926</div>
              <div className={style.moreInfo}>XX银行 信用卡中心 第三组</div>
            </div>
          </div>
          <QRCode value={'https://baidu.com'} size={56} />
        </div>
        <div className={style.cardDesc}>添加我的企业微信，为您提供专业的保险服务</div>
      </div>
      <img className={style.posterImg} src={postUrl} alt="" />
    </div>
  );
};

export default PosterCard;
