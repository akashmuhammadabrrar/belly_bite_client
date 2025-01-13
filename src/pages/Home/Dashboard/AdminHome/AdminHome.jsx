import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { FaRegCreditCard, FaTruckMoving, FaUsers } from "react-icons/fa";
import { SiCodechef } from "react-icons/si";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/order-stats");
      return res.data;
    },
  });

  // chard data (custom shape for the bar chart)
  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };
  // custom shape for the pie chart
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const pieChartData = chartData.map((data) => {
    return { name: data.category, value: data.revenue };
  });

  return (
    <div>
      <div className="mt-2">
        <h2 className="text-3xl flex flex-wrap justify-center items-center">
          <span className="mr-2">Hi, Welcome</span>
          <p className="bg-green-400 p-4 rounded-t-badge font-bold">
            {user?.displayName ? user.displayName : "Back"}
            ...
          </p>
        </h2>

        <div className="stats shadow mt-6 w-full gap-4 flex sm:flex-wrap lg:flex-nowrap">
          {/* revenue */}
          <div className="stat  bg-gradient-to-tr  from-purple-600">
            <div className="stat-figure  text-3xl text-slate font-bold">
              <FaRegCreditCard />
            </div>
            <div className="stat-title text-center font-semibold">Revenue</div>
            <div className="stat-value">$: {stats?.revenue}</div>
            {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
          </div>
          {/* users */}
          <div className="stat bg-gradient-to-tr from-[#D3A256] ">
            <div className="stat-figure text-3xl text-slate font-bold">
              <FaUsers></FaUsers>
            </div>
            <div className="stat-title text-center font-semibold">Users</div>
            <div className="stat-value">{stats?.users}</div>
            {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
          </div>
          {/* products */}
          <div className="stat bg-gradient-to-tr from-blue-500 font-semibold">
            <div className="stat-figure  text-3xl text-slate">
              <SiCodechef />
            </div>
            <div className="stat-title">Products</div>
            <div className="stat-value">{stats?.menuItems}</div>
            {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
          </div>
          {/* orders */}
          <div className="stat bg-gradient-to-tr from-red-500 font-semibold">
            <div className="stat-figure text-slate text-3xl">
              <FaTruckMoving />
            </div>
            <div className="stat-title">Orders</div>
            <div className="stat-value">{stats?.orders}</div>
            {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {/* bar chart */}
        <div className="w-1/2">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Bar
              dataKey="quantity"
              fill="#8884d8"
              shape={<TriangleBar />}
              label={{ position: "top" }}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 6]} />
              ))}
            </Bar>
          </BarChart>
        </div>
        {/* pie chart */}
        <div className="w-1/2">
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value">
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend></Legend>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
