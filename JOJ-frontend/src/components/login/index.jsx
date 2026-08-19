import FormulaireConnexion from "./FormulaireConnexion";
import ImageConnexion from "./ImageConnexion";

function Login() {
  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-white">
      {/* Partie gauche */}
      <section className="flex min-h-screen w-[57.5%] items-center justify-center">
        <FormulaireConnexion />
      </section>

      {/* Partie droite */}
      <ImageConnexion />
    </main>
  );
}

export default Login;
