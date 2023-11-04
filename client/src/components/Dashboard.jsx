import React from 'react'
import Navbar from './NavbarMain'
import Songs from './Songs'
import SideBar from './SideBar'
import Player from './Player'
import JustForYou from './JustForYou'
import { useSongUriContext } from './useSongContext';
import useAuth from "./useAuth";
import '../components/CustomCss/scroll.css'
const Dashboard = () => {
  const code = new URLSearchParams(window.location.search).get("code")
  const { selectedSongUri, setSelectedSongUri } = useSongUriContext();
  const accessToken = useAuth(code)
  return (
    <>

    <div className="h-screen bg-[#09090B] flex flex-col overflow-y-hidden">
    <div className="w-full"><Navbar/></div>
    <div className="flex flex-row">
    <div className="w-[20%]"><SideBar/></div>
    <div className="w-[50%] overflow-x-hidden slim-scrollbar"><Songs/></div>
    <div className="w-[30%]"><JustForYou/></div>
    {selectedSongUri ? ( // Conditionally render the Player component
    <div className="w-full pr-5 fixed bottom-0  bg-white border border-gray-300">
      <Player className="bg-black pr-5" accessToken={accessToken} trackUri={selectedSongUri} />
    </div>
  ) : null}
    </div>
    </div>
    </>
  )
}

export default Dashboard