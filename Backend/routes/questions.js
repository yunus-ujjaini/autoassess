var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer =require('multer');
const fs = require('fs');

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
      callBack(null, './public/images/')     // './public/images/' directory name where save the file
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
router.get('/', function(req, res, next) {
    // let tempQuery=`Select * from (Select * from ATAK.Questions 
    //   inner join ATAK.MCQ on ATAK.Questions.QuestionTypeId=ATAK.MCQ.QuestionTypeId)
    //   (Select * from ATAK.Questions 
    //     inner join ATAK.FITB on ATAK.Questions.QuestionTypeId=ATAK.FITB.QuestionTypeId)
    //   (Select * from ATAK.Questions 
    //       inner join ATAK.Coding on ATAK.Questions.QuestionTypeId=ATAK.Coding.QuestionTypeId)
    //   `
    con.query(`Select * from ATAK.FITB 
    inner join ATAK.Questions on ATAK.FITB.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err,result1)=>{
      if (err) console.log(err);
      else{
          console.log(result1);
          con.query(`Select * from ATAK.MCQ
          inner join ATAK.Questions on ATAK.MCQ.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result2)=>{
          con.query(`Select * from ATAK.Coding 
          inner join ATAK.Questions on ATAK.Coding.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result3)=>{
          res.json({"fitb":result1,"mcq":result2,"coding":result3});
          res.end();
        })
        })
      }
      
   
  })
  con.on('error', function() {
    con.end();
  });
});
router.get('/:id', function(req, res, next) {
    con.query(`Select * from ATAK.Questions where ATAK.QuestionId=${req.params.id}`,(err,result)=>{
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

router.patch('/changeDifficulty/:id', (req, res, next) => {
  console.log(`Update ATAK.Questions SET QuestionDifficulty="${req.body.QuestionDifficulty}" Where QuestionTypeId="${req.params.id}"`);
  con.query(`Update ATAK.Questions SET QuestionDifficulty="${req.body.QuestionDifficulty}" Where QuestionTypeId="${req.params.id}"`, function (err, result) {
    if (err) console.log(err);
    else{
      console.log("Updated Question Table with new Difficulty");
      con.query(`Select * from ATAK.FITB 
        inner join ATAK.Questions on ATAK.FITB.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err,result1)=>{
          if (err) console.log(err);
          else{
            console.log(result1);
            con.query(`Select * from ATAK.MCQ
              inner join ATAK.Questions on ATAK.MCQ.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result2)=>{
              con.query(`Select * from ATAK.Coding 
              inner join ATAK.Questions on ATAK.Coding.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result3)=>{
              res.json({"fitb":result1,"mcq":result2,"coding":result3});
              res.end();
            })
            })
          }
      })
    }
    
    


});
con.on('error', function () {
  con.end();
});
})
router.patch('/changeCategory/:id', (req, res, next) => {
  console.log(`Update ATAK.Questions SET QuestionCategoryId="${req.body.QuestionCategoryId}" Where QuestionTypeId="${req.params.id}"`);
  con.query(`Update ATAK.Questions SET QuestionCategoryId="${req.body.QuestionCategoryId}" Where QuestionTypeId="${req.params.id}"`, function (err, result) {
    if (err) console.log(err);
    else{
        console.log("Updated Question Table with new Category");
        con.query(`Select * from ATAK.FITB 
        inner join ATAK.Questions on ATAK.FITB.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err,result1)=>{
          if (err) console.log(err);
          else{
              console.log(result1);
              con.query(`Select * from ATAK.MCQ
              inner join ATAK.Questions on ATAK.MCQ.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result2)=>{
              con.query(`Select * from ATAK.Coding 
              inner join ATAK.Questions on ATAK.Coding.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result3)=>{
              res.json({"fitb":result1,"mcq":result2,"coding":result3});
              res.end();
            })
            })
          }
      })
    }
    


});
con.on('error', function () {
  con.end();
});
})


router.delete('/', (req, res, next) => {
  console.log(`Delete From ATAK.Questions Where QuestionId="${req.body.QuestionId}"`);
  con.query(`Delete From ATAK.Questions Where QuestionId="${req.body.QuestionId}"`, function (err, result) {
    if (err) console.log(err);
    else{
      console.log("Deleted from Questions Table");
      let table=req.body.QuestionTypeId.startsWith("F")?"FITB":req.body.QuestionTypeId.startsWith("M")?"MCQ":"Coding";
      let deleteQuery=`Delete From ATAK.${table} Where QuestionTypeId="${req.body.QuestionTypeId}"`
      con.query(deleteQuery, function (err, result) {
        if (err) console.log(err);
        else{
          const path = `./public/images/${req.body.QuestionTypeId}.jpg`;
            fs.unlink(path, (err) => {
              if (err) {
                console.error(err)
                return
              }
            })
            con.query(`Select * from ATAK.FITB 
              inner join ATAK.Questions on ATAK.FITB.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err,result1)=>{
                if (err) console.log(err);
                else{
                    console.log(result1);
                    con.query(`Select * from ATAK.MCQ
                    inner join ATAK.Questions on ATAK.MCQ.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result2)=>{
                    con.query(`Select * from ATAK.Coding 
                    inner join ATAK.Questions on ATAK.Coding.QuestionTypeId=ATAK.Questions.QuestionTypeId Inner Join ATAK.QuestionCategory on ATAK.Questions.QuestionCategoryId=ATAK.QuestionCategory.QuestionCategoryId`,(err1,result3)=>{
                    res.json({"fitb":result1,"mcq":result2,"coding":result3});
                    res.end();
                  })
                  })
                }
            })
        }
      });
    }
    
    


});
con.on('error', function () {
  con.end();
});
})




module.exports = router;
