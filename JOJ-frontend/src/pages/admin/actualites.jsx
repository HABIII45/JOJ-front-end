import { useEffect, useRef, useState } from "react";
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
  getEvenements,
} from "../../services/actualite";

import "./actualites.css";

export default function CreerActualite() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [evenement, setEvenement] = useState("");
  const [brouillon, setBrouillon] = useState(true);
  const [datePublication, setDatePublication] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Charger les événements
  useEffect(() => {
    const chargerEvenements = async () => {
      try {
        const data = await getEvenements();

        // Au cas où ton API est paginée
        setEvenements(data.results || data);
      } catch (error) {
        console.error("Impossible de charger les événements");
      }
    };

    chargerEvenements();
  }, []);

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

    const formData = new FormData();

    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("brouillon", brouillon);

    if (evenement) {
      formData.append("evenement_lie", evenement);
    }

    if (datePublication) {
      formData.append("date_publication", datePublication);
    }

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      await creerActualite(formData);

      alert(
        brouillon
          ? "Actualité enregistrée comme brouillon !"
          : "Actualité publiée avec succès !"
      );

      // Réinitialisation
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
          <h1>Créer une Actualité</h1>

          <p>
            Remplissez les détails pour publier un nouvel article sur la
            plateforme.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="actualite-form">
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
                      onClick={ajouterLien}
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
                    ? "Publication..."
                    : brouillon
                    ? "Enregistrer le brouillon"
                    : "Publier l'article"}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => window.history.back()}
                >
                  Annuler
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
    </AdminLayout>

  );
}