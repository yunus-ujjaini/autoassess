import './css/AdminPanel.css';
import job from './css/job.svg'
import viewjobs from './css/viewJob.svg'
import question from './css/question.svg'
import viewquestions from './css/viewQuestions.svg'
import search from './css/search.svg'
import Navbar from './Navbar';
import { Outlet, Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import {ReactSession} from 'react-client-session';
import _ from 'lodash';

function AdminPanel() {
  const navigate = useNavigate();
  let [location,setLocation]=useState([]);
  let [searchedLocation,setSearchedLocation]=useState([]);
  let [interviewers,setInterviewers]=useState([]);
  let [searchedInterviewers,setSearchedInterviewers]=useState([]);
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
  function deleteLocation(LocationId,Location){
   let confirmation= window.confirm(`Are you sure you want to delete location ${Location}`);
   if(confirmation){
    console.log(LocationId);
      fetch("http://localhost:3001/locations", {
        method: "DELETE",
        body: JSON.stringify({
          "LocationId": LocationId
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        if(!data.Error){
          setLocation(data);
          setSearchedLocation(data);
          console.log("Im executed")
        }
        else{
          alert(data.Error)
        }
      });
   }
  }
  function addLocation(){
    let location=document.getElementById('locationInput').value;
    let Allgood=true;
    if(location==null || location==''){
      document.getElementById('locationInput').setAttribute("Validation","Cannot be blank");
      document.getElementById('modalInputV').setAttribute("Validation","Location cannot be blank");
      Allgood=false;
    }
    else{
          document.getElementById('locationInput').removeAttribute("Validation");
    }
    if(Allgood){
      console.log("Sending data");
      fetch("http://localhost:3001/locations", {
        method: "POST",
        body: JSON.stringify({
          "Location": location
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        setLocation(data);
        setSearchedLocation(data);
        console.log("Im executed")
        document.getElementsByClassName("closeModal")[0].click();
      });
    }
  }
  function searchLocation(){
    let searchText=document.getElementById('locationSearch').value
    
    let searchedData=_.filter(location,function(l){
      
      return l.Location.includes(searchText);
    })
    setSearchedLocation(searchedData);
  }
  function searchInterviewers(){
    let searchText=document.getElementById('interviewerSearch').value
    
    let searchedData=_.filter(interviewers,function(i){
      
      return i.InterviewerName.includes(searchText);
    })
    setSearchedInterviewers(searchedData);
  }
  function deleteInterviewer(a,b){
    // let searchText=document.getElementById('locationSearch').value
    
    // let searchedData=_.filter(location,function(l){
      
    //   return l.Location.includes(searchText);
    // })
    // setSearchedLocation(searchedData);
  }
  function approveInterviewer(InterviewerId){
    fetch(`http://localhost:3001/interviewersignup/${InterviewerId}`, {
      method: "PATCH",
      body: JSON.stringify({
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json()).then((data) => {
      let pendingApprovalInterviewers=_.filter(data,(i)=>{
        return !i.InterviewerApproved;
      })
      setInterviewers(pendingApprovalInterviewers);
      setSearchedInterviewers(pendingApprovalInterviewers);
      setInfomessage("Interviewer Approved!")
          setTimeout(()=>{
            setInfomessage(null);
          },5000);
    });
  }
  function rejectInterviewer(InterviewerId){
    fetch(`http://localhost:3001/interviewersignup/${InterviewerId}`, {
      method: "Delete",
      body: JSON.stringify({
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json()).then((data) => {
      let pendingApprovalInterviewers=_.filter(data,(i)=>{
        return !i.InterviewerApproved;
      })
      setInterviewers(pendingApprovalInterviewers);
      setSearchedInterviewers(pendingApprovalInterviewers);
      setInfomessage("Interviewer Deleted!")
          setTimeout(()=>{
            setInfomessage(null);
          },5000);
    });
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

    fetch('http://localhost:3001/locations')
        .then((response) => response.json())
        .then((data) => {
         setLocation(data);
         setSearchedLocation(data);
        })
        .catch((err) => {
           console.log(err.message);
        });

    fetch('http://localhost:3001/Interviewersignup')
        .then((response) => response.json())
        .then((data) => {
          let pendingApprovalInterviewers=_.filter(data,(i)=>{
            return !i.InterviewerApproved;
          })
          setInterviewers(pendingApprovalInterviewers);
          setSearchedInterviewers(pendingApprovalInterviewers);
          
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
    <div className='modal'>
      <div className='modal-title'>Add Location <button className='closeModal' onClick={closeModal}>X</button></div>
      <div className='modal-body'>
        <div className='validation'><input id='locationInput' className='modal-input-text' type="text" placeholder='Location'/><span id="modalInputV" validation="Cannot be blank"></span></div>
        <button className='modal-button' onClick={addLocation}>Add</button>
      </div>
    </div>
    <div className='DashboardContainer'>
    <div className='Dashboard'>
      <div className='dashboard-header'>
        <h1 className='dashboard-title'>{getGreeting()}<br/><span>{ReactSession.get("InterviewerName")}</span></h1>
        <button id='logout' onClick={logout}>Logout</button>
      </div>
    </div>
    <div className='AdminPanelItems'>
      <div className='ManageLocations AdminPanelItem'>
        <div className='AdminPanelItem-header'>
          Manage Locations
          <button className='actionButton' id='addLocation' onClick={openModal}>+</button>
        </div>
        <div className='AdminPanelItem-contents'>
          <div className='contentTextContainer'><input id='locationSearch' className='contentText' type="text" placeholder="Location..." onKeyUp={searchLocation}/>
            <img className='content-icon' src={search} alt='search'/>
          </div>
          <div className='contentDataContainer'>
            {searchedLocation.map(location => {return <div key={location.LocationId} className='contentData'  onDoubleClick={()=>{deleteLocation(location.LocationId,location.Location)}}>{location.Location}</div>})}
            {searchedLocation.length<=0? <div >No Locations</div> : null}
          </div>
        </div>
          
      </div>
      <div className='OpenJobs AdminPanelItem'>
        <div className='AdminPanelItem-header'>
          Approve Interviewers
        </div>
        <div className='AdminPanelItem-contents'>
          <div className='contentTextContainer'><input id='interviewerSearch' className='contentText' type="text" placeholder="Interviewer..." onKeyUp={searchInterviewers}/>
            <img className='content-icon' src={search} alt='search'/>
          </div>
            <div className='contentDataContainer'>
            {searchedInterviewers.map(i => {return <div key={i.InterviewerId} className='contentData'  onDoubleClick={()=>{deleteInterviewer(i.InterviewerId,i.InterviewerName)}}>{i.InterviewerName} <div className='contentDataActions'><div className='contentDataActionGroup'><div className="contentDataAction" onClick={()=>{approveInterviewer(i.InterviewerId)}}>Approve</div><div className="contentDataAction" onClick={()=>{rejectInterviewer(i.InterviewerId)}}>Reject</div></div></div></div>})}
            {searchedInterviewers.length<=0? <div >No Interviewers</div> : null}
          </div>
        </div>
          
      </div>
    </div>
    {infomessage && <div className='infoMessage'>{infomessage}</div>}
    </div>
   
    </>
  );
}

export default AdminPanel;
