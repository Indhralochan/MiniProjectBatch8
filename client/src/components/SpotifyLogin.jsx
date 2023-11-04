
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=e547c3b2d7ba459693e6ccf458347f9e&response_type=code&redirect_uri=http://localhost:5173/session&scope=user-read-playback-state%20user-modify-playback-state%20streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20playlist-read-private%20playlist-modify-public%20playlist-modify-private";



export default function Login() {
  return (
    <div
      className="flex justify-content align-center items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="border border-2 border-green-400" href={AUTH_URL}>
        Login With Spotify
      </a>
    </div>
  )
}