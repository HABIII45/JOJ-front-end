// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   CalendarDays,
//   Clock,
//   MapPin,
//   Tags,
//   Image as ImageIcon,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   Trophy,
// } from "lucide-react";
// import AdminLayout from "../../components/layouts/AdminLayout";
// import api, { getImageUrl } from "../../api/api";
// import { getAllSites } from "../../services/sites";

// export function FormEvent() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const estEdition = Boolean(id);

//   const [categories, setCategories] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // Form State
//   const [titre, setTitre] = useState("");
//   const [categorie, setCategorie] = useState("");
//   const [site, setSite] = useState("");
//   const [date, setDate] = useState("");
//   const [heure, setHeure] = useState("");
//   const [description, setDescription] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imageApercu, setImageApercu] = useState(null);

//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("success");
//   const [erreurs, setErreurs] = useState({});

//   // 1. Charger les catégories et sites réels de la base de données
//   useEffect(() => {
//     const fetchSelectOptions = async () => {
//       try {
//         const [catsRes, sitesList] = await Promise.all([
//           api.get("/api/categories/?page_size=100"),
//           getAllSites(),
//         ]);

//         const dataCats = catsRes.data;
//         setCategories(Array.isArray(dataCats) ? dataCats : dataCats.results ?? []);
//         setSites(sitesList || []);
//       } catch (err) {
//         console.error("Erreur chargement listes :", err);
//       }
//     };

//     fetchSelectOptions();
//   }, []);

//   // 2. Si mode édition : pré-remplir les informations réelles de l'événement
//   useEffect(() => {
//     const chargerEvenement = async () => {
//       if (!estEdition) {
//         setLoadingInitial(false);
//         return;
//       }

//       try {
//         setLoadingInitial(true);
//         const res = await api.get(`/api/events/${id}/`);
//         const ev = res.data;

//         if (ev) {
//           setTitre(ev.titre || "");
//           setCategorie(
//             typeof ev.categorie === "object" ? ev.categorie?.id || "" : ev.categorie || ""
//           );
//           setSite(typeof ev.site === "object" ? ev.site?.id || "" : ev.site || "");
//           setDate(ev.date || "");
//           setHeure(ev.heure ? ev.heure.slice(0, 5) : "");
//           setDescription(ev.description || "");

//           if (ev.image) {
//             setImageApercu(getImageUrl(ev.image));
//           }
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération de l'événement :", err);
//         alert("Impossible de charger les données de cet événement.");
//         navigate("/admin/evenements");
//       } finally {
//         setLoadingInitial(false);
//       }
//     };

//     chargerEvenement();
//   }, [estEdition, id, navigate]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImageApercu(URL.createObjectURL(file));
//     }
//   };

//   const valider = () => {
//     const err = {};
//     if (!titre.trim()) err.titre = "Le titre de l'épreuve est obligatoire.";
//     if (!categorie) err.categorie = "Veuillez sélectionner une catégorie.";
//     if (!site) err.site = "Veuillez sélectionner un site olympique.";
//     if (!date) err.date = "Veuillez sélectionner une date.";
//     if (!heure) err.heure = "Veuillez définir une heure.";
//     setErreurs(err);
//     return Object.keys(err).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!valider()) return;

//     try {
//       setSubmitting(true);
//       setMessage("");

//       const formData = new FormData();
//       formData.append("titre", titre.trim());
//       formData.append("categorie", Number(categorie));
//       formData.append("site", Number(site));
//       formData.append("date", date);
//       formData.append("heure", heure.length === 5 ? `${heure}:00` : heure);
//       formData.append("description", description.trim());

//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       if (estEdition) {
//         // Envoi PATCH ou PUT vers le backend Django
//         await api.patch(`/api/events/${id}/`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setMessageType("success");
//         setMessage("Événement modifié avec succès !");
//       } else {
//         // Envoi POST vers le backend Django
//         await api.post("/api/events/", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setMessageType("success");
//         setMessage("Événement créé avec succès !");
//       }

