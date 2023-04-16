var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer =require('multer');
const fs = require('fs');
const vm = require('vm');


var con = mysql.createConnection({
  user: "root",
  password: "@quaVirgo1340",
  database: "ATAK"
});
con.connect(function (err) {
  if (err) console.log(err);
  })

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function addQuestionToAssessment(assessmentId,questionId) {
  let q2=`Insert into ATAK.AssessmentQuestions(QuestionId,AssessmentId) Values(${questionId},${assessmentId})`;
  con.query(q2,(err,result1)=>{
    console.log("Added new Question",result1);
  });
}
function updateQuestionResult(assessmentId,questionId,result) {
  let q2=`Update ATAK.AssessmentQuestions SET Result=${result} Where QuestionId=${questionId} and AssessmentId=${assessmentId}`;
  con.query(q2,(err,result1)=>{
    console.log("update result",result1);
  });
}
function getRelevantQuestions(dataSource,evaluatingVariable,objective) {
  if(evaluatingVariable<30){
    dataSource=dataSource.filter((question)=>{
      if(question.QuestionDifficulty=="Easy" && ((objective && !question.QuestionTypeId.startsWith("C")) || (!objective && question.QuestionTypeId.startsWith("C")))){
        return question;
      }
    })
  }
  else if(evaluatingVariable>=30 && evaluatingVariable<60){
    dataSource=dataSource.filter((question)=>{
      if(question.QuestionDifficulty=="Medium" && ((objective && !question.QuestionTypeId.startsWith("C")) || (!objective && question.QuestionTypeId.startsWith("C")))){
        return question;
      }
    })
  }
  else{
    dataSource=dataSource.filter((question)=>{
      if(question.QuestionDifficulty=="Hard" && ((objective && !question.QuestionTypeId.startsWith("C")) || (!objective && question.QuestionTypeId.startsWith("C")))){
        return question;
      }
    })
  }
  return dataSource
}
  
router.get('/getQuestion/Objective/:id', function(req, res, next) {
    let q=`Select EvaluatingVariable from ATAK.Assessment Where ATAK.Assessment.AssessmentId=${req.params.id}`
    con.query(q,(err,result1)=>{
      let evaluatingVariable=result1[0].EvaluatingVariable
      console.log("Evaluating Variable",evaluatingVariable)
      let q2=`Select ATAK.Applies.JobId from ATAK.Applies inner join ATAK.Assessment on ATAK.Applies.ApplicationId=ATAK.Assessment.ApplicationId where ATAK.Assessment.AssessmentId=${req.params.id}`;
      con.query(q2,(err,result1)=>{
        let jobId=result1[0].JobId;

        let q3=`Select * from ATAK.Job_Questions INNER JOIN ATAK.Questions on ATAK.Job_Questions.QuestionId=ATAK.Questions.QuestionId Where ATAK.Job_Questions.JobId=${jobId}`
        con.query(q3,(err,linkedQuestions)=>{
            linkedQuestions=getRelevantQuestions(linkedQuestions,evaluatingVariable,true)
          
            let q3=`Select * from ATAK.AssessmentQuestions Where AssessmentId=${req.params.id}`;
            let pickedQuestion;
            con.query(q3,(err,AskedQuestions)=>{
              console.log("Asked",AskedQuestions);
             
              if(AskedQuestions.length==0){
                pickedQuestion=linkedQuestions[0];
                
              }
              else{
                for(let i=0;i<linkedQuestions.length;i++){
                  console.log("current Question",linkedQuestions[i]);
                  let present=AskedQuestions.findIndex((question)=>{
                    return question.QuestionId==linkedQuestions[i].QuestionId;
                  })
                  console.log("Present",present);
                  if(present==-1){
                    pickedQuestion=linkedQuestions[i];
                    break;
                  }
                }
              }
              
              if(pickedQuestion){
                addQuestionToAssessment(req.params.id,pickedQuestion.QuestionId)
                res.json({"From":"Linked",pickedQuestion,evaluatingVariable});
                res.end();
              }
              else{
                console.log("All linkedquestions asked")
                let q3=`Select * from ATAK.Questions`
                con.query(q3,(err,allQuestions)=>{
                  allQuestions=getRelevantQuestions(allQuestions,evaluatingVariable,true);
                  if(AskedQuestions.length==0){
                    pickedQuestion=allQuestions[0];
                  }
                  else{
                    for(let i=0;i<allQuestions.length;i++){
                      console.log("current Question",allQuestions[i]);
                      let present=AskedQuestions.findIndex((question)=>{
                        return question.QuestionId==allQuestions[i].QuestionId;
                      })
                      console.log("Present",present);
                      if(present==-1){
                        pickedQuestion=allQuestions[i]
                        break;
                      }
                    }
                    if(pickedQuestion){
                      addQuestionToAssessment(req.params.id,pickedQuestion.QuestionId)
                      res.json({"From":"All",pickedQuestion,evaluatingVariable});
                      res.end();
                    }
                  }

                });
              }
              
            });
            
        });

        
      })
      
  });
  con.on('error', function() {
    con.end();
  });
});

