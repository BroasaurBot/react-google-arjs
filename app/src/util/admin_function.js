import { db } from '../firebase';
import { collection, query, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';

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

export { clearLeaderboard, removeFakePlayers, createFakePlayers}