import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, usersRef } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";

export const getCurrentUser = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return null;
    }

    const userDocument = doc(usersRef, currentUser.uid);

    const userInfoDoc = await getDoc(userDocument);

    return userInfoDoc.data();
};

export const registerUser = async (email, password) => {
    try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const newUserDocument = doc(usersRef, user.uid);
        const userData = {
            id: user.uid,
            email: user.email,
            firstName: "",
            lastName: "",
            phoneNumber: "",
        };

        await setDoc(newUserDocument, userData);
        return true;
    } catch (error) {
        return false;
    }
};

export const changePassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};