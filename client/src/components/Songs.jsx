import axios from "axios"
import { useEffect } from "react"

function Songs() {
   let songs
   async function GetSongs() {
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/songs')
          .then(response => {
            songs(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
    }
    return (
        <div className="overflow-y-hidden h-screen bg-gradient-to-b from-gray-700 to-gray-800">
            return (
            <ul role="list" className="divide-y divide-gray-100">
                {songs.map((song) => (
                    <li key={song.email} className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={song.imageUrl} alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{song.name}</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{song.email}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">{song.role}</p>
                            {song.lastSeen ? (
                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                    Last seen <time dateTime={song.lastSeenDateTime}>{song.lastSeen}</time>
                                </p>
                            ) : (
                                <div className="mt-1 flex items-center gap-x-1.5">
                                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-xs leading-5 text-gray-500">Online</p>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            )

        </div>
    )
}

export default Songs