import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFriends } from '../services/api';
import { useFriendStore } from '../store/friendStore';

import '../styles/LeftMenu.css';
import twitterLogo from '../assets/mdi_twitter.png';
import mockupPfp from '../assets/mockup-pfp.png';

export default function LeftMenu() {
  const { friends, setFriends, updateFriendName } = useFriendStore();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Récupérer les amis depuis l'API
        const friendsList = await getFriends();

        // Vérifie que les données contiennent les champs nécessaires
        if (!friendsList.every((friend: { userId: unknown; username: unknown; }) => friend.userId && friend.username)) {
          throw new Error('Les données retournées sont invalides');
        }

        // Met à jour le store avec la liste des amis
        setFriends(friendsList);

        // Initialiser le premier ami si besoin
        if (friendsList.length > 0) {
          updateFriendName(friendsList[0].username);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des amis :', error);
      }
    };

    fetchFriends();
  }, [setFriends, updateFriendName]);

  return (
    <div className="left-menu-container">
      <img src={twitterLogo} alt="app-logo" className="app-logo" />
      <div className="profile-section">
        <div className="friend-buttons">
          <Link to="#" className="friend-button">
            Mes amis
          </Link>
          <Link to="#" className="friend-button">
            Demandes d'ami
          </Link>
        </div>
        <div className="profile-container">
          <img src={mockupPfp} alt="profile-pic" className="profile-pic" />
        </div>
        <div className="friends-list">
          <h3>Liste d'amis</h3>
          {friends.length > 0 ? (
            <ul>
              {friends.map((friend) => (
                <li key={friend.userId} className="friend-item">
                  <Link to={`/message/${friend.userId}`} className="friend-link">
                    {friend.username}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun ami trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
