const spicedPg = require("spiced-pg");
var db = spicedPg("postgres:spicedling:password@localhost:5432/imageboard");

module.exports.getImages = () => {
    const q = `SELECT * FROM images`;
    return db.query(q);
};

// sudo service postgresql start
