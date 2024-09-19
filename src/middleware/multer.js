import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (file.fieldname === "profile") {
      folder = path.join(__dirname, "../public/uploads/profiles");
    } else if (file.fieldname === "product") {
      folder = path.join(__dirname, "../public/uploads/products");
    } else if (file.fieldname === "documents") {
      folder = path.join(__dirname, "../public/uploads/documents");
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Máximo 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|webp|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Tipo de archivo no permitido"));
    }
  },
});

export default upload;
