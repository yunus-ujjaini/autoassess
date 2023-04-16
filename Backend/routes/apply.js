var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer =require('multer');
const fs = require('fs');
const path=require('path');

var con = mysql.createConnection({
  user: "root",
  password: "@quaVirgo1340",
  database: "ATAK"
});

con.connect(function (err) {
  if (err) console.log(err);
  })

  var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/resumes/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        console.log(req.body)
        callBack(null,file.originalname)
    }
  })

var upload = multer({
  storage: storage
});
/* GET home page. */
router.get('/getCandidates/:jobid', function(req, res, next) {
  let q=`Select * from ATAK.Candidate Inner Join ATAK.Applies On ATAK.Candidate.CandidateId = ATAK.Applies.CandidateId Inner Join ATAK.Assessment On ATAK.Applies.ApplicationId = ATAK.Assessment.ApplicationId Where ATAK.Applies.JobId=${req.params.jobid}`
  con.query(q,(err,result1)=>{
      res.json(result1);
      res.end();
  });
con.on('error', function() {
  con.end();
});
});
router.get('/getPerf/:applicationId', function(req, res, next) {
  let q=`Select * from ATAK.Applies Inner Join ATAK.Assessment On ATAK.Applies.ApplicationId = ATAK.Assessment.ApplicationId Where ATAK.Applies.ApplicationId=${req.params.applicationId}`
  con.query(q,(err,result1)=>{
    let q1=`Select * from ATAK.AssessmentQuestions INNER JOIN ATAK.Questions ON ATAK.AssessmentQuestions.QuestionId = ATAK.Questions.QuestionId  Where ATAK.AssessmentQuestions.AssessmentId=${result1[0].AssessmentId}`
    con.query(q1,(err,result2)=>{
      let totalAns={"Hard":0,"Medium":0,"Easy":0}
      let correctAns={"Hard":0,"Medium":0,"Easy":0}
      for(let i=0;i<result2.length;i++){
        if(result2[i].QuestionDifficulty==="Easy")
          totalAns.Easy+=1;
        else if(result2[i].QuestionDifficulty==="Medium")
          totalAns.Medium+=1;
        else if(result2[i].QuestionDifficulty==="Hard")
          totalAns.Hard+=1;
        if(result2[i].Result>0){
          if(result2[i].QuestionDifficulty==="Easy")
            correctAns.Easy+=1;
          else if(result2[i].QuestionDifficulty==="Medium")
            correctAns.Medium+=1;
          else if(result2[i].QuestionDifficulty==="Hard")
            correctAns.Hard+=1;
        }
      }
      // res.sendFile(req.params.applicationId+".pdf",{
      //   "root":"./public/resumes/"
      // });
      // let filePath=`./public/resumes/${req.params.applicationId}.pdf`
      // let fileName=`${req.params.applicationId}.pdf`
      // fs.readFile(filePath, (err, data) => {
      //   res.set({
      //     "Content-Type": "application/pdf", //here you set the content type to pdf
      //     "Content-Disposition": "inline; filename=" + fileName, //if you change from inline to attachment if forces the file to download but inline displays the file on the browser
      //   });
      //   res.send(data); // here we send the pdf file to the browser
         
        // });
        res.send({"CorrectAns":correctAns,"TotalAns":totalAns,"AllData":result1,"file":`<iframe src="./public/resumes/${req.params.applicationId}.pdf"></iframe>`});
        res.end();  
    });
  });
con.on('error', function() {
  con.end();
});
});
router.get('/getResume/:applicationId', function(req, res, next) {
  
    res.attachment(path.resolve(`./public/resumes/${req.params.applicationId}.pdf`), function (error) {
      console.log("Error : ", error)
  });
  res.end();
      // res.sendFile(req.params.applicationId+".pdf",{
      //   "root":"./public/resumes/"
      // });
      // let filePath=`./public/resumes/${req.params.applicationId}.pdf`
      // let fileName=`${req.params.applicationId}.pdf`
      // fs.readFile(filePath, (err, data) => {
      //   res.set({
      //     "Content-Type": "application/pdf", //here you set the content type to pdf
      //     "Content-Disposition": "inline; filename=" + fileName, //if you change from inline to attachment if forces the file to download but inline displays the file on the browser
      //   });
      //   res.send(data); // here we send the pdf file to the browser
         
        // });
        // res.send({"CorrectAns":correctAns,"TotalAns":totalAns,"AllData":result1,"file":`<iframe src="./public/resumes/${req.params.applicationId}.pdf"></iframe>`});
        // res.end();  
});
router.get('/:id', function(req, res, next) {
    let q=`Select * from ATAK.Applies Where ATAK.Applies.CandidateId=${req.params.id}`
    con.query(q,(err,result1)=>{
        res.json(result1);
        res.end();
    });
  con.on('error', function() {
    con.end();
  });
});

router.patch("/changeApplicationStatus/:applicationid", (req, res, next) => {
  con.query(`Update ATAK.Applies SET ApplicationStatus="${req.body.ApplicationStatus}" Where ApplicationId="${req.params.applicationid}"`, function (err, result) {
    if (err) console.log(err);
    else{
      res.send({"Updated":true});
      res.end();
    }
  });
})

router.post('/', (req, res, next) => {
  console.log(`INSERT INTO ATAK.Applies(ApplicantRelevantExp,ApplicantTotalExp,ApplicationStatus,JobId,CandidateId,ApplicantSkills) Values(${req.body.ApplicantRelevantExp},${req.body.ApplicantTotalExp},"Pending",${req.body.JobId},${req.body.CandidateId},"${req.body.ApplicantSkills}")`);
  con.query(`INSERT INTO ATAK.Applies(ApplicantRelevantExp,ApplicantTotalExp,ApplicationStatus,JobId,CandidateId,ApplicantSkills) Values(${req.body.ApplicantRelevantExp},${req.body.ApplicantTotalExp},"Pending",${req.body.JobId},${req.body.CandidateId},"${req.body.ApplicantSkills}")`, function (err, result) {
    if (err) console.log(err);
    else{
      console.log("Inserted into Applies Table");
      let q=`Select ATAK.Applies.ApplicationId from ATAK.Applies Where ATAK.Applies.CandidateId=${req.body.CandidateId}`
      con.query(q,(err,result1)=>{
        if(result1.length>0){
          result1=result1[result1.length-1]
          result1=result1.ApplicationId
          res.json(result1);
          res.end();
        }
        else{
          res.json(1);
          res.end();
        }
      });
    }
    


});
con.on('error', function () {
  con.end();
});
})


router.post("/uploadsResume",upload.single('resume'));


module.exports = router;
