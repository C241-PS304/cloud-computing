const {
  collection,
  orderBy,
  getDocs,
  query,
  getDoc,
  doc,
} = require("firebase/firestore");
const { db } = require("../config/firebase");

const getAllArticle = async () => {
  const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const articles = snapshot.docs.map((article) => ({
    id: article.id,
    ...article.data(),
  }));

  return articles;
};

const getArticleById = async (id) => {
  const article = await getDoc(doc(db, "articles", id));

  if (!article.exists()) {
    return null;
  }

  return { id: article.id, ...article.data() };
};

module.exports = { getAllArticle, getArticleById };
