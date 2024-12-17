"use client";
import './App.css';
import Navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import TypingEffect from './components/TypingEffect';
import Footer from './components/footer';

function App() {
  return (
    <div className='mx-3 min-vh-100 d-flex flex-column'>
      <Navbar />
      <div className="d-flex flex-column justify-content-center text-center flex-grow-1">
        <TypingEffect 
          text="01101000 01100101 01101100 01101100 01101111 00100000 01110111 01101111 01110010 01101100 01100100" 
          speed={100}
        />
        <p className='fs-3 fw-bold m-0'>
          I am a free translator for Computer Architecture concepts
        </p>
        <p className='fs-5 fw-bold'>
          (Unicode, BCD, Binary, Boolean Alegbra, etc.)
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default App;
