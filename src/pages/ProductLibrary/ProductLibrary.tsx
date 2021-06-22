/**
 * @Descripttion: 产品库
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-27 14:16:59
 */

import React, { useState, Fragment, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import style from './style.module.less';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, Select, DatePicker, Button, Space, Card, Input, message } from 'antd';
import { FormInstance } from 'antd/lib/form';

import { TableComm } from 'src/components';
import classNames from 'classnames';
import moment from 'moment';
import { productList, productManage } from 'src/apis/marketing';

const ProductLibrary: React.FC<RouteComponentProps> = ({ history }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const formRef = React.createRef<FormInstance>();

  const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }]
  };
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  // 1-未上架、2-已上架、3-已下架
  const statusHanlde = (status: number) => {
    switch (status) {
      case 1:
        return '未上架';
      case 2:
        return '已上架';
      case 3:
        return '已下架';
    }
  };
  interface paramsType {
    productName: String | null;
    category: String | null;
    onlineTimeBegin: String | null;
    onlineTimeEnd: String | null;
    status: String | null;
    pageNum: number | null;
    pageSize: number | null;
  }
  const [params, setParams] = useState<paramsType>({
    productName: '',
    category: '',
    onlineTimeBegin: '',
    onlineTimeEnd: '',
    status: '',
    pageNum: 1,
    pageSize: 10
  });

  interface paginationType {
    current: number;
    pageSize: number;
    showPagination: boolean;
    showQuickJumper: boolean;
    showSizeChanger: boolean;
    total: number;
  }
  const [pagination, setPagination] = useState<paginationType>({
    current: 1,
    pageSize: 10,
    showPagination: false, // 是否要展示分页
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0
  });
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 查询产品列表
  const getExcelListByParams = async () => {
    // console.log('params', params);
    const res: any = await productList(params);
    console.log(res);
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };
  const initgetExcelListByParams = async () => {
    params.pageNum = 1;
    const res: any = await productList(params);
    console.log(res);
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };
  // 上架
  const putOnShelf = async (obj: any) => {
    console.log(obj);
    const res = await productManage({
      type: 1,
      productId: obj.productId
    });
    if (res) {
      message.success('上架成功');
      initgetExcelListByParams();
    }
  };
  // 下架
  const putOffShelf = async (obj: any) => {
    const res = await productManage({
      type: 2,
      productId: obj.productId
    });
    if (res) {
      message.success('下架成功');
      initgetExcelListByParams();
    }
  };
  // 编辑
  const edit = (obj: any) => {
    history.push('/productLibrary/productConfig', { id: obj.productId, type: '2' });
  };
  // 删除产品
  const deleteProduct = async (obj: any) => {
    const res = await productManage({
      type: 3,
      productId: obj.productId
    });
    if (res) {
      message.success('删除成功');
      initgetExcelListByParams();
    }
  };
  // 查看
  const checkDetail = (obj: any) => {
    history.push('/productLibrary/productConfig', { id: obj.productId, type: '1' });
  };
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 200
    },
    {
      title: '产品分类',
      dataIndex: 'categoryName',
      align: 'center',
      width: 80,
      render: (categoryName: String) => {
        return <span className={style.categoryName}>交通{categoryName}</span>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 120
    },
    {
      title: '上架时间',
      dataIndex: 'onlineTime',
      align: 'center',
      width: 120
    },
    {
      title: '下架时间',
      dataIndex: 'offlineTime',
      align: 'center',
      width: 120
    },
    {
      title: '产品状态',
      dataIndex: 'status',
      align: 'center',
      className: 'status-color',
      width: 100,
      render: (status: number) => {
        return (
          <a className="status-color">
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': status === 1,
                  'status-point-green': status === 2,
                  'status-point-red': status === 3
                }
              ])}
            ></i>
            {statusHanlde(status)}
          </a>
        );
      }
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'status',
      align: 'center',
      fixed: 'right',
      render: (status: number, obj: any) => (
        <Space size="middle">
          <a onClick={() => checkDetail(obj)}>查看</a>
          {status === 1 && <a onClick={() => edit(obj)}>编辑</a>}
          {(status === 1 || status === 3) && <a onClick={() => putOnShelf(obj)}>上架</a>}
          {status === 2 && <a onClick={() => putOffShelf(obj)}>下架</a>}
          {status === 3 && <a onClick={() => deleteProduct(obj)}>删除</a>}
        </Space>
      )
    }
  ];
  const [statusList] = useState<any[]>([
    { label: '全部', value: '' },
    { label: '未上架', value: '1' },
    { label: '已上架', value: '2' },
    { label: '已下架', value: '3' }
  ]);
  const [productCategoryList] = useState<any[]>([
    { label: '全部', value: '' },
    { label: '车险', value: '' },
    { label: '重疾险', value: '0' },
    { label: '医疗险', value: '1' },
    { label: '意外险', value: '2' },
    { label: '其他', value: '3' }
  ]);

  // 分页处理
  const handleTableChange = (pagination: paginationType) => {
    setParams({
      ...params,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    });
    getExcelListByParams();
    console.log('点击分页', pagination);
  };
  const addHandle = () => {
    history.push('/productLibrary/productConfig');
  };
  const addFeaturHandle = () => {
    history.push('/productLibrary/productFeatureConfig');
  };
  const onGenderChange = (value: string) => {
    console.log('选择的值', value);
  };
  const onReset = () => {
    console.log('充值', formRef);
    formRef.current!.resetFields();
  };

  const onFinish = async (fieldsValue: any) => {
    console.log('fieldsValue', fieldsValue);
    const rangeValue = fieldsValue['range-picker'];
    const { productName, category, status } = fieldsValue;
    let values: any;
    if (rangeValue) {
      values = [moment(rangeValue[0]._d).format('YYYY-MM-DD'), moment(rangeValue[1]._d).format('YYYY-MM-DD')];
    }
    console.log('Success:', values);
    setParams((params: paramsType) => {
      params.pageNum = 1;
      params.productName = productName || null;
      params.category = category || null;
      params.status = status || null;
      params.onlineTimeBegin = values ? values[0] : null;
      params.onlineTimeEnd = values ? values[1] : null;
      return params;
    });

    setPagination({
      ...pagination,
      current: 1
    });

    getExcelListByParams();
  };

  useEffect(() => {
    params.productName = null;
    params.productName = null;
    params.category = null;
    params.status = null;
    params.onlineTimeBegin = null;
    params.onlineTimeEnd = null;
    getExcelListByParams();
  }, []);

  return (
    <Fragment>
      <div className={style.addFriendBox}>
        <Card title="产品库列表">
          <div className={style.addFriendContent}>
            <div className={style.addFriendPanel}>
              <Button
                type="primary"
                onClick={addHandle}
                shape="round"
                icon={<PlusOutlined />}
                size="large"
                style={{ width: 128 }}
              >
                添加
              </Button>
              <Button
                type="primary"
                onClick={addFeaturHandle}
                shape="round"
                icon={<PlusOutlined />}
                size="large"
                style={{ width: 128, marginLeft: 40 }}
              >
                当月精选
              </Button>
            </div>
            <div className={style.addFriendSearchBox}>
              <Form {...layout} ref={formRef} labelAlign="right" form={form} name="control-hooks" onFinish={onFinish}>
                <Row gutter={24}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item name="productName" label="产品名称：">
                      <Input placeholder="请输入" allowClear />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Form.Item name="category" label="产品分类：">
                      <Select placeholder="请选择" onChange={onGenderChange} allowClear>
                        {productCategoryList.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item name="range-picker" label="时间：">
                      <RangePicker showTime format="YYYY-MM-DD" {...rangeConfig} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <Form.Item name="status" label="状态：">
                      <Select placeholder="请选择状态" onChange={onGenderChange} allowClear>
                        {statusList.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={5}>
                    <Form.Item {...layout}>
                      <Button type="primary" shape="round" htmlType="submit">
                        查询
                      </Button>
                      <Button htmlType="button" shape="round" onClick={onReset} style={{ marginLeft: 10 }}>
                        重置
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={style.tableBox}>
              <TableComm
                configData={{ columns, dataSource, pagination }}
                handleTableChange={handleTableChange}
                scroll={{ x: 1500 }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};
export default ProductLibrary;
