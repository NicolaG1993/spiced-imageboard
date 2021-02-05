const express = require("express");
const app = express();
const {
    getImages,
    getImageById,
    uploadImage,
    getMoreImages,
} = require("./public/js/db");
const { uploader } = require("./public/js/upload");
const s3 = require("./s3");
app.use(express.static("public"));
app.use(express.json());

app.get("/images", (req, res) => {
    console.log("/images route has been hit!!!");
    // res.json - how we send a response to the client!
    getImages()
        .then(({ rows }) => res.json(rows))
        .catch((err) => console.log("err with getImages: ", err));
});

app.get("/load-more/:lastId", (req, res) => {
    console.log("/load-more route has been hit!!!");
    console.log("req.params: ", req.params);
    getMoreImages(req.params.lastId)
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.json(rows);
        })
        .catch((err) => console.log("err with getMoreImages: ", err));
});

// app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
//     console.log("you've made it inside /upload!");
//     // do your db insert here!
//     // then send your newly inserted obj (image) back to the client via res.json!
// });

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("you've made it inside /upload!");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);

    if (req.file) {
        const title = req.body.title;
        const description = req.body.description;
        const username = req.body.username;
        const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

        uploadImage(title, description, username, url)
            .then(({ rows }) => res.json(rows[0])) //cos'é rows[0] -> é response.rows -> contiene title, descr, username, url
            .catch((err) => console.log("err with uploadImage: ", err));
    } else {
        res.json({ success: false });
    }
});

app.get("/picture/:pictureid", (req, res) => {
    console.log("/modal dynamic route has been hit!!!");
    console.log("req.params: ", req.params);
    let id = req.params.pictureid;

    getImageById(id)
        .then(({ rows }) => {
            res.json(rows[0]);
            console.log("rows: ", rows[0]);
        })
        .catch((err) => console.log("err with getImagesById: ", err));
});

app.get("/*", (req, res) => res.redirect("/"));
app.listen(8080, () => console.log("IB server is listening..."));
