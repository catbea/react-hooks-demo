/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-28 11:13:50
 */

import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Row, Col, Card, Form, FormProps, Upload, message, Button, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const ProductFeatureConfig: React.FC<RouteComponentProps> = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  // 每一项的样式
  const getItemStyle = () => ({
    height: 'auto',
    marginBottom: '20px',
    width: '100%'
  });
  const indexFormat = (index: number) => {
    switch (index) {
      case 1:
        return '一';
      case 2:
        return '二';
      case 3:
        return '三';
      case 4:
        return '四';
    }
  };
  const [productCategoryList] = useState<any[]>([
    { label: '全部', value: '' },
    { label: '车险', value: '' },
    { label: '重疾险', value: '0' },
    { label: '医疗险', value: '1' },
    { label: '意外险', value: '2' },
    { label: '其他', value: '3' }
  ]);

  const shareLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
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

  // 重新记录数组顺序
  // const reorder = (list: any, startIndex: number, endIndex: number) => {
  //   const result = Array.from(list);
  //   // 删除并记录 删除元素
  //   const [removed] = result.splice(startIndex, 1);
  //   // 将原来的元素添加进数组
  //   result.splice(endIndex, 0, removed);
  //   return result;
  // };

  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    if (data.length === 0) {
      // 初始化数据
      const newData = Array.from({ length: 4 }, (item, index) => ({ key: 'key' + index }));
      setData(newData);
    }
  }, [data]);

  // 拖拽结束
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    console.log('result', result);

    // 获取拖拽后的数据 重新赋值
    // const newData = reorder(data, result.source.index, result.destination.index);
    // setData(newData);
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
  const onGenderChange = (value: string) => {
    console.log('选择的值', value);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
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
    <Card title="当月精选">
      <Form form={form} name="share_other" {...shareLayout} onFinish={onFinish}>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* direction代表拖拽方向  默认垂直方向  水平方向:horizontal */}
          <Droppable droppableId="droppable">
            {(provided: any) => (
              // 这里是拖拽容器 在这里设置容器的宽高等等...
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {/* 这里放置所需要拖拽的组件,必须要被 Draggable 包裹 */}
                {/* {data.map((item, index) => ( */}
                <Draggable index={1} draggableId={'1'}>
                  {(provided: any) => (
                    // 在这里写你的拖拽组件的样式 dom 等等...
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...getItemStyle(), ...provided.draggableProps.style }}
                    >
                      <Card className="customer-add-box" type="inner" title={`精选产品${indexFormat(1)}`}>
                        <Row gutter={24}>
                          <Col className="gutter-row" span={24}>
                            <Form.Item
                              label="产品名称："
                              labelAlign="right"
                              name="productId"
                              rules={[{ required: true, message: '请选择产品名称：' }]}
                            >
                              <Select placeholder="请选择" style={{ width: 400 }} onChange={onGenderChange} allowClear>
                                {productCategoryList.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.value}>
                                      {item.label}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              label="banner图片："
                              name="bannerImgUrl"
                              getValueFromEvent={normFile}
                              valuePropName="fileList"
                              rules={[{ required: true, message: '请上传banner图片：' }]}
                              extra="为确保最佳展示效果，请上传1136*276像素高清图片，仅支持.jpg格式"
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
                                {imageUrl
                                  ? (
                                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                    )
                                  : (
                                      uploadButton
                                    )}
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  )}
                </Draggable>
                <Draggable index={2} draggableId={'2'}>
                  {(provided: any) => (
                    // 在这里写你的拖拽组件的样式 dom 等等...
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...getItemStyle(), ...provided.draggableProps.style }}
                    >
                      <Card className="customer-add-box" type="inner" title={`精选产品${indexFormat(2)}`}>
                        <Row gutter={24}>
                          <Col className="gutter-row" span={24}>
                            <Form.Item
                              label="产品名称："
                              labelAlign="right"
                              name="username"
                              rules={[{ required: true, message: '请选择产品名称：' }]}
                            >
                              <Select placeholder="请选择" style={{ width: 400 }} onChange={onGenderChange} allowClear>
                                {productCategoryList.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.value}>
                                      {item.label}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              label="banner图片："
                              name="bannerImgUrl"
                              getValueFromEvent={normFile}
                              valuePropName="fileList"
                              rules={[{ required: true, message: '请上传banner图片：' }]}
                              extra="为确保最佳展示效果，请上传1136*276像素高清图片，仅支持.jpg格式"
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
                                {imageUrl
                                  ? (
                                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                    )
                                  : (
                                      uploadButton
                                    )}
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  )}
                </Draggable>
                <Draggable index={3} draggableId={'3'}>
                  {(provided: any) => (
                    // 在这里写你的拖拽组件的样式 dom 等等...
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...getItemStyle(), ...provided.draggableProps.style }}
                    >
                      <Card className="customer-add-box" type="inner" title={`精选产品${indexFormat(3)}`}>
                        <Row gutter={24}>
                          <Col className="gutter-row" span={24}>
                            <Form.Item
                              label="产品名称："
                              labelAlign="right"
                              name="username"
                              rules={[{ required: true, message: '请选择产品名称：' }]}
                            >
                              <Select placeholder="请选择" style={{ width: 400 }} onChange={onGenderChange} allowClear>
                                {productCategoryList.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.value}>
                                      {item.label}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              label="banner图片："
                              name="bannerImgUrl"
                              getValueFromEvent={normFile}
                              valuePropName="fileList"
                              rules={[{ required: true, message: '请上传banner图片：' }]}
                              extra="为确保最佳展示效果，请上传1136*276像素高清图片，仅支持.jpg格式"
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
                                {imageUrl
                                  ? (
                                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                    )
                                  : (
                                      uploadButton
                                    )}
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  )}
                </Draggable>
                <Draggable index={4} draggableId={'4'}>
                  {(provided: any) => (
                    // 在这里写你的拖拽组件的样式 dom 等等...
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...getItemStyle(), ...provided.draggableProps.style }}
                    >
                      <Card className="customer-add-box" type="inner" title={`精选产品${indexFormat(4)}`}>
                        <Row gutter={24}>
                          <Col className="gutter-row" span={24}>
                            <Form.Item
                              label="产品名称："
                              labelAlign="right"
                              name="username"
                              rules={[{ required: true, message: '请选择产品名称：' }]}
                            >
                              <Select placeholder="请选择" style={{ width: 400 }} onChange={onGenderChange} allowClear>
                                {productCategoryList.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.value}>
                                      {item.label}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              label="banner图片："
                              name="bannerImgUrl"
                              getValueFromEvent={normFile}
                              valuePropName="fileList"
                              rules={[{ required: true, message: '请上传banner图片：' }]}
                              extra="为确保最佳展示效果，请上传1136*276像素高清图片，仅支持.jpg格式"
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
                                {imageUrl
                                  ? (
                                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                    )
                                  : (
                                      uploadButton
                                    )}
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  )}
                </Draggable>
                {/* ))} */}
                {/* 这个不能少 */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ textAlign: 'center', width: 1000, marginTop: 32 }}>
          <Button type="primary" shape="round" htmlType="submit" size="large" style={{ width: 128 }}>
            保存
          </Button>
        </div>
      </Form>
    </Card>
  );
};
export default ProductFeatureConfig;
