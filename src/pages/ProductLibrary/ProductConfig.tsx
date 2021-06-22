/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-28 11:18:11
 */
import React, { useState, useEffect } from 'react';
// import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, Form, Input, FormProps, Upload, message, Button, Select, Space } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import style from './style.module.less';
import { productEdit, uploadImg, productConfig, productDetail } from 'src/apis/marketing';

interface productConfigProps {
  id: number;
  type: number;
  location: any;
}
const ProductConfig: React.FC<productConfigProps> = (props) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const [highlights, setHighlights] = useState<string>('0');
  const [posterImgUrl, setPosterImgUrl] = useState<string>('');
  const [shareCoverImgUrl, setShareCoverImgUrl] = useState<string>('');
  const [premiumValue, setPremiumValue] = useState<string>('0');
  const [initialValues, setInitialValues] = useState<any>({});

  const [productCategoryList, setProductCategoryList] = useState<any[]>([]);
  const [familyecurityList, setFamilyecurityList] = useState<any[]>([]);
  const [guaranteeScenarioList, setGuaranteeScenarioList] = useState<any[]>([]);
  const [guaranteeObjectList, setGuaranteeObjectList] = useState<any[]>([]);
  const [premiumTypeList, setPremiumTypeList] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [shareImageUrl, setShareImageUrl] = useState<string>();
  // type Currency = '日' | '月' | '年';
  const [currency, setCurrency] = useState<string>('20');

  const { location } = props;
  console.log('location', location);
  const state = location.state || null;
  const id = (state && state.id) || '';
  const type = (state && state.type) || '0';

  // 获取详情
  const getProductDetail = async () => {
    const res = await productDetail({ productId: id });
    console.log('detail', res);
    if (res) {
      setInitialValues((initialValues: any) => {
        initialValues.productName = res.productName;
        initialValues.corpProductId = res.corpProductId;
        initialValues.corpProductLink = res.corpProductLink;
        initialValues.categoryId = res.categoryId;
        initialValues.familyEnsureId = res.familyEnsureId;
        initialValues.ensureTargetId = res.ensureTargetId;
        initialValues.ensureSceneId = res.ensureSceneId;
        initialValues.premiumTypeId = res.premiumTypeId;
        initialValues.speechcraft = res.speechcraft;
        initialValues.posterName = res.posterName;
        initialValues.shareTitle = res.shareTitle;
        initialValues.posterImgUrl = [{ url: res.posterImgUrl }];
        initialValues.shareCoverImgUrl = [{ url: res.shareCoverImgUrl }];
        return initialValues;
      });
      setHighlights(res.highlights);
      setPremiumValue(res.premium);
      setCurrency(res.premiumTypeId);
      res.posterImgUrl && setImageUrl(res.posterImgUrl);
      res.posterImgUrl && setPosterImgUrl(res.posterImgUrl);
      res.shareCoverImgUrl && setShareImageUrl(res.shareCoverImgUrl);
      res.shareCoverImgUrl && setShareCoverImgUrl(res.shareCoverImgUrl);
      form.setFieldsValue(initialValues);
    }
  };

  const formItemLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 10 }
  };

  const onGenderChange = (value: string) => {
    console.log('选择的值', value);
    setCurrency(value);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const uploadShareButton = (
    <div>
      {shareLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const getBase64 = (img: any, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPremiumValue(e.target.value);
  };

  const onCurrencyChange = (newCurrency: any) => {
    console.log('newCurrency', newCurrency);
    setCurrency(newCurrency);
  };
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  /** 海报图片 */
  const posterBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const posterUploadFile = async (option: any) => {
    // 创建一个空对象实例
    console.log('option', option);
    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', option.file);
    const res: any = await uploadImg(uploadData);
    console.log('res', res);
    if (res) {
      setPosterImgUrl(res);
      setImageUrl(res);
      setLoading(false);
    }
  };
  const posterHandleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        // setImageUrl(imageUrl);
        console.log(imageUrl);
      });
    }
  };
  /** 分享图片 */
  const shareCoverBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const shareCoverUploadFile = async (option: any) => {
    // 创建一个空对象实例
    console.log('option', option);

    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', option.file);
    const res: any = await uploadImg(uploadData);
    console.log('res', res);
    if (res) {
      setShareCoverImgUrl(res);
      setShareImageUrl(res);
      setShareLoading(false);
    }
  };
  const shareCoverHandleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setShareLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setShareLoading(false);
        // setImageUrl(imageUrl);
        console.log(imageUrl);
      });
    }
  };
  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    const {
      productName,
      corpProductId,
      corpProductLink,
      categoryId,
      familyEnsureId,
      ensureTargetId,
      ensureSceneId,
      speechcraft,
      posterName,
      shareTitle
    } = values;
    // const highlights = '专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为；专项重疾的等待服务专项重疾服务为';
    const highlightList = highlights.split('；');
    for (const i in highlightList) {
      if (highlightList[i].length > 16) {
        console.log('两点字数不能超过16个字');
        return;
      }
    }
    const editParams = {
      productId: id || null,
      productName,
      corpProductId,
      corpProductLink,
      categoryId,
      familyEnsureId,
      ensureTargetId,
      ensureSceneId,
      premium: premiumValue,
      premiumTypeId: currency,
      speechcraft,
      highlights,
      posterName,
      posterImgUrl,
      shareCoverImgUrl,
      shareTitle
    };
    const res = await productEdit(editParams);
    if (res) {
      message.success('编辑成功！');
    }
  };
  // 获取配置列表
  const getProductConfig = async () => {
    const res = await productConfig({ type: [1, 2, 3, 4, 5] });
    if (res) {
      setProductCategoryList(res.productTypeList);
      setFamilyecurityList(res.areaList);
      setGuaranteeScenarioList(res.sceneList);
      setGuaranteeObjectList(res.objectList);
      setPremiumTypeList(res.premiumTypeList || []);
    }
  };
  const highlightsChange = (e: any) => {
    setHighlights(e.target.value);
  };

  useEffect(() => {
    getProductConfig();
    id && getProductDetail();
  }, []);
  return (
    <Card title="新增产品">
      <Form form={form} name="validate_other" {...formItemLayout} onFinish={onFinish}>
        <Form.Item label="产品名称：" name="productName" rules={[{ required: true, message: '请输入产品名称' }]}>
          <Input maxLength={16} />
        </Form.Item>
        <Form.Item label="产品ID：" name="corpProductId">
          <Input />
        </Form.Item>
        <Form.Item label="产品链接：" name="corpProductLink" rules={[{ required: true, message: '请输入产品链接' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="categoryId" label="产品分类：" rules={[{ required: true, message: '请选择产品分类' }]}>
          <Select placeholder="请选择" onChange={onGenderChange} allowClear>
            {productCategoryList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="familyEnsureId" label="家庭保障：">
          <Select placeholder="请选择" onChange={onGenderChange} allowClear>
            {familyecurityList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="ensureSceneId" label="保障场景：">
          <Select placeholder="请选择" onChange={onGenderChange} allowClear>
            {guaranteeScenarioList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="ensureTargetId" label="保障对象：">
          <Select placeholder="请选择状态" onChange={onGenderChange} allowClear>
            {guaranteeObjectList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="premium" label="保费金额：">
          <Space direction="horizontal">
            <Input type="text" onChange={onNumberChange} value={premiumValue} style={{ width: 100 }} />
            元起
            <Select style={{ width: 80, margin: '0 8px' }} value={currency} onChange={onCurrencyChange}>
              {premiumTypeList.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Space>
        </Form.Item>
        <Form.Item label="产品亮点：" rules={[{ required: true, message: '请输入活动名称' }]}>
          <div className={style.textAreaBox}>
            <Input.TextArea
              bordered={false}
              value={highlights}
              placeholder="示例文字"
              onChange={highlightsChange}
              autoSize={{ minRows: 4 }}
            />
            <p className={style.txtLimit}>限10条，且每条亮点字数不超过16个字</p>
          </div>
        </Form.Item>
        <Form.Item name="speechcraft" label="营销话术：" rules={[{ required: true, message: '请输入活动名称' }]}>
          <Input.TextArea maxLength={300} showCount placeholder="示例文字" autoSize={{ minRows: 4 }} />
        </Form.Item>
        {/* </Form> */}
        <Card
          style={{ marginTop: 40 }}
          className="customer-add-box"
          type="inner"
          title="产品海报"
          extra=" 说明：如无配置，则该模块不展示"
        >
          {/* <Form form={form} name="share_other" {...shareLayout} onFinish={onFinish}> */}
          <Row gutter={24}>
            <Col className="gutter-row" span={15}>
              <Form.Item
                label="海报："
                name="posterImgUrl"
                getValueFromEvent={normFile}
                valuePropName="fileList"
                rules={[{ required: true, message: '请上传海报' }]}
                extra="为确保最佳展示效果，请上传750*1334像素高清图片，仅支持.jpg格式"
              >
                <Upload
                  multiple={false}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={posterUploadFile}
                  beforeUpload={posterBeforeUpload}
                  onChange={posterHandleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item
                label="海报名称："
                labelAlign="right"
                name="posterName"
                rules={[{ required: true, message: '请输入海报名称' }]}
              >
                <Input style={{ width: 400 }} />
              </Form.Item>
            </Col>
          </Row>
          {/* </Form> */}
        </Card>
        <Card style={{ marginTop: 40 }} type="inner" title="分享设置">
          {/* <Form form={form} name="share_other" {...shareLayout} onFinish={onFinish}> */}
          <Row gutter={24}>
            <Col className="gutter-row" span={15}>
              <Form.Item
                label="分享封面图："
                name="shareCoverImgUrl"
                getValueFromEvent={normFile}
                valuePropName="fileList"
                rules={[{ required: true, message: '请上传分享封面图' }]}
                extra="为确保最佳展示效果，请上传132*132像素高清图片，仅支持.jpg格式"
              >
                <Upload
                  multiple={false}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={shareCoverUploadFile}
                  beforeUpload={shareCoverBeforeUpload}
                  onChange={shareCoverHandleChange}
                >
                  {shareImageUrl
                    ? (
                    <img src={shareImageUrl} alt="avatar" style={{ width: '100%' }} />
                      )
                    : (
                        uploadShareButton
                      )}
                </Upload>
              </Form.Item>
              <Form.Item
                label="小标题："
                labelAlign="right"
                name="shareTitle"
                rules={[{ required: true, message: '请输入小标题' }]}
              >
                <Input style={{ width: 400 }} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              分享给客户样例展示
            </Col>
          </Row>
          {/* </Form> */}
        </Card>
        {type !== '1' && (
          <div style={{ textAlign: 'center', width: 1000, marginTop: 32 }}>
            <Button type="primary" shape="round" htmlType="submit" size="large" style={{ width: 128 }}>
              确定
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
};
export default ProductConfig;
