import nodemailer from "nodemailer";

class EmailService {
  private transporter;
  private from: string; // Mittente fisso

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtps.aruba.it", // Host SMTP di Aruba
      port: 465, // Porta per SSL
      secure: true, // True per SSL, False per TLS (se usi la porta 587)
      auth: {
        user: "info@alexviolatto.it", // Il tuo indirizzo email di autenticazione su Aruba
        pass: "Qazswx03!", // La password del tuo account email
      },
    });

    this.from = "info@alexviolatto.it"; // Imposta il mittente fisso (es. noreply@tuodominio.com)
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: this.from, // Mittente fisso
      to: to, // Destinatario passato come parametro
      subject: subject, // Oggetto passato come parametro
      html: htmlContent, // Contenuto HTML passato come parametro
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email inviata a ${to} con oggetto "${subject}"`);
    } catch (error) {
      console.error(`Errore nell'invio dell'email: ${error}`);
    }
  }
}

export const emailService = new EmailService();
