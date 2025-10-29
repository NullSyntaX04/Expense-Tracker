import React from 'react';
import api from '../services/api';

export default function ExpenseTable({ expenses, onUpdate, onDelete }) {

  const remove = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await api.delete('/expenses/' + id);
      onDelete(id);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5>Expenses</h5>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Amount</th><th>Category</th><th>Description</th><th></th></tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleString()}</td>
                <td>₹ {e.amount.toFixed(2)}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>
                  {/* For brevity, edit opens prompt */}
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={async ()=> {
                    const val = prompt('Edit amount', e.amount);
                    if (val==null) return;
                    try {
                      const res = await api.put('/expenses/' + e._id, { amount: parseFloat(val) });
                      onUpdate(res.data);
                    } catch (err) { alert('Update failed'); }
                  }}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(e._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {expenses.length===0 && <tr><td colSpan="5">No expenses yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
