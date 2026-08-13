const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = async (req, res) => {
    try {
        const imagePath = req.query.path;

        if (!imagePath) {
            return res.status(400).send("Image path is required");
        }

        // منع الوصول إلى ملفات خارج مجلد images
        const safePath = path.normalize(imagePath).replace(/^(\.\.(\/|\\|$))+/, "");

        const filePath = path.join(
            process.cwd(),
            "images",
            safePath
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).send("Image not found");
        }

        const width = Number(req.query.width) || 800;

        const safeWidth = Math.min(
            Math.max(width, 200),
            2000
        );

        const image = await sharp(filePath)
            .resize({
                width: safeWidth,
                withoutEnlargement: true
            })
            .webp({
                quality: 80
            })
            .toBuffer();

        res.setHeader("Content-Type", "image/webp");

        res.setHeader(
            "Cache-Control",
            "public, max-age=31536000, immutable"
        );

        res.status(200).send(image);

    } catch (error) {
        console.error(error);
        res.status(500).send("Image processing error");
    }
};
