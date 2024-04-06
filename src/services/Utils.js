import { geohashQueryBounds, distanceBetween } from "geofire-common";
import { query, collection, orderBy, startAt, endAt, getDocs, where, or, addDoc, Timestamp, limit, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export const FONT_FAMILY = "Avenir Next";
export const PRIMARY_COLOR = "#2649C2";
export const GREY_COLOR = "#808080";
export const IMAGE_QUALITY = 0.1;
export const SPIN_DURATION_MS = 550;
export const DEFAULT_CHAT_MESSAGE = 'Say hello!';
export const CHAT_MESSAGES_QUERY_LIMIT = 200;
export const MAX_LATEST_MESSAGE_LENGTH = 50;

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
        console.log("getUsersInRage, found chat id", doc.id);
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

export const createChat = async function(sourceUser, targetUser) {
    const today = new Date();

    addDoc(collection(db, "chats"), {
        "sourceUser": sourceUser.id,
        "targetUser": targetUser.id,
        "sourceUserProfilePicUrl": sourceUser.profilePictureUrl,
        "targetUserProfilePicUrl": targetUser.profilePictureUrl,
        "createdDate": Timestamp.fromDate(today),
        "latestMessageDate": Timestamp.fromDate(today),
        "latestMessage": DEFAULT_CHAT_MESSAGE,
        "sourceUserName": sourceUser.name,
        "targetUserName": targetUser.name,
        "unreadTargetUser": true,
        "unreadSourceUser": true,
        "status": "P"
    });
}

export const getChats = function(userId) {
    let chats = [];

    const chatsRef = collection(db, "chats");
    const chatQuery = query(
        chatsRef, 
        or(
            where('sourceUser', '==', userId), 
            where('targetUser', '==', userId)
        ),
        orderBy(
            "latestMessageDate",
            "desc"
        )
    );

    const unsubscribe = onSnapshot(chatQuery, (chatQuerySnapshot) => {
        if(chatQuerySnapshot?.docs) {
            for(const chatDoc of chatQuerySnapshot.docs) {
                let thisChat = chatDoc.data();
                thisChat.id = chatDoc.id;
    
                chats.push(thisChat);
            }
        }
    });

    return chats;
}

export const getChatMessages = function(chatId, queryLimit) {
    let chatMessages = [];

    const chatMessagesRef = collection(db, "chats", chatId, "messages");
    const chatMessagesQuery = query(
        chatMessagesRef, 
        orderBy('createdDate', 'desc'),
        limit(queryLimit)
    );

    try {
        const unsubscribe = onSnapshot(chatMessagesQuery, (chatMessagesQuerySnapshot) => {
            if(chatMessagesQuerySnapshot?.docs) {
                for(const chatMessageDoc of chatMessagesQuerySnapshot.docs) {
                    let thisChatMessage = chatMessageDoc.data();
                    thisChatMessage.id = chatMessageDoc.id;
    
                    chatMessages.push(thisChatMessage);
                }
            }

            return chatMessages;
        });
    }
    catch(error) {
        console.error(error);
    }
};