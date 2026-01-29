import { Row, Col, Card } from "antd";
import { Bar, Line, Pie } from "@ant-design/charts";
import { useThemeStore } from "../store/useThemeStore";

// 示例数据
const barData = [
  { name: '一月', value: 120 },
  { name: '二月', value: 200 },
  { name: '三月', value: 150 },
  { name: '四月', value: 240 },
  { name: '五月', value: 180 },
  { name: '六月', value: 300 },
];

const lineData = [
  { name: '一月', value: 100 },
  { name: '二月', value: 130 },
  { name: '三月', value: 180 },
  { name: '四月', value: 150 },
  { name: '五月', value: 200 },
  { name: '六月', value: 250 },
];

const pieData = [
  { type: '类别一', value: 30 },
  { type: '类别二', value: 40 },
  { type: '类别三', value: 20 },
  { type: '类别四', value: 10 },
];

// src/pages/Dashboard.tsx
export default function Dashboard() {
  const { siderTheme } = useThemeStore();

  // 检查主题值
  console.log('Current theme:', siderTheme);

  // 根据主题获取图表颜色
  const isLightTheme = siderTheme === 'light';
  const chartTextColor = isLightTheme ? '#333' : '#fff';
  const barColor = isLightTheme ? '#1890ff' : '#177ddc';
  const lineColor = isLightTheme ? '#52c41a' : '#49aa19';

  // 图表主题配置
  const chartTheme = isLightTheme ? 'light' : 'dark';

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">欢迎使用后台管理系统！</h2>
      <p className="mb-6">这是首页页面，以下是数据统计图表。</p>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="柱状图示例" className="border-0" size="small">
            <Bar
              data={barData}
              xField="name"
              yField="value"
              color={barColor}
              label={{
                position: 'top',
                style: {
                  fill: chartTextColor,
                },
              }}
              xAxis={{
                label: {
                  autoHide: true,
                  autoRotate: false,
                  style: {
                    fill: chartTextColor,
                  },
                },
                tickLine: {
                  stroke: chartTextColor,
                },
                line: {
                  stroke: chartTextColor,
                },
              }}
              yAxis={{
                label: {
                  style: {
                    fill: chartTextColor,
                  },
                },
                tickLine: {
                  stroke: chartTextColor,
                },
                line: {
                  stroke: chartTextColor,
                },
              }}
              grid={{
                horizontalLine: {
                  stroke: isLightTheme ? '#e8e8e8' : '#444',
                },
                verticalLine: {
                  stroke: isLightTheme ? '#e8e8e8' : '#444',
                },
              }}
              meta={{
                value: {
                  alias: '数值',
                },
              }}
              theme={chartTheme}
              height={200}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="折线图示例" className="border-0" size="small">
            <Line
              data={lineData}
              xField="name"
              yField="value"
              color={lineColor}
              label={{
                position: 'top',
                style: {
                  fill: chartTextColor,
                },
              }}
              xAxis={{
                label: {
                  autoHide: true,
                  autoRotate: false,
                  style: {
                    fill: chartTextColor,
                  },
                },
                tickLine: {
                  stroke: chartTextColor,
                },
                line: {
                  stroke: chartTextColor,
                },
              }}
              yAxis={{
                label: {
                  style: {
                    fill: chartTextColor,
                  },
                },
                tickLine: {
                  stroke: chartTextColor,
                },
                line: {
                  stroke: chartTextColor,
                },
              }}
              grid={{
                horizontalLine: {
                  stroke: isLightTheme ? '#e8e8e8' : '#444',
                },
                verticalLine: {
                  stroke: isLightTheme ? '#e8e8e8' : '#444',
                },
              }}
              meta={{
                value: {
                  alias: '数值',
                },
              }}
              theme={chartTheme}
              height={200}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="饼图示例" className="border-0" size="small">
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              radius={0.6}
              label={{
                content: (datum: any) => {
                  // 安全检查：确保datum和datum.data存在
                  if (datum && datum.data) {
                    return `${datum.data.type}: ${datum.data.value}`;
                  }
                  return '';
                },
                style: {
                  fill: chartTextColor,
                },
              }}
              interactions={[
                {
                  type: 'element-active',
                },
              ]}
              theme={chartTheme}
              height={266}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="数据表格示例" className="border-0" size="small">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                      名称
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                      数值
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                      状态
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {barData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {item.value}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          正常
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
