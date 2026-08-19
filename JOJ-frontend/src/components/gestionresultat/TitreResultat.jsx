import { useNavigate } from "react-router-dom";

function TitreResultat() {
  const navigate = useNavigate();

  return (
    <section className="flex items-end justify-between">
      <div>
        <h1 className="text-[30px] leading-[31px] font-extrabold tracking-[-0.7px] text-[#111214]">
          Gestion des Résultats
        </h1>
        <p className="mt-[5px] text-[14px] leading-[17px] text-[#68717e]">
          Consultez, modifiez et publiez les résultats de toutes les compétitions.
        </p>
      </div>

      <button
        onClick={() => navigate("/register-result")}
        className="h-[45px] px-[20px] cursor-pointer rounded-[8px] bg-[#d96814] text-white text-[14px] font-semibold flex items-center gap-[8px]"
      >
        <span className="text-lg font-normal leading-none">+</span>
        Créer un résultat
      </button>
    </section>
  );
}

export default TitreResultat;
