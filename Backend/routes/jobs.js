var express = require('express');
var router = express.Router();
var mysql = require('mysql');
// var {con} = "./Interviewersignup";
var con = mysql.createConnection({
  user: "root",
  password: "@quaVirgo1340",
  database: "ATAK"
});
con.connect(function (err) {
  if (err) console.log(err);
  })
/* GET home page. */
router.get('/', function (req, res, next) {
  con.query("Select * from ATAK.Job", (err, result) => {
    if (err) console.log(err);
    else{
      console.log(result);
      res.json(result)
      res.end();
    } 
    
  })
  con.on('error', function() {
    con.end();
  });
});
router.get('/details', function (req, res, next) {
  con.query(`Select * from ATAK.Job Inner Join ATAK.JobLocation on ATAK.Job.JobId = ATAK.JobLocation.JobId Inner Join ATAK.Locations on ATAK.JobLocation.LocationId=ATAK.Locations.LocationId`, (err, result) => {
    if (err) console.log(err);
    else{
      console.log(result);
      res.json(result)
      res.end();
    }
    
  })
  con.on('error', function() {
    con.end();
  });
});

router.get('/:id', function (req, res, next) {
  con.query(`Select * from ATAK.Job where JobId=${req.params.id}`, (err, result) => {
    if (err) console.log(err);
    else{
      console.log(result);
      res.json(result)
      res.end();
    }
    
  })
  con.on('error', function() {
    con.end();
  });
});






router.get('/havingInterviewer/:id', function (req, res, next) {
  con.query(`Select * from ATAK.Job inner join ATAK.Interviewer_Job on ATAK.Job.JobId = ATAK.Interviewer_Job.JobId Where ATAK.Interviewer_Job.InterviewerId=${req.params.id}`, (err, result) => {
    if (err) console.log(err);
    else{
      console.log(result);
      res.json(result)
      res.end();
    }
    
  })
  con.on('error', function() {
    con.end();
  });
});
router.post('/', (req, res, next) => {
    let currentDate = new Date().toJSON().slice(0, 10);
    console.log(`Insert Into ATAK.Job(JobTitle,JobDesc,JobStatus,SkillsRequired,JobDisplayID,PostingDate,UpdateDate,InterviewDuration,ObjectiveCodingRatio) Values("${req.body.JobTitle}","${req.body.JobDesc}","${req.body.JobStatus}","${req.body.SkillsRequired}","${req.body.JobID}",'${currentDate}','${currentDate}',30,"60:40")`);
    con.query(`Insert Into ATAK.Job(JobTitle,JobDesc,JobStatus,SkillsRequired,JobDisplayID,PostingDate,UpdateDate,InterviewDuration,ObjectiveCodingRatio) Values("${req.body.JobTitle}","${req.body.JobDesc}","${req.body.JobStatus}","${req.body.SkillsRequired}","${req.body.JobID}",'${currentDate}','${currentDate}',30,"60:40")`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Inserted into Job Table");
        con.query("Select * from ATAK.Job", (err, result) => {
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }  
  });
  con.on('error', function () {
    con.end();
  });
})

router.patch('/changeInterviewDuration', (req, res, next) => {
    console.log(`Update ATAK.Job SET InterviewDuration="${req.body.InterviewDuration}" Where JobId="${req.body.JobId}"`);
    con.query(`Update ATAK.Job SET InterviewDuration="${req.body.InterviewDuration}" Where JobId="${req.body.JobId}"`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Updated Job Table");
        con.query("Select * from ATAK.Job", (err, result) => {
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }
  });
  con.on('error', function () {
    con.end();
  });
})
router.patch('/changeObjCodingRatio', (req, res, next) => {
  console.log(`Update ATAK.Job SET ObjectiveCodingRatio="${req.body.ObjectiveCodingRatio}" Where JobId="${req.body.JobId}"`);
  con.query(`Update ATAK.Job SET ObjectiveCodingRatio="${req.body.ObjectiveCodingRatio}" Where JobId="${req.body.JobId}"`, function (err, result) {
    if (err) console.log(err);
    else{
      console.log("Updated Job Table");
      con.query("Select * from ATAK.Job", (err, result) => {
        if (err) console.log(err);
        else{
          console.log(result);
          res.json(result);
          res.end();
        }
      })
    }
});
con.on('error', function () {
  con.end();
});
})


