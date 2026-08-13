const sharp = require("sharp");
const path = require("path");

module.exports = async (req, res) => {
    try {
        const { name } = req.query;
        const width = Number(req.query.width) || 800;

        const safeWidth = Math.min(Math.max(width, 200), 2000);

        const imagePath = path.join(
            process.cwd(),
            "images",
            name
        );

        const image = await sharp(imagePath)
            .resize({
                width: safeWidth,
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();

        res.setHeader("Content-Type", "image/webp");
        res.setHeader(
            "Cache-Control",
            "public, max-age=31536000, immutable"
        );

        res.status(200).send(image);

    } catch (error) {
        console.error(error);
        res.status(404).send("Image not found");
    }
};