router.get('/getQuestion/Coding/:id', function(req, res, next) {
  let q=`Select EvaluatingVariableCoding from ATAK.Assessment Where ATAK.Assessment.AssessmentId=${req.params.id}`
    con.query(q,(err,result1)=>{
      let evaluatingVariable=result1[0].EvaluatingVariableCoding
      console.log("Evaluating Variable",evaluatingVariable)
      let q2=`Select ATAK.Applies.JobId from ATAK.Applies inner join ATAK.Assessment on ATAK.Applies.ApplicationId=ATAK.Assessment.ApplicationId where ATAK.Assessment.AssessmentId=${req.params.id}`;
      con.query(q2,(err,result1)=>{
        let jobId=result1[0].JobId;

        let q3=`Select * from ATAK.Job_Questions INNER JOIN ATAK.Questions on ATAK.Job_Questions.QuestionId=ATAK.Questions.QuestionId Where ATAK.Job_Questions.JobId=${jobId}`
        con.query(q3,(err,linkedQuestions)=>{
            linkedQuestions=getRelevantQuestions(linkedQuestions,evaluatingVariable,false)
          
            let q3=`Select * from ATAK.AssessmentQuestions Where AssessmentId=${req.params.id}`;
            let pickedQuestion;
            con.query(q3,(err,AskedQuestions)=>{
              console.log("Asked",AskedQuestions);
             
              if(AskedQuestions.length==0){
                pickedQuestion=linkedQuestions[0];
                
              }
              else{
                for(let i=0;i<linkedQuestions.length;i++){
                  console.log("current Question",linkedQuestions[i]);
                  let present=AskedQuestions.findIndex((question)=>{
                    return question.QuestionId==linkedQuestions[i].QuestionId;
                  })
                  console.log("Present",present);
                  if(present==-1){
                    pickedQuestion=linkedQuestions[i];
                    break;
                  }
                }
              }
              
              if(pickedQuestion){
                addQuestionToAssessment(req.params.id,pickedQuestion.QuestionId)
                res.json({"From":"Linked",pickedQuestion,evaluatingVariable});
                res.end();
              }
              else{
                console.log("All linkedquestions asked")
                let q3=`Select * from ATAK.Questions`
                con.query(q3,(err,allQuestions)=>{
                  allQuestions=getRelevantQuestions(allQuestions,evaluatingVariable,false);
                  if(AskedQuestions.length==0){
                    pickedQuestion=allQuestions[0];
                  }
                  else{
                    for(let i=0;i<allQuestions.length;i++){
                      console.log("current Question",allQuestions[i]);
                      let present=AskedQuestions.findIndex((question)=>{
                        return question.QuestionId==allQuestions[i].QuestionId;
                      })
                      console.log("Present",present);
                      if(present==-1){
                        pickedQuestion=allQuestions[i]
                        break;
                      }
                    }
                    if(pickedQuestion){
                      addQuestionToAssessment(req.params.id,pickedQuestion.QuestionId)
                      res.json({"From":"All",pickedQuestion,evaluatingVariable});
                      res.end();
                    }
                  }

                });
              }
              
            });
            
        });

        
      })
      
  });
  con.on('error', function() {
    con.end();
  });
});



