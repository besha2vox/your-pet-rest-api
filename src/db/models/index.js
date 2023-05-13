const { User, schemas } = require("./user");
const { News } = require("./news");
const { Pet } = require("./pets");
const Notice = require("./notice");
const { Friends } = require('./friends');


module.exports = {
    User,
    News,
    Pet,
    Notice,
    schemas,
    Friends,
};
