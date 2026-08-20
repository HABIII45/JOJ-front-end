/**
 * Données de démonstration JOJ_Events (version JavaScript)
 * Structure strictement identique aux serializers Django DRF du backend.
 * Utilisées quand `VITE_API_URL` n'est pas défini (aperçu du frontend seul).
 */

export const IMAGES = {
  mascotte:"/JOJ-frontend/src/assets/images/image.png",
  evAthletisme: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
  evFootball: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
  evBoxe: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80",
  siteIbaMar: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80",
  siteDakarArena: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
  siteSaly: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  discAthletisme: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80",
  discBasket: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80",
  discFootball: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80",
  discJudo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
  newsClassement: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  newsAcces: "https://images.unsplash.com/photo-1471295253337-4ceaaed65897?auto=format&fit=crop&w=800&q=80",
  newsProgramme: "https://images.unsplash.com/photo-1508801239166-4335a0796937?auto=format&fit=crop&w=800&q=80",
  newsOrientation: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
};

export const evenementsDemo = [
  {
    id: 1,
    titre: "Athlétisme — Épreuves 100m hommes",
    date: new Date().toISOString().slice(0, 10),
    heure: "15:30",
    description: "Séries du 100m hommes — Stade du Dakar Arena",
    image: IMAGES.evAthletisme,
    site: 1,
    categorie: 1,
    discipline_nom: "Athlétisme",
  },
  {
    id: 2,
    titre: "Football — Phase de poules",
    date: new Date().toISOString().slice(0, 10),
    heure: "17:00",
    description: "Phase de poules — Parc des Sports de Yoff",
    image: IMAGES.evFootball,
    site: 2,
    categorie: 2,
    discipline_nom: "Football",
  },
  {
    id: 3,
    titre: "Boxe — Séries",
    date: new Date().toISOString().slice(0, 10),
    heure: "19:15",
    description: "Séries — Arène de Toubab Dialaw",
    image: IMAGES.evBoxe,
    site: 3,
    categorie: 3,
    discipline_nom: "Boxe",
  },
];

export const sitesDemo = [
  {
    id: 1,
    nom: "Complexe Iba Mar Diop",
    capacite: 15000,
    description:
      "Complexe sportif historique de Dakar, dédié à l'athlétisme et aux épreuves en extérieur.",
    service: "Gradins, loges et espaces presse",
    image: IMAGES.siteIbaMar,
    ville: "Dakar",
    region: "Dakar",
    zones: [
      { id: 1, nom: "Gradins", capacite: 10000, type_zone: "STANDARD" },
      { id: 2, nom: "Loges", capacite: 500, type_zone: "VIP" },
      { id: 3, nom: "Presse", capacite: 200, type_zone: "PRESSE" },
    ],
  },
  {
    id: 2,
    nom: "Dakar Arena",
    capacite: 15000,
    description:
      "Arène multifonctionnelle ultramoderne au cœur de Diamniadio.",
    service: "Gradins et espaces presse",
    image: IMAGES.siteDakarArena,
    ville: "Diamniadio",
    region: "Dakar",
    zones: [
      { id: 4, nom: "Gradins", capacite: 12000, type_zone: "STANDARD" },
      { id: 5, nom: "Presse", capacite: 300, type_zone: "PRESSE" },
    ],
  },
  {
    id: 3,
    nom: "Site Saly Ouest",
    capacite: 8000,
    description: "Site olympique de Saly dédié aux sports de plage et de combat.",
    service: "Gradins, loges et espaces presse",
    image: IMAGES.siteSaly,
    ville: "Mbour",
    region: "Thiès",
    zones: [
      { id: 6, nom: "Gradins", capacite: 6000, type_zone: "STANDARD" },
      { id: 7, nom: "Loges", capacite: 400, type_zone: "VIP" },
      { id: 8, nom: "Presse", capacite: 150, type_zone: "PRESSE" },
    ],
  },
];

export const disciplinesDemo = [
  {
    id: 1,
    nom: "Athlétisme",
    regle: "Épreuves de vitesse, de sauts et de lancers selon le règlement World Athletics.",
    accessibilite: "Ouvert aux catégories U18 et U20.",
  },
  {
    id: 2,
    nom: "Basket-ball",
    regle: "Tournoi 3x3 et 5x5, règlement FIBA Jeunes.",
    accessibilite: "Tournoi et classement en temps réel.",
  },
  {
    id: 3,
    nom: "Football",
    regle: "Phases éliminatoires puis finales, règlement FIFA Jeunes.",
    accessibilite: "Résultats par groupe et horaires des rencontres.",
  },
  {
    id: 4,
    nom: "Judo",
    regle: "Combats par catégories de poids, règlement IJF.",
    accessibilite: "Résultats immédiats et podiums en temps réel.",
  },
];

