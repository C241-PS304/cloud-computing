const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const config = require("./config");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: config.firebaseApiKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.firebaseProjectId,
  storageBucket: config.firebaseStorageBucket,
  messagingSenderId: config.firebaseMessagingSenderId,
  appId: config.firebaseAppId,
};

const app = initializeApp(firebaseConfig);

module.exports = {
  db: getFirestore(app),
  storage: getStorage(app),
};
