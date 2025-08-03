import express from "express";
import webpush from "web-push";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔐 VAPID Keys (celle qu’on a générée)
const publicVapidKey = "BOpDFQyoWxny8Iyi2jWZqM-jDOVWBJcpOmMG4OJ3q_Uk5EHTYAYT6zNH5sWhydqUXZYoMZyRPFyGHyeA-3fVJ4U";
const privateVapidKey = "rI0E2RhN8ukCHZaUyzBmlQ7ge-XAhKO5Z__6Zx2E9uM";

// 📡 Config web-push
webpush.setVapidDetails(
  "mailto:ton@email.fr",
  publicVapidKey,
  privateVapidKey
);

// 📥 Stockage temporaire des abonnements (à remplacer par Firestore ou autre si besoin)
const subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Abonné !" });
});

// 📤 Envoi de la notification
app.post("/send", async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    for (const sub of subscriptions) {
      await webpush.sendNotification(sub, payload);
    }
    res.status(200).json({ message: "Notifications envoyées" });
  } catch (err) {
    console.error("Erreur push:", err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("✅ Serveur lancé sur http://localhost:3000"));

// 🔍 Endpoint pour vérifier les abonnements enregistrés
app.get("/subscriptions", (req, res) => {
  res.json({ count: subscriptions.length, subscriptions });
});
// Envoi d'une notification à tous les abonnés
app.get("/send", (req, res) => {
  const notificationPayload = JSON.stringify({
    title: "Un petit mot 💌",
    body: "Coucou ma Laura d’amour ❤️",
    icon: "/icon.png"
  });

  const sendPromises = subscriptions.map(sub =>
    webpush.sendNotification(sub, notificationPayload).catch(err => console.error(err))
);

  Promise.all(sendPromises)
    .then(() => res.status(200).send("Notifications envoyées !"))
    .catch(err => {
      console.error("Erreur d'envoi :", err);
      res.sendStatus(500);
    });
});
