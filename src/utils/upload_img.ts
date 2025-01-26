import multer from "multer";
import path from "path";
import fs from "fs";

// if src/image/user-img doesn't exist, create it
// Percorso delle cartelle
const imageDir = path.join(__dirname, "../../src/image");
const userImgDir = path.join(imageDir, "user-img");

// Verifica e crea la cartella 'image' se non esiste
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log("Directory 'src/image' created");
}

// Verifica e crea la cartella 'user-img' se non esiste
if (!fs.existsSync(userImgDir)) {
  fs.mkdirSync(userImgDir, { recursive: true });
  console.log("Directory 'src/image/user-img' created");
}

// Configurazione di multer per salvare i file nella cartella "user-img"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/image/user-img"); // Salva i file nella cartella "user-img"
  },
  filename: function (req, file, cb) {
    // Usa un nome univoco per il file (ad esempio un timestamp)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Mantieni l'estensione originale
  },
});

// Filtra i file per consentire solo le immagini
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File not supported"), false);
  }
};

// Crea il middleware
const upload = multer({ storage, fileFilter });

export default upload;
