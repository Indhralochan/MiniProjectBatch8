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
import Dashboard from './components/Dashboard.jsx';
import Search from './components/Search.jsx';
import SearchMain from './components/SearchMain.jsx';
import  SongProvider from './components/SongContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClickProvider from './components/SelectedContext.jsx';
import SpotifyLogin from './components/SpotifyLogin.jsx';
import  SongUriProvider  from './components/useSongContext.jsx';
import { UserDataProvider } from './components/DataContext';
import UserHistoryMain from './components/UserHistoryMain.jsx';
import PlaylistMain from './components/PlaylistMain.jsx';
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
    element : <Dashboard/>
  },
  {
    path: "/signout",
    element : <Home/>
  },
  {
    path: "/search",
    element : <SearchMain/>
  },
  {
    path: "/auth/login",
    element : <SpotifyLogin/>
  },
  {
    path: "/user-history",
    element : <UserHistoryMain />
  },
  {
    path: "/playlists",
    element : <PlaylistMain />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <SongUriProvider>
  <UserDataProvider>
  <SongProvider>
  <ClickProvider>
    <RouterProvider router={router} />
    <ToastContainer/>
  </ClickProvider>
    </SongProvider>
    </UserDataProvider>
    </SongUriProvider>
  </React.StrictMode>,
)
