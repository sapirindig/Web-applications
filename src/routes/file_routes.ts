import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import fs from "fs";

const base = process.env.DOMAIN_BASE + "/";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../../uploads"); // Correct path
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });

router.post('/', upload.single("file"), function (req, res) {
   if (req.file) {
       console.log("router.post(/file: " + base + req.file.path)
       res.status(200).send({ url: base + req.file.path })
   } else {
       res.status(400).send({ error: "File upload failed" })
   }
});
export = router;