export const actualitesDemo = [
  {
    id: 1,
    titre:
      "Résultats du jour publiés : consultez les classements finaux par épreuve.",
    description: "Les classements finaux par épreuve sont disponibles.",
    image: IMAGES.newsClassement,
    tags: ["Résultats"],
    date_publication: new Date().toISOString().slice(0, 10),
    auteur: 1,
  },
  {
    id: 2,
    titre:
      "Reconfiguration des accès pour le site Iba Mar Arena : zones loges et presse réorganisées.",
    description:
      "Les zones loges et presse du site Iba Mar Arena ont été réorganisées pour améliorer les flux spectateurs.",
    image: IMAGES.newsAcces,
    tags: ["Décision", "Accès"],
    date_publication: new Date().toISOString().slice(0, 10),
    auteur: 1,
  },
  {
    id: 3,
    titre:
      "Épreuves en cours : suivez les scores et les records au fil du déroulement en temps réel.",
    description: "Programme complet et scores en temps réel.",
    image: IMAGES.newsProgramme,
    tags: ["Programme"],
    date_publication: new Date().toISOString().slice(0, 10),
    auteur: 1,
  },
  {
    id: 4,
    titre:
      "Conseils d'orientation : points d'entrée recommandés par type de billet pour éviter les files.",
    description: "Guide d'orientation des spectateurs sur les sites.",
    image: IMAGES.newsOrientation,
    tags: ["Orientation"],
    date_publication: new Date().toISOString().slice(0, 10),
    auteur: 1,
  },
];

// ---------------------------------------------------------------------------
// Dashboard admin
// ---------------------------------------------------------------------------

export const kpiDemo = {
  totalEvenements: 42,
  variationEvenements: "+12%",
  revenusBillets: 15420000,
  variationRevenus: "+8.4%",
  sitesActifs: 12,
  actualitesPubliees: 128,
  variationActualites: "+5 aujourd'hui",
};

export const ventesMensuellesDemo = [
  { mois: "Jan", millionsFcfa: 1.2 },
  { mois: "Fév", millionsFcfa: 2.5 },
  { mois: "Mar", millionsFcfa: 1.8 },
  { mois: "Avr", millionsFcfa: 3.2 },
  { mois: "Mai", millionsFcfa: 4.5 },
  { mois: "Juin", millionsFcfa: 4.0 },
  { mois: "Juil", millionsFcfa: 5.8 },
  { mois: "Août", millionsFcfa: 6.2 },
  { mois: "Sept", millionsFcfa: 5.4 },
  { mois: "Oct", millionsFcfa: 7.8 },
  { mois: "Nov", millionsFcfa: 8.4 },
  { mois: "Déc", millionsFcfa: 9.1 },
];

export const activitesDemo = [
  {
    id: 1,
    type: "creation",
    titre: "Nouvel événement créé",
    detail: "Basketball — Finale Sénégalaise",
    ilYA: "IL Y A 10 MIN",
  },
  {
    id: 2,
    type: "modification",
    titre: "Site mis à jour",
    detail: "Dakar Arena : Gradins zone A",
    ilYA: "IL Y A 1 HEURE",
  },
  {
    id: 3,
    type: "publication",
    titre: "Actualité publiée",
    detail: "Conseils d'orientation — Billet Saly",
    ilYA: "IL Y A 3 HEURES",
  },
  {
    id: 4,
    type: "suppression",
    titre: "Événement supprimé",
    detail: "Tournoi amical — Football U15",
    ilYA: "HIER À 18:30",
  },
];

/** Utilisateur admin de démonstration (superadmin par défaut) */
export const adminDemo = {
  id: 1,
  username: "super_admin",
  email: "admin@joj-dakar-2026.sn",
  role: "SUPERADMIN",
  full_name: "Admin JOJ",
};

export const RESULTATS_DEMO_ENRICHIS = [
  {
    id: 1,
    score: "1-0",
    competiteur: { id: 1, nom: "Joueur", prenom: "T. Abe", pays: "JP" },
    adversaire: { nom: "Joueur", prenom: "J. Lima", pays: "BR" },
    evenement: { id: 1, titre: "Finale - Hommes -66kg", discipline: "Judo" },
  },
  {
    id: 2,
    score: "85-78",
    competiteur: { id: 2, nom: "Équipe", prenom: "États-Unis", pays: "US" },
    adversaire: { nom: "Équipe", prenom: "France", pays: "FR" },
    evenement: { id: 2, titre: "Demi-finale - Femmes", discipline: "Basketball" },
  },
  {
    id: 3,
    score: "10.05",
    competiteur: { id: 3, nom: "Athlète", prenom: "L. Thompson", pays: "JM" },
    evenement: { id: 3, titre: "100m - Hommes - Finale", discipline: "Athlétisme" },
    position: 1,
  },
  {
    id: 4,
    score: "10.12",
    competiteur: { id: 4, nom: "Athlète", prenom: "M. Davis", pays: "US" },
    evenement: { id: 3, titre: "100m - Hommes - Finale", discipline: "Athlétisme" },
    position: 2,
  },
  {
    id: 5,
    score: "10.18",
    competiteur: { id: 5, nom: "Athlète", prenom: "A. Smith", pays: "CA" },
    evenement: { id: 3, titre: "100m - Hommes - Finale", discipline: "Athlétisme" },
    position: 3,
  },
  {
    id: 6,
    score: "2-1",
    competiteur: { id: 6, nom: "Équipe", prenom: "Sénégal", pays: "SN" },
    adversaire: { nom: "Équipe", prenom: "Japon", pays: "JP" },
    evenement: { id: 6, titre: "Quart de finale - Hommes", discipline: "Football" },
  },
  {
    id: 7,
    score: "0.95",
    competiteur: { id: 7, nom: "Athlète", prenom: "A. Ba", pays: "SN" },
    evenement: { id: 7, titre: "50m Nage libre - Hommes", discipline: "Natation" },
    position: 1,
  },
  {
    id: 8,
    score: "32-28",
    competiteur: { id: 8, nom: "Équipe", prenom: "Égypte", pays: "EG" },
    adversaire: { nom: "Équipe", prenom: "Corée", pays: "KR" },
    evenement: { id: 8, titre: "Demi-finale - Femmes", discipline: "Handball" },
  },
];
 export const DRAPEAUX = {
  JP: "🇯🇵", BR: "🇧🇷", US: "🇺🇸", FR: "🇫🇷", JM: "🇯🇲", CA: "🇨🇦",
  SN: "🇸🇳", EG: "🇪🇬", KR: "🇰🇷",
};

