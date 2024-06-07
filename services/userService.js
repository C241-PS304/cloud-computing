const {
  addDoc,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} = require("firebase/firestore");
const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");

const createUserAccount = async (email, password) => {
  const user = {
    email,
    password,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const saved = await addDoc(collection(db, "users"), user);
  return { id: saved.id, ...user };
};

const loginUser = async (email, password) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  const user = snapshot.docs.map((user) => {
    return { id: user.id, ...user.data() };
  })[0];

  // check if user not registered
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  return user;
};

const updateUserProfile = async (id, data) => {
  const userRef = doc(db, "users", id);
  await setDoc(userRef, data, { merge: true });

  return { id, ...data };
};

module.exports = { createUserAccount, updateUserProfile, loginUser };
