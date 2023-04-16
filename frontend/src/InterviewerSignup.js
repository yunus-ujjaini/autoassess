import logo from './css/logo.png';
import eye from './css/eye.png';
import hiddenEye from './css/hidden.png';
import './css/Signup.css';
import Navbar from './Navbar';
import { Outlet, Link } from "react-router-dom";
import { useState } from 'react';

function InterviewerSignup() {
  
  let [passHidden,changePassHidden]=useState(true);

  function togglePass(){
    let InterviewerPassword=document.getElementById("InterviewerPassword");
    if(InterviewerPassword.getAttribute("type")=="text"){
      InterviewerPassword.setAttribute("type","password");
    }
    else{
      InterviewerPassword.setAttribute("type","text");
    }
    changePassHidden(!passHidden)
    
  }


  function sendData(){
      let InterviewerName=document.getElementById('InterviewerName').value;
      let InterviewerEmail=document.getElementById('InterviewerEmail').value.toLowerCase();
      let InterviewerPassword=document.getElementById("InterviewerPassword").value;
      let InterviewerDesignation=document.getElementById("InterviewerDesignation").value;

      let Allgood=true;
      if(InterviewerName==null || InterviewerName==''){
          document.getElementById('InterviewerName').setAttribute("Validation","Cannot be blank");
          document.getElementById('InterviewerNameV').setAttribute("Validation","Name cannot be blank");
          Allgood=false;
      }
      else{
          document.getElementById('InterviewerName').removeAttribute("Validation");
      }


      if(InterviewerDesignation==null || InterviewerDesignation==''){
        document.getElementById('InterviewerDesignation').setAttribute("Validation","Cannot be blank");
        document.getElementById('InterviewerDesignationV').setAttribute("Validation","Designation cannot be blank");
        Allgood=false;
      }
      else{
          document.getElementById('InterviewerDesignation').removeAttribute("Validation");
      }

      var mailformat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if(InterviewerEmail==null || InterviewerEmail==''){
         document.getElementById('InterviewerEmail').setAttribute("Validation","Cannot be blank");
          document.getElementById('InterviewerEmailV').setAttribute("Validation","Email cannot be blank");
          Allgood=false;
      }
      else if(!InterviewerEmail.match(mailformat)){
        document.getElementById('InterviewerEmail').setAttribute("Validation","Email not in correct format");
          document.getElementById('InterviewerEmailV').setAttribute("Validation","Email not in correct format");
          Allgood=false;
      }
      else{
        document.getElementById('InterviewerEmail').removeAttribute("Validation");
      }

      var passwordFormat=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      if(InterviewerPassword==null || InterviewerPassword==''){
        document.getElementById('InterviewerPassword').setAttribute("Validation","Cannot be blank");
        document.getElementById('InterviewerPasswordV').setAttribute("Validation","Password cannot be blank");
        Allgood=false;
      }
      else if(InterviewerPassword.length<8){
        document.getElementById('InterviewerPassword').setAttribute("Validation","Password not in correct format");
        document.getElementById('InterviewerPasswordV').setAttribute("Validation","8 characters required");
        Allgood=false;
      }
      else if(!InterviewerPassword.match(passwordFormat)){
        Allgood=false;
        document.getElementById('InterviewerPassword').setAttribute("Validation","Password not in correct format");
        document.getElementById('InterviewerPasswordV').setAttribute("Validation","Must have letter, number and special character");
      }
      else{
        document.getElementById('InterviewerPassword').removeAttribute("Validation");
      }
      if(Allgood){
        console.log("Sending data");
        fetch("http://localhost:3001/Interviewersignup", {
          method: "POST",
          body: JSON.stringify({
            "InterviewerName": InterviewerName,
            "InterviewerEmail": InterviewerEmail,
            "InterviewerPassword": InterviewerPassword,
            "InterviewerDesignation": InterviewerDesignation,
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
              Sign Up as Interviewer<br/>
              <span className='Signuptitlesub'>
                Create your account or  <Link id='loginLink' className="navlink" to={`/Interviewer/Login`}>Login</Link> to start your journey with Oracle
              </span>
            </p>
            <div className='validation'><input type="text" id="InterviewerName" placeholder='Name'></input><span id="InterviewerNameV" validation="Cannot be blank"></span></div>
            <div className='validation'><input type="text" id="InterviewerEmail" placeholder='Email'></input><span id="InterviewerEmailV" validation="Cannot be blank"></span></div>
            <div className='validation'><input type="password" id="InterviewerPassword" placeholder='Password'></input><span id="InterviewerPasswordV" validation="Cannot be blank"></span><img className='passwordEye' src={passHidden?hiddenEye:eye} onClick={togglePass} alt='Error Loading image'/></div>
            <div className='validation'><input type="text" id="InterviewerDesignation" placeholder='Designation'></input><span id="InterviewerDesignationV" validation="Cannot be blank"></span></div>
            <button id='submit' name='submit' onClick={sendData}>Create Account</button>
          </div>
          
        </div>
        <div className='SignupBlock2'>
          <p className='SignupBlock2Text'><span className='secondText'>Digital Assessment Portal for Conducting Testing Interviews</span><span className='firstText'>Providing better interface to Candidates and interviewers<br/></span></p>
        </div>
      </div>

      <Link id='toNavigate' className="navlink" to={`/Interviewer/Login`}>Login</Link>
      </div>
    </>
  );
}

export default InterviewerSignup;
