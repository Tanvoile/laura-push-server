import express from "express";
import webpush from "web-push";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const publicVapidKey = "BOpDFQyoWxny8Iyi2jWZqM-jDOVWBJcpOmMG4OJ3q_Uk5EHTYAYT6zNH5sWhydqUXZYoMZyRPFyGHyeA-3fVJ4U";
const privateVapidKey = "rI0E2RhN8ukCHZaUyzBmlQ7ge-XAhKO5Z__6Zx2E9uM";

webpush.setVapidDetails(
  "mailto:laura@amour.fr",
  publicVapidKey,
  privateVapidKey
);

const subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Abonné !" });
});

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