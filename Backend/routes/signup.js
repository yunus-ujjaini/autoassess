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
    con.query("Select * from ATAK.Candidate",(err,result)=>{
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
    console.log(`Insert Into ATAK.Candidate(CandidateName,CandidateEmail,CandidatePassword,CandidateAddress,CandidateQualification) Values("${req.body.CandidateName}","${req.body.CandidateEmail}","${req.body.CandidatePassword}","${req.body.CandidateAddress}","${req.body.CandidateQualification}")`);
    con.query(`Insert Into ATAK.Candidate(CandidateName,CandidateEmail,CandidatePassword,CandidateAddress,CandidateQualification) Values("${req.body.CandidateName}","${req.body.CandidateEmail}","${req.body.CandidatePassword}","${req.body.CandidateAddress}","${req.body.CandidateQualification}")`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Inserted into Table");
        con.query("Select * from ATAK.Candidate",(err,result)=>{
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

module.exports = router;
