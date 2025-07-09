import React, { useEffect, useState } from "react";
import { Spin, Table } from "antd";
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";

const Datatable = ({
  columns,
  dataSource,
  loading,
  totalCount,
  onPageChange,
  onRowSelectionChange,
  rowKey,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `Showing ${range[0]}–${range[1]} of ${total} results`,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "30"],
    total: totalCount,
  });

  useEffect(() => {
    setPaginationConfig((prev) => ({
      ...prev,
      total: totalCount,
    }));
  }, [totalCount]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPaginationConfig((prev) => ({
      ...prev,
      current,
      pageSize,
    }));

    onPageChange(current, pageSize);
  };

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return <RiArrowLeftWideLine />;
    }
    if (type === "next") {
      return <RiArrowRightWideLine />;
    }
    return originalElement;
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedRowKeys, selectedRows);
    }
  };

  console.log(selectedRowKeys, "selected row keys");

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const paginationProps = {
    ...paginationConfig,
    itemRender,
  };

  return (
    <Table
      className="table datanew dataTable no-footer"
      rowSelection={rowSelection}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      tableLayout="fixed"
      bordered
      scroll={{
        scrollToFirstRowOnChange: true,
      }}
      pagination={paginationProps}
      onChange={handleTableChange}
      rowKey={rowKey}
    />
  );
};

export default Datatable;
