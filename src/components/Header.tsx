import React from 'react';
import { BookOpen, Sparkles, Award, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onSelectPreset: (presetId: string) => void;
  activePresetId?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSelectPreset, activePresetId }) => {
  return (
    <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white shadow-xl relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/40 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Standar Kurikulum Merdeka & Pembelajaran Mendalam</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Generator PPM by : <span className="text-amber-300 font-serif">"PakGuruMassof"</span>
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
              Platform Cerdas Pembuat <strong>Perencanaan Pembelajaran Mendalam (PPM)</strong> Resmi untuk Semua Jenjang (SD, SMP, SMA) dan Mata Pelajaran. Menghasilkan 5 Tabel Terstruktur, Sintaks Pedagogis Sintetis, dan Ekspor Microsoft Word (.docx) Ukuran A4 Huruf Arial 11.
            </p>
          </div>

          {/* Badge Profil */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="flex items-center gap-2 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>5 Tabel Terstruktur Baku Kemendikbud</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Pilar Memahami, Mengaplikasi & Refleksi</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Unduh Word A4 Arial 11 & Cetak PDF</span>
            </div>
          </div>
        </div>

        {/* Quick Load Example Presets */}
        <div className="mt-6 pt-5 border-t border-emerald-700/50 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-emerald-200 flex items-center gap-1.5 mr-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            Muat Contoh Siap Pakai:
          </span>
          <button
            type="button"
            onClick={() => onSelectPreset('sd-ipas-4')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all border font-medium ${
              activePresetId === 'sd-ipas-4'
                ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold shadow-md'
                : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-700/60 border-emerald-600/40'
            }`}
          >
            🌱 SD: IPAS Kelas IV
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('smp-ipa-7')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all border font-medium ${
              activePresetId === 'smp-ipa-7'
                ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold shadow-md'
                : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-700/60 border-emerald-600/40'
            }`}
          >
            🔬 SMP: IPA Kelas VII
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('sma-biologi-10')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all border font-medium ${
              activePresetId === 'sma-biologi-10'
                ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold shadow-md'
                : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-700/60 border-emerald-600/40'
            }`}
          >
            🧪 SMA: Biologi Kelas X
          </button>
        </div>
      </div>
    </header>
  );
};
