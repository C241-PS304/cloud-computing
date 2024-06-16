const {
  addDoc,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  getDoc,
} = require("firebase/firestore");
const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemailer");
const config = require("../config/config");

const createUserAccount = async (email, password) => {
  const user = {
    email,
    password,
    // isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
  await setDoc(
    userRef,
    { ...data, updatedAt: new Date().toISOString() },
    { merge: true }
  );

  const updatedUser = await getDoc(userRef);

  return { id: updatedUser.id, ...updatedUser.data() };
};

const generateOtpCode = () => {
  return Math.floor(Math.random() * 9000) + 1000;
};

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: config.nodemailerEmailUser,
    to: email,
    subject: "Verifikasi Email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2 style="color: #4caf50">Verifikasi Email</h2>
      <p>Halo,</p>
      <p>Terima kasih telah mendaftar. Berikut adalah kode verifikasi Anda:</p>
      <div
        style="
          font-size: 24px;
          font-weight: bold;
          color: #41c845;
          background-color: #fff;
          padding: .6em;
        "
      >
        <p style="text-align: center;">${code}</p>
      </div>
      <p>Masukkan kode ini di aplikasi untuk memverifikasi alamat email Anda.</p>
      <p>Jika Anda tidak meminta kode ini, silakan abaikan email ini.</p>
      <br />
      <p>Salam,</p>
      <p>Tim Kami</p>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  createUserAccount,
  updateUserProfile,
  loginUser,
  sendVerificationEmail,
  generateOtpCode,
};
