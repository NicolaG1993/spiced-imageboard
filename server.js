const express = require("express");
const app = express();
const { getImages } = require("./sql/db");
app.use(express.static("public"));
app.use(express.json());

app.get("/images", (req, res) => {
    // console.log("/images route has been hit!!!");
    // res.json - how we send a response to the client!
    getImages()
        .then(({ rows }) => res.json(rows))
        .catch((err) => console.log("err with getImages: ", err));
});

app.get("/*", (req, res) => res.redirect("/"));
app.listen(8080, () => console.log("IB server is listening..."));
