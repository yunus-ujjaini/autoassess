import logo from './css/logo.png';
import eye from './css/eye.png';
import hiddenEye from './css/hidden.png';
import { Outlet, Link } from "react-router-dom";
import Navbar from './Navbar';
import './css/Login.css';
import _ from 'lodash';
import { useState } from 'react';
import {ReactSession} from 'react-client-session';

function Login() {
  let [passHidden,changePassHidden]=useState(true);
  function togglePass(){
    let CandidatePassword=document.getElementById("CandidatePassword");
    if(CandidatePassword.getAttribute("type")=="text"){
      CandidatePassword.setAttribute("type","password");
    }
    else{
      CandidatePassword.setAttribute("type","text");
    }
    changePassHidden(!passHidden)
    
  }
  function validateLogin(){
    let CandidateEmail=document.getElementById('CandidateEmail').value.toLowerCase();
    let CandidatePassword=document.getElementById("CandidatePassword").value;
    let Allgood=true;

    var mailformat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if(CandidateEmail==null || CandidateEmail==''){
         document.getElementById('CandidateEmail').setAttribute("Validation","Cannot be blank");
          document.getElementById('CandidateEmailV').setAttribute("Validation","Email cannot be blank");
          Allgood=false;
      }
      else if(!CandidateEmail.match(mailformat)){
        document.getElementById('CandidateEmail').setAttribute("Validation","Email not in correct format");
          document.getElementById('CandidateEmailV').setAttribute("Validation","Email not in correct format");
          Allgood=false;
      }
      else{
        document.getElementById('CandidateEmail').removeAttribute("Validation");
      }

      if(CandidatePassword==null || CandidatePassword==''){
        document.getElementById('CandidatePassword').setAttribute("Validation","Cannot be blank");
        document.getElementById('CandidatePasswordV').setAttribute("Validation","Password cannot be blank");
        Allgood=false;
      }
      else{
        document.getElementById('CandidatePassword').removeAttribute("Validation");
      }

      if(Allgood){
        fetch('http://localhost:3001/signup')
        .then((response) => response.json())
        .then((data) => {
         let present=_.findIndex(data, { 'CandidateEmail': CandidateEmail, 'CandidatePassword': CandidatePassword});
         if(present>=0){
            console.log("Login Success");
            ReactSession.setStoreType("sessionStorage");
            ReactSession.set("userId",data[present].CandidateId)
            ReactSession.set("userName",data[present].CandidateName)
            document.getElementById("toNavigate").click();
         }
         else{
          console.log("Login Fail");
          let errorBanner=document.getElementsByClassName("incorrectCredentials")[0];
          errorBanner.classList.add("visible");
          setTimeout(()=>{
            errorBanner.classList.remove("visible");
          },3000)
         }
        })
        .catch((err) => {
           console.log(err.message);
        });
      } 
  }
  setTimeout(()=>{
    let inputs=document.getElementsByTagName("input")
    console.log(inputs);
    for(let i=0;i<inputs.length;i++){
      inputs[i].addEventListener("keypress",(event)=>{
        if(event.key==="Enter"){
          event.preventDefault();
          document.getElementById("submit").click();
        }
      })
    }
  },3000);
 
  return (
    <div className="Login">
      <div className='incorrectCredentials'>
        Incorrect Username or Password
      </div>
      <div className='LoginBlock'>
        
        <div className='LoginBlock1'>
          
          <div className='Loginform'>
            <p className='Logintitle'>
            <img src={logo} className='logo' />
              Login<br/>
              <span className='Logintitlesub'>
                Enter your credentials or <Link id='signupLink' className="navlink" to={`/Signup`}>Signup</Link> to continue your journey with Oracle
              </span>
            </p>
            <div className='validation'><input type="email" id="CandidateEmail" placeholder='Email'></input><span id="CandidateEmailV" validation="Cannot be blank"></span></div>
            <div className='validation'><input type="password" id="CandidatePassword" placeholder='Password'></input><span id="CandidatePasswordV" validation="Cannot be blank"></span><img className='passwordEye' src={passHidden?hiddenEye:eye} onClick={togglePass} alt='Error Loading image'/></div>
            <button id='submit' name='submit' onClick={validateLogin}>Login</button>
          </div>
          
        </div>
        <div className='LoginBlock2'>
          <p className='LoginBlock2Text'><span className='secondText'>Digital Assessment Portal for Conducting Testing Interviews</span><span className='firstText'>Providing better interface to candidates and interviewers<br/></span></p>
        </div>
      </div>
      <Link id='toNavigate' className="navlink" to={`/Home`}>Login</Link>
    </div>
  );
}

export default Login;
