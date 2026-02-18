import { emailService } from "../../shared/email/email.factory";

export class NotificationService {

  async sendTestEmail() {
    await emailService.send(
      "sousagustavogarcia@gmail.com",
      "Teste de Email",
      "<h1>Funcionando 🚀</h1>"
    );
  }
}