//       setTimeout(() => {
//         navigate("/admin/evenements");
//       }, 1000);
//     } catch (err) {
//       console.error("Erreur enregistrement événement :", err);
//       setMessageType("error");
//       const errData = err.response?.data;
//       if (errData) {
//         const errorMsg = Object.values(errData).flat().join(" ");
//         setMessage(errorMsg || "Une erreur est survenue lors de l'enregistrement.");
//       } else {
//         setMessage("Impossible de joindre le serveur.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loadingInitial) {
//     return (
//       <AdminLayout>
//         <div className="py-24 text-center text-gray-400">
//           <Loader2 className="w-8 h-8 animate-spin text-[#C25B1E] mx-auto mb-3" />
//           <p className="text-sm font-semibold">Chargement des données de l'événement...</p>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <div className="max-w-4xl mx-auto space-y-6">
//         <button
//           type="button"
//           className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
//           onClick={() => navigate("/admin/evenements")}
//         >
//           <ArrowLeft size={15} /> Retour aux événements
//         </button>

//         <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
//               <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C25B1E] flex items-center justify-center shrink-0">
//                 <CalendarDays size={20} />
//               </div>
//               {estEdition ? `Modifier l'événement : ${titre || "..."}` : "Créer un nouvel événement"}
//             </h1>
//             <p className="text-xs sm:text-sm text-gray-400 mt-1">
//               {estEdition
//                 ? "Modifiez les paramètres de cette compétition sportive et enregistrez vos changements."
//                 : "Configurez les détails, le site, la date et les informations de l'épreuve."}
//             </p>
//           </div>

//           {message && (
//             <div
//               className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border ${
//                 messageType === "success"
//                   ? "bg-emerald-50 text-emerald-800 border-emerald-200"
//                   : "bg-red-50 text-red-800 border-red-200"
//               }`}
//             >
//               {messageType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
//               <span>{message}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Titre de l'épreuve */}
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-2">
//                 Titre de l'épreuve / Match *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={titre}
//                 onChange={(e) => setTitre(e.target.value)}
//                 placeholder="Ex: Finale 100m Hommes, Sénégal vs France (Basket)..."
//                 className={`w-full text-xs sm:text-sm p-3.5 bg-gray-50 border rounded-2xl focus:border-[#C25B1E] outline-none transition-all ${
//                   erreurs.titre ? "border-red-400" : "border-gray-200"
//                 }`}
//               />
//               {erreurs.titre && <p className="text-xs text-red-500 mt-1.5">{erreurs.titre}</p>}
//             </div>

//             {/* Catégorie & Site */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
//                   <Tags size={14} className="text-[#C25B1E]" />
//                   Catégorie Sportive *
//                 </label>
//                 <select
//                   required
//                   value={categorie}
//                   onChange={(e) => setCategorie(e.target.value)}
//                   className={`w-full text-xs sm:text-sm p-3.5 bg-gray-50 border rounded-2xl focus:border-[#C25B1E] outline-none transition-all ${
//                     erreurs.categorie ? "border-red-400" : "border-gray-200"
//                   }`}
//                 >
//                   <option value="">Sélectionner une catégorie</option>
//                   {categories.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.nom} {c.discipline_nom ? `(${c.discipline_nom})` : ""}
//                     </option>
//                   ))}
//                 </select>
//                 {erreurs.categorie && <p className="text-xs text-red-500 mt-1.5">{erreurs.categorie}</p>}
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
//                   <MapPin size={14} className="text-[#C25B1E]" />
//                   Site Olympique d'accueil *
//                 </label>
//                 <select
//                   required
//                   value={site}
//                   onChange={(e) => setSite(e.target.value)}
//                   className={`w-full text-xs sm:text-sm p-3.5 bg-gray-50 border rounded-2xl focus:border-[#C25B1E] outline-none transition-all ${
//                     erreurs.site ? "border-red-400" : "border-gray-200"
//                   }`}
//                 >
//                   <option value="">Sélectionner un site</option>
//                   {sites.map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.nom} ({s.ville || s.region || "Dakar"})
//                     </option>
//                   ))}
//                 </select>
//                 {erreurs.site && <p className="text-xs text-red-500 mt-1.5">{erreurs.site}</p>}
//               </div>
//             </div>

