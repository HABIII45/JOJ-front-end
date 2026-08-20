import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";
import mascotteLion from "../../assets/images/image.png";

export const PILLS = [
  "Événements disponibles",
  "Voir la liste des sites",
  "Voir la liste des jeux",
  "Actualités & résultats",
];

export default function HeroSection() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [shootingParticles, setShootingParticles] = useState([]);

  // La bulle "Salut !" apparaît toute seule après un court délai,
  // puis se met en veille — pour donner un côté vivant sans être intrusif.
  useEffect(() => {
    const showT = setTimeout(() => setShowGreeting(true), 1800);
    const hideT = setTimeout(() => setShowGreeting(false), 7500);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  const handleBotClick = () => {
    setShowGreeting(false);
    const jojColors = ["#0081C8", "#FCB131", "#D95D27", "#00A651", "#EE334E"];
    const particles = Array.from({ length: 32 }).map((_, i) => ({
      id: Date.now() + i,
      color: jojColors[i % jojColors.length],
      tx: (Math.random() - 0.5) * 320,
      ty: -window.innerHeight * 0.7 - Math.random() * 120,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.8,
      duration: 2.6 + Math.random() * 0.9,
    }));
    setShootingParticles(particles);
    setTimeout(() => setIsChatOpen((prev) => !prev), 320);
    setTimeout(() => setShootingParticles([]), 3600);
  };

  return (
    <section className="bg-[#F8F9FA] text-black pt-10 pb-12 relative overflow-hidden">
      <style>{`
        /* ---------- Danse de la mascotte ---------- */
        /* On combine un déhanché, un léger squash & stretch et une bascule
           des épaules pour simuler un vrai pas de danse plutôt qu'un simple bounce. */
        @keyframes lionDance {
          0%   { transform: translateY(0) translateX(0) rotate(0deg) scale(1, 1); }
          12%  { transform: translateY(2px) translateX(-3px) rotate(-2deg) scale(1.01, 0.98); }
          28%  { transform: translateY(-16px) translateX(2px) rotate(3deg) scale(0.98, 1.03); }
          42%  { transform: translateY(-2px) translateX(6px) rotate(-1deg) scale(1.01, 0.99); }
          58%  { transform: translateY(-18px) translateX(-4px) rotate(-3deg) scale(0.98, 1.03); }
          75%  { transform: translateY(0px) translateX(-2px) rotate(2deg) scale(1.02, 0.98); }
          90%  { transform: translateY(-6px) translateX(1px) rotate(0deg) scale(1, 1); }
          100% { transform: translateY(0) translateX(0) rotate(0deg) scale(1, 1); }
        }
        @keyframes shadowStep {
          0%, 100% { transform: scaleX(1) scaleY(1); opacity: 0.22; }
          28% { transform: scaleX(0.65) scaleY(0.8); opacity: 0.1; }
          58% { transform: scaleX(0.6) scaleY(0.75); opacity: 0.09; }
        }
        /* Petits nuages de sable/poussière soulevés au rythme des pas */
        @keyframes dustPuff {
          0%   { transform: translate(0,0) scale(0.3); opacity: 0; }
          10%  { opacity: 0.55; }
          100% { transform: translate(var(--dx), -14px) scale(1.4); opacity: 0; }
        }
        .animate-lion-dance { animation: lionDance 2.8s cubic-bezier(0.45,0,0.55,1) infinite; transform-origin: 50% 100%; }
        .animate-shadow-step { animation: shadowStep 2.8s cubic-bezier(0.45,0,0.55,1) infinite; }
        .dust-puff { animation: dustPuff 1.4s ease-out infinite; }

        /* Bulle de salutation de la mascotte */
        @keyframes bubblePop {
          0% { opacity: 0; transform: translateY(6px) scale(0.9); }
          10%, 85% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(6px) scale(0.95); }
        }
        .animate-bubble-pop { animation: bubblePop 5.6s ease-in-out forwards; }

        /* ---------- Étoile filante (déclenchement chatbot) ---------- */
        @keyframes shootUpwardStar {
          0% { opacity: 0; transform: translate(0,0) scale(0.3) rotate(0deg); filter: drop-shadow(0 0 4px var(--star-color)); }
          15% { opacity: 1; transform: translate(calc(var(--tw-tx) * 0.2), calc(var(--tw-ty) * 0.2)) scale(1.3); filter: drop-shadow(0 0 14px var(--star-color)); }
          80% { opacity: 0.8; transform: translate(calc(var(--tw-tx) * 0.85), calc(var(--tw-ty) * 0.85)) scale(0.8); }
          100% { opacity: 0; transform: translate(var(--tw-tx), var(--tw-ty)) scale(0.1) rotate(360deg); }
        }
        .shooting-particle { animation: shootUpwardStar var(--star-duration) cubic-bezier(0.25,1,0.5,1) forwards; animation-delay: var(--star-delay); }

        /* ---------- Bouton chatbot : lueur respirante ---------- */
        @keyframes warmGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217,93,39,0.45), 0 8px 24px rgba(0,0,0,0.18); }
          50% { box-shadow: 0 0 0 10px rgba(217,93,39,0), 0 8px 28px rgba(217,93,39,0.28); }
        }
        .animate-warm-glow { animation: warmGlow 2.6s ease-in-out infinite; }

        /* ---------- Séparateur "trace de pas" ---------- */
        @keyframes trailShimmer {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -240; }
        }
        .trail-shimmer { animation: trailShimmer 6s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-lion-dance, .animate-shadow-step, .dust-puff, .animate-bubble-pop,
          .shooting-particle, .animate-warm-glow, .trail-shimmer { animation: none !important; }
        }
      `}</style>

      {/* Étoiles filantes (comète colorée au clic sur l'assistant) */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {shootingParticles.map((star) => (
          <span
            key={star.id}
            className="shooting-particle absolute bottom-10 right-10 rounded-full"
            style={{
              backgroundColor: star.color,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 12px ${star.color}, 0 0 24px ${star.color}`,
              "--star-color": star.color,
              "--tw-tx": `${star.tx}px`,
              "--tw-ty": `${star.ty}px`,
              "--star-delay": `${star.delay}s`,
              "--star-duration": `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Colonne Gauche */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black leading-tight tracking-tight">
              Bienvenue sur <br />
              <span className="text-[#D95D27]">JOJ_</span>Events
            </h1>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-md font-normal">
              Votre guide d'infrastructure digital et d'informations en temps réel pour les
              Jeux Olympiques de la Jeunesse 2026 à Dakar, Mbour (Saly) et Diamniadio.
            </p>
            <Link
              to="/evenements"
              className="inline-block px-10 py-3.5 bg-[#D95D27] hover:bg-[#c04e1e] text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Explorer
            </Link>
          </div>

          {/* Colonne Droite : Mascotte dansante */}
          <div className="relative flex flex-col items-center justify-end min-h-[300px]">
            {/* Bulle de dialogue de la mascotte */}
            <div className="absolute -top-2 right-2 sm:right-8 bg-white border border-gray-100 shadow-lg rounded-2xl rounded-br-sm px-4 py-2 text-xs font-semibold text-gray-800 opacity-0 animate-bubble-pop pointer-events-none">
              Bienvenue à Dakar 2026 ! 🦁🔥
            </div>

            <div className="relative animate-lion-dance">
              <img
                src={mascotteLion}
                alt="Mascotte officielle Dakar 2026"
                className="h-72 sm:h-80 md:h-96 object-contain relative z-10 drop-shadow-md"
              />
              {/* Nuages de sable rythmés sous les pieds */}
              <span
                className="dust-puff absolute bottom-2 left-[30%] w-2.5 h-2.5 rounded-full bg-[#D95D27]/40 blur-[2px]"
                style={{ "--dx": "-14px", animationDelay: "0.1s" }}
              />
              <span
                className="dust-puff absolute bottom-2 right-[28%] w-2 h-2 rounded-full bg-[#FCB131]/50 blur-[2px]"
                style={{ "--dx": "16px", animationDelay: "0.9s" }}
              />
            </div>
            <div className="w-48 h-3.5 bg-black/20 rounded-full blur-sm -mt-2 animate-shadow-step pointer-events-none" />
          </div>
        </div>

        {/* Pills */}
        <div className="mt-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
            {PILLS.map((pill) => (
              <button
                key={pill}
                className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-semibold text-gray-800 shadow-2xs hover:border-[#D95D27] hover:text-[#D95D27] transition-all"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Séparateur signature : "trace de pas" du lion, anneaux olympiques en filigrane */}
        <div className="mt-8 h-8 w-full" aria-hidden="true">
          <svg viewBox="0 0 800 32" className="w-full h-8" preserveAspectRatio="none">
            <line
              x1="0" y1="16" x2="800" y2="16"
              stroke="#E7E3DD" strokeWidth="2"
            />
            <line
              x1="0" y1="16" x2="800" y2="16"
              stroke="#D95D27" strokeWidth="2.5"
              strokeDasharray="2 22"
              strokeLinecap="round"
              className="trail-shimmer"
              opacity="0.9"
            />
            {["#0081C8", "#FCB131", "#D95D27", "#00A651", "#EE334E"].map((c, i) => (
              <circle key={c} cx={70 + i * 165} cy="16" r="5" fill={c} />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}