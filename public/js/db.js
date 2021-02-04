const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images`;
    return db.query(q);
};

module.exports.uploadImage = (title, description, username, url) => {
    const q = `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4)`;
    const keys = [title, description, username, url];
    return db.query(q, keys);
};

// sudo service postgresql start
