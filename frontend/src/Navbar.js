import { Outlet, Link,useNavigate } from "react-router-dom";
import './css/Navbar.css';
import {ReactSession} from 'react-client-session';
import logo from './css/logo.png';

function Navbar() {
  const navigate=useNavigate();
  ReactSession.setStoreType("sessionStorage");

  return (
    <div className="nav">
      <div className="companyName">
        <p className="companyNameText"><img src={logo} className='logo' /></p>
      </div>
      <div className="navlinks">
        <button className="navlink" onClick={()=>{
          ReactSession.remove("userId"); 
          ReactSession.remove("userName"); 
          // document.getElementById("toNavigate").click();
          navigate("/Login");
        }}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
