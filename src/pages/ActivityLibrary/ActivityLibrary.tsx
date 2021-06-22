/**
 * @Descripttion: 产品库
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-27 14:16:59
 */

import React, { useState, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import style from './style.module.less';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, Select, Button, Space, Card, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';

import { TableComm } from 'src/components';
import classNames from 'classnames';
// import moment from 'moment';
import { activityList } from 'src/apis/marketing';

const ActivityLibrary: React.FC<RouteComponentProps> = ({ history }) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const formRef = React.createRef<FormInstance>();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const downloadHandle = (text: any) => {
    console.log('text', text);
  };
  const checkDetail = () => {
    history.push('/productLibrary/productConfig', { id: 'asdas', type: '1' });
  };

  // 0上传中, 1已分发 2=待分发 3=分发中 9=异常
  const statusHanlde = (status: String) => {
    switch (status) {
      case '0':
        return '上传中';
      case '1':
        return '已分发';
      case '2':
        return '待分发';
      case '3':
        return '分发中';
      case '9':
        return '异常';
    }
  };

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      width: 200
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120
    },
    {
      title: '上架时间',
      dataIndex: 'onlineTime',
      width: 120
    },
    {
      title: '下架时间',
      dataIndex: 'offlineTime',
      width: 120
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      className: 'status-color',
      width: 100,
      render: (status: String) => {
        return (
          <a className="status-color">
            <i className={classNames('status-point', status !== 'tom' ? ' status-point-gray' : ' ')}></i>
            {statusHanlde(status)}
          </a>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (text: String) => (
        <Space size="middle">
          <a onClick={() => checkDetail()}>查看</a>
          <a onClick={() => downloadHandle(text)}>编辑</a>
          <a onClick={() => downloadHandle(text)}>上架</a>
          <a onClick={() => downloadHandle(text)}>下架</a>
          <a onClick={() => downloadHandle(text)}>删除</a>
        </Space>
      )
    }
  ];

  const [statusList] = useState<any[]>([
    { label: '全部', value: '' },
    { label: '未上架', value: '0' },
    { label: '已上架', value: '1' },
    { label: '已下架', value: '2' }
  ]);
  const [total] = useState<number>(20);

  interface paramsType {
    activityName: String;
    status: String;
    pageNum: number;
    pageSize: number;
  }
  const [params, setParams] = useState<paramsType>({
    activityName: '',
    status: '',
    pageNum: 0,
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
    total: total
  });
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 查询活动列表
  const getExcelListByParams = async () => {
    console.log('params1111', params);
    const res: any = await activityList(params);
    console.log(res);
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };
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
    history.push('/activityLibrary/activityConfig', { id: 'asdas' });
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
    const { activityName, status } = fieldsValue;
    setParams({
      ...params,
      status: status || null,
      activityName: activityName || null
    });
    setPagination({
      ...pagination,
      current: 1
    });
    console.log('这里');

    getExcelListByParams();
  };

  // const configData = {
  //   columns: columns,
  //   dataSource: data,
  //   pagination: pagination
  // };
  return (
    <Fragment>
      <div className={style.addFriendBox}>
        <Card title="活动库列表">
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
            </div>
            <div className={style.addFriendSearchBox}>
              <Form {...layout} ref={formRef} labelAlign="left" form={form} name="control-hooks" onFinish={onFinish}>
                <Row gutter={24}>
                  <Col className="gutter-row" span={7}>
                    <Form.Item name="activityName" label="产品名称：">
                      <Input placeholder="请输入" allowClear />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={5}>
                    <Form.Item name="status" label="状态：">
                      <Select placeholder="请选择" onChange={onGenderChange} allowClear>
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
export default ActivityLibrary;
