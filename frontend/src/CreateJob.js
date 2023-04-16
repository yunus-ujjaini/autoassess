import './css/CreateJob.css';
import job from './css/job.svg'
import viewjobs from './css/viewJob.svg'
import question from './css/question.svg'
import viewquestions from './css/viewQuestions.svg'
import search from './css/search.svg'
import Navbar from './Navbar';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import _ from 'lodash';
import Select from 'react-select';

function CreateJob() {
  const navigate = useNavigate();
  let [location, setLocation] = useState([]);
  let locationOptions;
  let InterviewerOptions;
  let [categoryOpts, setCategoryOpts] = useState([]);
  let [searchedCategoryOpts, setSearchedCategoryOpts] = useState([]);
  let [skillExpertiseRequired,setSkillExpertiseRequired]=useState([]);
  let [LocationOpts, setLocationOpts] = useState([]);
  let [InterviewerOpts, setInterviewerOpts] = useState([]);
  let [selectedInterviewers, setSelectedInterviewers] = useState([]);
  let [JobDetails, setJobDetails] = useState([]);
  let [selectedJobLocations, setSelectedJobLocations] = useState([]);
  let [selectedStatus, setSelectedStatus] = useState([]);
  let [infomessage, setInfomessage] = useState(null);
  let [count,setCount]=useState(0);





  ReactSession.setStoreType("sessionStorage");
  function getGreeting() {
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

  function logout() {
    ReactSession.remove("InterviewerId");
    ReactSession.remove("InterviewerName");
    // document.getElementById("toNavigate").click();
    navigate("/Interviewer/Login");
  }
  function charIsLetter(char) {
    if (typeof char !== 'string') {
      return false;
    }
  
    return /^[a-z]+$/i.test(char);
  }
  function openModal() {
    let modal = document.getElementsByClassName('modal')[0];
    let dashboard = document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.add("openModal");
    dashboard.classList.add('DashboardContainerBlur');
    document.getElementById("locationInput").value = "";
  }
  function closeModal() {
    let modal = document.getElementsByClassName('modal')[0];
    let dashboard = document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.remove("openModal");
    dashboard.classList.remove('DashboardContainerBlur');
  }

  function applyLight() {
    let dashboard = document.getElementsByClassName("DashboardContainer")[0];
    dashboard.style.backgroundPosition = "left";
    var r = document.querySelector(':root');
    r.style.setProperty('--DashboardForeground', '#1e255b');
    r.style.setProperty('--DashboardForegroundSecondary', 'white');
    r.style.setProperty('--Dashboardicons', 'invert(12%) sepia(73%) saturate(1469%) hue-rotate(213deg) brightness(97%) contrast(95%)');
    r.style.setProperty('--Dashboardiconshover', 'invert(100%) sepia(100%) saturate(14%) hue-rotate(212deg) brightness(104%) contrast(104%)');
    r.style.setProperty('--DashboardBackground', 'rgba(255,255,255,0.5)');
    r.style.setProperty('--backdrop', 'blur(2px) grayscale(90%);');
    ReactSession.setStoreType("sessionStorage");
    ReactSession.set("theme", "light");

  }
  function applyClassic() {
    let dashboard = document.getElementsByClassName("DashboardContainer")[0];
    dashboard.style.backgroundPosition = "center";
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
    ReactSession.set("theme", "classic");
  }
  function applyDark() {
    let dashboard = document.getElementsByClassName("DashboardContainer")[0];
    dashboard.style.backgroundPosition = "right";
    var r = document.querySelector(':root');
    // r.style.setProperty('--DashboardForegroundSecondary', 'rgb(31, 138, 112)');
    r.style.setProperty('--DashboardForeground', 'rgb(230, 226, 195)');
    r.style.setProperty('--DashboardForegroundSecondary', 'rgb(54,69,79)');
    r.style.setProperty('--Dashboardicons', 'invert(93%) sepia(12%) saturate(407%) hue-rotate(358deg) brightness(99%) contrast(82%)');
    r.style.setProperty('--Dashboardiconshover', ' invert(24%) sepia(10%) saturate(1173%) hue-rotate(161deg) brightness(93%) contrast(88%)');
    r.style.setProperty('--DashboardBackground', 'rgba(46,111,172,0.5)');
    r.style.setProperty('--backdrop', 'blur(0px) grayscale(0%);');
    ReactSession.setStoreType("sessionStorage");
    ReactSession.set("theme", "dark");
  }

  function clearForm(){
    setSearchedCategoryOpts([]);
    setSkillExpertiseRequired([]);
    setSelectedInterviewers([]);
    setJobDetails([]);
    setSelectedJobLocations([]);
    setSelectedStatus([]);
    document.getElementById("JobTitle").value="";
    document.getElementById("JobID").value="";
    document.getElementById("JobDesc").value="";
    ReactSession.set("editJobSkills",[]);
    ReactSession.set('editJob', null);
  }

  function addJob() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let JobID = document.getElementById('JobID').value;
    let JobTitle = document.getElementById('JobTitle').value;
    let JobDesc = document.getElementById('JobDesc').value;
    let JobLocation = [];
    let Allgood = true;
    
    if (JobTitle == null || JobTitle == '') {
      document.getElementById('JobTitle').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobTitleV').setAttribute("Validation", "Job Title cannot be blank");
      Allgood = false;
    }
    else {
      document.getElementById('JobTitle').removeAttribute("Validation");
    }

    if (JobID == null || JobID == '') {
      document.getElementById('JobID').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobIDV').setAttribute("Validation", "Job ID cannot be blank");
      Allgood = false;
    }
    else {
      document.getElementById('JobID').removeAttribute("Validation");
    }

    if (JobDesc == null || JobDesc == '') {
      document.getElementById('JobDesc').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobDescV').setAttribute("Validation", "Job Description cannot be blank");
      Allgood = false;
    }
    else {
      document.getElementById('JobDesc').removeAttribute("Validation");
    }

    if (selectedJobLocations.length <= 0) {
      document.getElementById('JobLocation').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobLocationV').setAttribute("Validation", "Job Location needs to be selected");
      Allgood=false
    }
    else {
      document.getElementById('JobLocation').removeAttribute("Validation");
    }

    if (searchedCategoryOpts.length <= 0) {
      document.getElementById('QuestionCategory').setAttribute("Validation", "Cannot be blank");
      document.getElementById('QuestionCategoryV').setAttribute("Validation", "Skills needs to be added");
      Allgood=false
    }
    else {
      document.getElementById('QuestionCategory').removeAttribute("Validation");
    }

    searchedCategoryOpts.forEach((o)=>{
      console.log(document.getElementById(`Skill${o.value}`))
      if(document.getElementById(`Skill${o.value}`).value>5 || document.getElementById(`Skill${o.value}`).value<1 || document.getElementById(`Skill${o.value}`).value=="" || document.getElementById(`Skill${o.value}`).value==null || charIsLetter(document.getElementById(`Skill${o.value}`).value))
      {
        document.getElementById(`Skill${o.value}`).setAttribute("Validation", "Cannot be blank");
        document.getElementById(`Skill${o.value}V`).setAttribute("Validation", "Please enter value between 1 and 5");
        Allgood=false
      }
      else{
        document.getElementById(`Skill${o.value}`).removeAttribute("Validation");
      }
    });


    if (selectedStatus.length <= 0) {
      document.getElementById('JobStatus').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobStatusV').setAttribute("Validation", "Job Status needs to be selected");
      Allgood=false
    }
    else {
      document.getElementById('JobStatus').removeAttribute("Validation");
    }


    if (Allgood) {
      console.log("Sending data");
      let skillsRequired="";
      searchedCategoryOpts.forEach((o)=>{
        let skill=String(o.value);
        let skillValue=String(document.getElementById(`Skill${o.value}`).value);
        skillsRequired=skillsRequired.concat(";",skill.concat(":",skillValue));
      })
      skillsRequired=skillsRequired.replace(";","")
    
      fetch("http://localhost:3001/jobs", {
        method: "POST",
        body: JSON.stringify({
          "JobTitle": JobTitle,
          "JobID": JobID,
          "JobDesc": JobDesc,
          "JobStatus": selectedStatus.value,
          "SkillsRequired":skillsRequired,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data) => {
        // setLocation(data);
        // setSearchedLocation(data);
        JobLocation = selectedJobLocations.map(value => { return value.value })
        JobLocation.forEach(location => {
          fetch("http://localhost:3001/jobs/jobslocation", {
            method: "POST",
            body: JSON.stringify({
              "JobId": data[data.length - 1].JobId,
              "LocationId": location
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          }).then((response) => response.json()).then((data1) => {
            console.log(data1);
            setInfomessage("Job Created!")
            
            setTimeout(() => {
              setInfomessage(null);
            }, 5000);
          });
        })

        fetch("http://localhost:3001/jobs/addInterviewer", {
            method: "POST",
            body: JSON.stringify({
              "JobId": data[data.length - 1].JobId,
              "InterviewerId": ReactSession.get("InterviewerId")
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          }).then((response) => response.json()).then((data1) => {
            console.log(data1);
          });

          selectedInterviewers.forEach(interviewer => {
            fetch("http://localhost:3001/jobs/addInterviewer", {
              method: "POST",
              body: JSON.stringify({
                "JobId": data[data.length - 1].JobId,
                "InterviewerId": interviewer.value
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then((response) => response.json()).then((data1) => {
              console.log(data1);
              clearForm();

            });
          })


      });
    }
  }
  
  function editJob() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let JobTitle = document.getElementById('JobTitle').value;
    let JobID = document.getElementById('JobID').value;
    let JobDesc = document.getElementById('JobDesc').value;
    let JobLocation = [];
    let Allgood = true;
    if (JobTitle == null || JobTitle == '') {
      document.getElementById('JobTitle').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobTitleV').setAttribute("Validation", "Job Title cannot be blank");
      Allgood = false;
    }
    else {
      document.getElementById('JobTitle').removeAttribute("Validation");
    }
    if (JobID == null || JobID == '') {
      document.getElementById('JobID').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobIDV').setAttribute("Validation", "Job ID cannot be blank");
      Allgood = false;
    }
    else {
      document.getElementById('JobID').removeAttribute("Validation");
    }
    if (JobDesc == null || JobDesc == '') {
      document.getElementById('JobDesc').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobDescV').setAttribute("Validation", "Job Description cannot be blank");
      Allgood = false;
    }
    else {
      document.getElementById('JobDesc').removeAttribute("Validation");
    }

    if (selectedJobLocations.length <= 0) {
      document.getElementById('JobLocation').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobLocationV').setAttribute("Validation", "Job Location needs to be selected");
      Allgood=false
    }
    else {
      document.getElementById('JobLocation').removeAttribute("Validation");
    }

    if (searchedCategoryOpts.length <= 0) {
      document.getElementById('QuestionCategory').setAttribute("Validation", "Cannot be blank");
      document.getElementById('QuestionCategoryV').setAttribute("Validation", "Skills needs to be added");
      Allgood=false
    }
    else {
      document.getElementById('QuestionCategory').removeAttribute("Validation");
    }

    searchedCategoryOpts.forEach((o)=>{
      console.log(document.getElementById(`Skill${o.value}`))
      if(document.getElementById(`Skill${o.value}`).value>5 || document.getElementById(`Skill${o.value}`).value<1 || document.getElementById(`Skill${o.value}`).value=="" || document.getElementById(`Skill${o.value}`).value==null || charIsLetter(document.getElementById(`Skill${o.value}`).value))
      { 
        document.getElementById(`Skill${o.value}`).setAttribute("Validation", "Cannot be blank");
        document.getElementById(`Skill${o.value}V`).setAttribute("Validation", "Please enter value between 1 and 5");
        Allgood=false
      }
      else{
        document.getElementById(`Skill${o.value}`).removeAttribute("Validation");
      }
    });

    if (selectedStatus.length <= 0) {
      document.getElementById('JobStatus').setAttribute("Validation", "Cannot be blank");
      document.getElementById('JobStatusV').setAttribute("Validation", "Job Status needs to be selected");
      Allgood=false
    }
    else {
      document.getElementById('JobStatus').removeAttribute("Validation");
    }


    if (Allgood) {
      console.log("Sending data from Edit");
      let skillsRequired="";
      searchedCategoryOpts.forEach((o)=>{
        let skill=String(o.value);
        let skillValue=String(document.getElementById(`Skill${o.value}`).value);
        skillsRequired=skillsRequired.concat(";",skill.concat(":",skillValue));
      })
      skillsRequired=skillsRequired.replace(";","")
      fetch(`http://localhost:3001/jobs/${ReactSession.get("editJob")}`, {
        method: "PATCH",
        body: JSON.stringify({
          "JobTitle": JobTitle,
          "JobID": JobID,
          "JobDesc": JobDesc,
          "JobStatus": selectedStatus.value,
          "SkillsRequired":skillsRequired
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data) => {
        // setLocation(data);
        // setSearchedLocation(data);
        console.log("edit Delete");
        fetch("http://localhost:3001/jobs/jobslocation", {
          method: "Delete",
          body: JSON.stringify({
            "JobId": ReactSession.get("editJob"),
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then((response) => response.json()).then((data1) => {
          JobLocation = selectedJobLocations.map(value => { return value.value })
          JobLocation.forEach(location => {
            fetch("http://localhost:3001/jobs/jobslocation", {
              method: "POST",
              body: JSON.stringify({
                "JobId": ReactSession.get("editJob"),
                "LocationId": location
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then((response) => response.json()).then((data1) => {
              console.log(data1);
              setInfomessage("Job Edited!");
              setTimeout(() => {
                setInfomessage(null);
              }, 5000);
            });
          })
        });


        fetch("http://localhost:3001/jobs/deleteInterviewers", {
          method: "Delete",
          body: JSON.stringify({
            "JobId": ReactSession.get("editJob"),
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then((response) => response.json()).then((data1) => {
          fetch("http://localhost:3001/jobs/addInterviewer", {
            method: "POST",
            body: JSON.stringify({
              "JobId": data[data.length - 1].JobId,
              "InterviewerId": ReactSession.get("InterviewerId")
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          }).then((response) => response.json()).then((data1) => {
            console.log(data1);
          });

          selectedInterviewers.forEach(interviewer => {
            fetch("http://localhost:3001/jobs/addInterviewer", {
              method: "POST",
              body: JSON.stringify({
                "JobId": ReactSession.get("editJob"),
                "InterviewerId": interviewer.value
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then((response) => response.json()).then((data1) => {
              console.log(data1);
              clearForm();
            });
          })
        });





      });
    }
  } 
  // function searchLocation(){
  //   let searchText=document.getElementById('locationSearch').value

  //   let searchedData=_.filter(location,function(l){

  //     return l.Location.includes(searchText);
  //   })
  //   setSearchedLocation(searchedData);
  // }

  useEffect(() => {
    if (ReactSession.get("InterviewerId") == null) {

      navigate("/Interviewer/Login");

    }

    if (ReactSession.get("theme") == "light") {
      applyLight();
    }
    else if (ReactSession.get("theme") == "classic") {
      applyClassic();
    }
    else
      applyDark();

    fetch('http://localhost:3001/locations')
      .then((response) => response.json())
      .then((data) => {
        setLocation(data);

        locationOptions = data.map(loc => {
          return { value: loc.LocationId, label: loc.Location }
        });
        setLocationOpts(locationOptions);
        console.log("Locations Opts: ", LocationOpts);
      })
      .catch((err) => {
        console.log(err.message);
      });
    fetch('http://localhost:3001/category')
      .then((response) => response.json())
      .then((data) => {

        let categoryOptions = data.map(cat => {
          return { value: cat.QuestionCategoryId, label: cat.QuestionCategory }
        });
        console.log(categoryOptions)
        setCategoryOpts(categoryOptions);
        // setSearchedCategoryOpts(categoryOptions);
      })
      .catch((err) => {
        console.log(err.message);
      });
    fetch('http://localhost:3001/interviewersignup')
      .then((response) => response.json())
      .then((data) => {
        InterviewerOptions = data.map(interviewer => {
            return { value: interviewer.InterviewerId, label: interviewer.InterviewerName }
        });
        InterviewerOptions=_.reject(InterviewerOptions, function(o) { 
          return o.value==parseInt(ReactSession.get("InterviewerId")) || o.label=="Admin" || o.label=="admin"; 
        });
        setInterviewerOpts(InterviewerOptions);
        console.log("Interviewer Opts: ", InterviewerOptions);
      })
      .catch((err) => {
        console.log(err.message);
    });

    if (ReactSession.get("editJob") != null) {
      
      fetch(`http://localhost:3001/jobs/${ReactSession.get("editJob")}`)
        .then((response) => response.json())
        .then((data) => {
          setJobDetails(data);
          setSelectedStatus({ value: data[0].JobStatus, label: data[0].JobStatus });
          let fetchedSkills = [];
          let skills=[];
          data[0].SkillsRequired.split(";").map((elem)=>{
            skills.push(elem.split(":")[0]);
          })
          let expertise=[]
          data[0].SkillsRequired.split(";").map((elem)=>{
            expertise.push(elem.split(":")[1]);
          })
          skills.forEach(e => {
            fetch(`http://localhost:3001/category/${e}`)
              .then((response) => response.json())
              .then((data) => {
                fetchedSkills.push({
                  label: data[0].QuestionCategory,
                  value: data[0].QuestionCategoryId
                })

              });
          });
          setSearchedCategoryOpts(fetchedSkills);
          
          skills=[];
          let i=0
          searchedCategoryOpts.map((o)=>{
            skills.push(<div key={o.value} className='validation'><input  type="number" id={`Skill${o.value}`} placeholder={`Enter expertise required out of 5 for ${o.label}`} defaultValue={expertise[i++]}></input><span  id={`Skill${o.value}V`} validation="Cannot be blank"></span></div>);
            
          })
          setSkillExpertiseRequired(skills);
          
          
          fetch(`http://localhost:3001/jobs/jobslocation/${ReactSession.get("editJob")}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              let fetchedJobLocation = [];
              data.forEach(e => {
                fetch(`http://localhost:3001/locations/${e.LocationId}`)
                  .then((response) => response.json())
                  .then((data) => {
                    fetchedJobLocation.push({
                      label: data[0].Location,
                      value: data[0].LocationId,
                    })

                  });
              });
              setSelectedJobLocations(fetchedJobLocation);
              

            });

          fetch(`http://localhost:3001/jobs/interviewerDetails/${ReactSession.get("editJob")}`)
            .then((response) => response.json())
            .then((data) => {
              let fetchedInterviewerDetails = [];
              data.forEach(e => {
                fetch(`http://localhost:3001/interviewersignup/${e.InterviewerId}`)
                  .then((response) => response.json())
                  .then((data) => {
                    if(data[0].InterviewerId===parseInt(ReactSession.get("InterviewerId")))
                    {

                    }
                    else{
                      fetchedInterviewerDetails.push({
                        label: data[0].InterviewerName,
                        value: data[0].InterviewerId,
                      })
                    }
                   

                  });
              });
              setSelectedInterviewers(fetchedInterviewerDetails);

            });
        })
        .catch((err) => {
          console.log(err.message);
        });

        // setTimeout(() => {
        //   let elems=document.querySelectorAll('div[class*="Input"]');
        //   console.log(elems);
        //   for(let i=0;i<elems.length;i++){
        //     console.log("Clicked");
        //     elems[i].click();
        //   }
        // }, 3000);
        
    }
    else{
      setSelectedInterviewers([]);
      setSelectedJobLocations([]);
      setSelectedStatus([])
    }
  }, [])


  function handleLocationChange(options) {
    setSelectedJobLocations(options);
  }
  function handleInterviewersChange(options) {
    setSelectedInterviewers(options);
  }
  function handleStatusChange(options) {
    setSelectedStatus(options);
  }
  function handleCategoryChange(options) {
    if(ReactSession.get("editJob")!=null){
      let current=ReactSession.get("editJobSkills");
      let skills=[]
      options.map((o)=>{
        skills.push({
          "skill":o.value,
          "expertise":"",
          "skillName":o.label
        });
      })
      current.push({
        "skill":options[options.length-1].value,
        "expertise":"",
        "skillName":options[options.length-1].label
      })
      ReactSession.set("editJobSkills",skills)
      setSearchedCategoryOpts(options);
    }
    setSearchedCategoryOpts(options);
      let skills=[];
      options.map((o)=>{
        skills.push(<div key={o.value} className='validation'><input  type="number" id={`Skill${o.value}`} placeholder={`Enter expertise required out of 5 for ${o.label}`} ></input><span  id={`Skill${o.value}V`} validation="Cannot be blank"></span></div>);
      })
      setSkillExpertiseRequired(skills);
    
  }

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
            <h1 className='dashboard-title'>{getGreeting()}<br /><span>{ReactSession.get("InterviewerName")}</span></h1>
            <div className='dashboard-header-buttons'>
              <button id='home' onClick={() => { navigate("/Interviewer/Dashboard/") }}>Home</button>
              <button id='logout' onClick={logout}>Logout</button>
            </div>

          </div>
        </div>
        <div className='CreateJobItems'>
          <div className='QuickLinks CreateJobItem'>
            <div className='CreateJobItem-header'>
              {ReactSession.get("editJob") == null ? "Create Job" : "Edit Job"}
              <div className='CreateJobItem-header-Actions'>
                {ReactSession.get("editJob") != null && <button className="CreateJobItem-header-Actions-buttons" onClick={() => { ReactSession.set('editJob', null); window.location.reload(false); }}>Create Jobs</button>}
                <button className="CreateJobItem-header-Actions-buttons" onClick={() => { navigate("/Interviewer/Dashboard/ViewJobs") }}>View Jobs</button>
              </div>

            </div>
            
            <div className='CreateJobItem-contents'>
              <div className='validation'><input type="text" id="JobTitle" placeholder='Job Title...' defaultValue={ReactSession.get("editJob") == null ? "" : JobDetails.length > 0 ? JobDetails[0].JobTitle : ""}></input><span id="JobTitleV" validation="Cannot be blank"></span></div>
              <div className='validation'><input type="text" id="JobID" placeholder='Job ID...' defaultValue={ReactSession.get("editJob") == null ? "" : JobDetails.length > 0 ? JobDetails[0].JobDisplayID : ""}></input><span id="JobIDV" validation="Cannot be blank"></span></div>
              <div className='validation'>
                <Select placeholder="Required Skills" isMulti={true} styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles, 
                    background: 'transparent',
                    border: "0px solid transparent",
                  }),
                }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    outline: '0px solid transparent',
                    colors: {
                      ...theme.colors,
                      
                      primary: ReactSession.get("theme") == 'dark' ? "rgb(230, 226, 195)": ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                      primary25: "#e3e3e3",
                      //foreground
                      neutral80: ReactSession.get("theme") == 'dark' ? "rgb(54,69,79)" : ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                      
                    },
                  })}

                  id='QuestionCategory' className='select' options={categoryOpts} onChange={handleCategoryChange}  value={searchedCategoryOpts} />
                <span id="QuestionCategoryV" validation="Cannot be blank"></span>
              </div>
              {/* {skillExpertiseRequired.length>0?skillExpertiseRequired:null} */}
              {ReactSession.get("editJob") == null && searchedCategoryOpts.map((o)=>{return <div key={o.value} className='validation'><input  type="text" id={`Skill${o.value}`} placeholder={`Enter expertise required out of 5 for ${o.label}`}></input><span  id={`Skill${o.value}V`} validation="Cannot be blank"></span></div>})}
              {ReactSession.get("editJob") != null && ReactSession.get("editJobSkills").map((o)=>{return <div key={o.skill} className='validation'><input  type="text" id={`Skill${o.skill}`} defaultValue={o.expertise} placeholder={`Enter expertise required out of 5 for ${o.skillName}`}></input><span  id={`Skill${o.skill}V`} validation="Cannot be blank"></span></div>})}
              <div className='validation'><textarea id="JobDesc" placeholder='Job Desc...' defaultValue={ReactSession.get("editJob") == null ? "" : JobDetails.length > 0 ? JobDetails[0].JobDesc : ""}></textarea><span id="JobDescV" validation="Cannot be blank"></span></div>
              <div className='validation'>
                {/* <select id='JobLocation' multiple>
            {location.map(location => {return <option key={location.LocationId} className='contentData' value={location.LocationId}>{location.Location}</option>})}
          </select> */}

                <Select placeholder="Job Location..." isMulti={true} styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    background: 'transparent',
                    border: "0px solid transparent",
                  }),
                }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    outline: '0px solid transparent',
                    colors: {
                      ...theme.colors,
                      
                      primary: ReactSession.get("theme") == 'dark' ? "rgb(230, 226, 195)": ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                      primary25: "#e3e3e3",
                      //foreground
                      neutral80: ReactSession.get("theme") == 'dark' ? "rgb(54,69,79)" : ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                      
                    },
                  })}

                  id='JobLocation' className='select' options={LocationOpts} onChange={handleLocationChange} value={selectedJobLocations} />
                <span id="JobLocationV" validation="Cannot be blank"></span></div>
                <div className='validation'>
                {/* <select id='JobLocation' multiple>
            {location.map(location => {return <option key={location.LocationId} className='contentData' value={location.LocationId}>{location.Location}</option>})}
          </select> */}

                <Select placeholder="Select Interviewers..." isMulti={true} styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    background: 'transparent',
                    border: "0px solid transparent",
                  }),
                }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    outline: '0px solid transparent',
                    colors: {
                      ...theme.colors,
                      
                      primary: ReactSession.get("theme") == 'dark' ? "rgb(230, 226, 195)": ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                      primary25: "#e3e3e3",
                      //foreground
                      neutral80: ReactSession.get("theme") == 'dark' ? "rgb(54,69,79)" : ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                      
                    },
                  })}

                  id='Interviewers' className='select' options={InterviewerOpts} onChange={handleInterviewersChange} value={selectedInterviewers} />
                <span id="InterviewersV" validation="Cannot be blank"></span></div>
              <div className='validation'>
                <Select id='JobStatus' placeholder="Select Job Status..." className='select' styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    background: 'transparent',
                    border: "0px solid transparent",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  outline: '0px solid transparent',
                  colors: {
                    ...theme.colors,
                    
                    primary: ReactSession.get("theme") == 'dark' ? "rgb(54,69,79)": ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                    primary25: "#e3e3e3",
                    //foreground
                    neutral80: ReactSession.get("theme") == 'dark' ? "rgb(230, 226, 195)" : ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                    
                  },
                })}

                  options={[{ value: 'Open', label: 'Open' }, { value: 'Closed', label: 'Closed' }]}
                  onChange={handleStatusChange}
                  
                  value={selectedStatus}
                // defaultValue={{value:'Closed',label:'Closed'}}
                />
                {/* <option disabled hidden value="none">Select an Option</option>
          <option key="open" className='contentData' value="Open" selected={ReactSession.get("editJob")==null? false : JobDetails.length>0?JobDetails[0].JobStatus=="Open"?true:false:false}>Open</option>
          <option key="closed" className='contentData' value="Closed" selected={ReactSession.get("editJob")==null? false : JobDetails.length>0?JobDetails[0].JobStatus=="Closed"?true:false:false}>Closed</option> */}
                <span id="JobStatusV" validation="Cannot be blank"></span></div>
              <button id='submit' name='submit' onClick={ReactSession.get("editJob") == null ? addJob : editJob}>{ReactSession.get("editJob") == null ? "Create Job" : "Edit Job"}</button>
            </div>
          </div>
        </div>
        {infomessage && <div className='infoMessage'>{infomessage}</div>}
      </div>

    </>
  );
}

export default CreateJob;
