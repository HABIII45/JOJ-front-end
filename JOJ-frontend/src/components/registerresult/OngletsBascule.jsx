function OngletsBascule({ ongletActif, setOngletActif }) {
  return (
    <div className="p-1 mb-10 bg-black rounded-3xl inline-flex justify-center items-start overflow-hidden">
      {/* Individuel */}
      <button
        onClick={() => setOngletActif("individuel")}
        className={`px-6 cursor-pointer py-2.5 rounded-[20px] flex justify-center items-center overflow-hidden transition-all ${
          ongletActif === "individuel"
            ? "bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]"
            : ""
        }`}
      >
        <span
          className={`text-sm font-['Inter'] ${
            ongletActif === "individuel"
              ? "text-zinc-900 font-semibold"
              : "text-zinc-500 font-medium"
          }`}
        >
          Individuel
        </span>
      </button>

      {/* Collectif */}
      <button
        onClick={() => setOngletActif("collectif")}
        className={`px-6 cursor-pointer py-2.5 rounded-[20px] flex justify-center items-center overflow-hidden transition-all ${
          ongletActif === "collectif"
            ? "bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]"
            : ""
        }`}
      >
        <span
          className={`text-sm font-['Inter'] ${
            ongletActif === "collectif"
              ? "text-zinc-900 font-semibold"
              : "text-zinc-500 font-medium"
          }`}
        >
          Collectif
        </span>
      </button>
    </div>
  );
}

export default OngletsBascule;
