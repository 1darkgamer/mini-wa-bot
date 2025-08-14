import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    const text = m.message.conversation || "";
    if (text.toLowerCase() === "hi") {
      await sock.sendMessage(m.key.remoteJid, { text: "Hello Thilina! 👋" });
    }
  });
}

startBot();
