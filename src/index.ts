import "reflect-metadata";
import app from "./app";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import { emailService } from "./utils/email.service";

const getDatabaseConfig = () => {
  const data = fs.readFileSync("database.json", "utf8");
  return JSON.parse(data);
};
const config = getDatabaseConfig();
dotenv.config();

if (config.server === "localhost") {
  mongoose.set("debug", true);
  mongoose
    .connect("mongodb://127.0.0.1:27017/todo-list")
    .then((_) => {
      const port = 3000;
      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    })
    .catch((err) => {
      console.error(err);
    });
} else if (config.server === "atlas") {
  const atlasUri = `${process.env.MONGO_URI}`;

  mongoose
    .connect(atlasUri!)
    .then(() => {
      const port = 3000;
      app.listen(port, () => {
        console.log(`Server started on port ${port} (Atlas)`);
      });
    })
    .catch((err) => {
      console.error("Errore di connessione al database Atlas:", err);
    });
} else {
  console.error("Configurazione di database.json non valida, inserire 'localhost' o 'atlas'");
}

// async function sendEmail() {
//   await emailService.sendEmail(
//     "alex.violatto@itsdigitalacademy.com",
//     "Test Email - Verifica Invio",
//     "<p>Questa è una email di test per verificare il funzionamento del servizio email.</p>"
//   );
// }

// sendEmail().catch((err) => {
//   console.error(err);
// });
