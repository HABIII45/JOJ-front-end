import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  FiUploadCloud,
  FiPlus,
  FiCalendar,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiMenu,
  FiLink,
  FiImage,
  FiX,
} from "react-icons/fi";

import {
  creerActualite,
  getActualite,
  getEvenements,
  modifierActualite,
} from "../../services/actualite";
import { getImageUrl } from "../../api/api";

import "./actualites.css";

function idEvenement(evenementLie) {
  if (evenementLie == null) return "";
  if (typeof evenementLie === "object") return String(evenementLie.id ?? "");
  return String(evenementLie);
}

function toDatetimeLocal(valeur) {
  if (!valeur) return "";
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function CreerActualite() {
  const navigate = useNavigate();
  const { id } = useParams();
  const estEdition = Boolean(id);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [evenement, setEvenement] = useState("");
  const [brouillon, setBrouillon] = useState(true);
  const [datePublication, setDatePublication] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chargementArticle, setChargementArticle] = useState(estEdition);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const contenuCharge = useRef(false);

  useEffect(() => {
    const chargerEvenements = async () => {
      try {
        const data = await getEvenements();
        setEvenements(data.results || data);
      } catch (error) {
        console.error("Impossible de charger les événements");
      }
    };

    chargerEvenements();
  }, []);

  useEffect(() => {
    if (!estEdition) {
      setChargementArticle(false);
      return;
    }

    let ignore = false;
    contenuCharge.current = false;
    setChargementArticle(true);

    (async () => {
      try {
        const data = await getActualite(id);
        if (ignore) return;
        setTitre(data.titre || "");
        setDescription(data.description || "");
        setEvenement(idEvenement(data.evenement_lie));
        setBrouillon(Boolean(data.brouillon));
        setDatePublication(toDatetimeLocal(data.date_publication));
        setImage(null);
        setPreviewImage(getImageUrl(data.image));
      } catch {
        if (!ignore) {
          alert("Actualité introuvable.");
          navigate("/admin/actualites");
        }
      } finally {
        if (!ignore) setChargementArticle(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [estEdition, id, navigate]);

  useEffect(() => {
    if (estEdition && !chargementArticle && editorRef.current && !contenuCharge.current) {
      editorRef.current.innerHTML = description || "";
      contenuCharge.current = true;
    }
  }, [estEdition, chargementArticle, description]);

  // Gestion de l'image
  const handleImageChange = (file) => {
    if (!file) return;

    const typesAutorises = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!typesAutorises.includes(file.type)) {
      alert("Veuillez sélectionner une image PNG, JPG ou WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 MB.");
      return;
    }

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const supprimerImage = () => {
    setImage(null);
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  // Toolbar de l'éditeur
  const execCommand = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  const ajouterLien = () => {
    const url = prompt("Entrez le lien :");

    if (url) {
      document.execCommand("createLink", false, url);
    }

    editorRef.current?.focus();
  };

  // Publication
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre.trim()) {
      alert("Veuillez saisir le titre de l'article.");
      return;
    }

    if (!description.trim()) {
      alert("Veuillez ajouter le contenu de l'article.");
      return;
    }

    if (!evenement) {
      alert("Veuillez lier l'article à un événement.");
      return;
    }

    if (!brouillon && !datePublication) {
      alert("La date de publication est obligatoire pour un article publié.");
      return;
    }

    const formData = new FormData();

    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("brouillon", brouillon);
    formData.append("evenement_lie", evenement);

    if (datePublication) {
      formData.append("date_publication", new Date(datePublication).toISOString());
    }

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (estEdition) {
        await modifierActualite(id, formData);
        alert(
          brouillon
            ? "Brouillon mis à jour."
            : "Actualité mise à jour avec succès."
        );
        navigate("/admin/actualites");
        return;
      }

      await creerActualite(formData);

      alert(
        brouillon
          ? "Actualité enregistrée comme brouillon !"
          : "Actualité publiée avec succès !"
      );

      setTitre("");
      setDescription("");
      setEvenement("");
      setBrouillon(true);
      setDatePublication("");
      supprimerImage();

      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    } catch (error) {
      alert(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <AdminLayout>
    <main className="create-news-page">
      <div className="create-news-content">
        {/* HEADER */}
        <div className="page-header">
          <h1>{estEdition ? "Modifier l'actualité" : "Créer une Actualité"}</h1>

          <p>
            {estEdition
              ? "Mettez à jour le contenu, l'image et les paramètres de publication."
              : "Remplissez les détails pour publier un nouvel article sur la plateforme."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="actualite-form">
          {chargementArticle ? (
            <p className="text-sm text-slate-500">Chargement de l'article...</p>
          ) : (
          <div className="form-layout">

            {/* PARTIE GAUCHE */}
            <section className="form-main">

              {/* TITRE */}
              <div className="form-group">
                <label>TITRE DE L'ARTICLE</label>

                <input
                  type="text"
                  placeholder="Entrez le titre accrocheur de votre article..."
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                />
              </div>

              {/* IMAGE */}
              <div className="form-group">
                <label>IMAGE À LA UNE</label>

                <div
                  className="upload-zone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={(e) =>
                      handleImageChange(e.target.files[0])
                    }
                    hidden
                  />

                  {!previewImage ? (
                    <>
                      <div className="upload-icon">
                        <FiUploadCloud />
                      </div>

                      <h3>
                        Cliquez pour télécharger ou glissez-déposez
                      </h3>

                      <p>PNG, JPG ou WEBP (Max. 5MB)</p>

                      <button
                        type="button"
                        className="browse-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Parcourir les fichiers
                      </button>
                    </>
                  ) : (
                    <div className="image-preview">
                      <img
                        src={previewImage}
                        alt="Prévisualisation"
                      />

                      <button
                        type="button"
                        className="remove-image"
                        onClick={(e) => {
                          e.stopPropagation();
                          supprimerImage();
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CONTENU */}
              <div className="form-group content-group">
                <label>CONTENU DE L'ARTICLE</label>

                <div className="editor">
                  <div className="editor-toolbar">
                    <button
                      type="button"
                      onClick={() => execCommand("bold")}
                    >
                      <FiBold />
                    </button>

                    <button
                      type="button"
                      onClick={() => execCommand("italic")}
                    >
                      <FiItalic />
                    </button>

                    <button
                      type="button"
                      onClick={() => execCommand("underline")}
                    >
                      <FiUnderline />
                    </button>

                    <span className="toolbar-divider"></span>

                    <button
                      type="button"
                      onClick={() =>
                        execCommand("insertUnorderedList")
                      }
                    >
                      <FiList />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        execCommand("insertOrderedList")
                      }
                    >
                      <  FiMenu
 />
                    </button>

                    <span className="toolbar-divider"></span>

                    <button
                      type="button"
                      onClick={() =>
                        execCommand("createLink")
                      }
                    >
                      <FiLink />
                    </button>

                    <button type="button">
                      <FiImage />
                    </button>
                  </div>

                  <div
                    ref={editorRef}
                    className="editor-content"
                    contentEditable
                    data-placeholder="Commencez à rédiger votre contenu ici..."
                    onInput={(e) =>
                      setDescription(e.currentTarget.innerHTML)
                    }
                  ></div>
                </div>
              </div>
            </section>

            {/* PARTIE DROITE */}
            <aside className="publication-side">

              <div className="publication-settings">
                <h3>PARAMÈTRES DE PUBLICATION</h3>

                {/* EVENEMENT */}
                <div className="side-group">
                  <label>Événement</label>

                  <select
                    value={evenement}
                    onChange={(e) => setEvenement(e.target.value)}
                  >
                    <option value="">
                      Choisir un événement
                    </option>

                    {evenements.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nom || item.titre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STATUT */}
                <div className="side-group">
                  <label>Statut</label>

                  <div className="status-buttons">
                    <button
                      type="button"
                      className={brouillon ? "active" : ""}
                      onClick={() => setBrouillon(true)}
                    >
                      Brouillon
                    </button>

                    <button
                      type="button"
                      className={!brouillon ? "active" : ""}
                      onClick={() => setBrouillon(false)}
                    >
                      Publié
                    </button>
                  </div>
                </div>

                {/* DATE */}
                <div className="side-group">
                  <label>Date de publication</label>

                  <div className="date-input">
                    <FiCalendar />

                    <input
                      type="datetime-local"
                      value={datePublication}
                      onChange={(e) =>
                        setDatePublication(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="actions">
                <button
                  type="submit"
                  className="publish-button"
                  disabled={loading}
                >
                  <FiPlus />

                  {loading
                    ? estEdition
                      ? "Enregistrement..."
                      : "Publication..."
                    : estEdition
                    ? "Enregistrer les modifications"
                    : brouillon
                    ? "Enregistrer le brouillon"
                    : "Publier l'article"}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate("/admin/actualites")}
                >
                  Annuler
                </button>
              </div>
            </aside>
          </div>
          )}
        </form>
      </div>
    </main>
    </AdminLayout>

  );
}