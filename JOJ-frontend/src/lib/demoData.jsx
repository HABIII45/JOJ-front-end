/**
 * Données de démonstration JOJ_Events (version JavaScript)
 * Structure strictement identique aux serializers Django DRF du backend.
 * Utilisées quand `VITE_API_URL` n'est pas défini (aperçu du frontend seul).
 */

export const IMAGES = {
  mascotte: "/manus-storage/mascotte_lion_953015d2.png",
  evAthletisme: "/manus-storage/ev_athletisme_eb1ce2da.jpg",
  evFootball: "/manus-storage/ev_football_3916ad59.jpg",
  evBoxe: "/manus-storage/ev_boxe_9915d0e0.jpg",
  siteIbaMar: "/manus-storage/site_iba_mar_24a1dd9b.jpg",
  siteDakarArena: "/manus-storage/site_dakar_arena_bf9c04da.jpg",
  siteSaly: "/manus-storage/site_saly_de87c335.jpg",
  discAthletisme: "/manus-storage/disc_athletisme_3f583514.jpg",
  discBasket: "/manus-storage/disc_basket_b677790a.jpg",
  discFootball: "/manus-storage/disc_football_43906f01.jpg",
  discJudo: "/manus-storage/disc_judo_add68000.jpg",
  newsClassement: "/manus-storage/news_classement_37b66b0a.jpg",
  newsAcces: "/manus-storage/news_acces_cd449771.jpg",
  newsProgramme: "/manus-storage/news_programme_58526905.jpg",
  newsOrientation: "/manus-storage/news_orientation_5a2413b6.jpg",
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
