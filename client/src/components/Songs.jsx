import axios from "axios";
import { useState, useEffect } from "react";
import NavbarMain from "./NavbarMain";

function Songs() {
    const [songs, setSongs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 14;

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/songs')
          .then(response => {
            const songsArray = Object.keys(response.data.track_name).map(key => ({
              id: key,
              track_name: response.data.track_name[key],
              popularity: response.data.popularity[key],
              similarity_score: response.data.similarity_score[key],
              combined_score: response.data.combined_score[key],
            }));
            
            setSongs(songsArray);
            console.log(songsArray);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);

    const indexOfLastSong = currentPage * itemsPerPage;
    const indexOfFirstSong = indexOfLastSong - itemsPerPage;
    const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="overflow-y-scroll h-screen bg-gradient-to-b from-gray-700 to-gray-800">
        <NavbarMain/>
            <h1 className="text-3xl font-bold my-4 text-white mx-auto flex justify-center">Recommended Songs</h1>
            <div className="grid grid-cols-2 gap-4 px-5 py-5">
                {currentSongs.length > 0 ? (
                    currentSongs.map((song) => (
                        <div key={song.id} className="text-white p-4 shadow-lg rounded-md shadow-md shadow-emerald-300">
                            <h2 className="text-xl font-semibold">{song.track_name}</h2>
                            <p className="text-zinc-300">Popularity: {song.popularity}</p>
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            
            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                {Array.from({ length: Math.ceil(songs.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-2 mx-1 rounded-md ${
                            currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-500 text-gray-200'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Songs;
