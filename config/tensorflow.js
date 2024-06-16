const tf = require("@tensorflow/tfjs-node");

const modelPath = tf.io.fileSystem("./skin-track-models/model.json");

const loadModel = async () => {
  return await tf.loadGraphModel(modelPath);
};

module.exports = { loadModel };
