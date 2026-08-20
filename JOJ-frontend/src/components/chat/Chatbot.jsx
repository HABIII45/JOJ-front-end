/**
 * COMPOSANT — ASSISTANT CHATBOT JOJ_Events
 * ==========================================
 * Composant autonome (bouton flottant + comète + fenêtre de discussion),
 * extrait de HeroSection pour être réutilisable sur n'importe quelle page.
 *
 * APPEL BACKEND :
 *   Toute la logique réseau passe par UNE seule fonction, `envoyerMessage()`
 *   ci-dessous. C'est le seul endroit à modifier quand l'endpoint FastAPI
 *   sera prêt.
 *
 *   Contrat attendu côté FastAPI :
 *     POST {VITE_API_URL}/api/chat/
 *     body  : { message: string, historique: [{ role: "user"|"assistant", contenu: string }] }
 *     retour: { reponse: string }
 *
 *   Tant que VITE_API_URL n'est pas configuré (isBackendConnected() === false),
 *   ou si l'appel échoue, le composant retombe sur une réponse locale de
 *   démonstration — pour qu'il reste utilisable dès maintenant, avant que
 *   le backend existe.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Paperclip,
  Smile,
  ArrowRight,
  Ticket,
  Clock,
  MapPin,
  Newspaper,
  MessageCircle,
} from "lucide-react";
import { isBackendConnected } from "../../lib/api";
import mascotteLion from "../../assets/images/image.png";

const JOJ_COLORS = ["#0081C8", "#FCB131", "#D95D27", "#00A651", "#EE334E"];

const QUICK_REPLIES = [
  { icon: Ticket, label: "Acheter un billet" },
  { icon: Clock, label: "Horaires des épreuves" },
  { icon: MapPin, label: "Sites des jeux" },
  { icon: Newspaper, label: "Actualités" },
];

const MESSAGE_ACCUEIL = {
  role: "assistant",
  contenu:
    "Bonjour ! 👋 Je suis votre assistant digital pour les JOJ Dakar 2026. Que souhaitez-vous savoir ?",
};

const COMET_PATH =
  "M 58 112 C 26 92, 82 74, 42 54 C 10 38, 90 26, 52 4 C 30 -8, 70 -14, 48 -22";

/**
 * Réponses locales de démonstration, utilisées tant que le backend FastAPI
 * n'est pas branché (ou si l'appel réseau échoue). Simple correspondance de
 * mots-clés — juste assez pour que le composant paraisse vivant en attendant.
 */
function reponseDemo(message) {
  const m = message.toLowerCase();
  if (m.includes("billet")) {
    return "La billetterie officielle ouvre prochainement. Je pourrai bientôt vous rediriger directement vers l'achat depuis ce chat.";
  }
  if (m.includes("horaire")) {
    return "Les horaires détaillés par discipline seront affichés ici dès que je serai connecté aux données en temps réel.";
  }
  if (m.includes("site")) {
    return "Les compétitions se déroulent à Dakar, Mbour (Saly) et Diamniadio. Je pourrai bientôt vous indiquer le site exact par épreuve.";
  }
  if (m.includes("actualit")) {
    return "Les dernières actualités des JOJ 2026 s'afficheront ici une fois connecté au fil d'actualités.";
  }
  return "Je suis encore en mode démonstration — je ne suis pas encore relié aux données en direct, mais je le serai très bientôt !";
}

/**
 * Point d'entrée unique vers le backend. À terme, seule cette fonction
 * doit changer pour pointer vers le vrai endpoint FastAPI si son contrat
 * diffère de celui décrit en en-tête de fichier.
 */
