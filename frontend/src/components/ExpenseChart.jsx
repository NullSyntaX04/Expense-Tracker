import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ expenses }) {
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const labels = Object.keys(byCategory);

  // Generate colors dynamically
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8AFF33",
    "#FF33A6",
    "#33FFF2",
    "#FF5733",
  ];

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((l) => byCategory[l]),
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card p-3 shadow">
      <h5>Expenses by Category</h5>
      {labels.length === 0 ? <p>No data</p> : <Pie data={data} />}
    </div>
  );
}
