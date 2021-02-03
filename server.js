const express = require("express");
const app = express();
const { getImages } = require("./public/js/db");
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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("you've made it inside /upload!");
    // do your db insert here!
    // then send your newly inserted obj (image) back to the client via res.json!
});

app.get("/*", (req, res) => res.redirect("/"));
app.listen(8080, () => console.log("IB server is listening..."));
