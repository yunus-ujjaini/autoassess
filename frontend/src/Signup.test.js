import { render, screen } from '@testing-library/react';
import Signup from './Signup';
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const dummyComp=<BrowserRouter>
  <Signup />
</BrowserRouter>
describe('Testing Signup Page',()=>{
  it('renders Create Account button', () => {
    render(dummyComp);
    const button = screen.getByRole("button");
    expect(button.innerHTML).toMatch(/Create Account/i);
  });
  it('displays validation', () => {
    render(dummyComp);
    const signupButton = screen.getByRole("button");
    signupButton.click();
    expect(signupButton).toBeInTheDocument();
  });
})

