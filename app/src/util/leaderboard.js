import { db } from '../firebase';
import { collection, query, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from 'firebase/firestore';

const leaderboardSize = 20;

async function clearLeaderboard() {
    console.log("Clearing the leaderboard")
    const   q = query(collection(db, "leaderboard"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}

async function removeFakePlayers() {
    console.log("Clearing the leaderboard")
    const   q = query(collection(db, "leaderboard"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (doc.id.includes("BOT")) deleteDoc(doc.ref);
    });
}

async function createFakePlayers(count) {
    console.log("Creating fake players")
    for (let i = 0; i < count; i++) {
        await setDoc(doc(db, "leaderboard", "BOT" + i.toString()), {
            uid: "BOT" + i.toString(),
            name:"BOT" + i.toString(),
            points: i * 100
        });
    }
}

async function getLeaderboard() {
    const q = query(collection(db, "leaderboard"));
    const querySnapshot = await getDocs(q);
    let leaderboard = [];
    querySnapshot.forEach((doc) => {
        leaderboard.push(doc.data());
    });
    return leaderboard;
}

async function addUserLeaderboard(userInfo) {
    const snapdoc = await getDoc(doc(db, "leaderboard", userInfo.uid));
    if (snapdoc.exists()) {
        if (snapdoc.data().points !== userInfo.points) {
            await updateDoc(doc(db, "leaderboard", userInfo.uid), {
                points: userInfo.points
            });
        }
    } else {
        await setDoc(doc(db, "leaderboard", userInfo.uid), {
            uid: userInfo.uid,
            name: userInfo.name,
            points: userInfo.points
        });
    }
}





export { clearLeaderboard, createFakePlayers, removeFakePlayers, getLeaderboard, addUserLeaderboard}

