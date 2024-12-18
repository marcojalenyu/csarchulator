"use client";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './styles.css'
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';

const Layout = () => {
    return (
        <div className='mx-3 min-vh-100 d-flex flex-column'>
            <Navbar />
            <div className="d-flex flex-column justify-content-center text-center flex-grow-1">
                <Outlet />
            </div>
            <Footer />
      </div>
    );
};

export default Layout;
