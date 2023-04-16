var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.json({
    "username":"Yunus",
    "password":"1234"
  })
});

module.exports = router;
