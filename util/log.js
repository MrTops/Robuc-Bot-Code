const moment = require("moment");

module.exports.log = message => console.log(`[${moment()}] ${message}`);