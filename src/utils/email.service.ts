import nodemailer from "nodemailer";

const fromEmail = "info@alexviolatto.it";

class EmailService {
  private transporter;
  private from: string; // Mittente fisso

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtps.aruba.it", // Host SMTP di Aruba
      port: 465, // Porta per SSL
      debug: true,
      secure: true, // True per SSL, False per TLS (se usi la porta 587)
      auth: {
        user: fromEmail, // Il tuo indirizzo email di autenticazione su Aruba
        pass: "Qazswx03!", // La password del tuo account email
      },
    });

    // this.transporter = nodemailer.createTransport({
    //   host: "smtps.aruba.it",
    //   port: 587, // Cambia a 587 per STARTTLS
    //   secure: false, // Usa false per la porta 587 con STARTTLS
    //   auth: {
    //     user: "info@alexviolatto.it",
    //     pass: "Qazswx03!",
    //   },
    // });

    this.from = fromEmail; // Imposta il mittente fisso
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

// In caso non funzioni, verifica che:
// 1. Il firewall del tuo sistema operativo non blocchi la porta utilizzata per l'invio delle email (es. 465 per SSL).
// 2. Il tuo provider di servizi email non limiti l'accesso al server SMTP per applicazioni di terze parti.
// 3. La connessione non sia bloccata da firewall a livello di rete (ad esempio, quelli del tuo router o ISP).

// RISOLUZIONE PER DIVERSI SISTEMI OPERATIVI:

// Windows
// Utilizza PowerShell per creare una regola che consenta il traffico sulla porta 465 (o quella necessaria):
// New-NetFirewallRule -DisplayName "Allow All Traffic on Port 465" -Direction Outbound -LocalPort 465 -Protocol TCP -Action Allow

// macOS
// Utilizza il comando "pfctl" per verificare e configurare il firewall. Ad esempio:
// Verifica le regole attuali: sudo pfctl -s rules
// Aggiungi una regola per consentire il traffico sulla porta 465:
// echo "pass out proto tcp from any to any port 465" | sudo pfctl -ef -

// Linux
// Su Linux, utilizza il firewall "iptables" o "ufw" per configurare le regole:
// Con iptables:
// sudo iptables -A OUTPUT -p tcp --dport 465 -j ACCEPT
// Con ufw (più semplice):
// sudo ufw allow out 465/tcp

// IMPORTANTE: Dopo aver configurato le regole, riprova a connetterti e verifica se il problema persiste.
