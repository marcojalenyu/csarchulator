"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import { Link } from 'react-router-dom';

const Menu = ({ isMenuOpen, toggleMenu }) => {

    return (
        <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className={`menu ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="menu-content">
              <button className="borderless me-auto" onClick={toggleMenu}>
                <svg className="close-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </button>
              <div className="menu-links list-group">
                <Link className="list-group-item list-group-item-action" to="/unicode-utf" onClick={toggleMenu}>Unicode-UTF</Link>
                <Link className="list-group-item list-group-item-action" to="/utf-unicode" onClick={toggleMenu}>UTF-Unicode</Link>
                <Link className="list-group-item list-group-item-action" to="/decimal-ftp" onClick={toggleMenu}>Decimal-Floating Point</Link>
                <Link className="list-group-item list-group-item-action" to="/decimal-bcd" onClick={toggleMenu}>Decimal-BCD</Link>
              </div>
            </div>
          </div>
        </div>
      );
};

export default Menu;