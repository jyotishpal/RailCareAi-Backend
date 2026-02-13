const { v4: uuidv4 } = require("uuid");

module.exports = () => {
  return "CMP-" + uuidv4().slice(0, 8).toUpperCase();
};
