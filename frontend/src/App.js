import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import HomePage from "./components/HomePage/HomePage";
import GridPage from "./components/GridPage/GridPage";

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            CherryLite
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr_auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <Route path="/" exact component={HomePage} />
        <Route path="/:gridId" exact component={GridPage} />
      </div>
    </Router>
  );
}
export default App;
