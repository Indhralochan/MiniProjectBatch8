import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const UserHistory = () => {
    const [user_id, setuser_id] = useState("");
    const [user_rating, setUser_rating] = useState([]);
    const [user_history, setUser_history] = useState([]);

    useEffect(() => {
        getAuth().onAuthStateChanged((user) => {
            if (user) {
                setuser_id(user.uid);
                axios.get(`http://localhost:5000/user-history?user_id=${user.uid}`)
                    .then((response) => {
                        const { user_ratings, user_history } = response.data;
                        setUser_rating(user_ratings);
                        setUser_history(user_history);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }, []);

    return (
        <div className="w-full h-screen overflow-y-scroll p-8 text-white">
            <h1 className="text-3xl font-semibold text-white">User History</h1>

            <h2 className="text-2xl font-semibold text-white py-5">Ratings</h2>
            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr>
                    <th className="p-2 border-b border-gray-300">Song ID</th>
                    <th className="p-2 border-b border-gray-300">Song Name</th>
                    <th className="p-2 border-b border-gray-300">Rating</th>
                    <th className="p-2 border-b border-gray-300">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {user_rating.map((rating, index) => (
                        <tr key={index} className="border-b border-gray-300 rounded rounded-lg">
                            <td className="p-2">{rating.song_id}</td>
                            <td className="p-2">{rating.song_name}</td>
                            <td className="p-2">{rating.rating}</td>
                            <td className="p-2">{rating.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-2xl font-semibold text-white mt-8">History</h2>
            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr>
                        <th className="p-2 border-b border-gray-300">Song ID</th>
                        <th className="p-2 border-b border-gray-300">Song Name</th>
                        <th className="p-2 border-b border-gray-300">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {user_history.map((history, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="p-2">{history.song_id}</td>
                            <td className="p-2">{history.song_name}</td>
                            <td className="p-2">{history.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserHistory;
