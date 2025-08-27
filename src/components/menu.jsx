"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Menu = ({ isMenuOpen, toggleMenu }) => {

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        // Clean up on unmount
        return () => document.body.classList.remove('overflow-hidden');
    }, [isMenuOpen]);

    return (
        <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className={`menu ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="menu-content d-flex flex-column h-100">
              <button className="borderless me-auto" onClick={toggleMenu}>
                <svg className="close-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </button>
              <div className="menu-links list-group">
                <Link className="list-group-item list-group-item-action" to="/unicode-utf" onClick={toggleMenu}>Unicode-UTF</Link>
                <Link className="list-group-item list-group-item-action" to="/utf-unicode" onClick={toggleMenu}>UTF-Unicode</Link>
                <Link className="list-group-item list-group-item-action" to="/decimal-ftp2" onClick={toggleMenu}>Decimal-Binary FP</Link>
                <Link className="list-group-item list-group-item-action" to="/ftp2-decimal" onClick={toggleMenu}>Binary FP-Decimal</Link>              
                <Link className="list-group-item list-group-item-action" to="/decimal-ftp10" onClick={toggleMenu}>Decimal-Decimal FP</Link>
                <Link className="list-group-item list-group-item-action" to="/ftp10-decimal" onClick={toggleMenu}>Decimal FP-Decimal</Link>
                <Link className="list-group-item list-group-item-action" to="/decimal-bcd" onClick={toggleMenu}>Decimal-BCD</Link>
                <Link className="list-group-item list-group-item-action" to="/bcd-decimal" onClick={toggleMenu}>BCD-Decimal</Link>
              </div>
              <div className="menu-donate d-flex justify-content-end m-3 mt-auto text-center">
                <a
                  href="https://bit.ly/csnotes-qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary fw-bold"
                >
                  Donate
                </a>
              </div>
            </div>
          </div>
        </div>
      );
};

export default Menu;