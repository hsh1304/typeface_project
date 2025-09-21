const express = require("express");
const multer = require("multer");
const upload = multer();
const File = require("../models/File");
const { uploadFile, generatePresignedUrl } = require("../s3");

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const { key } = await uploadFile(file);

    const dbFile = await File.create({
      filename: file.originalname,
      key,
      contentType: file.mimetype,
      size: file.size,
    });

    res.json(dbFile);
  } catch (err) {
    console.error(err);
    
    if (err.message === "File type not allowed") {
      return res.status(400).json({ error: "File type not allowed. Please upload .txt, .jpg, .jpeg, .png, or .json files only." });
    }
    
    res.status(500).json({ error: "Upload failed. Please try again." });
  }
});

router.get("/files", async (req, res) => {
  const files = await File.findAll({ order: [["uploadedAt", "DESC"]] });
  res.json(files);
});

router.get("/download/:id", async (req, res) => {
  const file = await File.findByPk(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  const url = generatePresignedUrl(file.key);
  res.json({ url });
});

module.exports = router;