/* GET home page. */
router.get('/:id', function(req, res, next) {
    let q=`Select AssessmentId from ATAK.Assessment Where ATAK.Assessment.ApplicationId=${req.params.id}`
    con.query(q,(err,result1)=>{
        res.json(result1);
        res.end();
    });
  con.on('error', function() {
    con.end();
  });
});

function updateEval(eval,offset){
  return eval+offset;
}
router.patch('/updateScore', (req, res, next) => {
  console.log("----------------------",req.body);
  let type=req.body.QuestionTypeId.charAt(0)==="M"?"MCQ":req.body.QuestionTypeId.charAt(0)==="F"?"FITB":"Coding"
  console.log(`Select * from ATAK.${type} Inner Join ATAK.Questions on ATAK.${type}.QuestionTypeId=ATAK.Questions.QuestionTypeId where ATAK.${type}.QuestionTypeId="${req.body.QuestionTypeId}"`);
  con.query(`Select * from ATAK.${type} Inner Join ATAK.Questions on ATAK.${type}.QuestionTypeId=ATAK.Questions.QuestionTypeId where ATAK.${type}.QuestionTypeId="${req.body.QuestionTypeId}"`,(err,result)=>{
    if (err) console.log(err);
    else{
      console.log("Actual",req.body.Answer);
      console.log("Expected",result)
      let offset=0;
      if(type==="MCQ"){
        if(result[0].Answer===req.body.Answer){
          offset=8;
        }
        else
          offset=-3
      }
      else if(type==="FITB"){
        if(result[0].Answer.toLowerCase()===req.body.Answer.toLowerCase()){
          offset=8;
        }
        else
          offset=-3
      }
      else if(type==="Coding"){
        console.log("Received Code is following: ",req.body.Answer);
        let pairs=result[0].Answer.split("~");
        let inputs=[];
        let outputs=[];
        for(let i=0;i<pairs.length;i++){
          inputs.push(pairs[i].split("##")[0]);
          outputs.push(pairs[i].split("##")[1])
        }

        
        let offsetDivided=Math.floor(8/inputs.length);
        console.log("Offset Divided",offsetDivided)
        for(let i=0;i<inputs.length;i++){
          const script=new vm.Script(`
            ${req.body.Answer}

            myoutput=yourCode(${inputs[i]})
          `)
          var myObj = { myoutput: [] };
          vm.createContext(myObj)
          // const cacheWithout = script.createCachedData();
          // console.log("CacheWithout",cacheWithout);
          try{
            script.runInContext(myObj);
          }
          catch(err){
            console.log(err);
          } 
          
          // const cacheWith = script.createCachedData();
          if(outputs[i].startsWith('[')){
            outputs[i] = outputs[i].replace(/'/g, '"');
            outputs[i] = JSON.parse(outputs[i]);
            
          }
          else{
            outputs[i]=outputs[i].replaceAll("'","");
          }
          console.log("after running answer is",myObj);
          console.log("Actual output",myObj.myoutput)
          console.log("Expected output",outputs[i])
          console.log("Actual output 2",JSON.stringify(myObj.myoutput))
          console.log("Expected output 2",JSON.stringify(outputs[i]))
          if(myObj.myoutput===outputs[i] || `'${myObj.myoutput}'`===outputs[i] || JSON.stringify(myObj.myoutput)===JSON.stringify(outputs[i]))
            offset+=offsetDivided
          else
            offset-=(offsetDivided-2)
          console.log("Offset After",offset);
        }
      }
      console.log(result);
      let correct;
      if(offset==8){
        correct=1;
      }
      else if(offset>0){
        correct=2;
      }
      else
        correct=0;
      updateQuestionResult(req.body.AssessmentId,req.body.QuestionId,correct)
      con.query(`Select EvaluatingVariable,EvaluatingVariableCoding from ATAK.Assessment where AssessmentId=${req.body.AssessmentId}`,(err,result2)=>{
        if (err) console.log(err);
        else{
          let evalFetched;
          if(type==="Coding"){
            evalFetched=result2[0].EvaluatingVariableCoding
          }
          else{
            evalFetched=result2[0].EvaluatingVariable
          }
          let evalVar=updateEval(evalFetched,offset);
          if(evalVar<0){
            evalVar=0;
          }
          let evalToChange="";
          if(type==="Coding"){
            evalToChange="EvaluatingVariableCoding"
          }
          else{
            evalToChange="EvaluatingVariable"
          }
          con.query(`Update ATAK.Assessment SET ${evalToChange}=${evalVar} Where AssessmentId=${req.body.AssessmentId}`,(err,result3)=>{
            if (err) console.log(err);
            else{
              console.log(result3);
              res.json({"Eval":evalVar})
              res.end();
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




router.post('/', (req, res, next) => {
  let currentDate = new Date().toJSON().slice(0, 10);
  console.log(`INSERT INTO ATAK.Assessment(ApplicationId) Values(${req.body.ApplicationId})`);
  con.query(`INSERT INTO ATAK.Assessment(ApplicationId,AssessmentDate,EvaluatingVariable) Values(${req.body.ApplicationId},'${currentDate}',0)`, function (err, result) {
    if (err) console.log(err);
    else{
      console.log("Inserted into Assessment Table");
      let q=`Select AssessmentId from ATAK.Assessment Where ATAK.Assessment.ApplicationId=${req.body.ApplicationId}`
      con.query(q,(err,result1)=>{
        res.json(result1);
        res.end();
      });
    }
    


});
con.on('error', function () {
  con.end();
});
})

router.patch('/', (req, res, next) => {
  let currentDate = new Date().toJSON().slice(0, 10);
  console.log(`Update ATAK.Assessment SET AssessmentTime="${req.body.AssessmentTime}" Where ApplicationId="${req.body.ApplicationId}"`);
  con.query(`Update ATAK.Assessment SET AssessmentTime="${req.body.AssessmentTime}" Where ApplicationId="${req.body.ApplicationId}"`, function (err, result) {
    if (err) console.log(err);
    else{
      console.log("Updated Assessment Table");
      let q=`Select * from ATAK.Assessment Where ATAK.Assessment.ApplicationId=${req.body.ApplicationId}`
      con.query(q,(err,result1)=>{
        let q1=`Select * from ATAK.AssessmentQuestions INNER JOIN ATAK.Questions ON ATAK.AssessmentQuestions.QuestionId = ATAK.Questions.QuestionId  Where ATAK.AssessmentQuestions.AssessmentId=${result1[0].AssessmentId}`
        con.query(q1,(err,result2)=>{
          let correctAns={"Hard":0,"Medium":0,"Easy":0}
          for(let i=0;i<result2.length;i++){
            if(result2[i].Result>0){
              if(result2[i].QuestionDifficulty==="Easy")
                correctAns.Easy+=1;
              else if(result2[i].QuestionDifficulty==="Medium")
                correctAns.Medium+=1;
              else if(result2[i].QuestionDifficulty==="Hard")
                correctAns.Hard+=1;
            }
          }

          let weights={"Hard":2,"Medium":1.5,"Easy":1};
          let nominator=(correctAns.Hard*weights.Hard)+(correctAns.Medium*weights.Medium)+(correctAns.Easy*weights.Easy);
          let denominator=(weights.Hard+weights.Medium+weights.Easy);
          let score=(nominator/denominator);
          console.log("Correct answers",correctAns);
          console.log("Score",score);
          con.query(`Update ATAK.Assessment SET AssessmentScore="${score}" Where ApplicationId="${req.body.ApplicationId}"`, function (err, result3) {
            if (err) console.log(err);
            else{
              res.json("submitted");
              res.end();
            }
          });

          
        });
      });
    }
    


});
con.on('error', function () {
  con.end();
});
})




module.exports = router;
