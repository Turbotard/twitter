import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import twitterLogo from '../assets/mdi_twitter.png';
import mockupPfp from '../assets/mockup-pfp.png';
import useStore, { useUsernameStore } from '../store/store';
import '../styles/LeftMenu.css';
import FriendsList from './FriendsList';
import notificationIcon from '../assets/notification.svg';

export default function LeftMenu() {
  const { userId } = useStore();
  const { username } = useUsernameStore();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    console.log(userId);
    console.log(username);
  }, [userId, username]);
  
  return (
    <div className="left-menu-container">
      <img src={twitterLogo} alt="app-logo" className="app-logo" />
      {activeButton === 'left' && <FriendsList />}
      {activeButton === 'right' && <div>Contenu</div>}
      <div className="profile-section">
        <div className="friend-buttons">
          <Link to="#" className={`friend-button left ${activeButton === 'left' ? 'active' : ''}`} onClick={() => setActiveButton('left')}>
            <svg width="50" height="36" viewBox="0 0 50 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18C19.8359 18 23.75 14.0859 23.75 9.25C23.75 4.41406 19.8359 0.5 15 0.5C10.1641 0.5 6.25 4.41406 6.25 9.25C6.25 14.0859 10.1641 18 15 18ZM21 20.5H20.3516C18.7266 21.2812 16.9219 21.75 15 21.75C13.0781 21.75 11.2812 21.2812 9.64844 20.5H9C4.03125 20.5 0 24.5313 0 29.5V31.75C0 33.8203 1.67969 35.5 3.75 35.5H26.25C28.3203 35.5 30 33.8203 30 31.75V29.5C30 24.5313 25.9687 20.5 21 20.5ZM37.5 18C41.6406 18 45 14.6406 45 10.5C45 6.35938 41.6406 3 37.5 3C33.3594 3 30 6.35938 30 10.5C30 14.6406 33.3594 18 37.5 18ZM41.25 20.5H40.9531C39.8672 20.875 38.7188 21.125 37.5 21.125C36.2812 21.125 35.1328 20.875 34.0469 20.5H33.75C32.1562 20.5 30.6875 20.9609 29.3984 21.7031C31.3047 23.7578 32.5 26.4844 32.5 29.5V32.5C32.5 32.6719 32.4609 32.8359 32.4531 33H46.25C48.3203 33 50 31.3203 50 29.25C50 24.4141 46.0859 20.5 41.25 20.5Z" fill="white"/>
            </svg>
            <p>Mes amis</p>
          </Link>
          <Link to="#" className={`friend-button right ${activeButton === 'right' ? 'active' : ''}` } onClick={() => setActiveButton('right')}>
            <svg width="34" height="36" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.7465 10C23.6144 14.7201 19.7523 18.5 15 18.5C10.1641 18.5 6.25 14.5859 6.25 9.75C6.25 4.91406 10.1641 1 15 1C17.066 1 18.9638 1.71439 20.46 2.90985C19.5685 3.64347 19 4.75535 19 6C19 8.20914 20.7909 10 23 10H23.7465Z" fill="white"/>
            <path d="M20.3516 21H21C25.9688 21 30 25.0312 30 30V32.25C30 34.3203 28.3203 36 26.25 36H3.75C1.67969 36 0 34.3203 0 32.25V30C0 25.0312 4.03125 21 9 21H9.64844C11.2812 21.7812 13.0781 22.25 15 22.25C16.9219 22.25 18.7266 21.7812 20.3516 21Z" fill="white"/>
            <path d="M28 0C27.4477 0 27 0.447715 27 1V5H23C22.4477 5 22 5.44772 22 6C22 6.55228 22.4477 7 23 7H27V11C27 11.5523 27.4477 12 28 12C28.5523 12 29 11.5523 29 11V7H33C33.5523 7 34 6.55228 34 6C34 5.44772 33.5523 5 33 5H29V1C29 0.447715 28.5523 0 28 0Z" fill="white"/>
            </svg>
            <p>Demandes d'ami</p>
          </Link>
        </div>
        {userId ? (
        <div className='profile-container'>
          <img src={mockupPfp} alt='profile-picture' className='profile-picture'/>
            <p
            className='profile-username user-found' 
            onClick={() => {
              navigator.clipboard.writeText(username);
              alert('Votre nom d\'utilisateur a été copié dans le presse-papier !');
            }}
            >
            <span>{username}</span>
          </p>
          <img src={notificationIcon} alt='notification-icon' className='notification-icon'/>
        </div>
      ) : (
        <div className='profile-container'>
          <img src={mockupPfp} alt='profile-picture' className='profile-picture'/>
          <p className='profile-username user-not-found'>Utilisateur non connecté</p>
          <img src={notificationIcon} alt='notification-icon' className='notification-icon'/>
        </div>
      )}
      </div>
    </div>
  );
}
