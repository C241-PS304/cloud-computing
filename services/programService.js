const {
  addDoc,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  query,
  where,
  deleteDoc,
  orderBy,
} = require("firebase/firestore");
const { db } = require("../config/firebase");

const addProgram = async ({ idUser, namaProgram, skincares }) => {
  const program = {
    idUser,
    namaProgram,
    isActive: true,
    doneAt: null,
    skincares,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = await addDoc(collection(db, "programs"), program);
  return { id: saved.id, ...program };
};

const updateProgram = async (id, updatedData) => {
  const data = {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  const programRef = doc(db, "programs", id);

  const program = await getDoc(programRef);

  if (!program.exists()) {
    return null;
  }

  await setDoc(programRef, data, {
    merge: true,
  });

  const updatedProgram = await getDoc(programRef);

  return updatedProgram.data();
};

const getAllPrograms = async (idUser) => {
  const ref = collection(db, "programs");

  const q = query(
    ref,
    where("idUser", "==", idUser),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const programs = snapshot.docs.map((program) => ({
    id: program.id,
    ...program.data(),
  }));

  return programs;
};

const getProgramDetails = async (idProgram) => {
  const program = await getDoc(doc(db, "programs", idProgram));

  if (!program.exists()) {
    return null;
  }

  return { id: program.id, ...program.data() };
};

const deleteProgram = async (id) => {
  const findProgram = await getDoc(doc(db, "programs", id));

  if (!findProgram.exists()) {
    return false;
  }

  await deleteDoc(doc(db, "programs", id));
  return true;
};

const setProgramDone = async (idProgram) => {
  const programRef = doc(db, "programs", idProgram);

  const findProgram = await getDoc(programRef);
  if (!findProgram.exists()) {
    return false;
  }

  const newData = {
    isActive: false,
    doneAt: new Date().toLocaleString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(programRef, newData, { merge: true });

  return { ...findProgram.data(), ...newData };
};

// const addSkincare = async (skincares) => {
//   if (!Array.isArray(skincares)) {
//     throw new Error("Data skincare harus berupa array");
//   }

//   skincares.forEach(async (skincare) => {
//     await addDoc(collection(db, "skincares"), {
//       nama: skincare,
//     });
//   });

//   return true;
// };

module.exports = {
  addProgram,
  getAllPrograms,
  updateProgram,
  getProgramDetails,
  deleteProgram,
  setProgramDone,
};
