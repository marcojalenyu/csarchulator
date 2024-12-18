"use client";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './styles.css'
import Logo from './logo';
import Menu from "./menu";

const Navbar = () => {

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = prefersDarkScheme ? 'dark' : 'light';
  const [theme, setTheme] = useState(initialTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar my-1 w-100">

      <a className="fs-5 fw-bold d-inline-flex align-items-center" href="/">
        <Logo />
        <div className="ms-1 font-we">CSARCHulator</div>
      </a>
      
      <div className="d-flex flex-column align-items-end">
        <div className="form-check form-switch mb-1">
          <input 
            className="form-check-input mx-0" 
            type="checkbox" 
            id="flexSwitchCheckDefault" 
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            checked={theme === 'dark'}
          />
        </div>
        <div className="links">
          <button className="borderless fw-bold" onClick={toggleMenu}>Choose a converter...</button>
        </div>
      </div>
      <Menu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </nav>
  );
}

export default Navbar;