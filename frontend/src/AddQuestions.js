import './css/AddQuestions.css';
import search from './css/search.svg'
import editicon from './css/edit.svg'
import Navbar from './Navbar';
import { Outlet, Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import {ReactSession} from 'react-client-session';
import _ from 'lodash';

function AddQuestions() {
  const navigate = useNavigate();
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

  function openModal(){
    let modal=document.getElementsByClassName('modal')[0];
    let dashboard=document.getElementsByClassName('DashboardContainer')[0];
    modal.classList.add("openModal");
    dashboard.classList.add('DashboardContainerBlur');
    document.getElementById("categoryInput").value="";
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
        document.getElementsByClassName("closeModal")[0].click();
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
  

  function navigateToViewQuestions(){
    navigate("/Interviewer/Dashboard/ViewQuestions");
  }
  useEffect(() => {
    if(ReactSession.get("InterviewerId")==null){
  
      navigate("/Interviewer/Login");
      
    }

    if(ReactSession.get("theme")=="light"){
      applyLight();
    }
    else if(ReactSession.get("theme")=="classic"){
      applyClassic();
    }
    else
      applyDark();

    fetch('http://localhost:3001/category')
        .then((response) => response.json())
        .then((data) => {
         setCategory(data);
         setSearchedCategory(data);
        })
        .catch((err) => {
           console.log(err.message);
        });

},[])
  


  return (
    <>
    <div className='themeChanger'>
        <div className='lightTheme theme' onClick={applyLight}></div>
        <div className='classicTheme theme' onClick={applyClassic}></div>
        <div className='darkTheme theme' onClick={applyDark}></div>
    </div>
    <div className='modal'>
      <div className='modal-title'>Add Category <button className='closeModal' onClick={closeModal}>X</button></div>
      <div className='modal-body'>
        <div className='validation'><input id='categoryInput' className='modal-input-text' type="text" placeholder='Category'/><span id="modalInputV" validation="Cannot be blank"></span></div>
        <button className='modal-button' onClick={addCategory}>Add</button>
      </div>
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
    <div className='AddQuestionItems'>
      <div className='AddQuestionItem'>
        <div className='AddQuestionItem-header'>
          Add Question
          <button className="AddQuestionItem-header-buttons" onClick={navigateToViewQuestions}>View Questions</button>
        </div>
        <div className='AddQuestionItem-contents'>
            <div className='AddQuestionItem-content' onClick={()=>{navigate("/Interviewer/Dashboard/AddQuestions/FIBQuestions")}}>
                Fill in the blanks
            </div>
            <div className='AddQuestionItem-content' onClick={()=>{navigate("/Interviewer/Dashboard/AddQuestions/MCQQuestions")}}>
               Multiple Choice
            </div>
            <div className='AddQuestionItem-content' onClick={()=>{navigate("/Interviewer/Dashboard/AddQuestions/CodeQuestions")}}>
               Coding
            </div>
        </div>
      </div>
      <div className='ManageLocations AddQuestionItem'>
        <div className='AddQuestionItem-header'>
          Manage Question Categories
          <button className='actionButton' id='addLocation' onClick={openModal}>+</button>
        </div>
        <div className='AddQuestionItemSearch-contents'>
          <div className='contentTextContainer'><input id='categorySearch' className='contentText' type="text" placeholder="Category..." onKeyUp={searchCategory} />
            <img className='content-icon' src={search} alt='search'/>
          </div>
          <div className='contentDataContainer'>
            {searchedCategory.map(category => {return <div key={category.QuestionCategoryId} className='contentData'  onDoubleClick={()=>{deleteCategory(category.QuestionCategoryId,category.QuestionCategory)}}>{category.QuestionCategory}</div>})}
            {searchedCategory.length<=0? <div >No Category</div> : null}
          </div>
        </div>
          
      </div>
    </div>

    </div>
   
    </>
  );
}

export default AddQuestions;
