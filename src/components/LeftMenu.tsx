import { Link } from 'react-router-dom';
import { getFriends } from '../services/api';
import { useFriendStore } from '../store/friendStore';
import { useEffect } from 'react';
import twitterLogo from '../assets/mdi_twitter.png';
import mockupPfp from '../assets/mockup-pfp.png';
import useStore, { useUsernameStore } from '../store/store';
import '../styles/LeftMenu.css';

export default function LeftMenu() {
    const { userId } = useStore();
    const { username } = useUsernameStore();
    useEffect(() => {
        console.log(userId);
        console.log(username);
    }, [userId, username]);

    const { friends, setFriends, updateFriendName } = useFriendStore();

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
        {userId ? (
          <div className='profile-container'>
              <img src={mockupPfp} alt='profile-pic' className='profile-pic'/>
              <p
                  className='profile-username' 
                  onClick={() => navigator.clipboard.writeText(username)}
              >
                  {username}
              </p>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30.0002 5C25.3589 5 20.9077 6.84374 17.6258 10.1256C14.3439 13.4075 12.5002 17.8587 12.5002 22.5V31.32C12.5006 31.7078 12.4107 32.0904 12.2377 32.4375L7.94519 41.02C7.73551 41.4393 7.6365 41.9052 7.65756 42.3736C7.67863 42.8419 7.81907 43.2971 8.06555 43.6959C8.31204 44.0946 8.65637 44.4238 9.06586 44.652C9.47535 44.8803 9.93639 45.0001 10.4052 45H49.5952C50.064 45.0001 50.525 44.8803 50.9345 44.652C51.344 44.4238 51.6884 44.0946 51.9348 43.6959C52.1813 43.2971 52.3218 42.8419 52.3428 42.3736C52.3639 41.9052 52.2649 41.4393 52.0552 41.02L47.7652 32.4375C47.5913 32.0906 47.5006 31.708 47.5002 31.32V22.5C47.5002 17.8587 45.6564 13.4075 42.3746 10.1256C39.0927 6.84374 34.6415 5 30.0002 5ZM30.0002 52.5C28.4486 52.5008 26.9349 52.0204 25.6677 51.1249C24.4006 50.2294 23.4424 48.9629 22.9252 47.5H37.0752C36.558 48.9629 35.5998 50.2294 34.3326 51.1249C33.0655 52.0204 31.5518 52.5008 30.0002 52.5Z" fill="#303030"/>
              </svg>
          </div>
      ) : (
          <div className='profile-container'>
              <img src={mockupPfp} alt='profile-pic' className='profile-pic'/>
              <p className='profile-username'>Utilisateur non connecté</p>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30.0002 5C25.3589 5 20.9077 6.84374 17.6258 10.1256C14.3439 13.4075 12.5002 17.8587 12.5002 22.5V31.32C12.5006 31.7078 12.4107 32.0904 12.2377 32.4375L7.94519 41.02C7.73551 41.4393 7.6365 41.9052 7.65756 42.3736C7.67863 42.8419 7.81907 43.2971 8.06555 43.6959C8.31204 44.0946 8.65637 44.4238 9.06586 44.652C9.47535 44.8803 9.93639 45.0001 10.4052 45H49.5952C50.064 45.0001 50.525 44.8803 50.9345 44.652C51.344 44.4238 51.6884 44.0946 51.9348 43.6959C52.1813 43.2971 52.3218 42.8419 52.3428 42.3736C52.3639 41.9052 52.2649 41.4393 52.0552 41.02L47.7652 32.4375C47.5913 32.0906 47.5006 31.708 47.5002 31.32V22.5C47.5002 17.8587 45.6564 13.4075 42.3746 10.1256C39.0927 6.84374 34.6415 5 30.0002 5ZM30.0002 52.5C28.4486 52.5008 26.9349 52.0204 25.6677 51.1249C24.4006 50.2294 23.4424 48.9629 22.9252 47.5H37.0752C36.558 48.9629 35.5998 50.2294 34.3326 51.1249C33.0655 52.0204 31.5518 52.5008 30.0002 52.5Z" fill="#303030"/>
              </svg>
          </div>
      )}
      </div>
    </div>
  );
}
