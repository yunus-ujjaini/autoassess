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
  con.query("Select * from ATAK.QuestionCategory",(err,result)=>{
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
    con.query(`Select * from ATAK.QuestionCategory where QuestionCategoryId=${req.params.id}`,(err,result)=>{
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
    console.log(`Insert Into ATAK.QuestionCategory(QuestionCategory) Values("${req.body.QuestionCategory}")`);
    con.query(`Insert Into ATAK.QuestionCategory(QuestionCategory) Values("${req.body.QuestionCategory}")`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Inserted into QuestionCategory Table");
        con.query("Select * from ATAK.QuestionCategory",(err,result)=>{
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

router.delete('/',(req,res,next)=>{
    console.log(`Delete from ATAK.QuestionCategory where QuestionCategoryId="${req.body.QuestionCategoryId}"`);
    con.query(`Delete from ATAK.QuestionCategory where QuestionCategoryId="${req.body.QuestionCategoryId}"`, function (err, result) {
      if (err){
        console.log(err);
        res.json({"Error":"Cannot delete Category which is already in use"});
        res.end();
      }
      else{
        console.log("Deleted from QuestionCategory Table");
        con.query("Select * from ATAK.QuestionCategory",(err,result)=>{
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
