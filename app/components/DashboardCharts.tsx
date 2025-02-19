'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardCharts() {
  const [data, setData] = useState({ rooms: 0, customers: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const roomsRes = await fetch('/api/rooms');
      const rooms = await roomsRes.json();

      const customersRes = await fetch('/api/clientes');
      const customers = await customersRes.json();

      setData({ rooms: rooms.length, customers: customers.length });
    };

    fetchData();
  }, []);

  const pieData = [
    { name: "Quartos", value: data.rooms },
    { name: "Clientes", value: data.customers },
  ];

  const barData = [
    { name: "Quartos", quantidade: data.rooms },
    { name: "Clientes", quantidade: data.customers },
  ];

  const COLORS = ["#0088FE", "#FFBB28"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-bold mb-4">Distribuição de Quartos e Clientes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-bold mb-4">Número de Quartos e Clientes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
