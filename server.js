const express = require("express");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();

app.get("/image/*", async (req, res) => {
    try {
        const imagePath = req.params[0];

        if (!imagePath) {
            return res.status(400).send("Image path is required");
        }

        const safePath = path.normalize(imagePath);

        if (safePath.includes("..")) {
            return res.status(400).send("Invalid path");
        }

        const filePath = path.join(
            __dirname,
            "images",
            safePath
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).send("Image not found");
        }

        const width = Math.min(
            Math.max(Number(req.query.width) || 800, 200),
            2000
        );

        const image = await sharp(filePath)
            .resize({
                width: width,
                withoutEnlargement: true
            })
            .webp({
                quality: 80
            })
            .toBuffer();

        res.set("Content-Type", "image/webp");

        res.set(
            "Cache-Control",
            "public, max-age=31536000, immutable"
        );

        res.send(image);

    } catch (error) {
        console.error(error);
        res.status(500).send("Image processing error");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