router.patch('/:id', (req, res, next) => {
  let currentDate = new Date().toJSON().slice(0, 10);
  console.log(`Update ATAK.Job SET JobTitle="${req.body.JobTitle}", JobDesc="${req.body.JobDesc}", JobStatus="${req.body.JobStatus}",SkillsRequired="${req.body.SkillsRequired}",JobDisplayID="${req.body.JobID}",UpdateDate='${currentDate}' Where JobId="${req.params.id}"`);
  con.query(`Update ATAK.Job SET JobTitle="${req.body.JobTitle}", JobDesc="${req.body.JobDesc}", JobStatus="${req.body.JobStatus}",SkillsRequired="${req.body.SkillsRequired}",JobDisplayID="${req.body.JobID}",UpdateDate='${currentDate}' Where JobId="${req.params.id}"`, function (err, result) {
    if (err) console.log(err);
    else{
      console.log("Updated Job Table");
      con.query("Select * from ATAK.Job", (err, result) => {
        if (err) console.log(err);
        else{
          console.log(result);
          res.json(result);
          res.end();
        }
      })
    }
});
con.on('error', function () {
  con.end();
});
})



router.post('/changeJobStatus', (req, res, next) => {
    console.log(`Update ATAK.Job SET JobStatus="${req.body.JobStatus}" Where JobId=${req.body.JobId}`);
    con.query(`Update ATAK.Job SET JobStatus="${req.body.JobStatus}" Where JobId=${req.body.JobId}`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Updated Job Table");
        con.query("Select * from ATAK.Job", (err, result) => {
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }
  });
  con.on('error', function () {
    con.end();
  });
})

router.post('/jobslocation', (req, res, next) => {
    console.log(`Insert Into ATAK.JobLocation(JobId,LocationId) Values(${req.body.JobId},${req.body.LocationId})`);
    con.query(`Insert Into ATAK.JobLocation(JobId,LocationId) Values(${req.body.JobId},${req.body.LocationId})`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Inserted into JobLocation Table");
        con.query("Select * from ATAK.JobLocation", (err, result) => {
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }
  });
  con.on('error', function () {
    con.end();
  });
})

router.get('/jobslocation/:id', function(req, res, next) {
  
    con.query(`Select * from ATAK.JobLocation where JobId=${req.params.id}`,(err,result)=>{
      if (err) console.log(err);
      else{
        console.log(result);
        res.json(result)
        res.end();
      }
    })
  con.on('error', function() {
    con.end();
  });
});

router.delete('/', (req, res, next) => {
    // console.log(`Delete from ATAK.Job where JobId="${req.body.JobId}"`);
    con.query(`Delete from ATAK.Job_Questions where JobId=${req.body.JobId}`,function(err,result){
      if (err) console.log(err);
      else{
        con.query(`Delete from ATAK.JobLocation where JobId=${req.body.JobId}`, function (err, result) {
          if (err) console.log(err);
          else{
              console.log("Deleted from JobLocation Table");
              con.query(`Delete from ATAK.Interviewer_Job where JobId=${req.body.JobId}`, (err, result) => {
                if (err) console.log(err);
                else{
                      con.query(`Delete from ATAK.Job where JobId=${req.body.JobId}`, function (err, result) {
                      if (err) console.log(err);
                      else{
                        console.log("Deleted from Job Table");
                        con.query("Select * from ATAK.Job", (err, result) => {
                          if (err) console.log(err);
                          else{
                            console.log(result);
                            res.json(result);
                            res.end();
                          }
                        })
                      }
                  })
                }
            });
          }
      });
      }
    })
    
  con.on('error', function () {
    con.end();
  });
})

router.delete('/jobslocation', (req, res, next) => {
    // console.log(`Delete from ATAK.Job where JobId="${req.body.JobId}"`);
    con.query(`Delete from ATAK.JobLocation where JobId=${req.body.JobId}`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Deleted from JobLocation Table");
        con.query("Select * from ATAK.JobLocation", (err, result) => {
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }
  });
  con.on('error', function () {
    con.end();
  });
})


router.post('/addInterviewer', (req, res, next) => {
    console.log(`Insert Into ATAK.Interviewer_Job(JobId,InterviewerId) Values(${req.body.JobId},${req.body.InterviewerId})`);
    con.query(`Insert Into ATAK.Interviewer_Job(JobId,InterviewerId) Values(${req.body.JobId},${req.body.InterviewerId})`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Inserted into Interviewer_Job Table");
        con.query("Select * from ATAK.Interviewer_Job", (err, result) => {
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }
  });
  con.on('error', function () {
    con.end();
  });
})

router.get('/interviewerDetails/:jobid', function(req, res, next) {
  
    con.query(`Select * from ATAK.Interviewer_Job where JobId=${req.params.jobid}`,(err,result)=>{
      if (err) console.log(err);
      else{
        console.log(result);
        res.json(result)
        res.end();
      }
    })
  con.on('error', function() {
    con.end();
  });
});



router.delete('/deleteInterviewers', (req, res, next) => {
    // console.log(`Delete from ATAK.Job where JobId="${req.body.JobId}"`);
    con.query(`Delete from ATAK.Interviewer_Job where JobId=${req.body.JobId}`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Deleted from Interviewer_Job Table");
        con.query("Select * from ATAK.Interviewer_Job", (err, result) => {
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }
  });
  con.on('error', function () {
    con.end();
  });
})

module.exports = router;
