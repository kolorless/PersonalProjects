import { Link } from "react-router-dom";
import "./Navbar.css";

const linkStyle = {
  margin: "1rem",
  textDecoration: "none",
  color: "white",
};

const Navbar = () => {
  return (
    <nav>
      <ul className="nav nav-pills">
        <li className="nav-item search">
          <Link to="/search" style={linkStyle}>
            Search
          </Link>
        </li>
        <li className="nav-item favorites">
          <Link to="/favorites" style={linkStyle}>
            Favorites
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
