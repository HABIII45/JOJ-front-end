const API_URL = "http://127.0.0.1:8000/api";

//recuperer la liste des evenements
export async function getEvents(params = {}) {

    const queryParams = new URLSearchParams();

    if (params.recherche) {
        queryParams.append("recherche", params.recherche);
    }

    if (params.page) {
        queryParams.append("page", params.page);
    }

    const response = await fetch(
        `http://127.0.0.1:8000/api/events/?${queryParams.toString()}`
    );

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des événements");
    }

    return await response.json();
}

// Récupérer les catégories
export async function getCategories() {
    const response = await fetch(`${API_URL}/categories/`);

    if (!response.ok) {
        throw new Error(
            "Erreur lors de la récupération des catégories"
        );
    }

    return response.json();
}


// Récupérer les sites
export async function getSites() {
    const response = await fetch(`${API_URL}/sites/`);

    if (!response.ok) {
        throw new Error(
            "Erreur lors de la récupération des sites"
        );
    }

    return response.json();
}


// Récupérer les compétiteurs
export async function getCompetiteurs() {
    const response = await fetch(`${API_URL}/competiteurs/`);

    if (!response.ok) {
        throw new Error(
            "Erreur lors de la récupération des compétiteurs"
        );
    }

    return response.json();
}


// Créer un événement
export async function createEvent(eventData) {
    const response = await fetch(`${API_URL}/events/`, {
        method: "POST",
        body: eventData
    });

    if (!response.ok) {
        const errorData = await response.json();

        console.error("Erreur backend :", errorData);

        throw new Error(
            "Erreur lors de la création de l'événement"
        );
    }

    return response.json();
}