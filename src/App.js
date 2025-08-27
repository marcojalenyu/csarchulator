"use client";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import Home from './app/home';
import Error from './app/error';
import UnicodeUtf from './app/unicode-utf';
import DecimalFTP2 from './app/decimal-ftp2';
import DecimalFTP10 from './app/decimal-ftp10';
import DecimalBCD from './app/decimal-bcd';
import FTP2Decimal from './app/ftp2-decimal';
import FTP10Decimal from './app/ftp10-decimal';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="unicode-utf" element={<UnicodeUtf from='Unicode' to='UTF'/>} />
          <Route path="utf-unicode" element={<UnicodeUtf from='UTF' to='Unicode'/>} />
          {/* <Route path="decimal-ftp2" element={<DecimalFTP2 from='Decimal' to='Binary FTP'/>} />
          <Route path="ftp2-decimal" element={<FTP2Decimal from='Binary FTP' to='Decimal'/>} /> */}
          {/* <Route path="decimal-ftp10" element={<DecimalFTP10 from='Decimal' to='Decimal FTP'/>} />
          <Route path="ftp10-decimal" element={<FTP10Decimal from='Decimal FTP' to='Decimal'/>} /> */}
          <Route path="decimal-bcd" element={<DecimalBCD from='Decimal' to='BCD'/>} />
          <Route path="bcd-decimal" element={<DecimalBCD from='BCD' to='Decimal'/>} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
