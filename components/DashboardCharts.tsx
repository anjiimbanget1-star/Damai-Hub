import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const ImpactChart = () => {
  const data = [
    { name: 'Jan', impact: 400 },
    { name: 'Feb', impact: 300 },
    { name: 'Mar', impact: 600 },
    { name: 'Apr', impact: 800 },
    { name: 'May', impact: 500 },
    { name: 'Jun', impact: 900 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="impact" fill="#14B8A6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ZoneStatusChart = () => {
  const data = [
    { name: 'Zona Damai', value: 70 },
    { name: 'Perlu Perhatian', value: 20 },
    { name: 'Zona Rawan', value: 10 },
  ];
  const COLORS = ['#14B8A6', '#F59E0B', '#E11D48'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};