//             {/* Date & Heure */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
//                   <CalendarDays size={14} className="text-[#C25B1E]" />
//                   Date de l'épreuve *
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className={`w-full text-xs sm:text-sm p-3.5 bg-gray-50 border rounded-2xl focus:border-[#C25B1E] outline-none transition-all ${
//                     erreurs.date ? "border-red-400" : "border-gray-200"
//                   }`}
//                 />
//                 {erreurs.date && <p className="text-xs text-red-500 mt-1.5">{erreurs.date}</p>}
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
//                   <Clock size={14} className="text-[#C25B1E]" />
//                   Heure de début (GMT) *
//                 </label>
//                 <input
//                   type="time"
//                   required
//                   value={heure}
//                   onChange={(e) => setHeure(e.target.value)}
//                   className={`w-full text-xs sm:text-sm p-3.5 bg-gray-50 border rounded-2xl focus:border-[#C25B1E] outline-none transition-all ${
//                     erreurs.heure ? "border-red-400" : "border-gray-200"
//                   }`}
//                 />
//                 {erreurs.heure && <p className="text-xs text-red-500 mt-1.5">{erreurs.heure}</p>}
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-2">
//                 Description & Programme
//               </label>
//               <textarea
//                 rows={4}
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Détails du match, phases de poule ou finale, protocole..."
//                 className="w-full text-xs sm:text-sm p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#C25B1E] outline-none transition-all"
//               />
//             </div>

//             {/* Image de l'événement */}
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
//                 <ImageIcon size={14} className="text-[#C25B1E]" />
//                 Illustration / Photo de l'événement
//               </label>

//               {imageApercu && (
//                 <div className="mb-3 w-40 h-28 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm relative">
//                   <img src={imageApercu} alt="Aperçu" className="w-full h-full object-cover" />
//                 </div>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-2xl file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#C25B1E] file:text-white hover:file:bg-[#A04816] cursor-pointer"
//               />
//             </div>

//             {/* Actions */}
//             <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => navigate("/admin/evenements")}
//                 className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
//               >
//                 Annuler
//               </button>

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="px-8 py-3 bg-[#C25B1E] hover:bg-[#A04816] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2 size={16} className="animate-spin" />
//                     Enregistrement...
//                   </>
//                 ) : estEdition ? (
//                   "Modifier l'événement"
//                 ) : (
//                   "Créer l'événement"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

// export default FormEvent;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import FormEventIndividuel from "./EventsIndividuel";
import FormEventCollectif from "./EventsCollectif";
import "./Events.css";

export function FormEvent() {
  const [typeEvenement, setTypeEvenement] = useState("individuel");
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} /> Retour aux événements
        </button>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Créer un nouvel événement
          </h2>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            Configurez les détails, le site, la date et les participants de l'épreuve.
          </p>

          {/* SÉLECTEUR TYPE D'ÉVÉNEMENT */}
          <div className="inline-flex p-1 rounded-2xl bg-gray-100 mb-8">
            <button
              type="button"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeEvenement === "individuel"
                  ? "bg-[#C25B1E] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setTypeEvenement("individuel")}
            >
              Épreuve Individuelle
            </button>

            <button
              type="button"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeEvenement === "collectif"
                  ? "bg-[#C25B1E] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setTypeEvenement("collectif")}
            >
              Épreuve Collective
            </button>
          </div>

          {/* FORMULAIRE INDIVIDUEL OU COLLECTIF */}
          {typeEvenement === "individuel" ? (
            <FormEventIndividuel />
          ) : (
            <FormEventCollectif />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default FormEvent;