import React from 'react'
import { clearLeaderboard, createFakePlayers, removeFakePlayers, getLeaderboard, addUserLeaderboard } from '../util/leaderboard'
import { auth, db } from '../firebase';
import { doc, onSnapshot, query, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

function LeaderBoard(props) {
  let userInfo = props.userInfo;
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"));
    onSnapshot(q, (querySnapshot) => {
      let leaderboard = [];
      querySnapshot.forEach((doc) => {
        leaderboard.push(doc.data());
      });
      leaderboard.sort((a, b) => {return b.points - a.points});
      leaderboard = leaderboard.slice(0, 20);
      setLeaderboard(leaderboard);
    });
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && leaderboard) {
      console.log("Adding user to leaderboard");
      addUserLeaderboard(userInfo);
    }
  }, [userInfo, leaderboard]);
    
  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {leaderboard && leaderboard.map((player) => {
          return (
            <li key={player.name}>
              <h3>{player.name} {player.points}</h3>
            </li>
          )
        })}
      </ol>
    </div>
  )

}

function Stats() {

  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => {
      if (newUser) {
        console.log("User signed in: ", newUser.displayName);
        setUser(newUser);
      }else {
        console.log("User signed out");
      }
    });
  }, []);
  useEffect(() => {
    if (user) {
      onSnapshot(doc(db, "players", user.uid), (doc) => {
        if (doc.exists()) {
          setUserInfo(doc.data());
        }
      });
    }
  }, [user]);

  return (
    <div>
      <h1>Welcome to the Stats</h1>
      <button onClick={() => clearLeaderboard()}>Clear the leaderboard</button>
      <button onClick={() => createFakePlayers(25)}>Add fake players</button>
      <button onClick={() => removeFakePlayers()}>Remove fake players</button>
      <button onClick={() => console.log(getLeaderboard())}>Print Leaderboard</button>

      { user && <h2>Welcome, {user.displayName}</h2>}
      { userInfo && <h2>You have {userInfo.points} points</h2>}

      <LeaderBoard userInfo={userInfo} />
    </div>
  )
}

export default Stats