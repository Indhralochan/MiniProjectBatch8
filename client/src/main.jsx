import React from 'react'
import ReactDOM from 'react-dom/client'
// eslint-disable-next-line no-unused-vars
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home.jsx';
import Signin from './components/Signin.jsx';
import SignUp from './components/SignUp.jsx';
import ContactUs from './components/ContactUs.jsx';
import Songs from './components/Songs.jsx';

const router = createBrowserRouter([
{
    path: "/",
    element: <Home />
  }
  ,{
    path :"/signin",
    element : <Signin />
  },
  {
    path : "/signup",
    element : <SignUp/>
  },
  {
    path : "/contactus",
    element : <ContactUs/>
  },
  {
    path: "/session",
    element : <Songs/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
