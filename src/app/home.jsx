"use client";
import TypingEffect from '../components/TypingEffect';

const Home = () => {
    return (
        <>
            <TypingEffect 
                text="01101000 01100101 01101100 01101100 01101111 00100000 01110111 01101111 01110010 01101100 01100100" 
                speed={100}
            />
            <p className='fs-3 fw-bold m-0'>I am a free translator for Computer Architecture concepts</p>
            <p className='fs-5 fw-bold'>(Unicode, BCD, Floating-Point, etc.)</p>
        </>
    );
}

export default Home;