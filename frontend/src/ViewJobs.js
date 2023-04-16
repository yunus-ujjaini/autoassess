import './css/ViewJobs.css';
import job from './css/job.svg'
import viewjobs from './css/viewJob.svg'
import question from './css/question.svg'
import viewquestions from './css/viewQuestions.svg'
import search from './css/search.svg'
import editicon from './css/edit.svg'
import Navbar from './Navbar';
import { Outlet, Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import {ReactSession} from 'react-client-session';
import _ from 'lodash';

function ViewJobs() {
  const navigate = useNavigate();
  let [jobs,setJobs]=useState([]);
  let [searchedJobs,setSearchedJobs]=useState([]);
  let [infomessage, setInfomessage] = useState(null);
  ReactSession.setStoreType("sessionStorage");
  function getGreeting(){
    ReactSession.setStoreType("sessionStorage");
    var today = new Date()
    var curHr = today.getHours()

    if (curHr < 12) {
      return `Good Morning,`
    } else if (curHr < 18) {
      return `Good Afternoon,`
    } else {
      return `Good Evening,`
    }
  }

  function logout(){
    ReactSession.remove("InterviewerId"); 
    ReactSession.remove("InterviewerName"); 
    // document.getElementById("toNavigate").click();
    navigate("/Interviewer/Login");
  }

  function openModal(){
    let modal=document.getElementsByClassName('modal')[0];
    let dashboard=document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.add("openModal");
    dashboard.classList.add('DashboardContainerBlur');
    document.getElementById("locationInput").value="";
  }
  function closeModal(){
    let modal=document.getElementsByClassName('modal')[0];
    let dashboard=document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.remove("openModal");
    dashboard.classList.remove('DashboardContainerBlur');
  }

  function applyLight(){
    let dashboard=document.getElementsByClassName("DashboardContainer")[0];
    dashboard.style.backgroundPosition="left";
    var r = document.querySelector(':root');
    r.style.setProperty('--DashboardForeground', '#1e255b');
    r.style.setProperty('--DashboardForegroundSecondary', 'white');
    r.style.setProperty('--Dashboardicons', 'invert(12%) sepia(73%) saturate(1469%) hue-rotate(213deg) brightness(97%) contrast(95%)');
    r.style.setProperty('--Dashboardiconshover', 'invert(100%) sepia(100%) saturate(14%) hue-rotate(212deg) brightness(104%) contrast(104%)');
    r.style.setProperty('--DashboardBackground', 'rgba(255,255,255,0.5)');
    r.style.setProperty('--backdrop', 'blur(2px) grayscale(90%);');
    ReactSession.setStoreType("sessionStorage");
    ReactSession.set("theme","light");
  }
  function applyClassic(){
    let dashboard=document.getElementsByClassName("DashboardContainer")[0];
    dashboard.style.backgroundPosition="center";
    var r = document.querySelector(':root');
    // r.style.setProperty('--DashboardForeground', 'white');
    // r.style.setProperty('--DashboardForegroundSecondary', 'rgb(167,79,52)');
    // r.style.setProperty('--Dashboardicons', 'invert(93%) sepia(27%) saturate(343%) hue-rotate(344deg) brightness(92%) contrast(91%)');
    // r.style.setProperty('--Dashboardiconshover', 'invert(66%) sepia(11%) saturate(1630%) hue-rotate(346deg) brightness(93%) contrast(90%)');
    // r.style.setProperty('--DashboardBackground', 'rgba(251,188,10,0.8)');
    // r.style.setProperty('--backdrop', 'blur(0px) grayscale(10%);');

    r.style.setProperty('--DashboardForeground', 'rgb(54,69,79)');
    r.style.setProperty('--DashboardForegroundSecondary', 'rgb(247,222,174)');
    r.style.setProperty('--Dashboardicons', 'invert(24%) sepia(10%) saturate(1173%) hue-rotate(161deg) brightness(93%) contrast(88%)');
    r.style.setProperty('--Dashboardiconshover', 'invert(97%) sepia(40%) saturate(4392%) hue-rotate(298deg) brightness(125%) contrast(94%)');
    r.style.setProperty('--DashboardBackground', 'rgba(251,188,10,0.8)');
    r.style.setProperty('--backdrop', 'blur(0px) grayscale(0%);');
    ReactSession.setStoreType("sessionStorage");
    ReactSession.set("theme","classic");
  }
  function applyDark(){
    let dashboard=document.getElementsByClassName("DashboardContainer")[0];
    dashboard.style.backgroundPosition="right";
    var r = document.querySelector(':root');
    // r.style.setProperty('--DashboardForegroundSecondary', 'rgb(31, 138, 112)');
    r.style.setProperty('--DashboardForeground', 'rgb(230, 226, 195)');
    r.style.setProperty('--DashboardForegroundSecondary', 'rgb(54,69,79)');
    r.style.setProperty('--Dashboardicons', 'invert(93%) sepia(12%) saturate(407%) hue-rotate(358deg) brightness(99%) contrast(82%)');
    r.style.setProperty('--Dashboardiconshover', ' invert(24%) sepia(10%) saturate(1173%) hue-rotate(161deg) brightness(93%) contrast(88%)');
    r.style.setProperty('--DashboardBackground', 'rgba(46,111,172,0.5)');
    r.style.setProperty('--backdrop', 'blur(0px) grayscale(0%);');
    ReactSession.setStoreType("sessionStorage");
    ReactSession.set("theme","dark");
  }
  function deleteJob(JobId,JobTitle){
   let confirmation= window.confirm(`Are you sure you want to delete Job with Title ${JobTitle}`);
   if(confirmation){
    console.log(JobId);
      fetch("http://localhost:3001/jobs", {
        method: "DELETE",
        body: JSON.stringify({
          "JobId": JobId
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        fetch(`http://localhost:3001/jobs/havingInterviewer/${ReactSession.get("InterviewerId")}`)
        .then((response) => response.json())
        .then((data) => {
         setJobs(data);
         setSearchedJobs(data);
        })
        .catch((err) => {
           console.log(err.message);
           setInfomessage(`Job "${JobTitle}"  Deleted!`);
          setTimeout(() => {
            setInfomessage(null);
          }, 5000);
        });
      });
   }
  }
  
  function searchJobs(){
    let searchText=document.getElementById('jobSearch').value
    
    let searchedData=_.filter(jobs,function(l){
      
      return l.JobTitle.includes(searchText);
    })
    setSearchedJobs(searchedData);
  }

  function changeJobStatus(JobId,status){
    fetch("http://localhost:3001/jobs/changeJobStatus", {
        method: "POST",
        body: JSON.stringify({
          "JobId": JobId,
          "JobStatus":status
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data1)=>{
        fetch(`http://localhost:3001/jobs/havingInterviewer/${ReactSession.get("InterviewerId")}`)
        .then((response) => response.json())
        .then((data) => {
         setJobs(data);
         setSearchedJobs(data);
        })
        .catch((err) => {
           console.log(err.message);
        });
      });
  }

  function editJob(JobId,SkillsRequired){
    ReactSession.set('editJob',JobId);
    let skillsAndExpertise=[];
    SkillsRequired.split(";").map((elem)=>{
      fetch(`http://localhost:3001/category/${elem.split(":")[0]}`)
          .then((response) => response.json())
          .then((data) => {
            skillsAndExpertise.push({
              "skill":elem.split(":")[0],
              "expertise":elem.split(":")[1],
              "skillName":data[0].QuestionCategory
            })
          })
          .catch((err) => {
             console.log(err.message);
          });


      
    })
    setTimeout(()=>{
      ReactSession.set('editJobSkills',skillsAndExpertise);
      navigate("/Interviewer/Dashboard/CreateJob");
    },1000)
    
  }

  function navigateToCreateJob(){
    ReactSession.set('editJob',null);
    navigate("/Interviewer/Dashboard/CreateJob");
  }
  useEffect(() => {
    if(ReactSession.get("InterviewerId")==null){
  
      navigate("/Interviewer/Login");
      
    }
    else{
      if(ReactSession.get("theme")=="light"){
        applyLight();
      }
      else if(ReactSession.get("theme")=="classic"){
        applyClassic();
      }
      else
        applyDark();
  
      fetch(`http://localhost:3001/jobs/havingInterviewer/${ReactSession.get("InterviewerId")}`)
          .then((response) => response.json())
          .then((data) => {
           setJobs(data);
           setSearchedJobs(data);
          })
          .catch((err) => {
             console.log(err.message);
          });
    }
    

},[])
  


  return (
    <>
    <div className='themeChanger'>
        <div className='lightTheme theme' onClick={applyLight}></div>
        <div className='classicTheme theme' onClick={applyClassic}></div>
        <div className='darkTheme theme' onClick={applyDark}></div>
    </div>
    <div className='DashboardContainer'>
    <div className='Dashboard'>
      <div className='dashboard-header'>
        <h1 className='dashboard-title'>{getGreeting()}<br/><span>{ReactSession.get("InterviewerName")}</span></h1>
        <div className='dashboard-header-buttons'>
          <button id='home' onClick={()=>{navigate("/Interviewer/Dashboard/")}}>Home</button>
          <button id='logout' onClick={logout}>Logout</button>
        </div>
        
      </div>
    </div>
    <div className='ViewJobItems'>
      <div className='ViewJobItem'>
        <div className='ViewJobItem-header'>
          View Jobs
          <button className="ViewJobItem-header-buttons" onClick={navigateToCreateJob}>Create Jobs</button>
        </div>
        <div className='ViewJobItem-contents'>
          <div className='contentTextContainer'><input id='jobSearch' className='contentText' type="text" placeholder="Job Title..." onKeyUp={searchJobs}/>
            <img className='content-icon' src={search} alt='search'/>
          </div>
          <div className='contentDataContainer'>
            {searchedJobs.map(job => {return <div key={job.JobId} className='contentData'  onDoubleClick={()=>{deleteJob(job.JobId,job.JobTitle)}}>{job.JobTitle} <div className='contentDataActions'><div className='contentDataAction' onClick={()=>{editJob(job.JobId,job.SkillsRequired)}}><img src={editicon} alt='Edit'></img></div><div className='contentDataActionGroup'><div className={job.JobStatus=='Open'?'active contentDataAction':'contentDataAction'} onClick={()=>{changeJobStatus(job.JobId,"Open")}}>Open</div><div className={job.JobStatus=='Closed'?'active contentDataAction':'contentDataAction'} onClick={()=>{changeJobStatus(job.JobId,"Closed")}}>Closed</div></div></div></div>})}
            {searchedJobs.length<=0? <div >No Jobs</div> : null}
          </div>
        </div>
      </div>
    </div>
    {infomessage && <div className='infoMessage'>{infomessage}</div>}
    </div>
   
    </>
  );
}

export default ViewJobs;
