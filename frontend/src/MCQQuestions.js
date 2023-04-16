import './css/MCQQuestions.css';
import search from './css/search.svg'
import editicon from './css/edit.svg'
import Navbar from './Navbar';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import _ from 'lodash';
import Select from 'react-select';
import axios from 'axios';

function MCQQuestions() {
  const navigate = useNavigate();
  let [searchedCategoryOpts, setSearchedCategoryOpts] = useState([]);
  let [categoryOpts, setCategoryOpts] = useState([]);
  let [difficultyOpts, setDifficultyOpts] = useState([{value:"Easy",label:"Easy"},{value:"Medium",label:"Medium"},{value:"Hard",label:"Hard"}]);
  let [searchedDifficultyOpts, setSearchedDifficultyOpts] = useState([]);
  let [MCQQuestion, setMCQQuestion] = useState("");
  let [mcqoptions, setmcqOptions] = useState([]);
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
    document.getElementById("Option1").value="";
    document.getElementById("Option2").value="";
    document.getElementById("uploadBox").value="";
    setmcqOptions([]);
    
  }

  function addQuestion() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let answers=[];
    let options=[];
    let Allgood=true;
    for(let i=1;i<mcqoptions.length+3;i++){
      if(document.getElementById(`Option${i}`).value==""){
        document.getElementById(`Option${i}`).setAttribute("Validation", "Cannot be blank");
        document.getElementById(`Option${i}V`).setAttribute("Validation", "Please fill this option");
        Allgood=false
      }
      else{
        document.getElementById(`Option${i}`).removeAttribute("Validation");
        if(document.getElementById(`IsOption${i}Answer`).checked)
        {
          answers.push(document.getElementById(`Option${i}`).value);
        }
      }
      options.push(document.getElementById(`Option${i}`).value);
    }
    
    if(answers.length<=0){
      Allgood=false
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

    if(MCQQuestion==null || MCQQuestion==""){
      document.getElementById('Question').setAttribute("Validation", "Cannot be blank");
      document.getElementById('QuestionV').setAttribute("Validation", "Please Enter Question");
      Allgood=false
    }
    else {
      document.getElementById('Question').removeAttribute("Validation");
    }


    if (Allgood) {
      console.log("Sending data");
      fetch("http://localhost:3001/mcqquestions/getCount")
      .then((response) => response.json()).then((data) => {
        console.log(data);
        fetch("http://localhost:3001/mcqquestions", {
        method: "POST",
        body: JSON.stringify({
          "QuestionTypeId": "M"+parseInt(data),
          "Question": MCQQuestion,
          "Options":options.join("~"),
          "Answer": answers.join("~")
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data2) => {
        console.log(data2);
        // setLocation(data);
        // setSearchedLocation(data);
        fetch("http://localhost:3001/mcqquestions/questions", {
          method: "POST",
          body: JSON.stringify({
            "QuestionTypeId": "M"+parseInt(data),
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
          formData.append("image", file,`M${parseInt(data)}.jpg`);
          try {
            const res = await axios.post(
              "http://localhost:3001/mcqquestions/uploadImage",
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
  function addNewOption(){
    let options=[]
    options.push(<div key={mcqoptions.length} className='validation'><input type="text" id={`Option${mcqoptions.length+3}`} placeholder={`Option ${mcqoptions.length+3}`} ></input><span id={`Option${mcqoptions.length+3}V`} validation="Cannot be blank"></span><input className='isAnswerCheckbox' id={`IsOption${mcqoptions.length+3}Answer`} type='checkbox'></input></div>);
      // console.log(option);
    setmcqOptions(current=>[...current,options]);
  }
  function deleteLastOption(){
    setmcqOptions(current => (current.slice(0, -1)));
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
        <div className='MCQAddQuestionItems'>
          <div className='MCQAddQuestionItem'>
            <div className='MCQAddQuestionItem-header'>
              Add Multiple Choice Question
              <div className='MCQAddQuestionItem-header-Actions'>
                <button className="MCQAddQuestionItem-header-Actions-buttons" onClick={() => { navigate("/Interviewer/Dashboard/AddQuestions") }}>Questions Home</button>
                <button className="MCQAddQuestionItem-header-Actions-buttons" onClick={navigateToViewQuestions}>View Questions</button>

              </div>

            </div>
            <div className='MCQAddQuestionItem-contents'>

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

                  id='QuestionCategory' className='select' options={categoryOpts} onChange={handleCategoryChange} value={searchedCategoryOpts} />
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
                setMCQQuestion(e.target.value)
              }}></textarea><span id="QuestionV" validation="Cannot be blank"></span></div>
                <div className='validation'><input type="text" id="Option1" placeholder="Option 1" ></input><span id="Option1V" validation="Cannot be blank"></span><input className='isAnswerCheckbox' id='IsOption1Answer' type='checkbox'></input></div>
                <div className='validation'><input type="text" id="Option2" placeholder="Option 2" ></input><span id="Option2V" validation="Cannot be blank"></span><input className='isAnswerCheckbox' id='IsOption2Answer' type='checkbox'></input></div>
                {mcqoptions}
                <div className='addDeleteOptions'>
                  <button className='addOption addDeleteOptions-btn' onClick={addNewOption}>Add New Option</button>
                  <button className='deleteOption addDeleteOptions-btn' onClick={deleteLastOption}>Delete Last Option</button>
                </div>
                <div className='validation'><input id='uploadBox' type="file" onChange={handleFileChange} accept="image/*"/></div>
              <button id='submit' name='submit' onClick={addQuestion}>Add</button>
            </div>
          </div>

        </div>
        {infomessage && <div className='infoMessage'>{infomessage}</div>}
      </div>

    </>
  );
}

export default MCQQuestions;
