import { render, screen } from '@testing-library/react';
import Login from './Login';
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const dummyComp=<BrowserRouter>
  <Login />
</BrowserRouter>
describe('Testing Candidates Login Page',()=>{
  it('renders Login Link', () => {
    render(dummyComp);
    const linkElement = screen.getAllByText(/Login/i);
    expect(linkElement).toHaveLength(3);
  });
  it('displays validation', () => {
    render(dummyComp);
    const loginButton = screen.getByRole("button");
    loginButton.click();
    const error = screen.getByText(/Incorrect Username or Password/i);
    expect(error).toBeInTheDocument();
  });
})

