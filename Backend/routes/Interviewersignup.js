var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
  user: "root",
  password: "@quaVirgo1340",
  database: "ATAK"
});
con.connect(function (err) {
  if (err) console.log(err);
  })
/* GET home page. */
router.get('/', function(req, res, next) {
    con.query("Select * from ATAK.Interviewer",(err,result)=>{
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
router.get('/:id', function(req, res, next) {
    con.query(`Select * from ATAK.Interviewer where InterviewerId=${req.params.id}`,(err,result)=>{
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

router.post('/',(req,res,next)=>{
    console.log("Connected!");
    console.log(`Insert Into ATAK.Interviewer(InterviewerName,InterviewerEmail,InterviewerPassword,InterviewerDesignation,InterviewerApproved) Values("${req.body.InterviewerName}","${req.body.InterviewerEmail}","${req.body.InterviewerPassword}","${req.body.InterviewerDesignation}",FALSE)`);
    con.query(`Insert Into ATAK.Interviewer(InterviewerName,InterviewerEmail,InterviewerPassword,InterviewerDesignation,InterviewerApproved) Values("${req.body.InterviewerName}","${req.body.InterviewerEmail}","${req.body.InterviewerPassword}","${req.body.InterviewerDesignation}",FALSE)`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Inserted into Table");
        con.query("Select * from ATAK.Interviewer",(err,result)=>{
          if (err) console.log(err);
          else{
            console.log(result);
            res.json(result);
            res.end();
          }
        })
      }
    
    
  });
  con.on('error', function() {
    con.end();
  });
})

router.patch('/:id', (req, res, next) => {
    console.log("Connected!");
    console.log(`Update ATAK.Interviewer SET InterviewerApproved=TRUE Where InterviewerId="${req.params.id}"`);
    con.query(`Update ATAK.Interviewer SET InterviewerApproved=TRUE Where InterviewerId="${req.params.id}"`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Updated Interviewer Table");
        con.query("Select * from ATAK.Interviewer", (err, result) => {
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
router.delete('/:id', (req, res, next) => {
    console.log("Connected!");
    // console.log(`Delete from ATAK.Job where JobId="${req.body.JobId}"`);
    con.query(`Delete from ATAK.Interviewer where InterviewerId=${req.params.id}`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Deleted from Interviewer Table");
        con.query("Select * from ATAK.Interviewer", (err, result) => {
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
