const { getAllArticle, getArticleById } = require("../services/articleService");

const index = async (req, res, next) => {
  try {
    const articles = await getAllArticle();

    res.status(200).json({ status: "success", data: articles });
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const article = await getArticleById(req.params.id);

    if (!article) {
      return res
        .status(404)
        .json({ status: "error", message: "Artikel tidak ditemukan" });
    }

    res.status(200).json({ status: "success", data: article });
  } catch (error) {
    next(error);
  }
};

module.exports = { index, show };
