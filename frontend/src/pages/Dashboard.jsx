import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseTable from "../components/ExpenseTable";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onAdd = (newExpense) => setExpenses((prev) => [newExpense, ...prev]);
  const onUpdate = (updated) =>
    setExpenses((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
  const onDelete = (id) =>
    setExpenses((prev) => prev.filter((e) => e._id !== id));

  const totalThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, e) => s + e.amount, 0);

  // Logout handler that redirects to Home
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Expense
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="row g-4">
        {/* Sidebar / Summary */}
        <div className="col-md-4">
          <div className="card summary-card p-4 shadow">
            <h5>Total This Month</h5>
            <h2 className="text-success">₹ {totalThisMonth.toFixed(2)}</h2>
          </div>

          <div className="card chart-card p-3 shadow">
            <h5 className="mb-3">Expenses by Category</h5>
            <ExpenseChart expenses={expenses} />
          </div>
        </div>

        {/* Expenses Table */}
        <div className="col-md-8">
          <div className="card table-card p-3 shadow">
            <h5 className="mb-3">All Expenses</h5>
            <ExpenseTable
              expenses={expenses}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={onAdd}
      />
    </div>
  );
}
