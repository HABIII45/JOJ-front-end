
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import "./Footer.css";
import JOJlogo from "../../assets/images/JOJlogo.jpg";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="footer">

            
            <div className="footer-content">

                
                <div className="footer-info">
                    <div className="logo-title">
                        <img src={JOJlogo} alt="logo" />
                        <h2>JOJ_Events</h2>
                    </div>

                    <div className="description">
                        <p>
                            Le portail officiel pour les sites et événements
                            des Jeux Olympiques de la Jeunesse 2026.
                        </p>
                    </div>
                </div>

                
                <div className="navigation">
                    <h3>Navigation</h3>
                 
                        <Link to="/contact">Contact</Link>
                        <Link to="/presse">Presse</Link>
                        <Link to="/aide">Aide</Link>
                </div>

                
                <div className="resaux">
                    <h3>Suivez-nous</h3>

                    <div className="social-icons">
                        <FaFacebook />
                        <FaInstagram />
                        <FaLinkedin />
                        <FaYoutube />
                    </div>
                </div>

            </div>

            
            <div className="footer-bottom">

                
                <div className="slogan">
                    <p>VIBRONS AU RYTHME DE L'AFRIQUE</p>
                </div>

                
                <div className="copyright">
                    <p>© 2026 JOJ EVENT</p>
                    <small>Tous droits réservés</small>
                </div>

            </div>

        </footer>
    );
}