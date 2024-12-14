"use client";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './styles.css'
import Logo from "./logo";

const Navbar = () => {
  return (
    <nav className="navbar w-100">
      <div className="nav-title d-inline-flex justify-content-center align-items-center">
        <Logo />
        <div className="ms-1 font-we">CSARCHulator</div>
      </div>
      
      <div className="links">
        <a href="/">Home</a>
        <a href="/create">New Blog</a>
      </div>
    </nav>
  );
}

export default Navbar;