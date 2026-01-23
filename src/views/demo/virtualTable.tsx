import { useState, useMemo } from 'react';
import { Table } from 'antd';
import type { SorterResult, TablePaginationConfig } from 'antd/es/table/interface';

interface UserData {
  id: number;
  name: string;
  age: number;
}

const SimpleVirtualTable: React.FC = () => {
  const [count] = useState(10000);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<UserData>>({
    order: 'ascend',
    field: 'id',
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 100,
    showSizeChanger: true,
    pageSizeOptions: ['100', '200', '500', '1000'],
    showTotal: (total) => `共 ${total} 条数据`,
  });

  // 生成完整数据并应用排序
  const fullData = useMemo<UserData[]>(() => {
    const result: UserData[] = [];
    for (let i = 1; i <= count; i++) {
      result.push({
        id: i,
        name: `name${i}`,
        age: i + 3,
      });
    }

    // 应用排序
    if (sortedInfo.field) {
      result.sort((a, b) => {
        const aValue = a[sortedInfo.field as keyof UserData];
        const bValue = b[sortedInfo.field as keyof UserData];

        if (sortedInfo.order === 'ascend') {
          return aValue > bValue ? 1 : -1;
        } else if (sortedInfo.order === 'descend') {
          return aValue < bValue ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [count, sortedInfo]);

  // 根据分页参数计算当前页数据
  const data = useMemo<UserData[]>(() => {
    const { current = 1, pageSize = 100 } = pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return fullData.slice(start, end);
  }, [fullData, pagination]);

  // 处理表格变化（排序、分页等）
  const handleTableChange = (_: any, filters: any, sorter: SorterResult<UserData>, extra: any) => {
    // 处理排序变化
    if (sorter) {
      const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
      setSortedInfo(singleSorter);
    }
  };

  // 处理分页变化
  const handlePaginationChange = (current: number, pageSize: number) => {
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  };

  // 列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      sorter: (a: { id: number; }, b: { id: number; }) => a.id - b.id,
      defaultSortOrder: 'ascend' as const,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      sorter: (a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      sorter: (a: { age: number; }, b: { age: number; }) => a.age - b.age,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>简单虚拟表格</h1>
      <p>数据量: {count} 条</p>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          ...pagination,
          total: count,
          onChange: handlePaginationChange,
        }}
        scroll={{
          y: 600,
        }}
        virtual
        onChange={(pagination, filters, sorter, extra) => {
          handleTableChange(pagination, filters, Array.isArray(sorter) ? sorter[0] : sorter, extra);
        }}
      />
    </div>
  );
};

export default SimpleVirtualTable;