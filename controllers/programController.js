const { body, matchedData, validationResult } = require("express-validator");
const {
  addProgram,
  getAllPrograms,
  updateProgram,
  getProgramDetails,
  deleteProgram,
  setProgramDone,
} = require("../services/programService");
const { validationError } = require("../helpers/validationError");
const { getScanByProgram } = require("../services/scanService");

const validateStore = [
  body("namaProgram").notEmpty().withMessage("Nama program tidak boleh kosong"),
  body("skincares").isArray().withMessage("Data skincare harus berupa array"),
];

const store = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: validationError(errors.array()),
    });
  }

  const { namaProgram, skincares } = matchedData(req);

  try {
    // const skincareList = await addSkincare(skincares);

    const program = await addProgram({
      idUser: req.user.id,
      namaProgram,
      skincares,
    });

    res.status(201).json({
      status: "success",
      message: "Program berhasil ditambah",
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

const validateUpdate = [
  body("namaProgram").notEmpty().withMessage("Nama program tidak boleh kosong"),
  body("skincares").isArray().withMessage("Data skincare harus berupa array"),
];
const update = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: validationError(errors.array()),
    });
  }

  try {
    const program = await updateProgram(req.params.id, req.body);

    if (!program) {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Data berhasil di update",
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

const setDone = async (req, res, next) => {
  const idProgram = req.params.id;

  try {
    const program = await setProgramDone(idProgram);

    if (!program) {
      return res
        .status(404)
        .json({ status: "error", message: "Program tidak ditemukan" });
    }

    res.status(200).json({
      status: "success",
      message: "Hore program sudah selesai",
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const programs = await getAllPrograms(req.user.id);

    res.status(200).json({ status: "success", data: programs });
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  const idProgram = req.params.id;

  try {
    const program = await getProgramDetails(idProgram);

    if (!program) {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }

    const scans = await getScanByProgram(program.id);

    res.status(200).json({ message: "success", data: { ...program, scans } });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const destroy = await deleteProgram(req.params.id);

    if (!destroy) {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Program berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  store: [...validateStore, store],
  update: [...validateUpdate, update],
  index,
  show,
  destroy,
  setDone,
};
