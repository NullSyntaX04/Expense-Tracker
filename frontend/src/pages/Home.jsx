import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // Import your AuthContext
import "./Home.css"; // Custom CSS for styling

export default function Home() {
  const { token } = useAuth(); // Get login state from AuthContext

  return (
    <div className="home-container">
      <div className="overlay">
        <div className="content text-center">
          <h1 className="display-4 fw-bold animate-title">Expense Tracker</h1>
          <p className="lead animate-subtitle">
            Take control of your finances. Track your expenses effortlessly.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            {token ? (
              // User logged in → show dashboard button
              <Link
                to="/dashboard"
                className="btn btn-success btn-lg custom-btn"
              >
                Go to Dashboard
              </Link>
            ) : (
              // User not logged in → show register/login
              <>
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg custom-btn"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg custom-btn-outline"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
