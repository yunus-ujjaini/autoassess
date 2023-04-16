import './css/FIBQuestions.css';
import search from './css/search.svg'
import editicon from './css/edit.svg'
import Navbar from './Navbar';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import _ from 'lodash';
import Select from 'react-select';
import axios from 'axios';

function FIBQuestions() {
  const navigate = useNavigate();
  let [searchedCategoryOpts, setSearchedCategoryOpts] = useState([]);
  let [categoryOpts, setCategoryOpts] = useState([]);
  let [difficultyOpts, setDifficultyOpts] = useState([{value:"Easy",label:"Easy"},{value:"Medium",label:"Medium"},{value:"Hard",label:"Hard"}]);
  let [searchedDifficultyOpts, setSearchedDifficultyOpts] = useState([]);
  let [FIBQuestion, setFIBQuestion] = useState("");
  let [blanks, setBlanks] = useState([]);
  let [file, setFile] = useState();
  let [infomessage, setInfomessage] = useState(null);
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

  function openModal() {
    let modal = document.getElementsByClassName('modal')[0];
    let dashboard = document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.add("openModal");
    dashboard.classList.add('DashboardContainerBlur');
    document.getElementById("categoryInput").value = "";
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
    setSearchedDifficultyOpts([]);
    document.getElementById("Question").value="";
    document.getElementById("uploadBox").value="";
    setBlanks([]);
    
  }

  function addQuestion() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let answers=[];
    let Allgood=true;
    for(let i=1;i<=blanks.length;i++){
      if(document.getElementById(`Answer${i}`).value==""){
        document.getElementById(`Answer${i}`).setAttribute("Validation", "Cannot be blank");
        document.getElementById(`Answer${i}V`).setAttribute("Validation", "Please fill this answer");
        Allgood=false
      }
      else{
        document.getElementById(`Answer${i}`).removeAttribute("Validation");
      }
      answers.push(document.getElementById(`Answer${i}`).value);
    }

    if (searchedCategoryOpts.length <= 0) {
      document.getElementById('QuestionCategory').setAttribute("Validation", "Cannot be blank");
      document.getElementById('QuestionCategoryV').setAttribute("Validation", "Category needs to be selected");
      Allgood=false
    }
    else {
      document.getElementById('QuestionCategory').removeAttribute("Validation");
    }
    if (searchedDifficultyOpts.length <= 0) {
      document.getElementById('QuestionDifficulty').setAttribute("Validation", "Cannot be blank");
      document.getElementById('QuestionDifficultyV').setAttribute("Validation", "Difficulty needs to be selected");
      Allgood=false
    }
    else {
      document.getElementById('QuestionDifficulty').removeAttribute("Validation");
    }

    if(blanks.length<= 0){
      document.getElementById('Question').setAttribute("Validation", "Cannot be blank");
      document.getElementById('QuestionV').setAttribute("Validation", "Fill in the blanks question needs to have atleast one blank");
      Allgood=false
    }
    else {
      document.getElementById('Question').removeAttribute("Validation");
    }


    if (Allgood) {
      console.log("Sending data");
      fetch("http://localhost:3001/fibquestions/getCount")
      .then((response) => response.json()).then((data) => {
        console.log(data);
        fetch("http://localhost:3001/fibquestions", {
          method: "POST",
          body: JSON.stringify({
            "QuestionTypeId":"F"+parseInt(data),
            "Question": FIBQuestion,
            "Answer": answers.join("~")
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then((response) => response.json()).then((data2) => {
          console.log(data2);
          // setLocation(data);
          // setSearchedLocation(data);
          fetch("http://localhost:3001/fibquestions/questions", {
            method: "POST",
            body: JSON.stringify({
              "QuestionTypeId": "F"+parseInt(data),
              "CategoryId": searchedCategoryOpts.value,
              "Difficulty":searchedDifficultyOpts.value
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          }).then((response) => response.json()).then((data1) => {
            console.log(data1);
            const uploadFile = async (e) => {
            const formData = new FormData();
            formData.append("image", file,`F${parseInt(data)}.jpg`);
            try {
              const res = await axios.post(
                "http://localhost:3001/fibquestions/uploadImage",
                formData,
                { validateStatus: false }
              );
              console.log(res);
            } catch (ex) {
              console.log(ex);
            }
          };
          if(document.getElementById("uploadBox").value != "")
            uploadFile();
  
            setInfomessage("Question Created!")
            setTimeout(()=>{
              setInfomessage(null);
            },5000);
            setTimeout(()=>{
              clearForm();
            },1000)
          });
        })
      });
      
    }
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }
  function handleCategoryChange(options) {
    setSearchedCategoryOpts(options);
  }
  function handleDifficultyChange(options) {
    setSearchedDifficultyOpts(options);
  }
  function navigateToViewQuestions() {
    navigate("/Interviewer/Dashboard/ViewQuestions");
  }
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
        <div className='FIBAddQuestionItems'>
          <div className='FIBAddQuestionItem'>
            <div className='FIBAddQuestionItem-header'>
              Add Fill in the Blanks Question
              <div className='FIBAddQuestionItem-header-Actions'>
                <button className="FIBAddQuestionItem-header-Actions-buttons" onClick={() => { navigate("/Interviewer/Dashboard/AddQuestions") }}>Questions Home</button>
                <button className="FIBAddQuestionItem-header-Actions-buttons" onClick={navigateToViewQuestions}>View Questions</button>

              </div>

            </div>
            <div className='FIBAddQuestionItem-contents'>

              <div className='validation'>
                <Select placeholder="Question Category" styles={{
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

                  id='QuestionCategory' className='select' options={categoryOpts} onChange={handleCategoryChange} value={searchedCategoryOpts}/>
                <span id="QuestionCategoryV" validation="Cannot be blank"></span>
              </div>
              <div className='validation'>
                <Select placeholder="Question Difficulty" styles={{
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

                  id='QuestionDifficulty' className='select' options={difficultyOpts} onChange={handleDifficultyChange} value={searchedDifficultyOpts}/>
                <span id="QuestionDifficultyV" validation="Cannot be blank"></span>
              </div>
              <div className='validation'><textarea id="Question" placeholder='Question...'  onKeyUp={(e)=>{
                setFIBQuestion(e.target.value)
                let BlankContents=[];
                let reqBlanks=FIBQuestion.split("___").length-1;
                for(let i=1;i<=reqBlanks;i++){
                  BlankContents.push(<div key={i} className='validation'><input type="text" id={`Answer${i}`} placeholder={`Blank ${i} ...`} ></input><span id={`Answer${i}V`} validation="Cannot be blank"></span></div>);
                }
                setBlanks(BlankContents);
              }}></textarea><span id="QuestionV" validation="Cannot be blank"></span></div>
                
                {blanks}
              
                <div className='validation'><input id='uploadBox' type="file" onChange={handleFileChange} accept="image/x-png,image/png,image/jpg,image/jpeg" /></div>
              <button id='submit' name='submit' onClick={addQuestion}>Add</button>
            </div>
          </div>

        </div>
        {infomessage && <div className='infoMessage'>{infomessage}</div>}
      </div>

    </>
  );
}

export default FIBQuestions;
