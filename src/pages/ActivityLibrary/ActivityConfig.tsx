/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-28 11:18:11
 */
import React, { useState, useEffect } from 'react';
// import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, Form, Input, FormProps, Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

interface productConfigProps {
  id: number;
  type: number;
  location: any;
}

const ActivityConfig: React.FC<productConfigProps> = (props) => {
  const [form] = Form.useForm();
  const formItemLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 10 }
  };
  // const shareLayout: FormProps = {
  //   labelAlign: 'right',
  //   labelCol: { span: 4 },
  //   wrapperCol: { span: 20 }
  // };
  console.log('props', props);

  const [type, setType] = useState<string>('0');

  const { location } = props;
  console.log('location', location);
  const state = location.state;
  const id = state.id;
  useEffect(() => {
    setType(state.type || 0);
  }, []);
  console.log('id', id, type);

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    const { activityName, corpactivityId, corpactivityLink, speechcraft, shareCoverImgUrl, shareTitle } = values;
    const editParams = {
      activityName,
      corpactivityId,
      corpactivityLink,
      speechcraft,
      shareCoverImgUrl,
      shareTitle
    };
    console.log('活动参数', editParams);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const getBase64 = (img: any, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const beforeUpload = (file: any) => {
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
  const uploadFile = (option: any) => {
    // 创建一个空对象实例
    console.log('option', option);

    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', option.file);
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };
  return (
    <Card title="活动配置">
      <Form form={form} name="validate_other" {...formItemLayout} onFinish={onFinish}>
        <Form.Item label="活动名称：" name="activityName" rules={[{ required: true, message: '请输入活动名称' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="活动ID：" name="corpactivityId">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="活动链接：" name="corpactivityLink" rules={[{ required: true, message: '请输入活动链接' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="speechcraft" label="营销话术：">
          <Input.TextArea maxLength={300} showCount placeholder="示例文字" autoSize={{ minRows: 4 }} />
        </Form.Item>
        {/* </Form> */}
        <Card style={{ marginTop: 40 }} type="inner" title="分享设置">
          {/* <Form form={form} name="share_other" {...shareLayout} onFinish={onFinish}> */}
          <Row gutter={24}>
            <Col className="gutter-row" span={17}>
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
                  customRequest={uploadFile}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item
                label="小标题："
                labelAlign="right"
                name="shareTitle"
                rules={[{ required: true, message: '请输入小标题' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={7}>
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
export default ActivityConfig;
