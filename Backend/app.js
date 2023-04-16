var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var multer = require('multer');
var bodyParser = require('body-parser');



var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var InterviewersignupRouter = require('./routes/Interviewersignup');
var locations = require('./routes/location');
var jobs = require('./routes/jobs');
var category = require('./routes/category');
var fibQuestions = require('./routes/FIBQuestion');
var mcqQuestions = require('./routes/MCQQuestion');
var codeQuestions = require('./routes/codeQuestion');
var questions = require('./routes/questions');
var LinkQuestions = require('./routes/linkQuestions');
var Apply = require('./routes/apply');
var Assessment = require('./routes/assessment');

var app = express();
app.use(cors({origin:"*"}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static",express.static(path.join(__dirname, 'public')));
// app.use('/static',express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', loginRouter);
app.use('/signup', signupRouter);
app.use('/interviewersignup', InterviewersignupRouter);
app.use('/locations',locations);
app.use('/jobs',jobs);
app.use('/category',category);
app.use('/fibquestions',fibQuestions);
app.use('/mcqquestions',mcqQuestions);
app.use('/codequestions',codeQuestions);
app.use('/questions',questions);
app.use('/linkQuestions',LinkQuestions);
app.use('/applies',Apply);
app.use('/assessment',Assessment);

module.exports = app;