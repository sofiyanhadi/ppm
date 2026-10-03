import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PPMForm } from './components/PPMForm';
import { PPMPreview } from './components/PPMPreview';
import type { PPMInput, PPMOutputData } from './types/ppm';
import { PRESET_TEMPLATES } from './data/presets';
import { generateClientFallbackPPM } from './utils/localGenerator';
import {
  FileText,
  Sparkles,
  Layers,
  History,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const INITIAL_INPUT: PPMInput = PRESET_TEMPLATES[0].data;

export default function App() {
  const [input, setInput] = useState<PPMInput>(() => {
    try {
      const saved = localStorage.getItem('ppm_last_input');
      return saved ? JSON.parse(saved) : INITIAL_INPUT;
    } catch {
      return INITIAL_INPUT;
    }
  });

  const [ppmData, setPpmData] = useState<PPMOutputData | null>(() => {
    try {
      const saved = localStorage.getItem('ppm_last_output');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activePresetId, setActivePresetId] = useState<string>('sd-ipas-4');
  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Save input changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ppm_last_input', JSON.stringify(input));
    } catch (e) {
      console.warn('Failed to save input to localStorage:', e);
    }
  }, [input]);

  // Save output data to localStorage
  useEffect(() => {
    if (ppmData) {
      try {
        localStorage.setItem('ppm_last_output', JSON.stringify(ppmData));
      } catch (e) {
        console.warn('Failed to save output to localStorage:', e);
      }
    }
  }, [ppmData]);

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (found) {
      setInput(found.data);
      setActivePresetId(presetId);
      setErrorMsg(null);
    }
  };

  const handleGeneratePPM = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-ppm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (response.ok) {
        const result = await response.json();
        if (result?.data) {
          setPpmData(result.data);
          setActiveView('preview');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      // If response not ok or no data, fallback directly to rich client generator
      console.warn('Backend unavailable, using instant client-side generator');
      const clientGenerated = generateClientFallbackPPM(input);
      setPpmData(clientGenerated);
      setActiveView('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('Network fetch error, switching to instant client generator:', err);
      try {
        const clientGenerated = generateClientFallbackPPM(input);
        setPpmData(clientGenerated);
        setActiveView('preview');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (innerErr: any) {
        console.error('Error generating PPM:', innerErr);
        setErrorMsg('Gagal menyusun dokumen PPM. Mohon periksa kembali kelengkapan isian formulir.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header with Title: Generator PPM by : "PakGuruMassof" */}
      <Header onSelectPreset={handleSelectPreset} activePresetId={activePresetId} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs between Form and Preview */}
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'form'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Formulir Input Data</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (ppmData) setActiveView('preview');
              }}
              disabled={!ppmData}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                activeView === 'preview'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-700'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Preview Dokumen PPM 5 Tabel</span>
              {ppmData && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              )}
            </button>
          </div>

          {ppmData && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Dokumen aktif: <strong className="text-slate-800">{ppmData.identitas.mataPelajaran}</strong> ({ppmData.identitas.kelasSemester})
              </span>
            </div>
          )}
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 print:hidden">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Gagal Membuat PPM</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* View Switcher */}
        {activeView === 'form' ? (
          <div className="space-y-6">
            {/* Informational Guidance Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="text-xs text-emerald-950 space-y-1">
                <p className="font-bold text-sm text-emerald-900">
                  Panduan Perencanaan Pembelajaran Mendalam (PPM)
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  Isi data di bawah ini atau gunakan tombol contoh siap pakai di atas. Generator akan menghasilkan 5 tabel resmi: 
                  <strong> Tabel 1 Identitas</strong>, <strong> Tabel 2 Identifikasi</strong>, <strong> Tabel 3 Desain Pembelajaran</strong>, 
                  <strong> Tabel 4 Pengalaman Belajar (Memahami, Mengaplikasi, Refleksi)</strong>, dan <strong> Tabel 5 Asesmen Pembelajaran</strong>.
                </p>
              </div>
            </div>

            <PPMForm
              input={input}
              onChange={setInput}
              onSubmit={handleGeneratePPM}
              isLoading={isLoading}
            />
          </div>
        ) : (
          ppmData && (
            <PPMPreview
              ppmData={ppmData}
              onUpdatePPM={setPpmData}
              onBackToForm={() => setActiveView('form')}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              Generator Perencanaan Pembelajaran Mendalam (PPM) by : "PakGuruMassof"
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Didesain untuk kemudahan Guru Indonesia di semua jenjang (SD, SMP, SMA) dan mata pelajaran.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Standar A4 • Arial 11</span>
            <span>•</span>
            <span>Kurikulum Merdeka</span>
            <span>•</span>
            <span>Deep Learning Pedagogy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
