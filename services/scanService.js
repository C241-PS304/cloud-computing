const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage, db } = require("../config/firebase");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const { loadModel } = require("../config/tensorflow");
const { loadImage, createCanvas } = require("canvas");
const {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  orderBy,
  limit,
} = require("firebase/firestore");

const saveScan = async (data) => {
  const scan = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const masalahKulit = [
    {
      id: 1,
      nama: "Jerawat",
      deskripsi:
        "Jerawat adalah kondisi kulit yang terjadi ketika folikel rambut Anda tersumbat oleh minyak dan sel kulit mati. Jerawat biasanya muncul di wajah, leher, dada, punggung, dan bahu.",
      saran:
        "Bersihkan wajah dua kali sehari dengan pembersih yang lembut, hindari menyentuh wajah dengan tangan yang kotor, gunakan produk perawatan yang mengandung benzoyl peroxide atau salicylic acid, dan konsultasikan dengan dokter kulit untuk perawatan lebih lanjut.",
    },
    {
      id: 2,
      nama: "Mata Panda",
      deskripsi:
        "Mata panda atau lingkaran hitam di bawah mata sering disebabkan oleh kurang tidur, dehidrasi, atau faktor genetik. Mereka bisa membuat wajah terlihat lelah dan kurang segar.",
      saran:
        "Tidur cukup setidaknya 7-8 jam per malam, minum banyak air untuk menjaga hidrasi, gunakan krim mata yang mengandung vitamin K atau retinol, dan aplikasikan kompres dingin di area mata untuk mengurangi pembengkakan.",
    },
    {
      id: 3,
      nama: "Kerutan",
      deskripsi:
        "Kerutan adalah lipatan, garis, atau lekukan pada kulit yang terjadi seiring dengan bertambahnya usia. Paparan sinar matahari, merokok, dan ekspresi wajah yang berulang dapat mempercepat munculnya kerutan.",
      saran:
        "Gunakan tabir surya setiap hari untuk melindungi kulit dari sinar UV, hindari merokok, aplikasikan pelembap yang kaya antioksidan dan asam hialuronat, dan pertimbangkan perawatan seperti retinoid atau prosedur dermatologi seperti botox atau filler.",
    },
  ];

  const problems = [];

  const problemArray = scan.idProblem.split(",").map(Number);
  const jumlahArray = scan.jumlah.split(",").map(Number);

  problemArray.forEach((id, index) => {
    const foundProblem = masalahKulit.find((masalah) => masalah.id === id);

    if (foundProblem) {
      problems.push({ ...foundProblem, jumlah: jumlahArray[index] });
    }
  });

  const save = await addDoc(collection(db, "scans"), { ...scan, problems });
  return { id: save.id, ...scan, problems };
};

const getLastScan = async () => {
  const qProgram = await getDocs(
    query(
      collection(db, "programs"),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  );

  if (qProgram.empty) {
    return null;
  }

  const program = qProgram.docs.map((program) => program.id)[0];

  const qScan = await getDocs(
    query(
      collection(db, "scans"),
      where("idProgram", "==", program),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  );

  if (qScan.empty) {
    return null;
  }

  const scan = qScan.docs.map((scan) => ({ id: scan.id, ...scan.data() }))[0];

  return scan;
};

const deleteScan = async (id) => {
  const scan = await getDoc(doc(db, "scans", id));

  if (!scan.exists()) {
    return false;
  }

  await deleteDoc(doc(db, "scans", id));

  return true;
};

const getScanByProgram = async (idProgram) => {
  const q = query(collection(db, "scans"), where("idProgram", "==", idProgram));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const scans = snapshot.docs.map((scan) => ({ id: scan.id, ...scan.data() }));

  return scans;
};

const uploadImage = async (file) => {
  const storageRef = ref(
    storage,
    "/images/" + Date.now() + path.extname(file.originalname)
  );

  await uploadBytes(storageRef, file.buffer, {
    contentType: "image/jpeg",
  });

  const url = await getDownloadURL(storageRef);

  return { url };
};

const predictImage = async (file) => {
  const model = await loadModel();

  let inputTensor = tf.node.decodeImage(file.buffer, 3);
  inputTensor = tf.image.resizeBilinear(inputTensor, [800, 800]);
  inputTensor = inputTensor.expandDims(0);

  const predictions = await model.predict(inputTensor).data();

  return Array.from(predictions);
};

const drawLandmarks = async (imagePath, landmarks) => {
  const imgWidth = 800;
  const imgHeight = 800;

  const img = await loadImage(imagePath);
  const canvas = createCanvas(imgWidth, imgHeight);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

  ctx.fillStyle = "red";
  for (let i = 0; i < landmarks.length; i += 2) {
    const x = landmarks[i] * imgWidth; // Scale x to new width
    const y = landmarks[i + 1] * imgHeight; // Scale y to new height
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.fill();
  }

  const buffer = canvas.toBuffer();
  return { buffer };
};

module.exports = {
  uploadImage,
  predictImage,
  drawLandmarks,
  saveScan,
  getScanByProgram,
  deleteScan,
  getLastScan,
};
