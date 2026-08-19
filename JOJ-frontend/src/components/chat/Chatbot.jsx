import { useState, useEffect } from "react";
import mascotteLion from "../../assets/images/image.png"
import {
  Search,
  Menu,
  X,
  Send,
  Sparkles,
  MessageCircle,


} from "lucide-react";
export function ChatbotAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [shootingParticles, setShootingParticles] = useState([]);

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
    <>
      {/* Étoiles filantes lors du déclenchement */}
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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {showGreeting && !isChatOpen && (
          <button
            onClick={handleBotClick}
            className="bg-white shadow-xl border border-gray-100 rounded-2xl rounded-br-sm px-4 py-2.5 text-xs font-semibold text-gray-800 animate-bubble-pop text-left max-w-[200px]"
          >
            Besoin d'un coup de patte ? 🐾
          </button>
        )}

        <button
          aria-label="Assistant virtuel JOJ 2026"
          onClick={handleBotClick}
          className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 animate-warm-glow bg-gradient-to-br from-[#FCB131] via-[#D95D27] to-[#EE334E] p-[3px]"
        >
          <span className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
            {isChatOpen ? (
              <X className="w-6 h-6 text-[#D95D27]" />
            ) : (
              <img
                src={mascotteLion}
                alt="Assistant JOJ"
                className="w-full h-full object-cover scale-[1.8] translate-y-2"
              />
            )}
          </span>
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCB131] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00A651] border-2 border-white items-center justify-center">
              <MessageCircle className="w-2 h-2 text-white" strokeWidth={3} />
            </span>
          </span>
        </button>

        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-black animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-r from-[#0081C8] via-[#D95D27] to-[#EE334E] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FCB131]" />
                <div>
                  <h3 className="font-bold text-sm">Assistant JOJ 2026</h3>
                  <p className="text-[10px] opacity-90">En ligne pour vous guider</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:opacity-75">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 h-64 overflow-y-auto bg-gray-50 text-xs space-y-3">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-2xs max-w-[85%]">
                Bonjour ! 👋 Je suis votre assistant virtuel pour les Jeux Olympiques de la Jeunesse Dakar 2026. Des questions sur les résultats ?
              </div>
            </div>
            <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Posez votre question..."
                className="w-full text-xs bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D95D27]"
              />
              <button className="p-2 bg-[#D95D27] text-white rounded-full hover:bg-[#c04e1e] transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
