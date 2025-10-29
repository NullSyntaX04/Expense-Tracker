import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "../services/api";

export default function AddExpenseModal({ show, onClose, onAdd }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // fetch categories from backend
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
        if (res.data.length > 0) setCategory(res.data[0].name); // default first
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/expenses", {
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(),
      });
      onAdd(res.data);
      setAmount("");
      setDescription("");
      setCategory(categories[0]?.name || "");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
