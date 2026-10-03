import React, { useEffect } from 'react';
import {
  School,
  User,
  GraduationCap,
  BookMarked,
  Clock,
  Layers,
  Calendar,
  Sparkles,
  MapPin,
  HelpCircle,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import type { PPMInput, JenjangType } from '../types/ppm';
import {
  DIMENSI_PROFIL_LULUSAN_OPTIONS,
  PRAKTIK_PEDAGOGIS_OPTIONS,
  JENJANG_KELAS_MAP,
  POPULER_MAPEL_BY_JENJANG,
} from '../data/presets';

interface PPMFormProps {
  input: PPMInput;
  onChange: (updated: PPMInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PPMForm: React.FC<PPMFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}) => {
  // Update Praktik Pedagogis array when jumlahPertemuan changes
  useEffect(() => {
    const targetCount = Math.max(1, Math.min(10, Number(input.jumlahPertemuan) || 1));
    const currentList = [...input.praktikPedagogisPerPertemuan];

    if (currentList.length < targetCount) {
      for (let i = currentList.length; i < targetCount; i++) {
        currentList.push({
          pertemuanKe: i + 1,
          model: PRAKTIK_PEDAGOGIS_OPTIONS[i % PRAKTIK_PEDAGOGIS_OPTIONS.length] || 'Problem Based Learning',
        });
      }
      onChange({ ...input, praktikPedagogisPerPertemuan: currentList });
    } else if (currentList.length > targetCount) {
      onChange({ ...input, praktikPedagogisPerPertemuan: currentList.slice(0, targetCount) });
    }
  }, [input.jumlahPertemuan]);

  // Handle Jenjang Change
  const handleJenjangChange = (jenjang: JenjangType) => {
    const availableKelas = JENJANG_KELAS_MAP[jenjang];
    const defaultKelas = availableKelas[0] || '';
    const suggestedDuration =
      jenjang === 'SD' ? '2 × 35 menit' : jenjang === 'SMP' ? '2 × 40 menit' : '2 × 45 menit';

    onChange({
      ...input,
      jenjang,
      kelas: defaultKelas,
      durasiPertemuan: input.durasiPertemuan || suggestedDuration,
    });
  };

  // Handle Dimension Toggle
  const toggleDimension = (dimensi: string) => {
    const exists = input.dimensiProfilLulusan.includes(dimensi);
    if (exists) {
      onChange({
        ...input,
        dimensiProfilLulusan: input.dimensiProfilLulusan.filter((d) => d !== dimensi),
      });
    } else {
      onChange({
        ...input,
        dimensiProfilLulusan: [...input.dimensiProfilLulusan, dimensi],
      });
    }
  };

  const selectAllDimensions = () => {
    onChange({
      ...input,
      dimensiProfilLulusan: [...DIMENSI_PROFIL_LULUSAN_OPTIONS],
    });
  };

  const clearDimensions = () => {
    onChange({
      ...input,
      dimensiProfilLulusan: [],
    });
  };

  const handlePedagogisChange = (index: number, model: string) => {
    const updated = [...input.praktikPedagogisPerPertemuan];
    if (updated[index]) {
      updated[index] = { ...updated[index], model };
      onChange({ ...input, praktikPedagogisPerPertemuan: updated });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION 1: IDENTITAS SATUAN PENDIDIKAN & TENAGA PENDIDIK */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              1. Identitas Satuan Pendidikan & Pengesahan
            </h2>
            <p className="text-xs text-slate-500">
              Informasi sekolah, kepala sekolah, dan guru yang akan tercantum pada Tabel 1 & pengesahan tanda tangan.
            </p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Nama Satuan Pendidikan */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Satuan Pendidikan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: SD Negeri 1 Teladan / SMP Negeri 2 Jakarta / SMA Negeri 3 Surabaya"
              value={input.namaSatuanPendidikan}
              onChange={(e) => onChange({ ...input, namaSatuanPendidikan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Tahun Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tahun Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 2024/2025"
              value={input.tahunPelajaran}
              onChange={(e) => onChange({ ...input, tahunPelajaran: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Nama Guru */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Guru Pengampu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Lengkap beserta gelar (contoh: Siti Aminah, S.Pd.)"
              value={input.namaGuru}
              onChange={(e) => onChange({ ...input, namaGuru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* NIP Guru */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              NIP Guru <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nomor NIP atau tanda '-' jika non-PNS"
              value={input.nipGuru}
              onChange={(e) => onChange({ ...input, nipGuru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Semester <span className="text-rose-500">*</span>
            </label>
            <select
              value={input.semester}
              onChange={(e) => onChange({ ...input, semester: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
            >
              <option value="Semester 1 (Ganjil)">Semester 1 (Ganjil)</option>
              <option value="Semester 2 (Genap)">Semester 2 (Genap)</option>
            </select>
          </div>

          {/* Nama Kepala Sekolah */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Kepala Sekolah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Lengkap beserta gelar (contoh: Drs. H. Mulyono, M.M.)"
              value={input.namaKepalaSekolah}
              onChange={(e) => onChange({ ...input, namaKepalaSekolah: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* NIP Kepala Sekolah */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              NIP Kepala Sekolah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nomor NIP atau tanda '-' jika non-PNS"
              value={input.nipKepalaSekolah}
              onChange={(e) => onChange({ ...input, nipKepalaSekolah: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Nama Kabupaten */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Kabupaten / Kota <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kabupaten Sleman / Kota Bandung"
              value={input.namaKabupaten}
              onChange={(e) => onChange({ ...input, namaKabupaten: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Tanggal Pembuatan PPM */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tanggal Pembuatan PPM <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 24 September 2026 / 15 Juli 2025"
              value={input.tanggalPembuatan}
              onChange={(e) => onChange({ ...input, tanggalPembuatan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: JENJANG, KELAS, MAPEL, & MATERI PEMBELAJARAN */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              2. Jenjang, Kelas, Mata Pelajaran, & Kurikulum
            </h2>
            <p className="text-xs text-slate-500">
              Pilihan jenjang otomatis menyesuaikan kelas, pilihan mapel, dan durasi pertemuan ideal.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Pilihan Jenjang Radio Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilihan Jenjang Pendidikan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {(['SD', 'SMP', 'SMA'] as JenjangType[]).map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => handleJenjangChange(j)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    input.jenjang === j
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-lg font-black">{j}</span>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {j === 'SD'
                      ? 'Sekolah Dasar (Fase A-C)'
                      : j === 'SMP'
                      ? 'Sekolah Menengah Pertama (Fase D)'
                      : 'Sekolah Menengah Atas (Fase E-F)'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pilihan Kelas Sesuai Jenjang */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pilihan Kelas (Sesuai Jenjang {input.jenjang}) <span className="text-rose-500">*</span>
              </label>
              <select
                value={input.kelas}
                onChange={(e) => onChange({ ...input, kelas: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
              >
                {JENJANG_KELAS_MAP[input.jenjang].map((kls) => (
                  <option key={kls} value={kls}>
                    {kls}
                  </option>
                ))}
              </select>
            </div>

            {/* Mata Pelajaran (Mapel) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mata Pelajaran (Mapel) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="mapel-suggestions"
                placeholder="Pilih atau ketik mapel (contoh: IPAS, Matematika, Biologi)"
                value={input.mapel}
                onChange={(e) => onChange({ ...input, mapel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
              <datalist id="mapel-suggestions">
                {POPULER_MAPEL_BY_JENJANG[input.jenjang].map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400">Rekomendasi cepat:</span>
                {POPULER_MAPEL_BY_JENJANG[input.jenjang].slice(0, 4).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ ...input, mapel: m })}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    {m.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Materi Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Materi Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Bagian Tubuh Tumbuhan dan Fungsinya / Persamaan Linear / Fluida Dinamis"
              value={input.materiPelajaran}
              onChange={(e) => onChange({ ...input, materiPelajaran: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Capaian Pembelajaran (CP) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Capaian Pembelajaran (CP) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Salin atau ketik Capaian Pembelajaran (CP) resmi sesuai Keputusan BSKAP..."
              value={input.capaianPembelajaran}
              onChange={(e) => onChange({ ...input, capaianPembelajaran: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm leading-relaxed"
            />
          </div>

          {/* Tujuan Pembelajaran (TP) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Rincian tujuan pembelajaran (contoh: 1. Peserta didik dapat menganalisis..., 2. Peserta didik dapat mempraktikkan...)"
              value={input.tujuanPembelajaran}
              onChange={(e) => onChange({ ...input, tujuanPembelajaran: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Catatan: Jika membuat lebih dari 1 pertemuan, AI akan memecah tujuan pembelajaran ini menjadi sub-topik teratur di setiap pertemuan pada Tabel 4.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: STRUKTUR PERTEMUAN & PRAKTIK PEDAGOGIS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              3. Alokasi Pertemuan & Praktik Pedagogis per Pertemuan
            </h2>
            <p className="text-xs text-slate-500">
              Tentukan jumlah pertemuan dan model pedagogis spesifik untuk masing-masing pertemuan (bisa berbeda tiap pertemuan).
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Jumlah Pertemuan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jumlah Pertemuan (Angka) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={6}
                  required
                  value={input.jumlahPertemuan}
                  onChange={(e) =>
                    onChange({
                      ...input,
                      jumlahPertemuan: Math.max(1, Math.min(6, parseInt(e.target.value) || 1)),
                    })
                  }
                  className="w-32 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                />
                <span className="text-xs text-slate-500">
                  Pertemuan (Rekomendasi 1 - 4 pertemuan per modul PPM)
                </span>
              </div>
            </div>

            {/* Durasi Setiap Pertemuan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Durasi Setiap Pertemuan (Manual) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 2 × 35 menit, 3 × 40 menit, 2 × 45 menit"
                value={input.durasiPertemuan}
                onChange={(e) => onChange({ ...input, durasiPertemuan: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Praktik Pedagogis per Pertemuan (Dynamic per meeting) */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Praktik Pedagogis per Pertemuan (Sintaks Pembelajaran):
              </h3>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {input.praktikPedagogisPerPertemuan.length} Pertemuan Terdaftar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {input.praktikPedagogisPerPertemuan.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                      Pertemuan {p.pertemuanKe}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">Sintaks Model</span>
                  </div>

                  <select
                    value={p.model}
                    onChange={(e) => handlePedagogisChange(idx, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs bg-white font-medium text-slate-800"
                  >
                    {PRAKTIK_PEDAGOGIS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: DIMENSI PROFIL LULUSAN (MULTI-SELECT) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                4. Dimensi Profil Lulusan (Multi-Pilih)
              </h2>
              <p className="text-xs text-slate-500">
                Pilih dimensi kompetensi dan karakter yang akan dikembangkan dalam pembelajaran.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllDimensions}
              className="text-xs text-purple-700 hover:text-purple-900 font-medium px-2.5 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              Pilih Semua
            </button>
            <button
              type="button"
              onClick={clearDimensions}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {DIMENSI_PROFIL_LULUSAN_OPTIONS.map((dimensi) => {
              const isSelected = input.dimensiProfilLulusan.includes(dimensi);
              return (
                <button
                  key={dimensi}
                  type="button"
                  onClick={() => toggleDimension(dimensi)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-xs ring-1 ring-purple-400'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{dimensi}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ml-2 transition-colors ${
                      isSelected ? 'bg-purple-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          {input.dimensiProfilLulusan.length === 0 && (
            <p className="text-xs text-rose-500 font-medium mt-3 flex items-center gap-1.5">
              ⚠️ Harap pilih minimal 1 dimensi Profil Lulusan untuk dicantumkan pada PPM.
            </p>
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON ACTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            Siap Mengenerate Dokumen PPM?
          </h3>
          <p className="text-xs text-emerald-200/80">
            Sistem akan menyusun 5 tabel resmi dengan sintaks pedagogis mendalam, rincian aktivitas guru-siswa, dan siap diekspor ke Microsoft Word (.docx).
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || input.dimensiProfilLulusan.length === 0}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-sm tracking-wide uppercase shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Menyusun PPM Mendalam...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Generate Dokumen PPM Sekarang</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
