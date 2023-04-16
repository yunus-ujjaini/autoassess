import './css/ViewQuestions.css';
import searchIcon from './css/search.svg'
import editicon from './css/edit.svg'
import Navbar from './Navbar';
import { Outlet, Link, useNavigate, redirect } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
import _ from 'lodash';
import Select from 'react-select';
import axios from 'axios';

function ViewQuestions() {
  const navigate = useNavigate();
  let [searchedCategoryOpts, setSearchedCategoryOpts] = useState([]);
  const [searchedEditCategoryOpts, setSearchedEditCategoryOpts] = useState([]);
  let [categoryOpts, setCategoryOpts] = useState([]);
  let [difficultyOpts, setDifficultyOpts] = useState([{value:"Easy",label:"Easy"},{value:"Medium",label:"Medium"},{value:"Hard",label:"Hard"}]);
  let [searchedDifficultyOpts, setSearchedDifficultyOpts] = useState([]);
  let [typeOpts,setTypeOpts]=useState([{value:"FIB",label:"Fill in the Blanks"},{value:"MCQ",label:"Multiple Choice"},{value:"Code",label:"Coding"}]);
  let [searchedTypeOpts, setSearchedTypeOpts] = useState([]);
  let [FIBQuestion, setFIBQuestion] = useState("");
  let [blanks, setBlanks] = useState([]);
  let [file, setFile] = useState();
  let [infomessage, setInfomessage] = useState(null);
  let [advancedSearch,setAdvancedSearch]=useState([]);
  let [questions,setQuestions]=useState([]);
  let [unalteredQuestions,setUnalteredQuestions]=useState([]);
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

  function handleEditCategoryChange(options){
    setSearchedEditCategoryOpts(options);
    
  }
  function handleCategoryChange(options) {
    setSearchedCategoryOpts(options);
  }
  
  function handleDifficultyChange(options) {
    setSearchedDifficultyOpts(options);
  }
  function handleTypeChange(options) {
    setSearchedTypeOpts(options);
  }
  function navigateToViewQuestions() {
    navigate("/Interviewer/Dashboard/ViewQuestions");
  }

  function changeDifficulty(questionTypeId,difficulty){
    fetch(`http://localhost:3001/questions/changeDifficulty/${questionTypeId}`, {
        method: "PATCH",
        body: JSON.stringify({
          "QuestionDifficulty": difficulty,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        let finalArray= _.union(data.mcq,data.fitb,data.coding);
       finalArray=_.sortBy(finalArray, [function(o) { return o.QuestionId; }]);
       console.log(finalArray);
        // setSearchedCategoryOpts(categoryOptions);
        setQuestions(finalArray);
        setUnalteredQuestions(finalArray)
        setAdvancedSearch(finalArray);
        // search();
        // performSearch();
      });

  }
  
  
  function editCategory(questionTypeId){
  
      fetch(`http://localhost:3001/questions/changeCategory/${questionTypeId}`, {
        method: "PATCH",
        body: JSON.stringify({
          "QuestionCategoryId": searchedEditCategoryOpts.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        let finalArray= _.union(data.mcq,data.fitb,data.coding);
       finalArray=_.sortBy(finalArray, [function(o) { return o.QuestionId; }]);
       console.log(finalArray);
        // setSearchedCategoryOpts(categoryOptions);
        setQuestions(finalArray);
        setUnalteredQuestions(finalArray);
        setAdvancedSearch(finalArray);
        // search();
        // performSearch();
      });
  }
  function deleteQuestion(QuestionId,type,QuestionTypeId){
    let confirmation= window.confirm(`Are you sure you want to delete ${type} Question ${QuestionTypeId}`);
   if(confirmation){
    console.log(QuestionId);
      fetch("http://localhost:3001/questions", {
        method: "DELETE",
        body: JSON.stringify({
          "QuestionId": QuestionId,
          "QuestionTypeId":QuestionTypeId
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json()).then((data)=>{
        let finalArray= _.union(data.mcq,data.fitb,data.coding);
        finalArray=_.sortBy(finalArray, [function(o) { return o.QuestionId; }]);
        console.log(finalArray);
         // setSearchedCategoryOpts(categoryOptions);
         setQuestions(finalArray);
         setUnalteredQuestions(finalArray);
         setAdvancedSearch(finalArray);
      });
   }
  }

  function editValues(e){
    if(e.target.innerHTML=="Edit Category"){
      console.log("In Category Edit",searchedEditCategoryOpts);
      editCategory(e.target.id)
    }

    closeModal();

  }
  // useEffect(()=>{
  //   search();
  //   performSearch();
  // },[advancedSearch])
  function search(){
    console.log(searchedTypeOpts)
    let result=_.filter(unalteredQuestions,(elem)=>{
      let catmatches=false;
      if(searchedCategoryOpts.length>0){
        searchedCategoryOpts.forEach(category=>{
          if(category.label==elem.QuestionCategory){
            catmatches=true;
          }
        })
      }
      else{
        catmatches=true;
      }
      let diffmatches=false;
      if(searchedDifficultyOpts.length>0){
        searchedDifficultyOpts.forEach(diff=>{
          if(diff.label==elem.QuestionDifficulty){
            diffmatches=true;
          }
        })
      }
      else{
        diffmatches=true;
      }
      let typematches=false;
      if(searchedTypeOpts.length>0){
        searchedTypeOpts.forEach(type=>{
          if(type.label.charAt(0)==elem.QuestionTypeId.charAt(0)){
            typematches=true;
          }
        })
      }
      else{
        typematches=true;
      }

      if(catmatches && diffmatches && typematches){
        return elem;
      }
    })
    setQuestions(result);
    setAdvancedSearch(result);
  }

  function performSearch(){
    let searchText=document.getElementById('ESearch').value
      let searchedData=_.filter(questions,function(q){
        let matches=false;
        if(q.Question.includes(searchText)){
          matches=true;
        }
        else if(q.Answer.includes(searchText)){
          matches=true;
        }
        else if(q.QuestionDifficulty.includes(searchText)){
          matches=true;
        }
        else if(q.QuestionCategory.includes(searchText)){
          matches=true;
        }
        if(matches){
          return q;
        }
        else{
          if(searchText=="" || searchText==null){
            console.log("Here");
            return q;
          }
        }
        
      })
      setAdvancedSearch(searchedData);
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
      fetch('http://localhost:3001/questions')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
       let finalArray= _.union(data.mcq,data.fitb,data.coding);
       finalArray=_.sortBy(finalArray, [function(o) { return o.QuestionId; }]);
       console.log(finalArray);
        // setSearchedCategoryOpts(categoryOptions);
        setQuestions(finalArray);
        setUnalteredQuestions(finalArray);
        setAdvancedSearch(finalArray);
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
      <div className='modal'>
      <div className='modal-title'><span className='modal-title-heading'>Add Location</span> <button className='closeModal' onClick={closeModal}>X</button></div>
      <div className='modal-body'>
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
                    
                    primary: ReactSession.get("theme") == 'dark' ? "rgb(54,69,79)": ReactSession.get("theme")=='classic'? "rgb(247,222,174)": "white",
                    primary25: ReactSession.get("theme") == 'dark' ? "white": ReactSession.get("theme")=='classic'? "black": "black",
                    //foreground
                    neutral80: ReactSession.get("theme") == 'dark' ? "rgb(54,69,79)" : ReactSession.get("theme")=='classic'? "rgb(247,222,174)": "white",
                    neutral0: ReactSession.get("theme") == 'dark' ? "rgb(230, 226, 195)": ReactSession.get("theme")=='classic'? "rgb(54,69,79)": "#1e255b",
                    
                  },
                })}

                  id='QuestionCategoryEdit' className='select' options={categoryOpts} onChange={handleEditCategoryChange} />
          <span id="QuestionCategoryEditV" validation="Cannot be blank"></span></div>
      
        {/* <div className='validation'><input id='locationInput' className='modal-input-text' type="text" placeholder='...'/><span id="modalInputV" validation="Cannot be blank"></span></div> */}
        <button className='modal-button' onClick={editValues}></button>
      </div>
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
          <div className='ViewQuestions-DashboardItem'>
          <div className='DashboardItem-header'>
            Select Search Parameters
          </div>
          <div className='DashboardItem-contents'>
          <Select placeholder="Question Category" isMulti={true} styles={{
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

                  id='QuestionCategory' className='select' options={categoryOpts} onChange={handleCategoryChange} />
            
          <Select placeholder="Question Difficulty" isMulti={true} styles={{
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

                  id='QuestionDifficulty' className='select' options={difficultyOpts} onChange={handleDifficultyChange} />
            <Select placeholder="Question Type" isMulti={true} styles={{
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

                  id='QuestionType' className='select' options={typeOpts} onChange={handleTypeChange} />
            <button className='searchBtn' onClick={search}>Search</button>
            <div className='contentDataContainer'>
            <div className='contentTextContainer'><input id='ESearch' className='contentText' type="text" placeholder="Search Anything..." onKeyUp={performSearch}/>
              <img className='content-icon' src={searchIcon} alt='search'/>
            </div>
              {advancedSearch.map(question => {
                return question.QuestionTypeId.startsWith("F")?
                    <div key={question.QuestionTypeId} className='FIBcontentData'  onDoubleClick={()=>{deleteQuestion(question.QuestionId,"Fill in the Blanks",question.QuestionTypeId)}}>
                     
                      <div className='QuestionDetails'>
                      <div className='QuestionType'>Fill in the blanks:</div>
                      <div className='Question'>{question.Question}</div>
                      <div className='Answer'>
                        <ul>
                         {question.Answer.split("~").map((elem)=>{
                            return <li key={elem}>{elem}</li>
                         })}
                        </ul>
                      </div>
                      </div>
                      <div className='QuestionActions'>
                        <div className='QuestionDifficuly'>
                          <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Easy")}} className={question.QuestionDifficulty=="Easy"?"active":null}>Easy</button>
                          <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Medium")}} className={question.QuestionDifficulty=="Medium"?"active":null}>Medium</button>
                          <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Hard")}} className={question.QuestionDifficulty=="Hard"?"active":null}>Hard</button>
                        </div>
                        <div className='QuestionCategory'>
                          <div onClick={()=>{openModal("Category",question.QuestionTypeId);}}>Category: {question.QuestionCategory}</div>
                        </div>
                      </div>
                    </div>: 
                  question.QuestionTypeId.startsWith("M") ?
                  <div key={question.QuestionTypeId} className='MCQcontentData'  onDoubleClick={()=>{deleteQuestion(question.QuestionId,"MCQ",question.QuestionTypeId)}}>
                     
                  <div className='QuestionDetails'>
                  <div className='QuestionType'>Multiple Choice:</div>
                  <div className='Question'>{question.Question}</div>
                  <div className='Answer'>
                    <ul>
                     {question.Options.split("~").map((elem)=>{
                        return <li className={question.Answer!=elem?"strike":null} key={elem}>{elem}</li>
                     })}
                    </ul>
                  </div>
                  </div>
                  <div className='QuestionActions'>
                    <div className='QuestionDifficuly'>
                      <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Easy")}} className={question.QuestionDifficulty=="Easy"?"active":null}>Easy</button>
                      <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Medium")}} className={question.QuestionDifficulty=="Medium"?"active":null}>Medium</button>
                      <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Hard")}} className={question.QuestionDifficulty=="Hard"?"active":null}>Hard</button>
                    </div>
                    <div className='QuestionCategory'>
                      <div onClick={()=>{openModal("Category",question.QuestionTypeId);}}>Category: {question.QuestionCategory}</div>
                    </div>
                  </div>
                </div>
                :
                <div key={question.QuestionTypeId} className='CodingcontentData'  onDoubleClick={()=>{deleteQuestion(question.QuestionId,"Coding",question.QuestionTypeId)}}>
                     
                <div className='QuestionDetails'>
                <div className='QuestionType'>Coding:</div>
                <div className='Question'>{question.Question}</div>
                <div className='Answer'>
                  <ul>
                   {question.Answer.split("~").map((elem)=>{
                      return <li key={elem}>Input: {elem.split("##")[0]}<br/>Output: {elem.split("##")[1]}</li>
                   })}
                  </ul>
                </div>
                </div>
                <div className='QuestionActions'>
                  <div className='QuestionDifficuly'>
                    <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Easy")}} className={question.QuestionDifficulty=="Easy"?"active":null}>Easy</button>
                    <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Medium")}} className={question.QuestionDifficulty=="Medium"?"active":null}>Medium</button>
                    <button onClick={()=>{changeDifficulty(question.QuestionTypeId,"Hard")}} className={question.QuestionDifficulty=="Hard"?"active":null}>Hard</button>
                  </div>
                  <div className='QuestionCategory'>
                    <div onClick={()=>{openModal("Category",question.QuestionTypeId);}}>Category: {question.QuestionCategory}</div>
                  </div>
                </div>
              </div>
              })
              }
              {advancedSearch.length<=0? <div className='noMatch'>No matching questions</div> : null}
            </div>
          </div>
        </div>
          
      </div>
        {infomessage && <div className='infoMessage'>{infomessage}</div>}
      </div>

    </>
  );
}

export default ViewQuestions;
