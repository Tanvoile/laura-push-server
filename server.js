const express = require("express");
const webpush = require("web-push");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const publicKey = "BOpDFQyoWxny8Iyi2jWZqM-jDOVWBJcpOmMG4OJ3q_Uk5EHTYAYT6zNH5sWhydqUXZYoMZyRPFyGHyeA-3fVJ4U";
const privateKey = "0LCHz_h1nsACxQHY8ZlYcvx4Mcn1VYVZlb8HQQzLO38";

webpush.setVapidDetails("mailto:laura@push.com", publicKey, privateKey);

const subscriptions = [];

// 💾 Enregistrement d'un nouvel abonné
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log("👤 Nouvel abonné enregistré");
  res.status(201).json({ message: "Abonnement enregistré" });
});

// 🔍 Vérification des abonnés
app.get("/subscriptions", (req, res) => {
  res.json({ count: subscriptions.length, subscriptions });
});

// 💌 Envoi d’une notification à tous les abonnés
app.get("/send", (req, res) => {
  const payload = JSON.stringify({
    title: "Un petit mot 💌",
    body: "Coucou ma Laura d’amour ❤️",
    icon: "/icon.png"
  });

  const promises = subscriptions.map(sub =>
    webpush.sendNotification(sub, payload).catch(err => console.error("❌ Erreur d’envoi :", err))
  );

  Promise.all(promises)
    .then(() => res.status(200).send("Notifications envoyées !"))
    .catch(() => res.sendStatus(500));
});

// Démarrage
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Serveur lancé sur le port ${port}`));
