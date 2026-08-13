const express = require("express");
const sharp = require("sharp");
const path = require("path");

const app = express();

app.get("/image/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const width = Number(req.query.width) || 800;

        const imagePath = path.join(__dirname, "images", name);

        const image = await sharp(imagePath)
            .resize({
                width: width,
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();

        res.type("image/webp");
        res.send(image);

    } catch (error) {
        console.error(error);
        res.status(404).send("Image not found");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
