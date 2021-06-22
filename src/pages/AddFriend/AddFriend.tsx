/**
 * @author cat
 */

import React, { useState, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import style from './style.module.less';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import Axios from 'axios';
import {
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  // Radio,
  Button,
  Space,
  Modal,
  Card,
  Input,
  Upload,
  message,
  Progress
} from 'antd';
import { FormInstance } from 'antd/lib/form';

import { TableComm } from 'src/components';
// import BatchAddModal from './BatchAddModal';
import classNames from 'classnames';
import moment from 'moment';
import { getFriendList, distribute, uploadFile } from 'src/apis/friend';

const AddFriend: React.FC<RouteComponentProps> = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const formRef = React.createRef<FormInstance>();

  const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }]
  };

  const [statusList, setStatusList] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [data] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [percent, setPercent] = useState<number>(0);
  const [isShowProgress, setIsShowProgress] = useState<boolean>(false);
  // 弹窗配置
  const props = {
    multiple: false,
    onRemove: (file: any) => {
      // this.setState(state => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList([...newFileList]);
    },
    beforeUpload: (file: any) => {
      setFileList([file]);
      return false;
    },
    fileList
  };
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };

  interface paramsType {
    status: String | null;
    opName: String | null;
    startDate: String | null;
    endDate: String | null;
    pageNum: number;
    pageSize: number;
  }
  const [params, setParams] = useState<paramsType>({
    status: '',
    opName: '',
    startDate: '',
    endDate: '',
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
    showTotal?(total: number, range: any): void;
  }
  const [pagination, setPagination] = useState<paginationType>({
    current: 1,
    pageSize: 10,
    showPagination: false, // 是否要展示分页
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
    showTotal: (total: number, range: any) => {
      console.log('分页总数', total, range);
      return `共 ${total} 条`;
    }
  });

  // 下载表格
  const downloadHandle = async (obj: any) => {
    Axios({
      method: 'post',
      url: '/tenacity-manage/api/friend/download_excel',
      headers: { responseType: 'arraybuffer' },
      responseType: 'blob',
      data: { taskId: obj.taskId }
    }).then((response: any) => {
      const blob = new Blob([response.data]);
      console.log('blob', blob);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', obj.taskName);
      document.body.appendChild(link);
      link.click(); // 点击下载
      link.remove(); // 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
    });
  };
  const [dataSource, setDataSource] = useState<any[]>(data);
  // 查询批量加好友列表
  const getExcelListByParams = async () => {
    console.log('params', params);
    const res: any = await getFriendList(params);
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };
  // 分发
  const distributionHandle = async (obj: any) => {
    const res: any = await distribute({ taskId: obj.taskId });
    console.log(res);
    if (res) {
      params.pageNum = 1;
      pagination.current = 1;
      getExcelListByParams();
    }
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
      title: '表格名称',
      dataIndex: 'taskName',
      width: '15%'
    },
    {
      title: '状态',
      dataIndex: 'status',
      className: 'status-color',
      render: (status: String) => {
        return (
          <a className="status-color">
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': status === '0',
                  'status-point-green': status === '1',
                  'status-point-red': status === '9'
                }
              ])}
            ></i>
            {statusHanlde(status)}
          </a>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%'
    },
    {
      title: '操作人',
      dataIndex: 'createBy'
    },
    {
      title: '操作',
      dataIndex: 'status',
      render: (status: string, obj: Object) => (
        <Space size="middle">
          {status === '1' && <a onClick={() => downloadHandle(obj)}>下载表格</a>}
          {status === '9' && <a onClick={() => downloadHandle(obj)}>异常错误</a>}
          {status === '2' && <a onClick={() => distributionHandle(obj)}>开始分发</a>}
        </Space>
      )
    },
    {
      title: '批次通过率',
      dataIndex: 'finishRate',
      width: '20%'
    }
  ];

  // const [pagination, setPagination] = useState<configDataProp>({
  //   columns: columns,
  //   dataSource: data,
  //   pagination: pagination
  // });

  /** 弹窗 */
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 }
  };

  const [formD] = Form.useForm();

  // const [radioValue, setRadioValue] = useState<number>(0);

  // const radioChange = (e: any) => {
  //   console.log('e.target.value', e.target.value);
  //   setRadioValue(e.target.value);
  // };

  // 分页处理
  const handleTableChange = (paginationObj: paginationType) => {
    pagination.current = params.pageNum = paginationObj.current;
    pagination.pageSize = params.pageSize = paginationObj.pageSize;
    getExcelListByParams();
  };
  const addHandle = () => {
    setIsModalVisible(true);
  };

  // 点击确定上传文件
  const handleOk = async () => {
    if (fileList.length === 0) {
      message.success('请先上传文件！');
      return;
    }
    setIsShowProgress(true);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
      formData.append('uploadType', '0');
    });
    const res: any = await uploadFile(formData, (persent: any) => {
      console.log('persent', persent);
      setPercent(persent);
    });
    console.log('res', res);
    if (res) {
      message.success('上传成功！');
      setFileList([]);
      setIsModalVisible(false);
      getExcelListByParams();
    }
    setIsShowProgress(false);
    setPercent(0);
  };

  const onGenderChange = (value: string) => {
    console.log('选择的值', value);
  };

  const onReset = () => {
    console.log('重置', formRef);
    formRef.current!.resetFields();
  };

  const onFinish = async (fieldsValue: any) => {
    const rangeValue = fieldsValue['range-picker'];
    const { operator, status } = fieldsValue;

    let values: any;
    if (rangeValue) {
      values = [moment(rangeValue[0]._d).format('YYYY-MM-DD'), moment(rangeValue[1]._d).format('YYYY-MM-DD')];
    }

    setParams((params: paramsType) => {
      params.pageNum = 1;
      params.status = status || null;
      params.opName = operator || null;
      params.startDate = values ? values[0] : null;
      params.endDate = values ? values[1] : null;
      return params;
    });
    setPagination((pagination) => {
      pagination.current = 1;
      return pagination;
    });

    getExcelListByParams();
  };
  // 文档下载
  const downloadTemplate = () => {
    location.href =
      'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/test/addfri/addfriend_template.csv';
  };
  useEffect(() => {
    // 0上传中, 1已分发 2=待分发 3=分发中 9=异常
    const statusListData = [
      { label: '全部', value: '' },
      { label: '上传中', value: '0' },
      { label: '已分发', value: '1' },
      { label: '待分发', value: '2' },
      { label: '分发中', value: '3' },
      { label: '异常', value: '9' }
    ];
    setStatusList(statusListData);

    params.status = null;
    params.opName = null;
    params.startDate = null;
    params.endDate = null;
    getExcelListByParams();
  }, []);

  return (
    <Fragment>
      <div className={style.addFriendBox}>
        <Card title="批量加好友">
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
              <p className="suggest">分配建议：每次分配后客户经理添加时间只有30分钟，分配过多可能无法完成添加</p>
            </div>
            <div className={style.addFriendSearchBox}>
              <Form {...layout} ref={formRef} labelAlign="left" form={form} name="control-hooks" onFinish={onFinish}>
                <Row gutter={24}>
                  <Col className="gutter-row" span={5}>
                    <Form.Item name="status" label="状态">
                      <Select placeholder="请选择状态" onChange={onGenderChange} allowClear>
                        {' '}
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
                  <Col className="gutter-row" span={6}>
                    <Form.Item name="operator" label="操作人">
                      <Input placeholder="请输入" allowClear />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item name="range-picker" label="创建时间">
                      <RangePicker showTime format="YYYY-MM-DD" {...rangeConfig} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={5}>
                    <Form.Item>
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
              <TableComm configData={{ columns, dataSource, pagination }} handleTableChange={handleTableChange} />
            </div>
          </div>
        </Card>
      </div>
      <Modal
        title="新增批量添加"
        width={620}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={formD} name="validate_other" {...formItemLayout} initialValues={{ radioSelect: 0 }}>
          {/* <Form.Item name="radioSelect" label="信息是否脱敏：">
            <Radio.Group onChange={radioChange}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item> */}
          <Form.Item label="下载模板：">
            {/* {radioValue !== 1 */}
            {/* ? ( */}
            <Button type="primary" ghost onClick={downloadTemplate}>
              文档下载
            </Button>
            {/* ) */}
            {/* : ( */}
            {/* <Fragment>
                <p>脱敏加密算法教程文档</p>
                <Button type="primary" ghost onClick={downloadTemplate}>
                  文档下载
                </Button>
              </Fragment>
                )} */}
          </Form.Item>
          <Form.Item label="脱敏加密算法：">
            <Upload.Dragger {...props}>
              {/* <Button> */}
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">支持excel文本格式，大小不超过10M</p>
              <p className="ant-upload-hint">点击或者拖拽到此处上传</p>
              {/* </Button> */}
              {isShowProgress && <Progress percent={percent} strokeColor="#318CF5" style={{ bottom: -68 }} />}
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default AddFriend;
