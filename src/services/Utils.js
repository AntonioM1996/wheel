import { geohashQueryBounds, distanceBetween } from "geofire-common";
import { query, collection, orderBy, startAt, endAt, getDocs, where, or, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const FONT_FAMILY = "Avenir Next";
export const PRIMARY_COLOR = "#2649C2";
export const IMAGE_QUALITY = 0.1;
export const SPIN_DURATION_MS = 550;

export const getUsersInRange = async function (center, radiusInM, currentUserId) {
    console.log("excludingId", currentUserId);
    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];
    const alreadyChattingUserIds = [currentUserId];

    // First getting all user's chats not to include already-chatting users

    const chatsRef = collection(db, "chats");
    const chatQuery = query(
        chatsRef, 
        or(
            where('sourceUser', '==', currentUserId), 
            where('targetUser', '==', currentUserId)
        )
    );

    const chatQuerySnapshot = await getDocs(chatQuery);

    chatQuerySnapshot.forEach((doc) => {
        const docData = doc.data();

        if(docData.sourceUser != currentUserId) {
            alreadyChattingUserIds.push(docData.sourceUser);
        }
        else if(docData.targetUser != currentUserId) {
            alreadyChattingUserIds.push(docData.targetUser);
        }
    });

    for (const b of bounds) {
        const q = query(
            collection(db, 'users'),
            orderBy('geohash'),
            startAt(b[0]),
            endAt(b[1]));

        promises.push(getDocs(q));
    }

    // Collect all the query results together into a single list
    const snapshots = await Promise.all(promises);
    const matchingDocs = [];

    for (const snap of snapshots) {
        for (const doc of snap.docs) {
            const lat = doc.get('lastPositionLatitude');
            const lng = doc.get('lastPositionLongitude');

            // We have to filter out a few false positives due to GeoHash
            // accuracy, but most will match
            const distanceInKm = distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;

            if (distanceInM <= radiusInM && !alreadyChattingUserIds.includes(doc.id)) {
                console.log("matchingDoc", doc.id);
                matchingDocs.push({id: doc.id, ...doc.data()});
            }
        }
    }

    console.log("matchingDocs", matchingDocs);
    return matchingDocs;
};

export const createChat = async function(sourceUserId, targetUserId, sourceUserProfilePicUrl, targetUserProfilePicUrl) {
    const today = new Date();

    addDoc(collection(db, "chats"), {
        "sourceUser": sourceUserId,
        "targetUser": targetUserId,
        "sourceUserProfilePicUrl": sourceUserProfilePicUrl,
        "targetUserProfilePicUrl": targetUserProfilePicUrl,
        "createdDate": today.toUTCString(),
        "latestMessageDate": today.toUTCString()
    });
}