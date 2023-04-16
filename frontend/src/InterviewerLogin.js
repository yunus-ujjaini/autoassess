import logo from './css/logo.png';
import eye from './css/eye.png';
import hiddenEye from './css/hidden.png';
import { Outlet, Link, useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import './css/Login.css';
import _ from 'lodash';
import { useState } from 'react';
import {ReactSession} from 'react-client-session';

function InterviewerLogin() {
  const navigate = useNavigate();
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
  function validateLogin(){
    let InterviewerEmail=document.getElementById('InterviewerEmail').value.toLowerCase();
    let InterviewerPassword=document.getElementById("InterviewerPassword").value;
    let Allgood=true;

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

      if(InterviewerPassword==null || InterviewerPassword==''){
        document.getElementById('InterviewerPassword').setAttribute("Validation","Cannot be blank");
        document.getElementById('InterviewerPasswordV').setAttribute("Validation","Password cannot be blank");
        Allgood=false;
      }
      else{
        document.getElementById('InterviewerPassword').removeAttribute("Validation");
      }

      if(Allgood){
        fetch('http://localhost:3001/Interviewersignup')
        .then((response) => response.json())
        .then((data) => {
         let present=_.findIndex(data, { 'InterviewerEmail': InterviewerEmail, 'InterviewerPassword': InterviewerPassword });
         if(present>=0){
          if(data[present].InterviewerDesignation.toLowerCase()=='admin'){
            ReactSession.setStoreType("sessionStorage");
            ReactSession.set("InterviewerId",data[present].InterviewerId)
            ReactSession.set("InterviewerName",data[present].InterviewerName)
            navigate("/Interviewer/AdminPanel");
          }
          else if(data[present].InterviewerApproved){
            console.log("Login Success");
            ReactSession.setStoreType("sessionStorage");
            ReactSession.set("InterviewerId",data[present].InterviewerId)
            ReactSession.set("InterviewerName",data[present].InterviewerName)
            document.getElementById("toNavigate").click();
          }
          else{
            console.log("Login Fail Interviewer not approved");
            let errorBanner=document.getElementsByClassName("incorrectCredentials")[0];
            errorBanner.classList.add("visible");
            errorBanner.innerHTML="You are not yet approved as an Interviewer"
            setTimeout(()=>{
              errorBanner.classList.remove("visible");
            },3000)
          }
         }
         else{
          console.log("Login Fail");
          let errorBanner=document.getElementsByClassName("incorrectCredentials")[0];
          errorBanner.classList.add("visible");
          errorBanner.innerHTML="Incorrect Username or Password"
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
              Login as Interviewer<br/>
              <span className='Logintitlesub'>
                Enter your credentials or <Link id='signupLink' className="navlink" to={`/Interviewer/Signup`}>Signup</Link> to continue your journey with Oracle
              </span>
            </p>
            <div className='validation'><input type="email" id="InterviewerEmail" placeholder='Email'></input><span id="InterviewerEmailV" validation="Cannot be blank"></span></div>
            <div className='validation'><input type="password" id="InterviewerPassword" placeholder='Password'></input><span id="InterviewerPasswordV" validation="Cannot be blank"></span><img className='passwordEye' src={passHidden?hiddenEye:eye} onClick={togglePass} alt='Error Loading image'/></div>
            <button id='submit' name='submit' onClick={validateLogin}>Login</button>
          </div>
          
        </div>
        <div className='LoginBlock2'>
          <p className='LoginBlock2Text'><span className='secondText'>Digital Assessment Portal for Conducting Testing Interviews</span><span className='firstText'>Providing better interface to Candidates and interviewers<br/></span></p>
        </div>
      </div>
      <Link id='toNavigate' className="navlink" to={`/Interviewer/Dashboard`}>Login</Link>
    </div>
  );
}

export default InterviewerLogin;
