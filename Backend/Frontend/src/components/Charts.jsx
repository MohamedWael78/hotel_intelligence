import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TEAL = '#2DD4BF', GOLD = '#F59E0B', RED = '#EF4444', NAVY = '#111827';
const BLUE = '#3B82F6', GREEN = '#10B981';

const gridOpts = { color: 'rgba(255,255,255,0.04)' };
const tickOpts = { color: '#64748B', font: { size: 11 } };
const legendOpts = { labels: { color: '#64748B', boxWidth: 12, font: { size: 11 } } };

const baseOpts = { 
  responsive: true, 
  maintainAspectRatio: false, 
  plugins: { legend: legendOpts }, 
  scales: { 
    x: { ticks: tickOpts, grid: { display: false } }, 
    y: { ticks: tickOpts, grid: gridOpts } 
  } 
};

export const MonthlyTrend = ({ data, options }) => (
  <Line 
    data={data || {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        { label: 'City Hotel', data: [2800,2500,4200,5800,6100,7200,9100,8400,6300,4200,3100,3800], borderColor: TEAL, backgroundColor: 'rgba(45,212,191,.1)', fill: true, tension: 0.4, pointRadius: 3 },
        { label: 'Resort Hotel', data: [1200,1100,2300,3500,4200,5100,7800,6900,4100,2300,1800,2100], borderColor: GOLD, backgroundColor: 'rgba(245,158,11,.1)', fill: true, tension: 0.4, pointRadius: 3 }
      ]
    }}
    options={options || baseOpts}
  />
);

export const CancelBySegment = ({ data, options }) => (
  <Bar 
    data={data || {
      labels: ['Online TA','Offline TA','Groups','Corporate','Direct'],
      datasets: [
        { label: 'Cancelled', data: [41,33,28,23,17], backgroundColor: 'rgba(239,68,68,.75)', borderRadius: 6 },
        { label: 'Kept', data: [59,67,72,77,83], backgroundColor: 'rgba(45,212,191,.4)', borderRadius: 6 }
      ]
    }}
    options={options || {
      ...baseOpts,
      indexAxis: 'y',
      scales: {
        x: { stacked: true, ticks: tickOpts, grid: gridOpts, max: 100 },
        y: { stacked: true, ticks: tickOpts, grid: { display: false } }
      }
    }}
  />
);

export const ADRBySeason = ({ data, options }) => (
  <Bar 
    data={data || {
      labels: ['Q1','Q2','Q3','Q4'],
      datasets: [
        { label: 'City Hotel', data: [85, 100, 115, 92], backgroundColor: 'rgba(45,212,191,.7)', borderRadius: 6 },
        { label: 'Resort Hotel', data: [76, 108, 138, 89], backgroundColor: 'rgba(245,158,11,.7)', borderRadius: 6 }
      ]
    }}
    options={options || baseOpts}
  />
);

export const DepositRevenue = ({ data, options }) => (
  <Doughnut 
    data={data || {
      labels: ['No Deposit', 'Non Refund', 'Refundable'],
      datasets: [{ data: [75.4, 22.3, 2.3], backgroundColor: [TEAL, RED, GOLD], borderWidth: 0, hoverOffset: 8 }]
    }}
    options={options || { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { ...legendOpts, position: 'right' } } }}
  />
);

export const ROCChart = ({ data, options }) => (
  <Line 
    data={data || {
      labels: [0,0.05,0.1,0.15,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1],
      datasets: [
        { label: 'RF (AUC=0.962)', data: [0,0.65,0.79,0.85,0.89,0.93,0.96,0.97,0.975,0.982,0.989,0.995,1], borderColor: TEAL, pointRadius: 0, tension: 0.4, borderWidth: 2.5 },
        { label: 'XGB (AUC=0.955)', data: [0,0.60,0.75,0.82,0.87,0.91,0.94,0.96,0.97,0.978,0.985,0.993,1], borderColor: '#EF4444', pointRadius: 0, tension: 0.4, borderWidth: 2.5 },
        { label: 'DT (AUC=0.891)', data: [0,0.45,0.62,0.70,0.76,0.82,0.86,0.89,0.91,0.93,0.95,0.97,1], borderColor: BLUE, pointRadius: 0, tension: 0.4, borderWidth: 2 },
        { label: 'LR (AUC=0.871)', data: [0,0.38,0.55,0.64,0.70,0.76,0.80,0.84,0.87,0.90,0.93,0.96,1], borderColor: GOLD, pointRadius: 0, tension: 0.4, borderWidth: 2, borderDash: [5,3] },
        { label: 'Random', data: [0,0.05,0.1,0.15,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1], borderColor: 'rgba(255,255,255,.15)', pointRadius: 0, borderWidth: 1, borderDash: [4,4] }
      ]
    }}
    options={options || {
      ...baseOpts,
      scales: {
        x: { title: { display: true, text: 'False Positive Rate', color: '#64748B' }, ticks: tickOpts, grid: gridOpts },
        y: { title: { display: true, text: 'True Positive Rate', color: '#64748B' }, ticks: tickOpts, grid: gridOpts, min: 0, max: 1 }
      }
    }}
  />
);

export const EDASegment = ({ data, options }) => (
  <Doughnut 
    data={data || {
      labels: ['Online TA','Groups','Offline TA/TO','Direct','Corporate','Other'],
      datasets: [{ data: [47.4, 19.8, 11.4, 10.6, 6.5, 4.3], backgroundColor: [TEAL, RED, GOLD, BLUE, GREEN, '#9333EA'], borderWidth: 0, hoverOffset: 8 }]
    }}
    options={options || { responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { ...legendOpts, position: 'right' } } }}
  />
);

export const EDAMeal = ({ data, options }) => (
  <Bar 
    data={data || {
      labels: ['BB','HB','SC','Undefined','FB'],
      datasets: [{ label: 'Bookings', data: [77058, 14463, 10650, 1169, 798], backgroundColor: [TEAL, GOLD, BLUE, '#9333EA', RED], borderRadius: 6 }]
    }}
    options={options || { ...baseOpts, plugins: { legend: { display: false } } }}
  />
);

export const StayDur = ({ data, options }) => (
  <Bar 
    data={data || {
      labels: ['1','2','3','4','5','6','7','8+'],
      datasets: [{ label: 'Stays', data: [12400, 21000, 19800, 14200, 9100, 6300, 8900, 4200], backgroundColor: 'rgba(45,212,191,.65)', borderRadius: 4 }]
    }}
    options={options || { ...baseOpts, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Nights', color: '#64748B' }, ticks: tickOpts, grid: { display : false } }, y: { ticks: tickOpts, grid: gridOpts } } }}
  />
);
