import './css/ViewApplicants.css';
import searchIcon from './css/search.svg'
import editicon from './css/edit.svg'
import Navbar from './Navbar';
import { Outlet, Link, useNavigate, redirect } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import _ from 'lodash';
import Select from 'react-select';
import axios from 'axios';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Radar } from "react-chartjs-2";

Chart.register(CategoryScale);


function ViewApplicants() {
  const navigate = useNavigate();
  let [candidates,setCandidates]=useState([]);
  let [selectedJob,setSelectedJob]=useState([]);
  let [Jobs,setJobs]=useState([]);
  let [perfDetails,setPerfDetails]=useState({
    "ApplicationId":0,
    "ApplicationStatus":0,
    "AssessmentTime":0,
    "ApplicationDate":0,
    "TotalAttemptedQuestions":0,
    "TotalExperience":0,
    "RelevantExperience":0,
    "Attempted":{"Hard":0,"Medium":0,"Easy":0},
    "Correct":{"Hard":0,"Medium":0,"Easy":0},
    "ObjectiveEval":0,
    "CodingEval":0,
    "expectedSkills":[],
    "actualSkills":[],
    "CodingDesc":0,
    "CodingLabel":0,
    "ObjectiveDesc":0,
    "ObjectiveLabel":0
  });
  const [chartData, setChartData] = useState({
    labels: perfDetails.actualSkills.map((data) => data.skill), 
    datasets: [
      {
        label: "Expected Expertise",
        data: perfDetails.expectedSkills.map((data) => data.skillLevel),
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      },{
        label: "Claimed Expertise",
        data: perfDetails.actualSkills.map((data) => data.skillLevel),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }
    ],
    scales: {
      r: {
          angleLines: {
              display: false
          },
          suggestedMin: 1,
          suggestedMax: 5
      }
  }
  });


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

  function openModal(title,questionTypeId,methodName) {
    let modal = document.getElementsByClassName('modal')[0];
    let dashboard = document.getElementsByClassName('DashboardContainer')[0];
    document.getElementsByClassName("modal-title-heading")[0].innerHTML="Edit "+title;
    document.getElementsByClassName("modal-button")[0].id=questionTypeId;
    document.getElementsByClassName("modal-button")[0].innerHTML=`Edit ${title}`;
    modal.classList.add("openModal");
    dashboard.classList.add('DashboardContainerBlur');
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
  function handleJobChange(options) {
    setSelectedJob(options);
    
  }
  function downloadResume(){
    window.open(`http://localhost:3001/applies/getResume/${perfDetails.ApplicationId}`)
  }
  function promoteToNextRound(){
    fetch(`http://localhost:3001/applies/changeApplicationStatus/${perfDetails.ApplicationId}`, {
        method: "PATCH",
        body: JSON.stringify({
          "ApplicationStatus": perfDetails.ApplicationStatus==="Pending"?"Promoted":"Pending",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        console.log(data);
        getPerformance(perfDetails.ApplicationId)
      });
  }
  function getPerformance(applicationId){
    let copyPerf=perfDetails;
    fetch(`http://localhost:3001/applies/getPerf/${applicationId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        copyPerf.ApplicationId=applicationId
        copyPerf.ApplicationStatus=data.AllData[0].ApplicationStatus
        copyPerf.AssessmentTime=data.AllData[0].AssessmentTime
        copyPerf.TotalAttemptedQuestions=data.TotalAns.Easy+data.TotalAns.Medium+data.TotalAns.Hard
        copyPerf.TotalExperience=data.AllData[0].ApplicantTotalExp
        copyPerf.RelevantExperience=data.AllData[0].ApplicantRelevantExp
        copyPerf.ApplicationDate=data.AllData[0].AssessmentDate
        copyPerf.ObjectiveEval=data.AllData[0].EvaluatingVariable
        copyPerf.CodingEval=data.AllData[0].EvaluatingVariableCoding

        copyPerf.Attempted.Hard=data.TotalAns.Hard
        copyPerf.Attempted.Medium=data.TotalAns.Medium
        copyPerf.Attempted.Easy=data.TotalAns.Easy

        copyPerf.Correct.Hard=data.CorrectAns.Hard
        copyPerf.Correct.Medium=data.CorrectAns.Medium
        copyPerf.Correct.Easy=data.CorrectAns.Easy


        if(copyPerf.ObjectiveEval<=30){
          copyPerf.ObjectiveLabel="Fair"
          copyPerf.ObjectiveDesc="Can solve Easy Questions, but struggles with Medium and Hard difficulty"
        }
        else if(copyPerf.ObjectiveEval<=60){
          copyPerf.ObjectiveLabel="Good"
          copyPerf.ObjectiveDesc="Can solve Easy to Medium level Questions, but struggles Hard difficulty"
        }
        else if(copyPerf.ObjectiveEval>60){
          copyPerf.ObjectiveLabel="Excellent"
          copyPerf.ObjectiveDesc="Can solve Hard level questions with ease"
        }

        if(copyPerf.CodingEval<=30){
          copyPerf.CodingLabel="Fair"
          copyPerf.CodingDesc="Can solve Easy Questions, but struggles with Medium and Hard difficulty"
        }
        else if(copyPerf.CodingEval<=60){
          copyPerf.CodingLabel="Good"
          copyPerf.CodingDesc="Can solve Easy to Medium level Questions, but struggles Hard difficulty"
        }
        else if(copyPerf.CodingEval>60){
          copyPerf.CodingLabel="Excellent"
          copyPerf.CodingDesc="Can solve Hard level questions with ease"
        }


        let skills=data.AllData[0].ApplicantSkills.substring(0,(data.AllData[0].ApplicantSkills.length-1)).split(";");
        copyPerf.actualSkills=[];
        copyPerf.expectedSkills=[];
        skills.forEach((skill,index,skills)=>{
          let skillid=skill.split(":")[0];
          let actual=skill.split(":")[1];
          let expected=skill.split(":")[2];
          let last=false;
          if(index===skills.length-1){
            last=true;
          }
          
          fetch(`http://localhost:3001/category/${skillid}`)
          .then((response) => response.json())
          .then((skillData) => {
            copyPerf.actualSkills.push({
              "id":index,
              "skill": skillData[0].QuestionCategory,
              "skillLevel": actual,
            })
            copyPerf.expectedSkills.push({
              "id":index,
              "skill": skillData[0].QuestionCategory,
              "skillLevel": expected,
            })
          });
          if(last){
            setPerfDetails({...copyPerf})
          }

        })
      });
    
  }

  useEffect(()=>{
    console.log("Called");
      fetch(`http://localhost:3001/applies/getCandidates/${selectedJob.value}`)
      .then((response) => response.json())
      .then((data) => {
        data=data.sort((a,b)=>{
          return b.AssessmentScore-a.AssessmentScore
        })
        setCandidates(data);
        console.log("Candidate",data)
      })
      .catch((err) => {
          console.log(err.message);
      });
    
    
  },[selectedJob])

  useEffect(()=>{
    console.log("I executed")
    setTimeout(()=>{
      setChartData({
        labels: perfDetails.actualSkills.map((data) => data.skill), 
        datasets: [
          {
            label: "Expected Expertise",
            data: perfDetails.expectedSkills.map((data) => data.skillLevel),
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          },{
            label: "Claimed Expertise",
            data: perfDetails.actualSkills.map((data) => data.skillLevel),
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          }
        ],
        scales: {
          r: {
              angleLines: {
                  display: false
              },
              suggestedMin: 1,
              suggestedMax: 5
          }
      },
      })

    },2000)
    
  },[perfDetails]);

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

      fetch(`http://localhost:3001/jobs/havingInterviewer/${ReactSession.get("InterviewerId")}`)
        .then((response) => response.json())
        .then((data) => {
          let jobOptions = data.map(job => {
            return { value: job.JobId, label: job.JobTitle }
          });
          console.log(jobOptions)
         setJobs(jobOptions);
        })
        .catch((err) => {
           console.log(err.message);
        });
      

  }, [])



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
        <div className='DashboardItems'>
          <div className='ViewApplicants-DashboardItem'>
            <div className='DashboardItem-header'>
              Select Job
            </div>
            <div className='DashboardItem-contents'>
              <Select placeholder="Job"
              menuPortalTarget={document.body}
                styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      background: 'transparent',
                      border: "0px solid transparent",
                    })
                    
                  }
                }
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

                    id='JobSelect' className='select' options={Jobs} onChange={handleJobChange} />
            </div>
          </div>
          <div className='ViewApplicants-DashboardItem'>
            <div className='DashboardItem-header'>
              Candidate Details
            </div>
            <div className='DashboardItem-contents CandidateCards'>
              <div className='CandidateCardsLeft'>
              {candidates.map((candidate,key)=><div className="CandidateCardsLeft-Card" key={key} onClick={()=>{getPerformance(candidate.ApplicationId)}}>{candidate.CandidateName}</div>)}
              </div>
              {
                perfDetails.AssessmentTime!==0 && <div className='CandidateCardsRight'>
                <div className='CandidateCardsRight-detail-group'>
                  <div>
                  <h3 className='CandidateCardsRight-detail-group-detail CandidateCardsRight-detail-group-title'>Performance Report</h3>
                  <div className='CandidateCardsRight-detail-group-detail'>Application Date: {new Date(perfDetails.ApplicationDate).toJSON().slice(0, 10)}</div>
                  </div>
                <button className='CandidateCardsRight-detail-group-promote CandidateCardsRight-detail-group-detail' onClick={promoteToNextRound}>{perfDetails.ApplicationStatus==="Pending"?"Promote to next round":"Promoted"}</button>
                  
                </div>
                
                <div className='CandidateCardsRight-detail-group'>
                  <div className='CandidateCardsRight-detail-group-detail'>Assessment time: {perfDetails.AssessmentTime} Mins</div>
                  <div className='CandidateCardsRight-detail-group-detail'>Total Experience: {perfDetails.TotalExperience} years</div>
                </div>
                <div className='CandidateCardsRight-detail-group'>
                  <div className='CandidateCardsRight-detail-group-detail'>Total Questions Attempted: {perfDetails.TotalAttemptedQuestions}</div>
                  <div className='CandidateCardsRight-detail-group-detail'>Relevant Experience: {perfDetails.RelevantExperience} Years</div>
                </div>
                <table>
                  <thead>
                    <tr>
                    <th className='blank'>

                    </th>
                    <th>
                      Hard Questions
                    </th>
                    <th>
                      Medium Questions
                    </th>
                    <th>
                      Easy Questions
                    </th>
                    </tr>
                    
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Attempted
                      </td>
                      <td>
                        {perfDetails.Attempted.Hard}
                      </td>
                      <td>
                        {perfDetails.Attempted.Medium}
                      </td>
                      <td>
                        {perfDetails.Attempted.Easy}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Correct
                      </td>
                      <td>
                        {perfDetails.Correct.Hard}
                      </td>
                      <td>
                        {perfDetails.Correct.Medium}
                      </td>
                      <td>
                        {perfDetails.Correct.Easy}
                      </td>
                    </tr>

                  </tbody>
                </table>

                <div className='CandidateCardsRight-Summary-title'>Objective Section Summary: <span className='CandidateCardsRight-Summary-title-bold'>{perfDetails.ObjectiveLabel}</span></div>
                <div className='CandidateCardsRight-Summary-desc'>{perfDetails.ObjectiveDesc}</div>
                
                <div className='CandidateCardsRight-Summary-title'>Coding Section Summary: <span className='CandidateCardsRight-Summary-title-bold'>{perfDetails.CodingLabel}</span></div>
                <div className='CandidateCardsRight-Summary-desc'>{perfDetails.CodingDesc}</div>
                <Radar className='Radar'
                    data={chartData}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: "Skills Summary"
                        }
                      }
                    }}
                  />
                <button className='CandidateCardsRight-Download' onClick={downloadResume}>Download Resume</button>
                <embed src={`http://localhost:3001/static/resumes/${perfDetails.ApplicationId}.pdf`} width="100%" height="1000px" />
        
              </div>
              }
              

            </div>
          </div>
          
        </div>
        
      </div>

    </>
  );
}

export default ViewApplicants;