async function envoyerMessage(message, historique) {
  if (!isBackendConnected()) {
    return reponseDemo(message);
  }
  try {
    const base = import.meta.env.VITE_API_URL.replace(/\/$/, "");
    const res = await fetch(`${base}/api/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, historique }),
    });
    if (!res.ok) throw new Error(`Statut HTTP ${res.status}`);
    const data = await res.json();
    return data.reponse || reponseDemo(message);
  } catch (erreur) {
    console.error("Assistant JOJ : appel API échoué, repli local.", erreur);
    return reponseDemo(message);
  }
}

export default function ChatbotAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showComet, setShowComet] = useState(false);
  const [messages, setMessages] = useState([MESSAGE_ACCUEIL]);
  const [saisie, setSaisie] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const finDesMessagesRef = useRef(null);

  useEffect(() => {
    const showT = setTimeout(() => setShowGreeting(true), 1800);
    const hideT = setTimeout(() => setShowGreeting(false), 7500);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  useEffect(() => {
    finDesMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, envoiEnCours]);

  const cometParticles = useMemo(() => {
    return Array.from({ length: 34 }).map((_, i) => {
      const t = i / 34;
      return {
        id: i,
        color: JOJ_COLORS[i % JOJ_COLORS.length],
        r: 0.55 + Math.random() * 1.15 * (1 - t * 0.5),
        opacity: 0.85 - t * 0.55 + Math.random() * 0.1,
        begin: t * 1.35 + Math.random() * 0.05,
        twinkleDur: 0.4 + Math.random() * 0.5,
      };
    });
  }, []);

  const toggleChat = () => {
    setShowGreeting(false);
    setShowComet(true);
    setTimeout(() => setIsChatOpen((prev) => !prev), 350);
    setTimeout(() => setShowComet(false), 4900);
  };

  const envoyer = async (texte) => {
    const contenu = texte.trim();
    if (!contenu || envoiEnCours) return;

    const historique = messages.map((m) => ({ role: m.role, contenu: m.contenu }));
    const messageUtilisateur = { role: "user", contenu };
    setMessages((prev) => [...prev, messageUtilisateur]);
    setSaisie("");
    setEnvoiEnCours(true);

    const reponse = await envoyerMessage(contenu, historique);
    setMessages((prev) => [...prev, { role: "assistant", contenu: reponse }]);
    setEnvoiEnCours(false);
  };

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    envoyer(saisie);
  };

  return (
    <>
      <style>{`
        @keyframes bubblePop {
          0% { opacity: 0; transform: translateY(6px) scale(0.9); }
          10%, 85% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(6px) scale(0.95); }
        }
        .chatbot-bubble-pop { animation: bubblePop 5.6s ease-in-out forwards; }

        @keyframes chatbotWarmGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217,93,39,0.45), 0 8px 24px rgba(0,0,0,0.18); }
          50% { box-shadow: 0 0 0 10px rgba(217,93,39,0), 0 8px 28px rgba(217,93,39,0.28); }
        }
        .chatbot-warm-glow { animation: chatbotWarmGlow 2.6s ease-in-out infinite; }

        @keyframes chatbotTypingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
        .chatbot-typing-dot { animation: chatbotTypingDot 1.1s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .chatbot-bubble-pop, .chatbot-warm-glow, .chatbot-typing-dot { animation: none !important; }
        }
      `}</style>

      {/* Comète plein écran, déclenchée à l'ouverture/fermeture du chat */}
      {showComet && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <filter id="chatbotCometGlow" x="-300%" y="-300%" width="700%" height="700%">
                <feGaussianBlur stdDeviation="1.1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {cometParticles.map((p) => (
              <circle key={p.id} r={p.r} fill={p.color} filter="url(#chatbotCometGlow)">
                <animateMotion dur="2.4s" begin={`${p.begin}s`} fill="freeze" path={COMET_PATH} />
                <animate
                  attributeName="opacity"
                  values={`0;${p.opacity};${p.opacity * 0.6};0`}
                  keyTimes="0;0.12;0.7;1"
                  dur="2.4s"
                  begin={`${p.begin}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="r"
                  values={`${p.r * 0.4};${p.r};${p.r * 0.3}`}
                  dur={`${p.twinkleDur}s`}
                  begin={`${p.begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            <g filter="url(#chatbotCometGlow)">
              <circle r="2.6" fill="#FFF3CE" opacity="0.55">
                <animateMotion dur="2.4s" begin="0s" fill="freeze" path={COMET_PATH} />
              </circle>
              <polygon points="0,-3.4 0.9,-0.9 3.4,0 0.9,0.9 0,3.4 -0.9,0.9 -3.4,0 -0.9,-0.9" fill="#FFFDF6">
                <animateMotion dur="2.4s" begin="0s" fill="freeze" path={COMET_PATH} />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.08;0.85;1"
                  dur="2.4s"
                  begin="0s"
                  fill="freeze"
                />
              </polygon>
            </g>
          </svg>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {showGreeting && !isChatOpen && (
          <button
            onClick={toggleChat}
            className="bg-white shadow-xl border border-gray-100 rounded-2xl rounded-br-sm px-4 py-2.5 text-xs font-semibold text-gray-800 chatbot-bubble-pop text-left max-w-[200px]"
          >
            Besoin d'un coup de patte ? 🐾
          </button>
        )}

        <button
          aria-label="Assistant virtuel JOJ 2026"
          onClick={toggleChat}
          className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 chatbot-warm-glow bg-gradient-to-br from-[#FCB131] via-[#D95D27] to-[#EE334E] p-[3px]"
        >
          <span className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
            {isChatOpen ? (
              <X className="w-6 h-6 text-[#D95D27]" />
            ) : (
              <img
                src={mascotteLion}
                alt=""
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
          <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-black animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
              <img
                src={mascotteLion}
                alt=""
                className="w-10 h-10 rounded-full object-cover bg-[#FCB131]/20 border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-black leading-tight">Assistant JOJ_Events</h3>
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] inline-block" />
                  Concierge digital • Dakar 2026
                </p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-[#D95D27] transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 h-72 overflow-y-auto bg-[#F8F9FA] text-xs space-y-3">
              {messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div key={i} className="flex items-start gap-2 max-w-[90%]">
                    <img src={mascotteLion} alt="" className="w-6 h-6 rounded-full object-cover mt-0.5 shrink-0" />
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-2xs whitespace-pre-line">
                      {m.contenu}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="bg-[#D95D27] text-white p-3 rounded-2xl rounded-br-sm max-w-[85%] shadow-2xs whitespace-pre-line">
                      {m.contenu}
                    </div>
                  </div>
                )
              )}

              {envoiEnCours && (
                <div className="flex items-start gap-2">
                  <img src={mascotteLion} alt="" className="w-6 h-6 rounded-full object-cover mt-0.5 shrink-0" />
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-2xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 chatbot-typing-dot" style={{ animationDelay: "0s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 chatbot-typing-dot" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 chatbot-typing-dot" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={finDesMessagesRef} />
            </div>

            <div className="px-3 pt-2.5 pb-1 flex gap-1.5 overflow-x-auto no-scrollbar bg-white border-t border-gray-100">
              {QUICK_REPLIES.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => envoyer(label)}
                  disabled={envoiEnCours}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] border border-gray-200 rounded-full text-[10px] font-semibold text-gray-700 hover:border-[#D95D27] hover:text-[#D95D27] transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={soumettreFormulaire} className="p-3 bg-white flex items-center gap-2">
              <button type="button" className="text-gray-400 hover:text-[#D95D27] transition-colors shrink-0" aria-label="Joindre un fichier">
                <Paperclip className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-center bg-[#F8F9FA] rounded-full px-4 py-2 gap-2">
                <input
                  type="text"
                  value={saisie}
                  onChange={(e) => setSaisie(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-transparent text-xs focus:outline-none"
                  disabled={envoiEnCours}
                />
                <Smile className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
              <button
                type="submit"
                disabled={envoiEnCours || !saisie.trim()}
                className="p-2.5 bg-[#D95D27] text-white rounded-xl hover:bg-[#c04e1e] transition-colors shrink-0 disabled:opacity-50"
                aria-label="Envoyer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}