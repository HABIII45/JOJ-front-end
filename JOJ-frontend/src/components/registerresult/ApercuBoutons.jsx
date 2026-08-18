import avantage from "../../assets/images/avantage.svg";

function ApercuBoutons() {
  return (
    <div className="w-[373px]">
      {/* Aperçu recommandé */}
      <div className="bg-white h-[13rem] rounded-3xl border border-gray-100 shadow-sm p-3 mb-6">
        <div className="text-xs font-medium text-gray-500 tracking-[0.60px] mb-4">
          APERÇU RECOMMANDÉ
        </div>
        <div className="h-[120px] bg-gray-200 rounded-xl overflow-hidden">
          <img
            src={avantage}
            alt="aperçu"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-4">
        <button className="px-8 cursor-pointer py-3 bg-white rounded-xl border-2 border-[#c85f18]">
          <span className="text-[#c85f18] font-medium text-base tracking-[0.27px]">
            Annuler
          </span>
        </button>
        <button className="px-8 cursor-pointer py-3.5 bg-[#c85f18] rounded-xl">
          <span className="text-white font-medium text-base tracking-[0.02px]">
            Publier les résultats
          </span>
        </button>
      </div>
    </div>
  );
}

export default ApercuBoutons;
