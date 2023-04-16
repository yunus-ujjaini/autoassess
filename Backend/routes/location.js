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
    con.query("Select * from ATAK.Locations",(err,result)=>{
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
    con.query(`Select * from ATAK.Locations where LocationId=${req.params.id}`,(err,result)=>{
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
    console.log(`Insert Into ATAK.Locations(Location) Values("${req.body.Location}")`);
    con.query(`Insert Into ATAK.Locations(Location) Values("${req.body.Location}")`, function (err, result) {
      if (err) console.log(err);
      else{
        console.log("Inserted into Locations Table");
        con.query("Select * from ATAK.Locations",(err,result)=>{
          if (err) console.log(err);
          console.log(result);
          res.json(result);
          res.end();
        })
      }
     

    
    
  });
  con.on('error', function() {
    con.end();
  });
})

router.delete('/',(req,res,next)=>{
    console.log("Connected!");
    console.log(`Delete from ATAK.Locations where LocationId="${req.body.LocationId}"`);
    con.query(`Delete from ATAK.Locations where LocationId="${req.body.LocationId}"`, function (err, result) {
      if (err){
        console.log(err);
        res.json({"Error":"Cannot delete location which is already in use"});
        res.end();
      } 
      else
      {
          console.log("Deleted from Locations Table");
          con.query("Select * from ATAK.Locations",(err,result)=>{
            if (err) console.log(err);
            else{
              console.log(result);
              res.json(result);
              res.end();
            }
            
        });
      }
      
    
    
  });
  con.on('error', function() {
    con.end();
  });
})

module.exports = router;
