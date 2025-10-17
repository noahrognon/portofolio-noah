/// <reference path="../pb_data/types.d.ts" />

console.log("✅ Hook chargé !");

onRecordCreateRequest((e) => {
    if (e.collection.name !== "messages") {
        e.next();
        return;
    }

    const record = e.record;
    const nom = record.get("name") || record.get("nom");
    const email = record.get("email");
    const message = record.get("message");

    console.log("📨 Nouveau message reçu :", nom, email);

    try {
        const mailClient = $app.newMailClient();

        // --- 1️⃣ Mail envoyé à toi (notification) ---
        mailClient.send({
            from: { address: "contact@noahrognon.fr", name: "Portfolio Noah Rognon" },
            to: [{ address: "noah.rognon@gmail.com", name: "Noah Rognon" }],
            subject: ` Nouveau message de ${nom}`,
            html: `
        <h2>Nouveau message reçu depuis ton site</h2>
        <p><b>Nom :</b> ${nom}</p>
        <p><b>Email :</b> ${email}</p>
        <p><b>Message :</b></p>
        <p>${message}</p>
      `,
        });

        console.log("✅ Mail admin envoyé !");

        // --- 2️⃣ Mail automatique envoyé à l'expéditeur ---
        if (email) {
            mailClient.send({
                from: { address: "contact@noahrognon.fr", name: "Noah Rognon" },
                to: [{ address: email, name: nom || "Visiteur" }],
                subject: "Merci pour ton message 👋",
                html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2 style="color:#111;">Merci pour ton message ${nom || ""} 👋</h2>
            <p>Je t’écris pour confirmer que ton message a bien été reçu depuis mon portfolio.</p>
            <p>Je te répondrai personnellement dès que possible.</p>
            <br>
            <p style="font-style: italic; color: #555;">— Noah Rognon</p>
            <p style="font-size: 0.9em; color: #999;">Portfolio officiel — <a href="https://noahrognon.fr">noahrognon.fr</a></p>
          </div>
        `,
            });

            console.log("📩 Accusé de réception envoyé à :", email);
        }

        console.log("✅ Tous les mails envoyés avec succès !");
    } catch (err) {
        console.error("❌ Erreur d’envoi du mail :", err);
    }

    e.next();
}, "messages");
