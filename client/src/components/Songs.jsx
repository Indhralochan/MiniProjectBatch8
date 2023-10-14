import axios from "axios";
import { useState, useEffect, useRef } from "react"; // Import useRef
import NavbarMain from "./NavbarMain";
import InfiniteScroll from "react-infinite-scroll-component";

function Songs() {
    const [songs, setSongs] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const page = useRef(1); // Use a ref to keep track of the current page
    const [pageCount, setPageCount] = useState(1); // [1
    const songsPerPage = 30;

    const loadSongs = () => {
        const offset = (page.current - 1) * songsPerPage;

        axios.get(`http://127.0.0.1:5000/songs?page=${page.current}&itemsPerPage=${songsPerPage}`)
            .then(response => {
                if (response.data.length > 0) {
                    setSongs([...songs, ...response.data]);
                    console.log(response.data)
                    page.current++; 
                } else {
                    // If there are no more songs, set hasMore to false
                    setHasMore(false);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleLoadMore = () => {
        // Calculate the next page based on the number of songs loaded so far
        const nextPage = Math.ceil(songs.length / songsPerPage) + 1;
        page.current = nextPage;
        loadSongs();
    };

    useEffect(() => {
        loadSongs(); // Load initial songs
    }, []);

    return (
        <div className="overflow-y-scroll h-screen bg-[#09090B]">
            <NavbarMain />
            <h1 className="text-3xl font-bold my-4 text-white mx-auto flex justify-center">Recommended Songs</h1>

            <InfiniteScroll
                dataLength={songs.length}
                next={handleLoadMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more songs to load</p>}
            >
                <div className="px-5 py-5 grid grid-cols-5 gap-4">
                    {songs.map((song) => (
                        <div key={song.id} className="bg-[#09090B] border border-gray-200 rounded-xl shadow-lg shadow-[#294936] dark:bg-gray-800 dark:border-gray-700">
                            <a href={song.album.external_urls.spotify} target="_blank" rel="noreferrer">
                                {song.album.images && song.album.images.length > 0 && (
                                    <img className="rounded-t-xl" src={song.album.images[0].url} alt={song.name} />
                                )}
                            </a>
                            <div className="p-5">
                                <a href={song.album.external_urls.spotify} target="_blank" rel="noreferrer">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                                        {song.name}
                                    </h5>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default Songs;
