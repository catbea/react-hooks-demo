/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-20 10:28:54
 */
/**
 * @description table通用组件
 * @author jser
 * @configData table参数配置
 * @handleTableChange 分页方法,非必
 */
import React from 'react';
import { Table } from 'antd';

// 定义props类型
interface tableProps {
  configData: any;
  handleTableChange?(pagination: Object): void;
  scroll?: Object;
}

const TableComm: React.FC<tableProps> = (configData) => {
  console.log('configData', configData);
  return (
    <Table
      columns={configData.configData.columns}
      dataSource={[...configData.configData.dataSource]}
      rowKey={'taskId' || 'productId'}
      size="middle"
      pagination={configData.configData.pagination}
      onChange={configData.handleTableChange}
      scroll={configData.configData.scroll}
    />
  );
};
export default React.memo(TableComm);
