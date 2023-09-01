import React from 'react'
import {getLeaderboard, addUserLeaderboard, getPosition } from '../util/leaderboard'
import { auth, db } from '../firebase';
import { doc, onSnapshot, query, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

import './css/stats.css'

function LeaderBoard(props) {
  let userInfo = props.userInfo;
  const [leaderboard, setLeaderboard] = useState(null);
  const [position, setPosition] = useState({pos: -1, next: 0, status:"NONE"});

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
      setPosition(getPosition(leaderboard, userInfo)) 
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
      <h2>Position</h2>
      {position && <h3>You are currently in pos: {position.pos}</h3>}
      {position && <h3>You are {position.next} behind the next player</h3>}
      {position && <h3>You have the status: {position.status}</h3>}
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
    <div id="screen">
      <h1>Welcome to the Stats</h1>
      { user && <h2>Welcome, {user.displayName}</h2>}
      { userInfo && <h2>You have {userInfo.points} points</h2>}

      <LeaderBoard userInfo={userInfo} />
    </div>
  )
}

export default Stats