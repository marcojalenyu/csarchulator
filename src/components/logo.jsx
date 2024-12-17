"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';
import logo3 from '../assets/logo3.svg';
import logo4 from '../assets/logo4.svg';


const Logo = ({ width = 50, height = 50, type = 1 }) => {

    var logo;

    switch (type) {
        case 1:
            logo = logo1;
            break;
        case 2:
            logo = logo2;
            break;
        case 3:
            logo = logo3;
            break;
        case 4:
            logo = logo4;
            break;
        default:
            logo = logo2;
    }
    
    return (
        <div className="d-inline">
            <img className="logo-img" src={logo} alt="logo" width={width} height={height}/>
        </div>
    );
}

export default Logo;