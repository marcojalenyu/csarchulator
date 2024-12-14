"use client";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import logo from '../logo.svg';

const Logo = () => {
    return (
        <div className="logo d-inline">
            <img src={logo} alt="logo" width={50} height={50}/>
        </div>
    );
}

export default Logo;