export function getHtmlAddMessage(userId: string, confirmationCode) {
  const confirmationLink = `http://localhost:3000/api/todoapp/confirm-email?userId=${userId}&code=${confirmationCode}`;
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333;">Conferma il tuo indirizzo email</h2>
            <p>Ciao, Grazie per esserti registrato con noi! Per completare la tua registrazione, per favore conferma il tuo indirizzo email cliccando sul pulsante qui sotto:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${confirmationLink}" style="background-color: #f48c06; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Conferma la tua email</a>
            </div>
            <p>Se non riesci a cliccare il pulsante, clicca il seguente link:</p>
            <p><a href="${confirmationLink}">${confirmationLink}</a></p>
            <p style="color: #777;">Se non hai richiesto questa registrazione, puoi ignorare questa email.</p>
            <p>Grazie,<br>Il team di MyBanking</p>
        </div>
    `;
  return htmlContent;
}
export function getHtmlRequestChangePassword(token: string, userId: string) {
  const resetLink = `http://localhost:4200/reset-password-with-email?token=${token}&userId=${userId}`;
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333;">Conferma il reset della password</h2>
            <p>Ciao, per favore conferma il cambio della password cliccando sul pulsante qui sotto:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetLink}" style="background-color: #f48c06; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Conferma il cambio della password</a>
            </div>
            <p>Se non riesci a cliccare il pulsante, clicca il seguente link:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p style="color: #777;">Se non hai richiesto questa registrazione, puoi ignorare questa email.</p>
            <p>Grazie,<br>Il team di MyBanking</p>
        </div>
    `;
  return htmlContent;
}
