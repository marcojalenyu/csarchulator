"use client";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import Home from './app/home';
import Error from './app/error';
import UnicodeUtf from './app/unicode-utf';
import DecimalFTP from './app/decimal-ftp';
import DecimalBCD from './app/decimal-bcd';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="unicode-utf" element={<UnicodeUtf from='Unicode' to='UTF'/>} />
          <Route path="utf-unicode" element={<UnicodeUtf from='UTF' to='Unicode'/>} />
          <Route path="decimal-ftp" element={<DecimalFTP from='Decimal' to='FTP'/>} />
          <Route path="decimal-bcd" element={<DecimalBCD from='Decimal' to='BCD'/>} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
