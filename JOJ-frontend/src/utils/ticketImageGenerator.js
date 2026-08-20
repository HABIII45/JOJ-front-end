/**
 * Utilitaire de génération et téléchargement de billets sous forme d'image PNG haute définition.
 * Reproduit fidèlement le design exact de l'interface supporter JOJ 2026.
 */

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
 * Générateur déterministe de motif QR Code haute fidélité
 */
function drawQRCodePattern(ctx, startX, startY, size, textSeed) {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(startX, startY, size, size);

  ctx.fillStyle = "#000000";
  const modSize = size / 25;

  // 1. Finder patterns (Coins de repère standard QR)
  const drawFinder = (fx, fy) => {
    // Extérieur
    ctx.fillRect(fx, fy, modSize * 7, modSize * 7);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(fx + modSize, fy + modSize, modSize * 5, modSize * 5);
    ctx.fillStyle = "#000000";
    ctx.fillRect(fx + modSize * 2, fy + modSize * 2, modSize * 3, modSize * 3);
  };

  drawFinder(startX, startY);
  drawFinder(startX + size - modSize * 7, startY);
  drawFinder(startX, startY + size - modSize * 7);

  // 2. Timing patterns (Lignes de synchronisation)
  ctx.fillStyle = "#000000";
  for (let i = 8; i < 18; i += 2) {
    ctx.fillRect(startX + i * modSize, startY + 6 * modSize, modSize, modSize);
    ctx.fillRect(startX + 6 * modSize, startY + i * modSize, modSize, modSize);
  }

  // 3. Modules de données pseudo-aléatoires basés sur le seed du code unique
  const str = String(textSeed || "JOJ2026");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  ctx.fillStyle = "#000000";
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      // Ignorer les zones des 3 finders
      const inTopLeft = row < 8 && col < 8;
      const inTopRight = row < 8 && col > 16;
      const inBottomLeft = row > 16 && col < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      const val = Math.sin(row * 13 + col * 17 + hash) * 10000;
      if (val - Math.floor(val) > 0.45) {
        ctx.fillRect(startX + col * modSize, startY + row * modSize, modSize, modSize);
      }
    }
  }
}

/**
 * Dessine le billet officiel avec la forme EXACTE de l'interface supporter
 */
export async function creerCanvasBillet(billet) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Format haute résolution panoramique (1280 x 640)
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
  // CARTE GAUCHE : CarteBillet du supporter (Dégradé, photo, badge, détails)
  // ════════════════════════════════════════════════════════════════════════════
  const leftX = 40;
  const leftW = 680;

  ctx.save();
  drawRoundedRect(ctx, leftX, cardY, leftW, cardH, 24);
  ctx.clip();

  // Fond de stade stylisé en dégradé sportif
  const bgGrad = ctx.createLinearGradient(leftX, cardY, leftX + leftW, cardY + cardH);
  bgGrad.addColorStop(0, "#1E293B");
  bgGrad.addColorStop(0.5, "#0F172A");
  bgGrad.addColorStop(1, "#020617");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(leftX, cardY, leftW, cardH);

  // Effets d'éclairage de stade en arrière-plan
  const spotGrad = ctx.createRadialGradient(leftX + leftW / 2, cardY + 120, 20, leftX + leftW / 2, cardY + 120, 350);
  spotGrad.addColorStop(0, "rgba(194, 91, 30, 0.35)");
  spotGrad.addColorStop(0.6, "rgba(30, 41, 59, 0.1)");
  spotGrad.addColorStop(1, "transparent");
  ctx.fillStyle = spotGrad;
  ctx.fillRect(leftX, cardY, leftW, cardH);

  // Dégradé sombre de bas en haut
  const grad = ctx.createLinearGradient(leftX, cardY + 140, leftX, cardY + cardH);
  grad.addColorStop(0, "rgba(0,0,0,0.15)");
  grad.addColorStop(0.6, "rgba(0,0,0,0.85)");
  grad.addColorStop(1, "rgba(0,0,0,0.98)");
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

  // Informations de l'épreuve
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
  // CARTE DROITE : CarteQR du supporter (Carte blanche, QR Code, pastille statut)
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

  // QR Code Box & Canvas Drawing (sans taint)
  drawQRCodePattern(ctx, rightX + rightW / 2 - 95, cardY + 35, 190, codeUnique);

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
  try {
    const canvas = await creerCanvasBillet(billet);
    const dataUrl = canvas.toDataURL("image/png");

    const code = billet.codeUnique || billet.code_unique || billet.id || Date.now();
    const link = document.createElement("a");
    link.download = `billet_JOJ2026_${code}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Erreur génération image billet:", err);
  }
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
