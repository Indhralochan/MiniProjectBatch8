import axios from "axios";
import { useState, useEffect } from "react";
import NavbarMain from "./NavbarMain";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const songsPerPage = 5; // Set the number of songs to display per page
  const artistsPerPage = 5; // Set the number of artists to display per page

  useEffect(() => {
    const fetchData = async () => {
      if (searchText) {
        try {
          const response = await axios.post("http://localhost:5000/search", {
            data: searchText,
          });
          setSearchResults(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(e.target.elements.searchInput.value);
    setSelectedArtist(null);
  };

  // Calculate the index range for the current page for songs
  const indexOfLastSong = songsPerPage;
  const currentSongs = searchResults.songs ? searchResults.songs.slice(0, indexOfLastSong) : [];

  // Calculate the index range for the current page for artists
  const indexOfLastArtist = artistsPerPage;
  const currentArtists = searchResults.artists ? searchResults.artists.slice(0, indexOfLastArtist) : [];

  return (
    <div className="bg-[#09090B] h-screen w-screen overflow-x-hidden">
      <NavbarMain />
      <div className="py-5">
        <form onSubmit={handleSearch}>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-white sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              name="searchInput"
              className="block w-full p-4 pl-10 text-sm text-white border rounded-xl bg-[#09090B] focus:ring-[#3e6259] focus:border-[#3e6259]"
              placeholder="Search Mockups, Logos..."
              required
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-[#3e6259] hover:bg-[#294936] focus:ring-4 focus:outline-none focus:ring-[#3e6259] font-medium rounded-xl text-sm px-4 py-2 0 dark:focus:ring-[#09090B]"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="px-5">
        <h2 className="text-2xl text-white py-5">Songs</h2>
        <div className="flex flex-row space-x-4 overflow-x-auto max-w-screen-xl mx-auto " style={{ whiteSpace: "break-word" }}>
          {currentSongs && currentSongs.length > 0 ? (
            currentSongs.map((song) => (
              <div
                key={song.id}
                className="inline-block mr-4 bg-[#09090B] w-[20%] border border-gray-200 rounded-xl shadow-lg shadow-[#294936] dark:bg-gray-800 dark:border-gray-700"
              >
                <a href={song.external_urls.spotify} target="_blank" rel="noreferrer">
                  {song.album.images && song.album.images.length > 0 && (
                    <img className="rounded-t-xl" src={song.album.images[0].url} alt={song.name} />
                  )}
                </a>
                <div className="p-5">
                  <a href={song.external_urls.spotify} target="_blank" rel="noreferrer">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                      {song.name}
                    </h5>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white mt-4">No songs found.</p>
          )}
        </div>

        <h2 className="text-2xl text-white mt-5">Albums</h2>
        <div className="flex flex-row space-x-4 overflow-x-auto max-w-screen-xl mx-auto py-5 " style={{ whiteSpace: "break-word" }}>
          {searchResults.albums && searchResults.albums.length > 0 ? (
            searchResults.albums.map((album) => (
              <div
              key={album.id}
              className="inline-block mr-4 bg-[#09090B] w-[20%] border border-gray-200 rounded-xl shadow-lg shadow-[#294936] "
            >
              <a href={album.external_urls.spotify} target="_blank" rel="noreferrer">
                {album.images && album.images.length > 0 && (
                  <img className="rounded-t-xl" src={album.images[0].url} alt={album.name} />
                )}
              </a>
              <div className="p-5">
                <a href={album.external_urls.spotify} target="_blank" rel="noreferrer">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                    {album.name}
                  </h5>
                </a>
              </div>
            </div>
            ))
          ) : (
            <p className="text-white mt-4">No albums found.</p>
          )}
        </div>

        <h2 className="text-2xl text-white mt-5">Artists</h2>
        <div className="flex flex-row space-x-4 overflow-x-auto max-w-screen-xl mx-auto py-5" style={{ whiteSpace: "break-word" }}>
          {currentArtists && currentArtists.length > 0 ? (
            currentArtists.map((artist) => (
              <div
              key={artist.id}
              className="inline-block mr-4 bg-[#09090B] w-[20%] border border-gray-200 rounded-xl  shadow-lg shadow-[#294936] dark:bg-gray-800 dark:border-gray-700"
            >
              <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">
                {artist.images && artist.images.length > 0 && (
                  <img className="rounded-t-xl" src={artist.images[0].url} alt={artist.name} />
                )}
              </a>
              <div className="p-5">
                <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                    {artist.name}
                  </h5>
                </a>
              </div>
            </div>
            ))
          ) : (
            <p className="text-white mt-4">No artists found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
