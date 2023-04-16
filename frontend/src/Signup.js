import logo from './css/logo.png';
import eye from './css/eye.png';
import hiddenEye from './css/hidden.png';
import './css/Signup.css';
import Navbar from './Navbar';
import { Outlet, Link } from "react-router-dom";
import { useState } from 'react';

function Signup() {
  
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


  function sendData(){
      let CandidateName=document.getElementById('CandidateName').value;
      let CandidateEmail=document.getElementById('CandidateEmail').value.toLowerCase();
      let CandidatePassword=document.getElementById("CandidatePassword").value;
      let CandidateAddress=document.getElementById("CandidateAddress").value;
      let CandidateQualification=document.getElementById("CandidateQualification").value;

      let Allgood=true;
      if(CandidateName==null || CandidateName==''){
          document.getElementById('CandidateName').setAttribute("Validation","Cannot be blank");
          document.getElementById('CandidateNameV').setAttribute("Validation","Name cannot be blank");
          Allgood=false;
      }
      else{
          document.getElementById('CandidateName').removeAttribute("Validation");
      }

      if(CandidateAddress==null || CandidateAddress==''){
        document.getElementById('CandidateAddress').setAttribute("Validation","Cannot be blank");
        document.getElementById('CandidateAddressV').setAttribute("Validation","Address cannot be blank");
        Allgood=false;
      }
      else{
          document.getElementById('CandidateAddress').removeAttribute("Validation");
      }

      if(CandidateQualification==null || CandidateQualification==''){
        document.getElementById('CandidateQualification').setAttribute("Validation","Cannot be blank");
        document.getElementById('CandidateQualificationV').setAttribute("Validation","Qualification cannot be blank");
        Allgood=false;
      }
      else{
          document.getElementById('CandidateQualification').removeAttribute("Validation");
      }

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

      var passwordFormat=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      if(CandidatePassword==null || CandidatePassword==''){
        document.getElementById('CandidatePassword').setAttribute("Validation","Cannot be blank");
        document.getElementById('CandidatePasswordV').setAttribute("Validation","Password cannot be blank");
        Allgood=false;
      }
      else if(CandidatePassword.length<8){
        document.getElementById('CandidatePassword').setAttribute("Validation","Password not in correct format");
        document.getElementById('CandidatePasswordV').setAttribute("Validation","8 characters required");
        Allgood=false;
      }
      else if(!CandidatePassword.match(passwordFormat)){
         document.getElementById('CandidatePassword').setAttribute("Validation","Password not in correct format");
          document.getElementById('CandidatePasswordV').setAttribute("Validation","Must have letter, number and special character");
          Allgood=false;
      }
      else{
        document.getElementById('CandidatePassword').removeAttribute("Validation");
      }
      if(Allgood){
        console.log("Sending data");
        fetch("http://localhost:3001/signup", {
          method: "POST",
          body: JSON.stringify({
            "CandidateName": CandidateName,
            "CandidateEmail": CandidateEmail,
            "CandidatePassword": CandidatePassword,
            "CandidateAddress": CandidateAddress,
            "CandidateQualification": CandidateQualification,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then((response) => response.json()).then((data)=>{
          console.log("Im executed")
          document.getElementById("toNavigate").click();
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
    <>
    <div className='Signup'>
      <div className='SignupBlock'>
        <div className='SignupBlock1'>
          
          <div className='Signupform'>
            <p className='Signuptitle'>
            <img src={logo} className='logo' />
              Sign Up<br/>
              <span className='Signuptitlesub'>
                Create your account or  <Link id='loginLink' className="navlink" to={`/Login`}>Login</Link> to start your journey with Oracle
              </span>
            </p>
            <div className='validation'><input type="text" id="CandidateName" placeholder='Name'></input><span id="CandidateNameV" validation="Cannot be blank"></span></div>
            <div className='validation'><input type="text" id="CandidateEmail" placeholder='Email'></input><span id="CandidateEmailV" validation="Cannot be blank"></span></div>
            <div className='validation'><input type="password" id="CandidatePassword" placeholder='Password'></input><span id="CandidatePasswordV" validation="Cannot be blank"></span><img className='passwordEye' src={passHidden?hiddenEye:eye} onClick={togglePass} alt='Error Loading image'/></div>
            <div className='validation'><input type="text" id="CandidateAddress" placeholder='Address'></input><span id="CandidateAddressV" validation="Cannot be blank"></span></div>
            <div className='validation'><input type="text" id="CandidateQualification" placeholder='Qualification'></input><span id="CandidateQualificationV" validation="Cannot be blank"></span></div>
            <button id='submit' name='submit' onClick={sendData}>Create Account</button>
          </div>
          
        </div>
        <div className='SignupBlock2'>
          <p className='SignupBlock2Text'><span className='secondText'>Digital Assessment Portal for Conducting Testing Interviews</span><span className='firstText'>Providing better interface to candidates and interviewers<br/></span></p>
        </div>
      </div>

      <Link id='toNavigate' className="navlink" to={`/Login`}>Login</Link>
      </div>
    </>
  );
}

export default Signup;
