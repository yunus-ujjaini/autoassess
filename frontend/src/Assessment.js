
import './css/Assessment.css';
import { Outlet, Link,useNavigate } from "react-router-dom";
import { useEffect,useState } from 'react';
import {ReactSession} from 'react-client-session';
import Navbar from './Navbar';
import Select from 'react-select';
import _ from 'lodash';
import axios from 'axios';
import Editor from './Editor';


function Assessment() {
  ReactSession.setStoreType("sessionStorage");
  const navigate=useNavigate();
  var assessTime;
  let [Applied,setApplied]=useState([]);
  let [currentQuestion,setCurrentQuestion]=useState(false);
  let [jsCode,setJsCode]=useState(``);
  function updateScore(){
    debugger;
    let answers=[];
    if(currentQuestion.QuestionType==="fibquestions"){
      debugger;
      let blanks=document.getElementsByClassName("Main-Job-card-FITB-blank");
      for(let i=0;i<blanks.length;i++){
        debugger;
        answers.push(blanks[i].value);
      }
      answers=answers.join("~")
    }
    else if(currentQuestion.QuestionType==="mcqquestions"){
      debugger;
      let selectedOptions=document.getElementsByClassName("Main-Job-card-MCQ-Options-Option-active");
      for(let i=0;i<selectedOptions.length;i++){
        debugger;
        answers.push(selectedOptions[i].innerHTML);
        selectedOptions[i].classList.remove("Main-Job-card-MCQ-Options-Option-active");
      }
      answers=answers.join("~")
    }
    else if(currentQuestion.QuestionType==="codequestions"){
      debugger;
      let code=jsCode;
      answers.push(code);
    }
    debugger;
    console.log("Answer",answers[0])
    debugger;
    fetch("http://localhost:3001/assessment/updateScore", {
      method: "PATCH",
      body: JSON.stringify({
        "AssessmentId": ReactSession.get("AssessmentId"),
        "QuestionId":currentQuestion.QuestionId,
        "QuestionTypeId":currentQuestion.QuestionTypeId,
        "Answer":answers
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json()).then((data) => {
      debugger;
      console.log(data);
      generateQuestion()
    });
    
  }

  function generateQuestion(){
    let currentSection=document.getElementById("section").innerHTML;
          if(currentSection==="Objective"){
            fetch(`http://localhost:3001/assessment/getQuestion/Objective/${ReactSession.get("AssessmentId")}`)
              .then((response) => response.json())
              .then((data) => {
                debugger;
                console.log("Fetch 1",data);
                let type=data.pickedQuestion.QuestionTypeId.charAt(0)==="M"?"mcqquestions":data.pickedQuestion.QuestionTypeId.charAt(0)==="F"?"fibquestions":"codequestions"
                fetch(`http://localhost:3001/${type}/onlyQuestion/${data.pickedQuestion.QuestionTypeId}`)
                  .then((response) => response.json())
                  .then((data1) => {
                    debugger;
                    console.log("Fetch 2",data1);
                    // let formattedData
                    console.log("Question is ",data1[0].Question);
                    let Question=data1[0].Question;
                    let Question1;
                    let Question2;
                    let Question3;
                    if(type=="fibquestions"){
                      Question1=Question.replace("_____","_")
                      Question2=Question1.replace("____","_")
                      Question3=Question2.replace("___","_")
                      console.log("Yunus",Question3);
                      setCurrentQuestion({"QuestionData":Question3,"QuestionType":type,"QuestionId":data.pickedQuestion.QuestionId,"QuestionTypeId":data.pickedQuestion.QuestionTypeId});
                    }
                    else{
                      setCurrentQuestion({"QuestionData":data1,"QuestionType":type,"QuestionId":data.pickedQuestion.QuestionId,"QuestionTypeId":data.pickedQuestion.QuestionTypeId});
                    }
                     debugger;
                  });
              });
            }
          else{
            fetch(`http://localhost:3001/assessment/getQuestion/Coding/${ReactSession.get("AssessmentId")}`)
            .then((response) => response.json())
            .then((data) => {
              debugger;
              console.log("Fetch 1",data);
              let type=data.pickedQuestion.QuestionTypeId.charAt(0)==="M"?"mcqquestions":data.pickedQuestion.QuestionTypeId.charAt(0)==="F"?"fibquestions":"codequestions"
              fetch(`http://localhost:3001/${type}/onlyQuestion/${data.pickedQuestion.QuestionTypeId}`)
                .then((response) => response.json())
                .then((data1) => {
                  debugger;
                  console.log("Fetch 2",data1);
                  let input=data1[0].Answer.split("~")[0].split("##")[0];
                  let output=data1[0].Answer.split("~")[0].split("##")[1];
                  if(input.startsWith('[') && output.startsWith('[')){
                    setJsCode(`function yourCode(inputArr){\n\tlet arr=inputArr;\n\t//Enter your code here\n\treturn arr;\n}`)
                  }
                  else if(input.startsWith('[') && !output.startsWith('[')){
                    setJsCode(`function yourCode(inputArr){\n\tlet arr=inputArr;\n\t//Enter your code here\n\treturn outputstr;\n}`)
                  }
                  else if(!input.startsWith('[') && !output.startsWith('[')){
                    setJsCode(`function yourCode(inputString){\n\tlet mystr=inputString;\n\t//Enter your code here\n\treturn outputstr;\n}`)
                  }
                  else if(!input.startsWith('[') && output.startsWith('[')){
                    setJsCode(`function yourCode(inputString){\n\tlet mystr=inputString;\n\t//Enter your code here\n\treturn arr;\n}`)
                  }
                  setCurrentQuestion({"QuestionData":data1,"QuestionType":type,"QuestionId":data.pickedQuestion.QuestionId,"QuestionTypeId":data.pickedQuestion.QuestionTypeId});
                  debugger;
                });
            });
          }
    

    console.log("I am called");

  }


  function diffDates(datePost,dateUpdate){
    const diffTime = Math.abs(dateUpdate - datePost);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffDays,diffTime);
    if(diffDays==0)
    {
      return "today";
    }
    else if(diffDays==1)
    {
      return "yesterday";
    }
    else{
      return `${diffDays} days ago`
    }
    
  }
  function charIsLetter(char) {
    if (typeof char !== 'string') {
      return false;
    }
  
    return /^[a-z]+$/i.test(char);
  }
  function submitAssessmentParent(){
    
    console.log("Submitted");
    let display = document.querySelector('#time');
    let timeLeft=display.innerHTML.split(":")[0];
    clearTimeout(assessTime);
    fetch(`http://localhost:3001/jobs/${ReactSession.get("jobDetails").JobId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("ABC",data);
      let totalTimeSpent;
      let currentSection=document.getElementById("section").innerHTML;
      if(currentSection==="Objective"){
        let codingTimeLeft =Math.floor((parseInt(data[0].InterviewDuration)/100)*parseInt(data[0].ObjectiveCodingRatio.split(":")[1]));
        let objectiveTimeLeft=parseInt(timeLeft);
        totalTimeSpent=parseInt(data[0].InterviewDuration)-(codingTimeLeft+objectiveTimeLeft)
        console.log("Total Time Spent",totalTimeSpent);
      }
      else if(currentSection==="Coding"){
        let codingTimeLeft=parseInt(timeLeft);
        let objectiveTimeLeft=0;
        totalTimeSpent=parseInt(data[0].InterviewDuration)-(codingTimeLeft+objectiveTimeLeft)
        console.log("Total Time Spent",totalTimeSpent);
      }
      fetch(`http://localhost:3001/applies/${ReactSession.get("userId")}`)
      .then((response) => response.json())
      .then((data) => {
        
        console.log(data);
        let present=_.filter(data,(value)=>{
          if(value.JobId===ReactSession.get("jobDetails").JobId){
            return value;
          }
        })

        fetch("http://localhost:3001/assessment", {
          method: "PATCH",
          body: JSON.stringify({
            "ApplicationId": present[0].ApplicationId,
            "AssessmentTime":totalTimeSpent,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then((response) => response.json()).then((data) => {
          console.log(data);
          navigate("/Apply");
        });

      });
    });
  }
  function startTimer(duration, display) {
      var timer = duration, minutes, seconds;
      function submitAssessment(){
        console.log("Submitted");
        let display = document.querySelector('#time');
        let timeLeft=display.innerHTML.split(":")[0];
        clearTimeout(assessTime);
        fetch(`http://localhost:3001/jobs/${ReactSession.get("jobDetails").JobId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("ABC",data);
          let totalTimeSpent;
          let currentSection=document.getElementById("section").innerHTML;
          if(currentSection==="Objective"){
            let codingTimeLeft =((parseInt(data[0].InterviewDuration)/100)*parseInt(data[0].ObjectiveCodingRatio.split(":")[1]));
            let objectiveTimeLeft=parseInt(timeLeft);
            totalTimeSpent=parseInt(data[0].InterviewDuration)-(codingTimeLeft+objectiveTimeLeft)
            console.log("Total Time Spent",totalTimeSpent);
          }
          else if(currentSection==="Coding"){
            let codingTimeLeft=timeLeft;
            let objectiveTimeLeft=0;
            totalTimeSpent=parseInt(data[0].InterviewDuration)-(codingTimeLeft+objectiveTimeLeft)
            console.log("Total Time Spent",totalTimeSpent);
          }
          fetch(`http://localhost:3001/applies/${ReactSession.get("userId")}`)
          .then((response) => response.json())
          .then((data) => {
            
            console.log(data);
            let present=_.filter(data,(value)=>{
              if(value.JobId===ReactSession.get("jobDetails").JobId){
                return value;
              }
            })

            fetch("http://localhost:3001/assessment", {
              method: "PATCH",
              body: JSON.stringify({
                "ApplicationId": present[0].ApplicationId,
                "AssessmentTime":totalTimeSpent,
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then((response) => response.json()).then((data) => {
              console.log(data);
              navigate("/Apply");
            });

          });
        });
      }
      assessTime=setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (--timer < 0) {
              let currentSection=document.getElementById("section").innerHTML;
              if(currentSection==="Objective"){
                
                fetch(`http://localhost:3001/jobs/${ReactSession.get("jobDetails").JobId}`)
                .then((response) => response.json())
                .then((data) => {
                  console.log("ABC",data);
                  var minutes =((parseInt(data[0].InterviewDuration)/100)*parseInt(data[0].ObjectiveCodingRatio.split(":")[1])) * 60;
                  timer=minutes;
                  document.getElementById("section").innerHTML="Coding"
                  generateQuestion();
                });
                
              }
              else{
                submitAssessment();
              }
          }
      }, 1000);
      
  }
  useEffect(() => {
    if(ReactSession.get("userId")==null){
      navigate("/Login");
    }
    else{
      

      
      fetch(`http://localhost:3001/applies/${ReactSession.get("userId")}`)
      .then((response) => response.json())
      .then((data) => {
        
        console.log(data);
        let present=_.filter(data,(value)=>{
          if(value.JobId===ReactSession.get("jobDetails").JobId){
            return value;
          }
        })
        if(present.length<=0){
          navigate("/Home");
        }
        else{
          fetch(`http://localhost:3001/assessment/${present[0].ApplicationId}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Assessment details",data);
            if(data.length<=0){
              console.log("Assessment just started");
              fetch("http://localhost:3001/assessment", {
                method: "POST",
                body: JSON.stringify({
                  "ApplicationId": present[0].ApplicationId
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8"
                }
              }).then((response) => response.json()).then((data) => {
                console.log("Assessment Id",data);
                ReactSession.setStoreType("sessionStorage");
                ReactSession.set("AssessmentId",data[0].AssessmentId)
                // setApplied(present);
                console.log(present);
                fetch(`http://localhost:3001/jobs/${ReactSession.get("jobDetails").JobId}`)
                .then((response) => response.json())
                .then((data) => {
                  console.log("ABC",data);
                  
                  var minutes =((parseInt(data[0].InterviewDuration)/100)*parseInt(data[0].ObjectiveCodingRatio.split(":")[0])) * 60;
                  let display = document.querySelector('#time');
                  
                    generateQuestion();
                    startTimer(minutes, display);
                  
                  
                });
              });
              
            }
            else{
              navigate("/Apply")
            }
          });
        }
      })
        
    }
      
},[])


  return (
    <div className="Assessment">
      <Navbar />
      <div className='Main'>
          <div className='Main-Job'>
            <div className='Main-Job-title'><div><span id='section'>Objective</span> Questions - <span id='time'>40:00</span> Mins left</div><span><button onClick={updateScore}>Next</button></span></div>
          </div>
          <div className='Main-Job-card'>
          <div className='Main-Job-card-title'>{currentQuestion?currentQuestion.QuestionType==="fibquestions"?"Fill in the Blanks":currentQuestion.QuestionType==="mcqquestions"?"Multiple Choice Questions":"Coding":null}</div>
          {currentQuestion?<div id='QuestionData' questionid={currentQuestion.QuestionId} questiontypeid={currentQuestion.QuestionTypeId}></div>:null}
            {currentQuestion?currentQuestion.QuestionType==="fibquestions" && <div className='Main-Job-card-FITB'>
              {

                Array.from(currentQuestion.QuestionData).map((char,index)=>{
                  if(char==="_"){
                    return <input key={index} type='text' className='Main-Job-card-FITB-blank'/>
                  }
                  else{
                    return char
                  }
                })
                
                // currentQuestion.QuestionData[0].Question
              }
              {currentQuestion?<img className='Questionimg' src={`http://localhost:3001/static/images/${currentQuestion.QuestionTypeId}.jpg`} onError={(event) => event.target.style.display = 'none'}/>:null}
              {/* What is most advandced <input type="text" className='Main-Job-card-FITB-blank'/> programming <input type="text" className='Main-Job-card-FITB-blank'/> Language? */}
            </div>:null}
            {currentQuestion?currentQuestion.QuestionType==="mcqquestions" && <div className='Main-Job-card-MCQ'>
                <div className='Main-Job-card-MCQ-Question'>
                  {currentQuestion.QuestionData[0].Question}<br/><br/>
                  {currentQuestion?<img className='Questionimg' src={`http://localhost:3001/static/images/${currentQuestion.QuestionTypeId}.jpg`} onError={(event) => event.target.style.display = 'none'}/>:null}
                </div>
                <div className='Main-Job-card-MCQ-Options'>
                  {currentQuestion.QuestionData[0].Options.split("~").map((elem,key)=>{
                    return <div className='Main-Job-card-MCQ-Options-Option' onClick={(e)=>{
                      if(e.currentTarget.classList.contains("Main-Job-card-MCQ-Options-Option-active")){
                        e.currentTarget.classList.remove("Main-Job-card-MCQ-Options-Option-active")
                      }
                      else{
                        e.currentTarget.classList.add("Main-Job-card-MCQ-Options-Option-active")
                      }
                    }} key={key}>{elem}</div>
                  })}
                </div>
            </div>:null}
            {currentQuestion?currentQuestion.QuestionType==="codequestions" &&  <div className='Main-Job-card-Coding'>
            <div className='Main-Job-card-Coding-Question'>
                  {currentQuestion.QuestionData[0].Question}<br/>
                  {currentQuestion?<img className='Questionimg' src={`http://localhost:3001/static/images/${currentQuestion.QuestionTypeId}.jpg`} onError={(event) => event.target.style.display = 'none'}/>:null}
                </div>
                <Editor className="Main-Job-card-Coding-Question-CodeArea" value={jsCode} onChange={setJsCode} />
            </div>:null}
            
          </div>
          <div className='Main-Job'>
            <div className='Main-Job-actions'><div><button onClick={submitAssessmentParent}>Submit</button></div><span></span></div>
          </div>
      </div>
    </div>
  );
}

export default Assessment;
