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

  // 🔄 Sync pagination when totalCount changes
  useEffect(() => {
    setPaginationConfig((prev) => ({
      ...prev,
      total: totalCount,
    }));
  }, [totalCount]);

  // 🔄 Handle Table change (page change or page size change)
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    // 🔄 Update local state
    setPaginationConfig((prev) => ({
      ...prev,
      current,
      pageSize,
    }));

    // 🔄 Call parent function to fetch new data
    onPageChange(current, pageSize);
  };

  // ✅ Custom page item rendering (icons for next and prev)
  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return <RiArrowLeftWideLine />;
    }
    if (type === "next") {
      return <RiArrowRightWideLine />;
    }
    return originalElement;
  };

  // ✅ Row selection logic
  // const onSelectChange = (newSelectedRowKeys) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedRowKeys, selectedRows);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 🔄 Keep `itemRender` inside paginationConfig to avoid re-rendering
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
    />
  );
};

export default Datatable;
