import React, { useState, useEffect } from 'react';
import { getFriends } from '../services/api';
import { useFriendStore } from '../store/friendStore';
import { Link } from 'react-router-dom';

import '../styles/FriendsList.css';
import mockupPfp from '../assets/mockup-pfp.png';

export default function FriendsList() {
    const { friends, setFriends, updateFriendName } = useFriendStore();
    const [activeFriendId, setActiveFriendId] = useState<string | null>(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsList = await getFriends();

                if (!friendsList.every((friend: { userId: unknown; username: unknown; }) => friend.userId && friend.username)) {
                    throw new Error('Les données retournées sont invalides');
                }
                setFriends(friendsList);
                if (friendsList.length > 0) {
                    updateFriendName(friendsList[0].username);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des amis :', error);
            }
        };

        fetchFriends();
    }, [setFriends, updateFriendName]);

    const handleLinkClick = (userId: string) => {
        setActiveFriendId(userId);
    };

    return (
        <div className="friends-list">
            {friends.length > 0 ? (
            <ul>
                    {friends.map((friend) => (
                        <Link
                            to={`/message/${friend.userId}`}
                            className="friend-link"
                            onClick={() => friend.userId && handleLinkClick(friend.userId.toString())}
                        >
                        <li key={friend.userId} className={`friend-item ${activeFriendId === friend.userId ? 'active' : ''}`}>
                            <img src={mockupPfp} width="50" height="50" alt="profile-pic" className="profile-pic" />
                            <p>{friend.username}</p>
                        </li>
                        </Link>
                    ))}
                </ul>
            ) : (
                <p>Aucun ami trouvé.</p>
            )}
        </div>
    );
}