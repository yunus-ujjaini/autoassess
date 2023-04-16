import { render, screen } from '@testing-library/react';
import InterviewerLogin from './InterviewerLogin';
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const dummyComp=<BrowserRouter>
  <InterviewerLogin />
</BrowserRouter>
describe('Testing Interviewer Login Page',()=>{
  it('renders Login as Interviewer Link', () => {
    render(dummyComp);
    const linkElement = screen.getByText(/Login as Interviewer/i);
    expect(linkElement).toBeInTheDocument();
  });
  it('displays validation', () => {
    render(dummyComp);
    const loginButton = screen.getByRole("button");
    loginButton.click();
    const error = screen.getByText(/Incorrect Username or Password/i);
    expect(error).toBeInTheDocument();
  });
})

