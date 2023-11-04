import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

// eslint-disable-next-line react/prop-types
export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)
  console.log(accessToken)
  console.log(trackUri)
  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null
  return (
    <div className="bg-black">
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
    </div>
  )
}