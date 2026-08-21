import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import HeroSection from "../../components/sections/HeroSection";
import EventsSection from "../../components/sections/EventsSection";
import SitesSection from "../../components/sections/SitesSection";
import GamesSection from "../../components/sections/GamesSection";
import NewsSection from "../../components/sections/NewsSection";
import { useHomeData } from "../../hooks/useHomeData";
import ChatbotAssistant from "../../components/chat/Chatbot"

const IMAGES_FALLBACK = {
  mascotte: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  ev: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80"
  ],
  sites: [
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  ],
  jeux: [
    { id: 1, nom: "Athlétisme", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=200&q=80" },
    { id: 2, nom: "Basket-ball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=200&q=80" },
    { id: 3, nom: "Football", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=200&q=80" },
    { id: 4, nom: "Judo", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80" }
  ]
};

export default function Home() {
  const { evenements, sites, disciplines, actualites } = useHomeData();

  const listEv = Array.isArray(evenements) && evenements.length > 0 
    ? evenements 
    : [
        { id: 1, titre: "Athlétisme – Épreuves 100m hommes", image: IMAGES_FALLBACK.ev[0] },
        { id: 2, titre: "Football – Phase de poules", image: IMAGES_FALLBACK.ev[1] },
        { id: 3, titre: "Boxe – Épreuves", image: IMAGES_FALLBACK.ev[2], isBientot: true }
      ];

  const listSites = Array.isArray(sites) && sites.length > 0 
    ? sites 
    : [
        { id: 1, nom: "Complexe Iba Mar Diop", image: IMAGES_FALLBACK.sites[0] },
        { id: 2, nom: "Dakar Arena", image: IMAGES_FALLBACK.sites[1] },
        { id: 3, nom: "Site Saly Ouest", image: IMAGES_FALLBACK.sites[2] }
      ];

  const listDisc = Array.isArray(disciplines) && disciplines.length > 0 
    ? disciplines 
    : IMAGES_FALLBACK.jeux;

  const listNews = Array.isArray(actualites) ? actualites : [];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased">
      <Header />

      <main className="flex-1">
        <HeroSection mascotteUrl={IMAGES_FALLBACK.mascotte} />
        <EventsSection evenements={listEv} />
        <SitesSection sites={listSites} />
        <GamesSection disciplines={listDisc} />
        <NewsSection actualites={listNews} />
      </main>
      <ChatbotAssistant/>
      <Footer />
    </div>
  );
}