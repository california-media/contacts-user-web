import React, { useEffect, useRef, useState } from "react";
import { Spin, Table } from "antd";

const Datatable = ({
  columns,
  dataSource,
  loading,
  isLoading,
  totalCount,
  onPageChange,
  onRowSelectionChange,
  rowKey,
  scrollX
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const tableRef = useRef(null);

  const pageSize = 20;

  useEffect(() => {
    const onWindowScroll = () => console.log("window scrolled");
    window.addEventListener("scroll", onWindowScroll);
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, []);

  useEffect(() => {
    const container = tableRef.current?.querySelector(".ant-table-container");

    if (!container) {
      console.warn("❌ .ant-table-container not found. Waiting...");
      return;
    }

    const handleContainerScroll = () => {
      if (isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      console.log("🌀 Scrolling .ant-table-container");
      console.log({ scrollTop, scrollHeight, clientHeight });

      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom) {
        if (dataSource.length < totalCount) {
          const nextPage = Math.ceil(dataSource.length / pageSize) + 1;
          console.log(`📤 Fetching next page: ${nextPage}`);
          onPageChange(nextPage, pageSize);
        } else {
          console.log("✅ All data loaded.");
        }
      }
    };

    container.addEventListener("scroll", handleContainerScroll);
    console.log("📌 Attached scroll listener to .ant-table-container");

    return () => {
      container.removeEventListener("scroll", handleContainerScroll);
      console.log("🔌 Removed scroll listener from .ant-table-container");
    };
  }, [dataSource, isLoading, totalCount]);

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (onRowSelectionChange) {
      onRowSelectionChange(newSelectedRowKeys, selectedRows);
    }
  };

  return (
    <div ref={tableRef}>
      <Table
        className="table datanew dataTable no-footer"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        columns={columns}
        isLoading={isLoading}
        dataSource={dataSource}
        tableLayout="fixed"
        bordered
        pagination={false}
        scroll={{ y: "calc(100vh - 325px)",x: scrollX }}
        rowKey={rowKey}
      />
      {isLoading && (
        <div className="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Datatable;