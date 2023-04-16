import sort from './css/sort.svg';
import search from './css/search.svg';
import './css/Home.css';
import { Outlet, Link,useNavigate } from "react-router-dom";
import { useEffect,useState } from 'react';
import {ReactSession} from 'react-client-session';
import Navbar from './Navbar';
import Select from 'react-select';
import _ from 'lodash';

function Home() {
  ReactSession.setStoreType("sessionStorage");
  const navigate=useNavigate();
  let [LocationOpts, setLocationOpts] = useState([]);
  let [selectedLocation, setSelectedLocation] = useState([]);
  let [openJobs, setOpenJobs] = useState([]);
  let [searchedOpenJobs, setSearchedOpenJobs] = useState([]);
  let [searchedJob,setSearchedJob]=useState("");
  let [sorting,setSorting]=useState("Posted");
  
  

  function handleLocationChange(options) {
    setSelectedLocation(options);
  }
  function handleInputChange(e) {
    setSearchedJob(e.target.value);
  }

  function performSearch(){
    if(searchedJob.length>0 && selectedLocation.length>0)
    {
      console.log("Both")
      let searchedData=_.filter(openJobs,function(j){
        let jobValid=false
        if(j.JobTitle.toLowerCase().includes(searchedJob.toLowerCase()) || (j.JobDisplayID && j.JobDisplayID.toLowerCase().includes(searchedJob.toLowerCase())) || (j.SkillsRequired && j.SkillsRequired.toLowerCase().includes(searchedJob.toLowerCase()))){
          jobValid=true;
        }

        let locationValid=false;
        for(let i=0;i<selectedLocation.length;i++){
          
          if(j.Location.includes(selectedLocation[i].label)){
            locationValid=true;
          }
        }


        if(jobValid && locationValid){
          return j;
        }

      })

      setSearchedOpenJobs(searchedData)
    }
    else if(searchedJob.length>0){
      let searchedData=_.filter(openJobs,function(j){
        let jobValid=false
        if(j.JobTitle.toLowerCase().includes(searchedJob.toLowerCase()) || (j.JobDisplayID && j.JobDisplayID.toLowerCase().includes(searchedJob.toLowerCase())) || (j.SkillsRequired && j.SkillsRequired.toLowerCase().includes(searchedJob.toLowerCase()))){
          jobValid=true;
        }


        if(jobValid){
          return j;
        }

      })

      setSearchedOpenJobs(searchedData)
    }
    else if(selectedLocation.length>0){
      let searchedData=_.filter(openJobs,function(j){
        let locationValid=false;
        for(let i=0;i<selectedLocation.length;i++){
          if(j.Location.includes(selectedLocation[i].label)){
            locationValid=true;
          }
        }


        if(locationValid){
          return j;
        }

      })

      setSearchedOpenJobs(searchedData)
    }
    else{
      setSearchedOpenJobs(openJobs);
    }
  }

  function changeSort(e){
    if(e.target.innerHTML=="Posted Recently"){
      document.getElementById('sortBtn').innerHTML="Updated Recently"
      setSorting("Updated");
    }
    else{
      document.getElementById('sortBtn').innerHTML="Posted Recently"
      setSorting("Posted");
    }
  }
  useEffect(()=>{
    let sorted=searchedOpenJobs.sort((a,b)=>{
      if(sorting=="Posted")
        return new Date(b.PostingDate) - new Date(a.PostingDate);
      else if(sorting=='Updated')
      return new Date(b.UpdateDate) - new Date(a.UpdateDate);
    })
    setSearchedOpenJobs(sorted);
  },[sorting])

  function checkJob(job){
    ReactSession.setStoreType("sessionStorage");
    ReactSession.set("jobDetails",job);
    navigate("/Apply");
  }

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
  function getGreeting(){
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
  function clearFilters(){
    setSelectedLocation([])
    document.getElementById("searchText").value="";
    setSearchedJob("");
    setSearchedOpenJobs(openJobs);
  }
  useEffect(() => {
    if(ReactSession.get("userId")==null){
      navigate("/Login");
    }
    else{
      fetch('http://localhost:3001/locations')
      .then((response) => response.json())
      .then((data) => {

        let locationOptions = data.map(loc => {
          return { value: loc.LocationId, label: loc.Location }
        });
        setLocationOpts(locationOptions);
      })
      .catch((err) => {
        console.log(err.message);
      });


      fetch(`http://localhost:3001/jobs/details`)
      .then((response) => response.json())
      .then((data) => {
        fetch('http://localhost:3001/category')
          .then((response) => response.json())
          .then((data2) => {
            data=data.filter((job)=>{
              if(job.JobStatus!='Open')
              {
    
              }
              else
                return job;
            })
            data=_.groupBy(data, 'JobId');
            let finalArrWithLocation=[]
            for (let [key, value] of Object.entries(data)) {
              let location=""
              value.forEach((elem)=>{
                location+=elem.LocationId+":";
                location+=elem.Location+";"
              })
              location=location.slice(0, -1)
              value[0].Location=location;
              let skillsTemp=[];
              if(value[0].SkillsRequired!=null){
                if(value[0].SkillsRequired.includes(";"))
                  skillsTemp=value[0].SkillsRequired.split(";");
                else
                  skillsTemp.push(value[0].SkillsRequired)
              }
              let skills="";
              skillsTemp.forEach(elem=>{
                skills+=elem.split(":")[0]+":"
                skills+=_.find(data2,{"QuestionCategoryId":parseInt(elem.split(":")[0])}).QuestionCategory+":"
                skills+=elem.split(":")[1]+";"
              })
              skills=skills.slice(0, -1)
              value[0].SkillsRequired=skills;
              finalArrWithLocation.push(value[0]);
            }
            setOpenJobs(finalArrWithLocation);
            setSearchedOpenJobs(finalArrWithLocation)
          })
          .catch((err) => {
              console.log(err.message);
          });
      })
      .catch((err) => {
          console.log(err.message);
      });
    }
      
},[])


  return (
    <div className="Home">
      <Navbar />
      <div className='Header' id='Header'>
        <div className='Header-title'>
          <div className='Header-title-sub'>{getGreeting()}&nbsp; {ReactSession.get("userName")} </div>
          <div className='Header-title-main'>Search Job</div>
          <div className='Header-title-sub'>Find your next job at ORACLE and take the assessment online</div>
        </div>
        <div className='Header-input'>
          <div className='Header-input-text'>
            <img className='Header-input-text-icon' src={search} alt='search'/>
            <input type='text' id='searchText' placeholder='Job title, keyword or Job ID' onKeyUp={handleInputChange}/>
          </div>
          <div className='Header-input-select'>
          <img className='Header-input-select-icon' src={search} alt='search'/>
          <Select placeholder="Location" isMulti={true} styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    background: 'white',
                    border: "0px solid transparent",
                  }),
                  valueContainer: (provided, state) => ({
                    ...provided,
                    height: '70px',
                    padding: '20px 20px 20px 60px'
                  }),

                }}
                
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    outline: '0px solid red',
                    colors: {
                      ...theme.colors,
                      
                      primary: "black",
                      primary25: "gray",
                      //foreground
                      neutral80: "black",
                      neutral0:"black",
                      
                    },
                  })}

                  id='searchLocation' className='select' options={LocationOpts} onChange={handleLocationChange} value={selectedLocation}/>
          </div>
          
        </div>
        <div className='Header-buttons'>
            <button className='Header-buttons-clear Header-buttons-btn' onClick={clearFilters}>Clear</button>
            <button className='Header-buttons-search Header-buttons-btn' onClick={performSearch}>Search</button>
        </div>
      </div>
      <div className='Main'>
        <div className='Main-SkillsRequired' id='sidebar'>
          <h1>Expertise Level expected in particular skill mapped to colors</h1>
          <div className='colors' ><div className='color color1'>1</div><div className='skillLevel'>Beginner</div></div>
          <div className='colors' ><div className='color color2'>2</div><div className='skillLevel'>Normal</div></div>
          <div className='colors' ><div className='color color3'>3</div><div className='skillLevel'>Intermediate</div></div>
          <div className='colors' ><div className='color color4'>4</div><div className='skillLevel'>Advanced</div></div>
          <div className='colors' ><div className='color color5'>5</div><div className='skillLevel'>Expert</div></div>
          
          
          
          
        </div>
          <div className='Main-header'>
            <div className='Main-header-count'>
              <span className='count'>{searchedOpenJobs.length}</span> Jobs
            </div>
            <div className='Main-header-sort'>
              <button onClick={changeSort} id='sortBtn'>Posted Recently</button>
              <img src={sort} className='sort' />
            </div>
          </div>
          <div className='Main-Jobs'>
            {
              searchedOpenJobs.map((job)=>{
                return  <div key={job.JobId} className='Main-Jobs-Job'>
                <div className='Main-Jobs-Job-Header'>
                  <h1 className='Main-Jobs-Job-Header-Title' onClick={()=>{checkJob(job)}}>
                      {job.JobTitle}
                  </h1>
                  {
                    job.PostingDate && <h1 className='Main-Jobs-Job-Header-Date'>
                    Posted {job.PostingDate!=null?`${new Date(job.PostingDate).toLocaleString('default', { month: 'long' })} ${new Date(job.PostingDate).getDate()}, ${new Date(job.PostingDate).getFullYear()}`:null}
                </h1>
                  }
                  
                  
                  
                </div>
                <div className='Main-Jobs-Job-Location'>
                  <h1 className='Main-Jobs-Job-Location-Display'>
                      {
                        job.Location.split(";").map((elem)=>{
                          return <div key={elem.split(":")[0]} className='Main-Jobs-Job-Location-Display-Loc' id={elem.split(":")[0]}><span className='dot'>•</span> {elem.split(":")[1]}</div>
                        })
                      }
                  </h1>
                  {
                    job.PostingDate && job.UpdateDate && <h1 className='Main-Jobs-Job-Header-Date'>
                    Updated {job.PostingDate!=null?diffDates(new Date(),new Date(job.UpdateDate)):null}
                </h1>
                  }
                </div>
                <div className='Main-Jobs-Job-JobId'>
                  <h1 className='Main-Jobs-Job-JobId-Title'>
                      Job Id: {job.JobDisplayID}
                  </h1>
                </div>
                <div className='Main-Jobs-Job-Skills'>
                    {
                        job.SkillsRequired.split(";").map((elem)=>{
                          return <div key={elem.split(":")[0]} className={`Main-Jobs-Job-Skills-Skill Main-Jobs-Job-Skills-Skill-${elem.split(":")[2]}` } id={elem.split(":")[0]}>{elem.split(":")[1]}</div>
                        })
                      }
                </div>
                <button className='Main-Jobs-Job-Apply' onClick={()=>{checkJob(job)}}>Apply</button>
              </div>
              })
            }
             
              
          </div>
      </div>
    </div>
  );
}

export default Home;
