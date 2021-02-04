const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC LIMIT 6`; //torna ordine inverso, limite di 6 (limite non funziona!!)
    return db.query(q);
};

module.exports.getMoreImages = (lastId) => {
    const q = `SELECT url, title, id, (
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
            ) AS "lastId" FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 6;`;
    const key = [lastId];
    return db.query(q, key);
};

module.exports.getImageById = (id) => {
    const q = `SELECT * FROM images WHERE id=$1`;
    const key = [id];
    return db.query(q, key);
};

module.exports.uploadImage = (title, description, username, url) => {
    const q = `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING title, description, username, url, id`; //senza returnin non vedo l'immagine appena la carico, ma solo se ricarico la pagin
    const keys = [title, description, username, url];
    return db.query(q, keys);
};

// sudo service postgresql start
