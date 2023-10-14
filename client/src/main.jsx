import React from 'react'
import ReactDOM from 'react-dom/client'
import { Theme } from '@radix-ui/themes';
// eslint-disable-next-line no-unused-vars
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home.jsx';
import Signin from './components/Signin.jsx';
import SignUp from './components/SignUp.jsx';
import ContactUs from './components/ContactUs.jsx';
import Songs from './components/Songs.jsx';
import Search from './components/Search.jsx';
import { Provider } from 'react-redux'
import { store } from './redux/store';
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
  },
  {
    path: "/signout",
    element : <Home/>
  },
  {
    path: "/search",
    element : <Search/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Theme>
  <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
    </Theme>
  </React.StrictMode>,
)
