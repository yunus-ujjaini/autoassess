var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer =require('multer');
const e = require('express');

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
    con.query("Select * from ATAK.FITB Inner Join ATAK.Questions on ATAK.FITB.QuestionTypeId=ATAK.Questions.QuestionTypeId",(err,result)=>{
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
router.get('/getCount', function(req, res, next) {
  let q="Select count(*) as count from ATAK.FITB ORDER BY QuestionTypeId ASC"
  con.query("Select * from ATAK.FITB",(err,result)=>{
    if (err) console.log(err);
    else{
      console.log(result);
      if(result.length>0){
        const sortAlphaNum = (a, b) => a.QuestionTypeId.localeCompare(b.QuestionTypeId, 'en', { numeric: true })
        result.sort(sortAlphaNum)
        result=result[result.length-1]
        result=result.QuestionTypeId
        res.json(parseInt(result.substring(1))+1);
        res.end();
      }
      else{
        res.json(1);
        res.end();
      }
    }
    
})
con.on('error', function() {
  con.end();
});
});

router.get('/onlyQuestion/:id', function(req, res, next) {
  con.query(`Select Question from ATAK.FITB Inner Join ATAK.Questions on ATAK.FITB.QuestionTypeId=ATAK.Questions.QuestionTypeId where ATAK.FITB.QuestionTypeId="${req.params.id}"`,(err,result)=>{
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
    con.query(`Select * from ATAK.FITB Inner Join ATAK.Questions on ATAK.FITB.QuestionTypeId=ATAK.Questions.QuestionTypeId where ATAK.FITB.QuestionTypeId="${req.params.id}"`,(err,result)=>{
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
    console.log("Connected!");
    let question=req.body.Question;
    let answer=req.body.Answer;
    question=question.replaceAll('"',"'");
    answer=answer.replaceAll('"',"'");
    console.log(`Insert Into ATAK.FITB(QuestionTypeId,Question,Answer) Values("${req.body.QuestionTypeId}","${question}","${answer}")`);
    con.query(`Insert Into ATAK.FITB(QuestionTypeId,Question,Answer) Values("${req.body.QuestionTypeId}","${question}","${answer}")`, function (err, result) {
      if (err) console.log(err);
      else{
        con.query("Select * from ATAK.FITB", (err, result) => {
          if (err) console.log(err);
          else{
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

router.post('/questions', (req, res, next) => {
    console.log("Connected!");
    console.log(`INSERT INTO ATAK.Questions(QuestionTypeId,QuestionCategoryId,QuestionDifficulty) VALUES ('${req.body.QuestionTypeId}',${req.body.CategoryId},"${req.body.Difficulty}")`);
    con.query(`INSERT INTO ATAK.Questions(QuestionTypeId,QuestionCategoryId,QuestionDifficulty) VALUES ('${req.body.QuestionTypeId}',${req.body.CategoryId},"${req.body.Difficulty}")`, function (err, result) {
      if (err) console.log(err);
      else{
        con.query("Select * from ATAK.Questions", (err, result) => {
          if (err) console.log(err);
          else{
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

router.post("/uploadImage",upload.single('image'))


module.exports = router;
