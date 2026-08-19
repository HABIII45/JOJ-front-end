import { Routes, Route,Navigate } from "react-router-dom";
import FormEvent from "../pages/admin/EventForm";
import { GestionEvents } from "../pages/admin/GestionEvents";


export function AppRoutes() {
    return (
        <Routes>
            {/* <Route
                path="/"
                element={<Navigate to="/events" replace />}/> */}
            <Route path="/" element={<Navigate to="/events" replace />} />
            <Route path="/events" element={<GestionEvents />}/>
            <Route path="/events/create" element={<FormEvent />}/>
        </Routes>
    );
}

export default AppRoutes;