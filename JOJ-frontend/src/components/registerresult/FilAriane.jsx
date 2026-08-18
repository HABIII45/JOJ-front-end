function FilAriane({ modeEdition = false }) {
  return (
    <div className="mb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-500">Événements</span>
        <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm font-medium text-gray-500">Résultats</span>
        {modeEdition && (
          <>
            <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm font-medium text-[#c85f18]">Détail</span>
          </>
        )}
        {!modeEdition && (
          <>
            <svg className="w-2.5 h-2.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm font-medium text-[#c85f18]">Nouveau</span>
          </>
        )}
      </div>

      {/* Titre */}
      <h1 className="text-[32px] font-medium text-black leading-[48px] mb-0">
        Résultats de l'événement
      </h1>
      <p className="text-base font-medium text-gray-400 m-0">
        {modeEdition
          ? "Consultez et modifiez les résultats de cette épreuve."
          : "Gérez et publiez les classements officiels de la compétition."}
      </p>
    </div>
  );
}

export default FilAriane;
