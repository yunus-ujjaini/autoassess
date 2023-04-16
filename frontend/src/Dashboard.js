import './css/Dashboard.css';
import job from './css/job.svg'
import viewjobs from './css/viewJob.svg'
import question from './css/question.svg'
import viewquestions from './css/viewQuestions.svg'
import search from './css/search.svg'
import link from './css/link.svg'
import viewApplications from './css/viewApplications.svg'
import Navbar from './Navbar';
import { Outlet, Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import {ReactSession} from 'react-client-session';
import _ from 'lodash';

function Dashboard() {
  const navigate = useNavigate();
  let [location,setLocation]=useState([]);
  let [searchedLocation,setSearchedLocation]=useState([]);
  let [openJobs,setOpenJobs]=useState([]);
  let [searchedOpenJobs,setSearchedOpenJobs]=useState([]);
  let [allJobs,setAllJobs]=useState([]);
  let [searchedAllJobs,setSearchedAllJobs]=useState([]);
  let [category,setCategory]=useState([]);
  let [searchedCategory,setSearchedCategory]=useState([]);
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

  function openModalLoc(){
    let modal=document.getElementById('modalLoc');
    let dashboard=document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.add("openModal");
    dashboard.classList.add('DashboardContainerBlur');
    document.getElementById("locationInput").value="";
  }
  function openModalCat(){
    let modal=document.getElementById('modalCat');
    let dashboard=document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.add("openModal");
    dashboard.classList.add('DashboardContainerBlur');
    document.getElementById("categoryInput").value="";
  }
  function closeModalLoc(){
    let modal=document.getElementById('modalLoc');
    let dashboard=document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.remove("openModal");
    dashboard.classList.remove('DashboardContainerBlur');
  }
  function closeModalCat(){
    let modal=document.getElementById('modalCat');
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
  function viewApplicants(JobId,JobTitle){
  }
  function deleteJob(JobId,JobTitle){
    let confirmation= window.confirm(`Are you sure you want to delete Job with title ${JobTitle}`);
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
         setOpenJobs(data);
         setSearchedOpenJobs(data);
        })
        .catch((err) => {
           console.log(err.message);
        });
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
        closeModalLoc();
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
  function searchOpenJobs(){
    let searchText=document.getElementById('jobSearch').value
    
    let searchedData=_.filter(openJobs,function(j){
      
      return j.JobTitle.includes(searchText);
    })
    setSearchedOpenJobs(searchedData);
  }
  function searchAllJobs(){
    let searchText=document.getElementById('jobSearchAll').value
    
    let searchedData=_.filter(allJobs,function(j){
      
      return j.JobTitle.includes(searchText);
    })
    setSearchedAllJobs(searchedData);
  }
  function addCategory(){
    let category=document.getElementById('categoryInput').value;
    let Allgood=true;
    if(category==null || category==''){
      document.getElementById('categoryInput').setAttribute("Validation","Cannot be blank");
      document.getElementById('modalInputV').setAttribute("Validation","Category cannot be blank");
      Allgood=false;
    }
    else{
          document.getElementById('categoryInput').removeAttribute("Validation");
    }
    if(Allgood){
      console.log("Sending data");
      fetch("http://localhost:3001/category", {
        method: "POST",
        body: JSON.stringify({
          "QuestionCategory": category
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        setCategory(data);
        setSearchedCategory(data);
        console.log("Im executed")
        closeModalCat();
      });
    }
  }
  function searchCategory(){
    let searchText=document.getElementById('categorySearch').value
    
    let searchedData=_.filter(category,function(c){
      
      return c.QuestionCategory.includes(searchText);
    })
    setSearchedCategory(searchedData);
  }
  function deleteCategory(CategoryId,Category){
    let confirmation= window.confirm(`Are you sure you want to delete Question Category ${Category}`);
    if(confirmation){
     console.log(CategoryId);
       fetch("http://localhost:3001/category", {
         method: "DELETE",
         body: JSON.stringify({
           "QuestionCategoryId": CategoryId
         }),
         headers: {
           "Content-type": "application/json; charset=UTF-8"
         }
       }).then((response) => response.json()).then((data)=>{
          if(!data.Error){
            setCategory(data);
            setSearchedCategory(data);
          }
          else{
            alert(data.Error)
          }
       });
    }
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
    fetch('http://localhost:3001/category')
      .then((response) => response.json())
      .then((data) => {
        setCategory(data);
        setSearchedCategory(data);
      })
      .catch((err) => {
          console.log(err.message);
      });
    fetch(`http://localhost:3001/jobs/havingInterviewer/${ReactSession.get("InterviewerId")}`)
    .then((response) => response.json())
    .then((data) => {
      setAllJobs(data);
      setSearchedAllJobs(data);
      let openJobsarr=data.filter((job)=>{
        if(job.JobStatus!='Open')
        {

        }
        else
          return job;
      })
      setOpenJobs(openJobsarr);
      setSearchedOpenJobs(openJobsarr);
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
    <div className='modal' id='modalLoc'>
      <div className='modal-title'>Add Location <button className='closeModal' onClick={closeModalLoc}>X</button></div>
      <div className='modal-body'>
        <div className='validation'><input id='locationInput' className='modal-input-text' type="text" placeholder='Location'/><span id="modalInputV" validation="Cannot be blank"></span></div>
        <button className='modal-button' onClick={addLocation}>Add</button>
      </div>
    </div>
    <div className='modal' id='modalCat'>
      <div className='modal-title'>Add Category <button className='closeModal' onClick={closeModalCat}>X</button></div>
      <div className='modal-body'>
        <div className='validation'><input id='categoryInput' className='modal-input-text' type="text" placeholder='Category'/><span id="modalInputV" validation="Cannot be blank"></span></div>
        <button className='modal-button' onClick={addCategory}>Add</button>
      </div>
    </div>
    <div className='DashboardContainer'>
    <div className='Dashboard'>
      <div className='dashboard-header'>
        <h1 className='dashboard-title'>{getGreeting()}<br/><span>{ReactSession.get("InterviewerName")}</span></h1>
        <button id='logout' onClick={logout}>Logout</button>
      </div>
    </div>
    <div className='DashboardItems'>
      <div className='QuickLinks DashboardItem'>
        <div className='DashboardItem-header'>
          QuickLinks
        </div>
        <div className='DashboardItem-contents'>
          
          <div className='content' onClick={()=>{ReactSession.set('editJob',null);navigate("/Interviewer/Dashboard/CreateJob")}}><img className='content-icon' src={job} alt='job'/>Create Job</div>
          <div className='content' onClick={()=>{ReactSession.set('editJob',null);navigate("/Interviewer/Dashboard/ViewJobs")}}><img className='content-icon' src={viewjobs} alt='view job'/>View Jobs</div>
          <div className='content' onClick={()=>{navigate("/Interviewer/Dashboard/AddQuestions")}}><img className='content-icon' src={question} alt='question'/>Add Questions</div>
          <div className='content' onClick={()=>{navigate("/Interviewer/Dashboard/ViewQuestions")}}><img className='content-icon' src={viewquestions} alt='question'/>View Questions</div>
          <div className='content' onClick={()=>{navigate("/Interviewer/Dashboard/LinkQuestions")}}><img className='content-icon' src={link} alt='question'/>Link Questions to Job</div>
          <div className='content' onClick={()=>{navigate("/Interviewer/Dashboard/ViewApplicants")}}><img className='content-icon' src={viewApplications} alt='question'/>View Applications</div>
        </div>
      </div>
      <div className='OpenJobs DashboardItem'>
        <div className='DashboardItem-header'>
          Search Open Jobs
        </div>
        <div className='DashboardItem-contents'>
          <div className='contentTextContainer'><input id='jobSearch' className='contentText' type="text" placeholder="Job title..." onKeyUp={searchOpenJobs}/>
            <img className='content-icon' src={search} alt='search'/>
          </div>
          <div className='contentDataContainer'>
            {searchedOpenJobs.map(job => {return <div key={job.JobId} className='contentData'  onDoubleClick={()=>{deleteJob(job.JobId,job.JobTitle)}}>{job.JobTitle}</div>})}
            {searchedOpenJobs.length<=0? <div >No Open Jobs</div> : null}
          </div>
        </div>
          
      </div>
      <div className='ManageLocations DashboardItem'>
        <div className='DashboardItem-header'>
          Manage Locations
          <button className='actionButton' id='addLocation' onClick={()=>{openModalLoc()}}>+</button>
        </div>
        <div className='DashboardItem-contents'>
          <div className='contentTextContainer'><input id='locationSearch' className='contentText' type="text" placeholder="Location..." onKeyUp={searchLocation}/>
            <img className='content-icon' src={search} alt='search'/>
          </div>
          <div className='contentDataContainer'>
            {searchedLocation.map(location => {return <div key={location.LocationId} className='contentData'  onDoubleClick={()=>{deleteLocation(location.LocationId,location.Location)}}>{location.Location}</div>})}
            {searchedLocation.length<=0? <div >No Locations</div> : null}
          </div>
        </div>
          
      </div>
      <div className='ManageLocations DashboardItem'>
        <div className='DashboardItem-header'>
          Manage Question Categories
          <button className='actionButton' id='addLocation' onClick={()=>{openModalCat()}}>+</button>
        </div>
        <div className='DashboardItem-contents'>
          <div className='contentTextContainer'><input id='categorySearch' className='contentText' type="text" placeholder="Category..." onKeyUp={searchCategory} />
            <img className='content-icon' src={search} alt='search'/>
          </div>
          <div className='contentDataContainer'>
            {searchedCategory.map(category => {return <div key={category.QuestionCategoryId} className='contentData'  onDoubleClick={()=>{deleteCategory(category.QuestionCategoryId,category.QuestionCategory)}}>{category.QuestionCategory}</div>})}
            {searchedCategory.length<=0? <div >No Category</div> : null}
          </div>
        </div>
          
      </div>
      {/* <div className=' DashboardItem'>
        <div className='DashboardItem-header'>
          Search Jobs to view Applicants
        </div>
        <div className='DashboardItem-contents'>
          <div className='contentTextContainer'><input id='jobSearch' className='contentText' type="text" placeholder="Job title..." onKeyUp={searchAllJobs}/>
            <img className='content-icon' src={search} alt='search'/>
          </div>
          <div className='contentDataContainer'>
            {searchedAllJobs.map(job => {return <div key={job.JobId} className='contentData'  onClick={()=>{viewApplicants(job.JobId,job.JobTitle)}}>{job.JobTitle}</div>})}
            {searchedAllJobs.length<=0? <div >No Jobs Found</div> : null}
          </div>
        </div>
          
      </div> */}
    </div>
    </div>
   
    </>
  );
}

export default Dashboard;
