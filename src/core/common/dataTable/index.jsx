import React, { useEffect, useState } from "react";
import { Spin, Table } from "antd";
import { DatatableProps } from "../../data/interface"; // Ensure correct path
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import { useSelector } from "react-redux";

const Datatable= ({ columns, dataSource, loading,totalCount,onPageChange }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    total: totalCount,
    showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} results`,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30'],
    onChange: (page, pageSize) => {
      setPaginationConfig({
        ...paginationConfig,
        current: page,
        pageSize: pageSize,
      });
    },
    itemRender: (page, type, originalElement) => {
      if (type === 'prev') {
        return <RiArrowLeftWideLine />;
      }
      if (type === 'next') {
        return <RiArrowRightWideLine />;
      }
      return originalElement;
    },
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };




  useEffect(() => {
    setPaginationConfig((prev) => ({
      ...prev,
      total: totalCount,
    }));
  }, [totalCount]);

  // ➡️ Handle page change
  const handleTableChange = (pagination) => {
    setPaginationConfig((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    // 👇 Call parent handler to fetch new page data
    onPageChange(pagination.current, pagination.pageSize);
  };




  return (
    <>
     
      <Table
        className="table datanew dataTable no-footer"
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        bordered
        scroll={{
          //  x: 'max-content', y: 300,
            scrollToFirstRowOnChange: true }}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />
     
    </>
  );
};

export default Datatable;
