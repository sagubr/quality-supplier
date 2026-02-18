import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

const service = new NotificationService();

export async function sendTestEmail(req: Request, res: Response) {
  await service.sendTestEmail();
  res.json({ message: "Email enviado (ou tentativa feita)." });
}