/**
 * Nettoyage et dédoublonnage dynamique des filtres de disciplines
 */
export function pastillesInitiales(categorieNames) {
  const ordonne = ["Football", "Basketball", "Athlétisme", "Natation", "Handball", "Judo"];
  const reste = (categorieNames || []).filter(
    (n) => !ordonne.includes(n) && !["Sports Collectifs", "Sports de Combat"].includes(n)
  );
  
  // Array.from(new Set(...)) évite les entrées en double (ex: Judo répété)
  return ["Tous", ...Array.from(new Set([...ordonne, ...reste]))];
}

export const ICONE_DISCIPLINE = {
  Judo: "🥋",
  Basketball: "🏀",
  Football: "⚽",
  Athlétisme: "⏱️",
  Natation: "🏊",
  Handball: "🤾",
};


// ---------------------------------------------------------------------------
// Données de démonstration (structure miroir du serializer Categorie)
// ---------------------------------------------------------------------------
export const CATEGORIES_DEMO = [
  {
    id: 1,
    nom: "100m - Hommes",
    description: "Épreuve reine de la vitesse, course en ligne droite sur 100 mètres.",
    discipline: { id: 1, nom: "Athlétisme" },
  },
  {
    id: 2,
    nom: "100m - Femmes",
    description: "Épreuve reine de la vitesse, course en ligne droite sur 100 mètres.",
    discipline: { id: 1, nom: "Athlétisme" },
  },
  {
    id: 3,
    nom: "Saut en longueur - Hommes",
    description: "Saut avec élan mesuré au mètre près selon le règlement World Athletics.",
    discipline: { id: 1, nom: "Athlétisme" },
  },
  {
    id: 4,
    nom: "Tournoi 3x3 - Hommes",
    description: "Format rapide sur demi-terrain, premier à 21 points ou temps réglementaire.",
    discipline: { id: 2, nom: "Basket-ball" },
  },
  {
    id: 5,
    nom: "Tournoi 5x5 - Femmes",
    description: "Tournoi réglementaire FIBA Jeunes en cinq contre cinq.",
    discipline: { id: 2, nom: "Basket-ball" },
  },
  {
    id: 6,
    nom: "Tournoi - Hommes",
    description: "Compétition complète par équipes, phases de poule puis éliminatoires.",
    discipline: { id: 3, nom: "Football" },
  },
  {
    id: 7,
    nom: "-66kg - Hommes",
    description: "Combats par catégories de poids selon le règlement IJF.",
    discipline: { id: 4, nom: "Judo" },
  },
  {
    id: 8,
    nom: "-57kg - Femmes",
    description: "Combats féminins par catégories de poids selon le règlement IJF.",
    discipline: { id: 4, nom: "Judo" },
  },
];

// ---------------------------------------------------------------------------
// Icône ronde par discipline (couleur + lettre, même style que Disciplines)
// ---------------------------------------------------------------------------
export const COULEURS_ICONE = [
  "#C25B1E",
  "#16A34A",
  "#2563EB",
  "#9333EA",
  "#0891B2",
  "#DB2777",
  "#CA8A04",
  "#475569",
];


// ---------------------------------------------------------------------------
// Données de repli si l'API ne renvoie rien
// ---------------------------------------------------------------------------
export const DEMO = {
  categories:
    Array.isArray(CATEGORIES_DEMO) && CATEGORIES_DEMO.length > 0
      ? CATEGORIES_DEMO
      : [
          {
            id: 1,
            nom: "100m - Hommes",
            description: "",
            discipline: { id: 1, nom: "Athlétisme" },
          },
        ],
  disciplines:
    Array.isArray(disciplinesDemo) && disciplinesDemo.length > 0
      ? disciplinesDemo
      : [
          { id: 1, nom: "Athlétisme", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 4 },
          { id: 2, nom: "Basket-ball", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 12 },
          { id: 3, nom: "Football", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 0 },
          { id: 4, nom: "Judo", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 6 },
        ],
};