const { addDoc, collection } = require("firebase/firestore");
const { db } = require("../config/firebase");

const artikelKesehatanKulit = [
  {
    title: "Tips Mengatasi Jerawat Membandel",
    content:
      "Jerawat adalah masalah kulit yang umum terjadi pada semua usia. Untuk mengatasi jerawat, penting untuk menjaga kebersihan kulit dengan mencuci wajah dua kali sehari menggunakan pembersih yang lembut. Selain itu, hindari memencet jerawat karena bisa memperparah kondisi dan meninggalkan bekas. Gunakan produk perawatan kulit yang mengandung bahan aktif seperti benzoyl peroxide atau salicylic acid untuk membantu mengatasi jerawat.",
    author: "Dr. Amanda Putri",
    imageUrl:
      "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2023/01/09040835/cara-mengenali-munculnya-jerawat-pasir-ini-penjelasannya.jpg",
  },
  {
    title: "Perawatan Kulit untuk Mengatasi Mata Panda",
    content:
      "Mata panda atau lingkaran hitam di bawah mata bisa disebabkan oleh berbagai faktor seperti kurang tidur, dehidrasi, dan faktor genetik. Untuk mengurangi mata panda, pastikan Anda tidur cukup setiap malam, sekitar 7-8 jam. Minum cukup air juga penting untuk menjaga kulit tetap terhidrasi. Selain itu, gunakan krim mata yang mengandung bahan aktif seperti vitamin K atau retinol, dan aplikasikan kompres dingin di area mata untuk mengurangi pembengkakan.",
    author: "Dr. Budi Santoso",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_4lryRwyJMUQjWmMtIrxIaKFt6y3nfY7J6A&s",
  },
  {
    title: "Cara Efektif Mengurangi Kerutan di Wajah",
    content:
      "Kerutan adalah tanda penuaan yang alami, tetapi bisa dikurangi dengan perawatan yang tepat. Gunakan tabir surya setiap hari untuk melindungi kulit dari kerusakan akibat sinar UV. Hindari kebiasaan merokok karena dapat mempercepat penuaan kulit. Aplikasikan pelembap yang mengandung antioksidan dan asam hialuronat untuk menjaga kulit tetap lembap dan kencang. Pertimbangkan juga penggunaan produk perawatan kulit yang mengandung retinoid atau konsultasikan dengan dokter kulit mengenai prosedur dermatologi seperti botox atau filler.",
    author: "Dr. Clara Wijaya",
    imageUrl:
      "https://cdns.klimg.com/merdeka.com/i/w/news/2021/12/15/1387264/540x270/8-cara-mengatasi-kerutan-di-wajah-dengan-efektif-salah-satunya-batasi-konsumsi-gula.jpg",
  },
  {
    title: "Pentingnya Eksfoliasi untuk Kulit Wajah",
    content:
      "Eksfoliasi adalah proses mengangkat sel-sel kulit mati dari permukaan kulit. Proses ini penting untuk menjaga kulit tetap bersih dan mencegah penyumbatan pori-pori. Gunakan produk eksfoliasi yang sesuai dengan jenis kulit Anda, seperti scrub lembut untuk kulit sensitif atau produk dengan kandungan AHA/BHA untuk kulit yang lebih tebal. Lakukan eksfoliasi 1-2 kali seminggu untuk hasil yang optimal.",
    author: "Dr. Dian Nugroho",
    imageUrl:
      "https://cdns.klimg.com/merdeka.com/i/w/news/2022/02/23/1410641/540x270/rekomendasi-produk-eksfoliasi-wajah-terbaik-rev-1.jpg",
  },
  {
    title: "Manfaat Masker Wajah untuk Kulit Sehat",
    content:
      "Masker wajah adalah salah satu cara efektif untuk memberikan perawatan intensif pada kulit. Terdapat berbagai jenis masker wajah yang bisa digunakan sesuai dengan kebutuhan kulit, seperti masker hydrating untuk kulit kering, masker clay untuk kulit berminyak, dan masker anti-aging untuk mengurangi tanda-tanda penuaan. Gunakan masker wajah secara rutin, sekitar 1-2 kali seminggu, untuk hasil terbaik.",
    author: "Dr. Edwin Pratama",
    imageUrl:
      "https://foto.kontan.co.id/Zp0yEE7Y4AQaXyqV1bd64DVEEcI=/smart/filters:format(webp)/2021/09/23/978431733p.jpg",
  },
];

const articleSeed = () => {
  artikelKesehatanKulit.forEach(async (article) => {
    await addDoc(collection(db, "articles"), {
      ...article,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log("article seed success");
  });
};

module.exports = articleSeed;
