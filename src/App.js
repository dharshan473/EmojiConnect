import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function App() {
  const [ipdata, setipdata] = useState({ bio: '', name: '' });
  const [userdata, setuserdata] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [showForm, setShowForm] = useState(false);

  const initialUsers = [
    { id: 1, name: 'USER 1' },
    { id: 2, name: 'USER 2' },
    { id: 3, name: 'USER 3' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [activeUser, setActiveUser] = useState(null);

  const handleShow = (user) => {
    setActiveUser(user.id);
    setipdata({ ...ipdata, name: user.name });
  };

  const handleChange = (e) => {
    setipdata({ ...ipdata, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (ipdata.bio === '') {
      alert("Enter bio");
    } else {
      setuserdata([...userdata, ipdata]);
      setipdata({ bio: '', name: '' });
      setShowForm(false);
      setActiveUser(null);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleEmojiClick = (bioIndex, emoji) => {
    if (activeUser === null) return;

    const updatedUserReactions = { ...userReactions };
    const updatedSelectedEmojis = { ...selectedEmojis };

    if (!updatedUserReactions[activeUser]) {
      updatedUserReactions[activeUser] = {};
    }

    if (!updatedSelectedEmojis[bioIndex]) {
      updatedSelectedEmojis[bioIndex] = {};
    }

    if (!updatedSelectedEmojis[bioIndex][emoji]) {
      updatedSelectedEmojis[bioIndex][emoji] = { count: 0, users: [] };
    }

    if (updatedUserReactions[activeUser][bioIndex] === emoji) {
      updatedSelectedEmojis[bioIndex][emoji].count -= 1;
      updatedSelectedEmojis[bioIndex][emoji].users = updatedSelectedEmojis[bioIndex][emoji].users.filter(
        (user) => user.id !== activeUser
      );
      delete updatedUserReactions[activeUser][bioIndex];
    } else {
      if (updatedUserReactions[activeUser][bioIndex]) {
        const previousEmoji = updatedUserReactions[activeUser][bioIndex];
        updatedSelectedEmojis[bioIndex][previousEmoji].count -= 1;
        updatedSelectedEmojis[bioIndex][previousEmoji].users = updatedSelectedEmojis[bioIndex][previousEmoji].users.filter(
          (user) => user.id !== activeUser
        );
      }
      updatedSelectedEmojis[bioIndex][emoji].count += 1;
      updatedSelectedEmojis[bioIndex][emoji].users.push({ id: activeUser, name: users.find(user => user.id === activeUser).name });
      updatedUserReactions[activeUser][bioIndex] = emoji;
    }

    setSelectedEmojis(updatedSelectedEmojis);
    setUserReactions(updatedUserReactions);
  };

  const handleFabClick = () => {
    if (activeUser) {
      setShowForm(true);
    } else {
      alert("Please select a user first.");
    }
  };

  return (
    <div className="main-container">
      <div className="btncontainer">
        <div className="user-bio-container">
          {users.map((user) => (
            <div className='btndiv' key={user.id}>
              <button
                type='button'
                className="btn btn-primary"
                onClick={() => handleShow(user)}
              >
                {user.name}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='card w-75 bio-card' style={{ marginTop: '20px' }}>
        <div className="card-header crdhd">
          <div id='plusicon'>
            <Fab color="primary" aria-label="add" id='fab' onClick={handleFabClick}>
              <AddIcon />
            </Fab>
          </div>
          <span id='biohead'>
            BIO
          </span>
        </div>

        {showForm && (
          <div className='card-body'>
            <input
              type="text"
              name="bio"
              id="bio"
              value={ipdata.bio}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter bio"
            />
            <div className="button-group mt-3">
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleClick}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setActiveUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <ul className='list-group list-group-flush'>
          {userdata.map((data, index) => (
            <li
              key={index}
              className='list-group-item lgi'
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <strong>{data.name}:</strong> {data.bio}
              {selectedEmojis[index] && (
                <span className='selected-emoji' style={{ marginLeft: '10px' }}>
                  {Object.entries(selectedEmojis[index])
                    .filter(([emoji, { count }]) => count > 0)
                    .map(([emoji, { count, users }]) => (
                      <span key={emoji} style={{ marginRight: '10px', position: 'relative' }}>
                        <span
                          onClick={() => handleEmojiClick(index, emoji)}
                          style={{ cursor: 'pointer' }}
                        >
                          {emoji}
                          <button
                            id='countspan'
                            className={users.some(user => user.id === activeUser) ? 'active-count' : ''}
                          >
                            {count}
                          </button>
                        </span>
                        <span
                          style={{
                            visibility: hoveredIndex === index ? 'visible' : 'hidden',
                            backgroundColor: '#f9f9f9',
                            color: '#333',
                            textAlign: 'center',
                            borderRadius: '6px',
                            padding: '5px',
                            position: 'absolute',
                            zIndex: 1,
                            bottom: '125%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {users.map(user => (
                            <div id='selectedusers' key={user.id}>{user.name}</div>
                          ))}
                        </span>
                      </span>
                    ))}
                </span>
              )}
              {hoveredIndex === index && (
                <div className="reactions" style={{ marginTop: '10px' }}>
                  <span
                    role="img"
                    aria-label="like"
                    onClick={() => handleEmojiClick(index, '👍')}
                    style={{
                      cursor: 'pointer',
                      marginRight: '5px',
                      color: userReactions[activeUser]?.[index] === '👍' ? 'blue' : 'black',
                    }}
                  >
                    👍
                  </span>
                  <span
                    role="img"
                    aria-label="love"
                    onClick={() => handleEmojiClick(index, '❤️')}
                    style={{
                      cursor: 'pointer',
                      marginRight: '5px',
                      color: userReactions[activeUser]?.[index] === '❤️' ? 'red' : 'black',
                    }}
                  >
                    ❤️
                  </span>
                  <span
                    role="img"
                    aria-label="laugh"
                    onClick={() => handleEmojiClick(index, '😂')}
                    style={{
                      cursor: 'pointer',
                      color: userReactions[activeUser]?.[index] === '😂' ? 'yellow' : 'black',
                    }}
                  >
                    😂
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}               
