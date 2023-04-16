
import './css/Apply.css';
import { Outlet, Link,useNavigate } from "react-router-dom";
import { useEffect,useState } from 'react';
import {ReactSession} from 'react-client-session';
import Navbar from './Navbar';
import Select from 'react-select';
import _ from 'lodash';
import axios from 'axios';

function Apply() {
  ReactSession.setStoreType("sessionStorage");
  const navigate=useNavigate();
  let [applied,setApplied]=useState(false);
  let [formData,setFormData]=useState({totalExp:null,relevantExp:null});
  let [file,setFile]=useState(null);

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
  function takeAssessment() {
    let Allgood = true;
    
    if (formData.totalExp === null || formData.totalExp === "" || charIsLetter(formData.totalExp)) {
      document.getElementById('totalExp').setAttribute("Validation", "Cannot be blank");
      document.getElementById('totalExpV').setAttribute("Validation", "Total Experience cannot be blank");
      Allgood = false;
    }
    else if(formData.totalExp<0){
      document.getElementById('totalExp').setAttribute("Validation", "Cannot be blank");
      document.getElementById('totalExpV').setAttribute("Validation", "Experience cannot be negative");
      Allgood = false;
    }
    else {
      document.getElementById('totalExp').removeAttribute("Validation");
    }

    if (formData.relevantExp === null || formData.relevantExp === "" || charIsLetter(formData.relevantExp)) {
      document.getElementById('relevantExp').setAttribute("Validation", "Cannot be blank");
      document.getElementById('relevantExpV').setAttribute("Validation", "Relevant Experience cannot be blank");
      Allgood = false;
    }
    else if(formData.relevantExp<0){
      document.getElementById('relevantExp').setAttribute("Validation", "Cannot be blank");
      document.getElementById('relevantExpV').setAttribute("Validation", "Experience cannot be negative");
      Allgood = false;
    }
    else {
      document.getElementById('relevantExp').removeAttribute("Validation");
    }

    let skillElems=document.getElementsByClassName("Skill");
    for(let i=0;i<skillElems.length;i++){
      if(skillElems[i].value===""){
        Allgood=false;
        document.getElementById(skillElems[i].id).setAttribute("Validation", "Cannot be blank");
        document.getElementById(`${skillElems[i].id}V`).setAttribute("Validation", "Cannot be blank");
      }
      else if(skillElems[i].value>5 || skillElems[i].value<1){
        Allgood=false;
        document.getElementById(skillElems[i].id).setAttribute("Validation", "Cannot be blank");
        document.getElementById(`${skillElems[i].id}V`).setAttribute("Validation", "Value should be between 1 and 5");
      }
      else{
        document.getElementById(skillElems[i].id).removeAttribute("Validation");
      }
    }

    if(file===null){
      Allgood=false;
      document.getElementById("resumeUpload").setAttribute("Validation", "Cannot be blank");
      document.getElementById("resumeUploadV").setAttribute("Validation", "Cannot be blank");
    }
    else{
      document.getElementById("resumeUpload").removeAttribute("Validation");
    }
    if (Allgood) {
      let skillElems=document.getElementsByClassName("Skill");
      let skillData="";
      for(let i=0;i<skillElems.length;i++){
        skillData+=skillElems[i].id.replace("Skill","")+":"+skillElems[i].getAttribute("difficulty")+":"+skillElems[i].value+";"
      }
      console.log("All Good")
      fetch("http://localhost:3001/applies", {
        method: "POST",
        body: JSON.stringify({
          "ApplicantRelevantExp": formData.relevantExp,
          "ApplicantTotalExp": formData.totalExp,
          "ApplicantSkills":skillData,
          "JobId": parseInt(ReactSession.get("jobDetails").JobId),
          "CandidateId": parseInt(ReactSession.get("userId"))
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data) => {
        console.log(data);
        const uploadFile = async (e) => {
          const formData = new FormData();
          formData.append("resume", file,`${data}.pdf`);
          try {
            const res = await axios.post(
              "http://localhost:3001/applies/uploadsResume/",
              formData,
              { validateStatus: false }
            );
            console.log(res);
          } catch (ex) {
            console.log(ex);
          }
        };
        uploadFile();
        setTimeout(()=>{
          navigate("/Assessment");
        },1000)
      });
    }
    else{
      window.scrollTo({ top:document.body.scrollHeight,
         behavior:'smooth'
    });
    }
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
        setApplied(present.length>0?true:false);
      })
        
      //   fetch(`http://localhost:3001/jobs/jobslocation/${ReactSession.get("jobId")}`)
      //       .then((response) => response.json())
      //       .then((data2) => {
      //         let fetchedJobLocation = [];
      //         data2.forEach(e => {
      //           fetch(`http://localhost:3001/locations/${e.LocationId}`)
      //             .then((response) => response.json())
      //             .then((data2) => {
      //               fetchedJobLocation.push({
      //                 label: data2[0].Location,
      //                 value: data2[0].LocationId,
      //               })

      //             });
      //         });
      //         // console.log("Locations",fetchedJobLocation);
      //         let fetchedSkills = [];
      //         let skills=[];
      //         data[0].SkillsRequired.split(";").map((elem)=>{
      //           skills.push(elem.split(":")[0]);
      //         })
      //         let expertise=[]
      //         data[0].SkillsRequired.split(";").map((elem)=>{
      //           expertise.push(elem.split(":")[1]);
      //         })
      //         skills.forEach(e => {
      //           fetch(`http://localhost:3001/category/${e}`)
      //             .then((response) => response.json())
      //             .then((data3) => {
      //               fetchedSkills.push({
      //                 label: data3[0].QuestionCategory,
      //                 value: data3[0].QuestionCategoryId
      //               })
      //               // console.log("Skills",fetchedSkills);
      //               data.push({"Location":fetchedJobLocation});
      //               data.push({"Skills":fetchedSkills});
      //               console.log("Job Details",data);
      //             });
      //         });
              
              

      //       });
            
      // })
      // .catch((err) => {
      //     console.log(err.message);
      // });
    }
      
},[])


  return (
    <div className="Apply">
      <Navbar />
      <div className='Main'>
        <div className='Main-SkillsRequired' id='sidebar'>
          <h1>Expertise Level expected in particular skill mapped to colors</h1>
          <div className='colors' ><div className='color color1'>1</div><div className='skillLevel'>Beginner</div></div>
          <div className='colors' ><div className='color color2'>2</div><div className='skillLevel'>Normal</div></div>
          <div className='colors' ><div className='color color3'>3</div><div className='skillLevel'>Intermediate</div></div>
          <div className='colors' ><div className='color color4'>4</div><div className='skillLevel'>Advanced</div></div>
          <div className='colors' ><div className='color color5'>5</div><div className='skillLevel'>Expert</div></div>
          
        </div>
      
          <div className='Main-Job'>
            <div className='Main-Job-title'><span>{ReactSession.get("jobDetails").JobTitle}</span><button className='Main-Job-title-Apply' onClick={takeAssessment} disabled={applied}>{applied?"Already Applied":"Take Assessment"}</button></div>
            <div className='Main-Job-title-sub'>
              <span>Job Id: {ReactSession.get("jobDetails").JobDisplayID}</span>
              <div className='Main-Job-title-sub-posting'>
              {
                    ReactSession.get("jobDetails").PostingDate && <span className='Main-Job-title-sub-posting-date'>
                    Posted {ReactSession.get("jobDetails").PostingDate!=null?`${new Date(ReactSession.get("jobDetails").PostingDate).toLocaleString('default', { month: 'long' })} ${new Date(ReactSession.get("jobDetails").PostingDate).getDate()}, ${new Date(ReactSession.get("jobDetails").PostingDate).getFullYear()}`:null}
                </span>
                  }<br/>

                {
                    ReactSession.get("jobDetails").PostingDate && ReactSession.get("jobDetails").UpdateDate && <span className='Main-Job-title-sub-posting-date'>
                    Updated {ReactSession.get("jobDetails").PostingDate!=null?diffDates(new Date(),new Date(ReactSession.get("jobDetails").UpdateDate)):null}
                    </span>
                }
              </div>
              
            </div>
            <div className='Main-Job-desc'>
              <div>
              <div className='Main-Job-desc-Locations'>
                  <div>Locations:
                      {
                        ReactSession.get("jobDetails").Location.split(";").map((elem)=>{
                          return <div key={elem.split(":")[0]} className='Main-Job-desc-Locations-Location' id={elem.split(":")[0]}><span className='dot'>•</span> {elem.split(":")[1]}</div>
                        })
                      }

                  </div>
                </div>
                <pre>
                   {ReactSession.get("jobDetails").JobDesc}
                </pre>
                
              </div>
              <div>
                Please fill below questionnaire in order to apply: 
              </div>
            </div>
            <div className='Main-Job-Actions'>
              <div className='Main-Job-Actions-title'>
                Experience:
              </div>
              <div className='Main-Job-Actions-Main'>
              <div className='Main-Job-Actions-Main-Action'>
                <div className='Main-Job-Actions-Main-Action-Question'>What is your total experience?</div>
                
                <div className='validation'>
                <input id="totalExp" className='Main-Job-Actions-Main-Action-Answer' type="number" onChange={(e)=>{
                  setFormData({
                    totalExp:e.target.value,
                    relevantExp:formData.relevantExp
                  })
                }}/>
                <span id="totalExpV" validation="Cannot be blank"></span></div>
              </div>
              <div className='Main-Job-Actions-Main-Action'>
                <div className='Main-Job-Actions-Main-Action-Question'>What is your relevant experience?</div>
                
                <div className='validation'>
                <input id="relevantExp" className='Main-Job-Actions-Main-Action-Answer' type="number" onChange={(e)=>{
                  setFormData({
                    totalExp:formData.totalExp,
                    relevantExp:e.target.value
                  })
                }}/>
                <span id="relevantExpV" validation="Cannot be blank"></span></div>
              </div>
              </div>
              <div className='Main-Job-Actions-title'>
                Please rate yourself on following skills out of 5:
              </div>
              <div className='Main-Job-Actions-Main'>
                    {
                        ReactSession.get("jobDetails").SkillsRequired.split(";").map((elem)=>{
                          // return <div key={elem.split(":")[0]} className={`Main-Jobs-Job-Skills-Skill Main-Jobs-Job-Skills-Skill-${elem.split(":")[2]}` } id={elem.split(":")[0]}>{elem.split(":")[1]}</div>
                          return <div key={elem.split(":")[0]} className='Main-Job-Actions-Main-Action'>
                          <div className='Main-Job-Actions-Main-Action-Question'>{elem.split(":")[1]}</div>

                          <div className='validation'>
                          <input className={`Main-Job-Actions-Main-Action-Answer Main-Job-Actions-Main-Action-Answer-${elem.split(":")[2]} Skill`} type="number" difficulty={elem.split(":")[2]} id={`Skill${elem.split(":")[0]}`}/>
                          <span id={`Skill${elem.split(":")[0]}V`} validation="Cannot be blank"></span></div>
                        </div>
                        })
                      }
              
              
              
              </div>
              <div className='Main-Job-Actions-title'>
                Upload your resume:
              </div>
              <div className='Main-Job-Actions-Main'>
                <div className='Main-Job-Actions-Main-Action'>
                  {/* <div className='Main-Job-Actions-Main-Action-Question'>What is your total experience?</div> */}
                  {/* <input className='Main-Job-Actions-Main-Action-Answer' type="number"/> */}
                  <div className='validation'>
                  <input className='Main-Job-Actions-Main-Action-Answer' id='resumeUpload' type="file"  accept="application/pdf" onChange={(e)=>{
                    setFile(e.target.files[0]);
                  }} />
                  <span id='resumeUploadV' validation="Cannot be blank"></span></div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Apply;
