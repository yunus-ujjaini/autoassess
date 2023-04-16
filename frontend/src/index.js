import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import Apply from './Apply';
import Signup from './Signup';
import Login from './Login';
import InterviewerLogin from './InterviewerLogin';
import reportWebVitals from './reportWebVitals';
import InterviewerSignup from './InterviewerSignup';
import Dashboard from './Dashboard';
import CreateJob from './CreateJob';
import ViewJobs from './ViewJobs';
import AddQuestions from './AddQuestions';
import FIBQuestions from './FIBQuestions';
import MCQQuestions from './MCQQuestions';
import CodeQuestions from './CodeQuestions';
import AdminPanel from './AdminPanel';
import ViewQuestions from './ViewQuestions';
import LinkQuestions from './LinkQuestions';
import ViewApplicants from './ViewApplicants';
import Assessment from './Assessment';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/Apply",
    element: <Apply />,
  },
  {
    path: "/Assessment",
    element: <Assessment />,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Interviewer/Login",
    element: <InterviewerLogin />
  },
  {
    path: "/Interviewer/Signup",
    element: <InterviewerSignup />
  },
  {
    path: "/Interviewer/Dashboard",
    element: <Dashboard />
  },
  {
    path: "/Interviewer/Dashboard/CreateJob",
    element: <CreateJob />
  },
  {
    path: "/Interviewer/Dashboard/ViewJobs",
    element: <ViewJobs />
  },
  {
    path: "/Interviewer/Dashboard/AddQuestions",
    element: <AddQuestions />
  },
  {
    path: "/Interviewer/Dashboard/ViewQuestions",
    element: <ViewQuestions />
  },
  {
    path: "/Interviewer/Dashboard/AddQuestions/FIBQuestions",
    element: <FIBQuestions />
  },
  {
    path: "/Interviewer/Dashboard/AddQuestions/MCQQuestions",
    element: <MCQQuestions />
  },
  {
    path: "/Interviewer/Dashboard/AddQuestions/CodeQuestions",
    element: <CodeQuestions />
  },
  {
    path: "/Interviewer/Dashboard/LinkQuestions",
    element: <LinkQuestions />
  },
  {
    path: "/Interviewer/Dashboard/ViewApplicants",
    element: <ViewApplicants />
  },
  {
    path: "/Interviewer/AdminPanel",
    element: <AdminPanel />
  },
  {
    path: "*",
    element: <h1>Custom 404</h1>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
