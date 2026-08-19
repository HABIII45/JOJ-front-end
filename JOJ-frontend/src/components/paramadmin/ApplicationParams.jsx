import { useState } from "react";

function ApplicationParams() {
  const [maintenance, setMaintenance] = useState(false);

  return (
    <section className="w-[20rem] mt-[21px] bg-white border border-[#e1e4e8] rounded-[20px] pb-5">
      <div className="px-[20px] pt-[20px]">

        {/* En-tête */}
        <div className="flex items-center gap-[9px]">
          <div className="w-[28px] h-[28px] rounded-[8px] bg-[#f7efff] flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="#8b3ee6" strokeWidth="2">
              <path d="M12 3v4" />
              <path d="M12 17v4" />
              <path d="m4.9 4.9 2.8 2.8" />
              <path d="m16.3 16.3 2.8 2.8" />
              <path d="M3 12h4" />
              <path d="M17 12h4" />
              <path d="m4.9 19.1 2.8-2.8" />
              <path d="m16.3 7.7 2.8-2.8" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h2 className="m-0 text-lg font-semibold">Application</h2>
        </div>

        {/* Toggle maintenance */}
        <div className="mt-[14px] flex items-center justify-between">
          <div>
            <p className="m-0 text-sm font-medium">Mode Maintenance</p>
            <p className="m-0 mt-[1px] text-xs text-[#8b939e]">Rendre le site inaccessible</p>
          </div>

          <button
            type="button"
            onClick={() => setMaintenance((v) => !v)}
            aria-pressed={maintenance}
            className={`w-[32px] h-[17px] cursor-pointer rounded-full p-[2px] box-border flex items-center transition-colors ${
              maintenance ? "bg-[#d96814]" : "bg-[#e2e5e9]"
            }`}
          >
            <span
              className={`w-[13px] h-[13px] rounded-full bg-white block transition-transform ${
                maintenance ? "translate-x-[15px]" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-[#eef0f2] mt-[17px]" />

        {/* Langue */}
        <div className="mt-[13px]">
          <label className="block mb-[6px] text-xs tracking-[1.5px] text-[#8e97a3] uppercase">
            Langue de l'interface
          </label>
          <div className="h-[38px] rounded-[8px] border border-[#e0e4e8] bg-[#f8f9fa] flex items-center px-[10px] text-sm text-[#30343a]">
            Français (Sénégal)
          </div>
        </div>

      </div>
    </section>
  );
}

export default ApplicationParams;
