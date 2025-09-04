import React from "react";
import { Table } from "antd";

const Datatable = ({
  columns,
  dataSource,
  isLoading,
  totalCount,
  rowKey,
  scrollX = false,
}) => {
  return (
    <div>
      <Table
        className="table datanew dataTable no-footer"
        columns={columns}
        dataSource={dataSource}
        tableLayout="fixed"
        bordered
        pagination={false}
        scroll={{ y: "calc(100vh - 325px)", x: scrollX }}
        rowKey={rowKey}
        loading={isLoading}
      />
    </div>
  );
};

export default Datatable;
