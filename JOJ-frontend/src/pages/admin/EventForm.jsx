
import { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import FormEventIndividuel from "./EventsIndividuel";
import FormEventCollectif from "./EventsCollectif";
import "./Events.css";
import { ArrowLeft } from "lucide-react";
import { getEvents } from "../../api/Eventapi";
import { useNavigate } from "react-router-dom";


export function FormEvent() {

    const [typeEvenement, setTypeEvenement] = useState("individuel");
    const navigate = useNavigate();
    return (
        <div className="dashboard-layout">
            
            <Sidebar />
           
            <main className="event-content">
                 <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                 <ArrowLeft size={15} /> Retour</button>
                <h2>Créer un nouveau événement </h2>
                   <p>Configurez les détails de l'épreuve</p>
                {/* TYPE D'ÉVÉNEMENT */}
                <div className="event-type">
                   
                    <button
                        type="button"
                        className={
                            typeEvenement === "individuel"
                                ? "type-btn active"
                                : "type-btn"
                        }
                        onClick={() => setTypeEvenement("individuel")}
                    >
                        Individuel
                    </button>

                    <button
                        type="button"
                        className={
                            typeEvenement === "collectif"
                                ? "type-btn active"
                                : "type-btn"
                        }
                        onClick={() => setTypeEvenement("collectif")}
                    >
                        Collectif
                    </button>

                </div>
                

                {/* FORMULAIRE */}
                {typeEvenement === "individuel" ? (
                    <FormEventIndividuel />
                ) : (
                    <FormEventCollectif />
                )}

            </main>

        </div>
    );
}

export default FormEvent;