const upload = require("../config/multer");
const {
  predictImage,
  drawLandmarks,
  uploadImage,
  saveScan,
  deleteScan,
  getLastScan,
} = require("../services/scanService");

const lastScan = async (req, res, next) => {
  try {
    const scans = await getLastScan();

    res.status(200).json({ status: "success", data: scans });
  } catch (error) {
    next(error);
  }
};

const store = async (req, res, next) => {
  const file = req.file;
  const body = { ...req.body };

  if (!file) {
    return res
      .status(400)
      .json({ status: "error", message: "Silakan upload gambar" });
  }
  if (!body.idProgram) {
    return res
      .status(400)
      .json({ status: "error", message: "Id program tidak boleh kosong" });
  }
  if (!body.idProblem) {
    return res
      .status(400)
      .json({ status: "error", message: "Id problem tidak boleh kosong" });
  }
  if (!body.jumlah) {
    return res
      .status(400)
      .json({ status: "error", message: "Jumlah tidak boleh kosong" });
  }

  try {
    // const predictions = await predictImage(file);

    // const { buffer } = await drawLandmarks(file.buffer, predictions);
    const { url } = await uploadImage(file);

    const scan = await saveScan({
      idProgram: body.idProgram,
      idProblem: body.idProblem,
      jumlah: body.jumlah,
      gambar: url,
    });

    res.status(200).json({
      status: "success",
      message: "Scan berhasil disimpan",
      data: scan,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const destroy = await deleteScan(req.params.id);

    if (!destroy) {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Scan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { store: [upload.single("gambar"), store], destroy, lastScan };
