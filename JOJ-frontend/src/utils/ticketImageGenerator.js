/**
 * Utilitaire de génération et téléchargement de billets sous forme d'image PNG haute définition.
 * Reproduit fidèlement le design exact de l'interface supporter JOJ 2026.
 */

function chargerImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Dessine un rectangle avec coins arrondis
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Dessine le billet officiel avec la forme EXACTE de l'interface supporter
 */
export async function creerCanvasBillet(billet) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Format haute résolution panoramique (1280 x 640) reproduisant la carte et le QR code du supporter
  const W = 1280;
  const H = 640;
  canvas.width = W;
  canvas.height = H;

  // Fond global
  ctx.fillStyle = "#F8FAFC";
  ctx.fillRect(0, 0, W, H);

  // En-tête bandeau JOJ Dakar 2026
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, W, 70);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("JEUX OLYMPIQUES DE LA JEUNESSE — DAKAR 2026", 40, 42);

  ctx.fillStyle = "#C25B1E";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("BILLET OFFICIEL DE COMPÉTITION", W - 40, 42);
  ctx.textAlign = "left";

  const cardY = 95;
  const cardH = 510;

  // ════════════════════════════════════════════════════════════════════════════
  // CARTE GAUCHE : Exactement la CarteBillet du site supporter
  // ════════════════════════════════════════════════════════════════════════════
  const leftX = 40;
  const leftW = 680;

  ctx.save();
  drawRoundedRect(ctx, leftX, leftY = cardY, leftW, cardH, 24);
  ctx.clip();

  // Fond sombre
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(leftX, cardY, leftW, cardH);

  // Image d'arrière-plan du site
  const photoUrl = billet.imageUrl || "https://images.unsplash.com/photo-1518605348400-437a4a7761c4?w=800&q=80";
  const siteImg = await chargerImage(photoUrl);
  if (siteImg) {
    ctx.globalAlpha = 0.55;
    ctx.drawImage(siteImg, leftX, cardY, leftW, cardH);
    ctx.globalAlpha = 1.0;
  }

  // Dégradé sombre de bas en haut (comme sur le site web)
  const grad = ctx.createLinearGradient(leftX, cardY + 150, leftX, cardY + cardH);
  grad.addColorStop(0, "rgba(0,0,0,0.1)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.75)");
  grad.addColorStop(1, "rgba(0,0,0,0.96)");
  ctx.fillStyle = grad;
  ctx.fillRect(leftX, cardY, leftW, cardH);

  // Badge Catégorie en haut à droite
  const categorie = String(billet.categorie || "STANDARD").toUpperCase();
  const badgeW = 120;
  const badgeH = 34;
  const badgeX = leftX + leftW - badgeW - 24;
  const badgeY = cardY + 24;

  ctx.fillStyle = categorie === "VIP" ? "#D97706" : categorie === "PRESSE" ? "#059669" : "#C45D1E";
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 17);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(categorie, badgeX + badgeW / 2, badgeY + 22);
  ctx.textAlign = "left";

  // Informations de l'épreuve (Titre, Lieu, Siège)
  const infoBottomY = cardY + cardH - 120;

  // Titre de l'épreuve
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 26px sans-serif";
  const titreEv = String(billet.epreuve || "Compétition Olympique");
  ctx.fillText(titreEv.slice(0, 32), leftX + 24, infoBottomY - 40);

  // Lieu / Site
  ctx.fillStyle = "#E2E8F0";
  ctx.font = "bold 15px sans-serif";
  const lieuTexte = `📍 ${billet.site || "Site Olympique"}${billet.ville && billet.ville !== "—" ? `, ${billet.ville}` : ""}`;
  ctx.fillText(lieuTexte, leftX + 24, infoBottomY - 12);

  // Place / Siège
  if (billet.siege && billet.siege !== "—") {
    ctx.fillStyle = "#94A3B8";
    ctx.font = "13px sans-serif";
    ctx.fillText(billet.siege, leftX + 24, infoBottomY + 12);
  }

  // Date et Heure à droite
  ctx.textAlign = "right";
  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("DATE & HEURE", leftX + leftW - 24, infoBottomY - 40);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText(billet.date || "Date officielle", leftX + leftW - 24, infoBottomY - 15);

  ctx.fillStyle = "#F28C28";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(`${billet.heure || "18:00"} GMT`, leftX + leftW - 24, infoBottomY + 12);
  ctx.textAlign = "left";

  // Ligne de séparation basse
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftX + 24, cardY + cardH - 55);
  ctx.lineTo(leftX + leftW - 24, cardY + cardH - 55);
  ctx.stroke();

  // Titulaire & Code unique
  ctx.fillStyle = "#CBD5E1";
  ctx.font = "13px sans-serif";
  ctx.fillText(`👤 ${billet.titulaire || "Spectateur"}`, leftX + 24, cardY + cardH - 25);

  const codeUnique = billet.codeUnique || billet.code_unique || `JOJ-${billet.id || Date.now()}`;
  ctx.textAlign = "right";
  ctx.font = "bold 12px monospace";
  ctx.fillStyle = "#F8FAFC";
  ctx.fillText(codeUnique, leftX + leftW - 24, cardY + cardH - 25);
  ctx.textAlign = "left";

  ctx.restore();

  // ════════════════════════════════════════════════════════════════════════════
  // CARTE DROITE : Exactement la CarteQR du site supporter
  // ════════════════════════════════════════════════════════════════════════════
  const rightX = 750;
  const rightW = 490;

  ctx.save();
  drawRoundedRect(ctx, rightX, cardY, rightW, cardH, 24);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // QR Code Image
  const qrUrl = billet.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeUnique)}`;
  const qrImg = await chargerImage(qrUrl);
  if (qrImg) {
    ctx.drawImage(qrImg, rightX + rightW / 2 - 95, cardY + 35, 190, 190);
  }

  // Titre "Votre QR Code"
  ctx.textAlign = "center";
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("Votre QR Code", rightX + rightW / 2, cardY + 265);

  // Catégorie
  ctx.fillStyle = "#C45D1E";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText(`${billet.label || `Billet #${billet.id}`} — ${categorie}`, rightX + rightW / 2, cardY + 295);

  // Épreuve
  ctx.fillStyle = "#334155";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText(titreEv.slice(0, 32), rightX + rightW / 2, cardY + 325);

  // UUID Box
  const uuidW = 320;
  const uuidH = 34;
  const uuidX = rightX + (rightW - uuidW) / 2;
  const uuidY = cardY + 345;

  ctx.fillStyle = "#F1F5F9";
  drawRoundedRect(ctx, uuidX, uuidY, uuidW, uuidH, 10);
  ctx.fill();

  ctx.fillStyle = "#475569";
  ctx.font = "bold 12px monospace";
  ctx.fillText(codeUnique, rightX + rightW / 2, uuidY + 22);

  // Texte instruction
  ctx.fillStyle = "#94A3B8";
  ctx.font = "12px sans-serif";
  ctx.fillText("Présentez ce code à la borne de contrôle dès votre arrivée.", rightX + rightW / 2, cardY + 415);

  // Badge statut
  const badgeStatutW = 240;
  const badgeStatutH = 38;
  const badgeStatutX = rightX + (rightW - badgeStatutW) / 2;
  const badgeStatutY = cardY + 440;

  ctx.fillStyle = "#ECFDF5";
  ctx.strokeStyle = "#A7F3D0";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, badgeStatutX, badgeStatutY, badgeStatutW, badgeStatutH, 19);
  ctx.fill();
  ctx.stroke();

  // Pastille verte
  ctx.fillStyle = "#10B981";
  ctx.beginPath();
  ctx.arc(badgeStatutX + 24, badgeStatutY + 19, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#065F46";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Code prêt • Scan à l'entrée", badgeStatutX + badgeStatutW / 2 + 8, badgeStatutY + 24);

  ctx.textAlign = "left";
  ctx.restore();

  return canvas;
}

/**
 * Télécharge un billet individuel sous forme d'image PNG haute fidélité
 */
export async function telechargerBilletImage(billet) {
  if (!billet) return;
  const canvas = await creerCanvasBillet(billet);
  const dataUrl = canvas.toDataURL("image/png");

  const code = billet.codeUnique || billet.code_unique || billet.id || Date.now();
  const link = document.createElement("a");
  link.download = `billet_JOJ2026_${code}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Télécharge tous les billets de la commande un par un de façon séquentielle sous forme d'image
 */
export async function telechargerTousLesBilletsImages(listeBillets, onProgression = null) {
  if (!Array.isArray(listeBillets) || listeBillets.length === 0) return;

  for (let i = 0; i < listeBillets.length; i++) {
    const billet = listeBillets[i];
    if (onProgression) {
      onProgression(i + 1, listeBillets.length);
    }
    await telechargerBilletImage(billet);
    // Pause séquentielle de 600ms entre chaque téléchargement
    if (i < listeBillets.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }
}
