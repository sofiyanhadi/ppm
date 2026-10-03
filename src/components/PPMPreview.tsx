import React, { useState } from 'react';
import {
  Download,
  Printer,
  Edit3,
  CheckCircle,
  Copy,
  ArrowLeft,
  FileCheck,
  FileText,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';
import type { PPMOutputData } from '../types/ppm';
import { exportPPMToWord } from '../utils/docxExport';

interface PPMPreviewProps {
  ppmData: PPMOutputData;
  onUpdatePPM: (updated: PPMOutputData) => void;
  onBackToForm: () => void;
}

export const PPMPreview: React.FC<PPMPreviewProps> = ({
  ppmData,
  onUpdatePPM,
  onBackToForm,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'a4' | 'raw'>('a4');

  // Export to Word (.docx) A4 Arial 11
  const handleDownloadDocx = async () => {
    try {
      setIsExporting(true);
      await exportPPMToWord(ppmData);
    } catch (error) {
      console.error('Failed to export to Word:', error);
      alert('Terjadi kesalahan saat mengekspor dokumen ke Word. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  // Print A4 Document
  const handlePrint = () => {
    window.print();
  };

  // Copy Plain Text for easy pasting
  const handleCopyText = () => {
    const text = `
PERENCANAAN PEMBELAJARAN MENDALAM (PPM)
${ppmData.identitas.namaSatuanPendidikan} - ${ppmData.identitas.tahunPelajaran}

=== TABEL 1: IDENTITAS ===
Nama Satuan Pendidikan: ${ppmData.identitas.namaSatuanPendidikan}
Mata Pelajaran: ${ppmData.identitas.mataPelajaran}
Kelas/Semester: ${ppmData.identitas.kelasSemester}
Materi Pelajaran: ${ppmData.identitas.materiPelajaran}
Durasi Pertemuan: ${ppmData.identitas.durasiPertemuan}
Tahun Pelajaran: ${ppmData.identitas.tahunPelajaran}

=== TABEL 2: IDENTIFIKASI ===
1. Peserta Didik:
- Pengetahuan Awal: ${ppmData.identifikasi.kesiapanPesertaDidik.pengetahuanAwal}
- Minat: ${ppmData.identifikasi.kesiapanPesertaDidik.minat}
- Latar Belakang: ${ppmData.identifikasi.kesiapanPesertaDidik.latarBelakang}
- Kebutuhan Belajar: ${ppmData.identifikasi.kesiapanPesertaDidik.kebutuhanBelajar}
2. Materi Pelajaran: ${ppmData.identifikasi.materiPelajaran}
3. Dimensi Profil Lulusan: ${ppmData.identifikasi.capaianDimensiProfilLulusan.join(', ')}

=== TABEL 3: DESAIN PEMBELAJARAN ===
Capaian Pembelajaran: ${ppmData.desainPembelajaran.capaianPembelajaran}
Lintas Disiplin Ilmu: ${ppmData.desainPembelajaran.lintasDisiplinIlmu}
Tujuan Pembelajaran: ${ppmData.desainPembelajaran.tujuanPembelajaran}
Topik Pembelajaran: ${ppmData.desainPembelajaran.topikPembelajaran}
Praktik Pedagogis: ${ppmData.desainPembelajaran.praktikPedagogisRingkasan}
Kemitraan Pembelajaran: ${ppmData.desainPembelajaran.kemitraanPembelajaran}
Lingkungan Pembelajaran: ${ppmData.desainPembelajaran.lingkunganPembelajaran}
Pemanfaatan Digital: ${ppmData.desainPembelajaran.pemanfaatanDigital.deskripsi}

=== TABEL 4: PENGALAMAN BELAJAR ===
${ppmData.pengalamanBelajar
  .map(
    (pb) => `
Pertemuan ${pb.pertemuanKe}: ${pb.subTopik} (${pb.praktikPedagogis}, ${pb.durasi})
A. Kegiatan Awal (${pb.kegiatanAwal.labelPrinsip}):
${pb.kegiatanAwal.langkahLangkah.map((l) => `- ${l}`).join('\n')}
B. Kegiatan Inti (${pb.kegiatanInti.labelPrinsip}):
${pb.kegiatanInti.sintaks.map((s) => `[${s.tahap}]\n${s.aktivitas}`).join('\n\n')}
C. Kegiatan Penutup (${pb.kegiatanPenutup.labelPrinsip}):
${pb.kegiatanPenutup.langkahLangkah.map((l) => `- ${l}`).join('\n')}
`
  )
  .join('\n----------------------------------------\n')}

=== TABEL 5: ASESMEN PEMBELAJARAN ===
1. Asesmen Awal: ${ppmData.asesmenPembelajaran.asesmenAwal.deskripsi}
2. Asesmen Proses: ${ppmData.asesmenPembelajaran.asesmenProses.deskripsi}
3. Asesmen Akhir: ${ppmData.asesmenPembelajaran.asesmenAkhir.deskripsi}

${ppmData.pengesahan.namaKabupaten}, ${ppmData.pengesahan.tanggalPembuatan}
Kepala Satuan Pendidikan: ${ppmData.pengesahan.namaKepalaSekolah} (NIP. ${ppmData.pengesahan.nipKepalaSekolah})
Guru Mata Pelajaran: ${ppmData.pengesahan.namaGuru} (NIP. ${ppmData.pengesahan.nipGuru})
    `;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ubah Data Input</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>PPM Terstruktur Siap Pakai</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border ${
              isEditMode
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Mode Baca Saja' : 'Edit Konten'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF (A4)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menyiapkan Word...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word (.docx) A4 Arial 11</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 print:hidden">
          <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Mode Edit Aktif:</strong> Anda dapat mengklik teks atau sel pada tabel di bawah untuk melakukan penyesuaian langsung. Hasil editan akan otomatis diikutsertakan saat unduh Word atau Cetak!
          </span>
        </div>
      )}

      {/* DOCUMENT PREVIEW CONTAINER (EMULATING A4 PAPER) */}
      <div className="bg-slate-100 p-2 sm:p-6 lg:p-8 rounded-2xl flex justify-center print:bg-white print:p-0">
        <div
          className="w-full max-w-[210mm] bg-white shadow-xl rounded-lg p-6 sm:p-10 lg:p-12 print:shadow-none print:p-0 print:max-w-none text-slate-800 font-sans border border-slate-200 print:border-none"
          style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: 1.35 }}
        >
          {/* HEADER DOKUMEN */}
          <div className="text-center pb-4 mb-6 border-b-2 border-slate-800">
            <h1 className="text-base sm:text-lg font-bold tracking-wider text-slate-900 uppercase">
              PERENCANAAN PEMBELAJARAN MENDALAM (PPM)
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 uppercase mt-0.5">
              {ppmData.identitas.namaSatuanPendidikan}
            </p>
            <p className="text-[11px] text-slate-600">
              Tahun Ajaran {ppmData.identitas.tahunPelajaran} • Kurikulum Merdeka
            </p>
          </div>

          {/* TABEL 1: IDENTITAS PEMBELAJARAN */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                TABEL 1
              </span>
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                IDENTITAS PEMBELAJARAN
              </h2>
            </div>

            <div className="overflow-x-auto border border-slate-400 rounded">
              <table className="w-full border-collapse text-left" style={{ fontSize: '11pt' }}>
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400">
                    <th className="p-2 border-r border-slate-400 w-12 text-center font-bold">No</th>
                    <th className="p-2 border-r border-slate-400 w-2/5 font-bold">Komponen Identitas</th>
                    <th className="p-2 font-bold">Deskripsi / Informasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">a.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">Nama Satuan Pendidikan</td>
                    <td className="p-2 text-justify">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={ppmData.identitas.namaSatuanPendidikan}
                          onChange={(e) =>
                            onUpdatePPM({
                              ...ppmData,
                              identitas: { ...ppmData.identitas, namaSatuanPendidikan: e.target.value },
                            })
                          }
                          className="w-full border border-blue-400 rounded px-2 py-1 text-xs"
                        />
                      ) : (
                        ppmData.identitas.namaSatuanPendidikan
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">b.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">Mata Pelajaran</td>
                    <td className="p-2 text-justify">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={ppmData.identitas.mataPelajaran}
                          onChange={(e) =>
                            onUpdatePPM({
                              ...ppmData,
                              identitas: { ...ppmData.identitas, mataPelajaran: e.target.value },
                            })
                          }
                          className="w-full border border-blue-400 rounded px-2 py-1 text-xs"
                        />
                      ) : (
                        ppmData.identitas.mataPelajaran
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">c.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">Kelas / Semester</td>
                    <td className="p-2 text-justify">{ppmData.identitas.kelasSemester}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">d.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">Materi Pelajaran</td>
                    <td className="p-2 text-justify">{ppmData.identitas.materiPelajaran}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">e.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">Durasi Pertemuan</td>
                    <td className="p-2 text-justify">{ppmData.identitas.durasiPertemuan}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">f.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">Tahun Pelajaran</td>
                    <td className="p-2 text-justify">{ppmData.identitas.tahunPelajaran}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 2: IDENTIFIKASI */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                TABEL 2
              </span>
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                IDENTIFIKASI KESIAPAN PESERTA DIDIK & PROFIL LULUSAN
              </h2>
            </div>

            <div className="overflow-x-auto border border-slate-400 rounded">
              <table className="w-full border-collapse text-left" style={{ fontSize: '11pt' }}>
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400">
                    <th className="p-2 border-r border-slate-400 w-12 text-center font-bold">No</th>
                    <th className="p-2 border-r border-slate-400 w-2/5 font-bold">Aspek Identifikasi</th>
                    <th className="p-2 font-bold">Uraian Identifikasi Pembelajaran Mendalam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">a.</td>
                    <td className="p-2 border-r border-slate-300 align-top">
                      <div className="font-semibold">Peserta Didik</div>
                      <div className="text-[10pt] text-slate-600 italic">
                        (Kesiapan sebelum belajar: pengetahuan awal, minat, latar belakang, & kebutuhan belajar)
                      </div>
                    </td>
                    <td className="p-2 text-justify space-y-1.5">
                      {isEditMode ? (
                        <textarea
                          rows={4}
                          value={ppmData.identifikasi.kesiapanPesertaDidik.ringkasan}
                          onChange={(e) =>
                            onUpdatePPM({
                              ...ppmData,
                              identifikasi: {
                                ...ppmData.identifikasi,
                                kesiapanPesertaDidik: {
                                  ...ppmData.identifikasi.kesiapanPesertaDidik,
                                  ringkasan: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full border border-blue-400 rounded p-2 text-xs"
                        />
                      ) : (
                        <>
                          <p>
                            <strong>1) Pengetahuan Awal:</strong>{' '}
                            {ppmData.identifikasi.kesiapanPesertaDidik.pengetahuanAwal}
                          </p>
                          <p>
                            <strong>2) Minat Belajar:</strong>{' '}
                            {ppmData.identifikasi.kesiapanPesertaDidik.minat}
                          </p>
                          <p>
                            <strong>3) Latar Belakang:</strong>{' '}
                            {ppmData.identifikasi.kesiapanPesertaDidik.latarBelakang}
                          </p>
                          <p>
                            <strong>4) Kebutuhan Belajar:</strong>{' '}
                            {ppmData.identifikasi.kesiapanPesertaDidik.kebutuhanBelajar}
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">b.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">Materi Pelajaran</td>
                    <td className="p-2 text-justify">{ppmData.identifikasi.materiPelajaran}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">c.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Capaian Dimensi Profil Lulusan
                    </td>
                    <td className="p-2 text-justify">
                      <div className="flex flex-wrap gap-1.5">
                        {ppmData.identifikasi.capaianDimensiProfilLulusan.map((dim, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-[10pt] font-medium"
                          >
                            • {dim}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 3: DESAIN PEMBELAJARAN */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                TABEL 3
              </span>
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                DESAIN PEMBELAJARAN MENDALAM
              </h2>
            </div>

            <div className="overflow-x-auto border border-slate-400 rounded">
              <table className="w-full border-collapse text-left" style={{ fontSize: '11pt' }}>
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400">
                    <th className="p-2 border-r border-slate-400 w-12 text-center font-bold">No</th>
                    <th className="p-2 border-r border-slate-400 w-2/5 font-bold">Elemen Desain</th>
                    <th className="p-2 font-bold">Rancangan Pedagogis Mendalam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">a.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Capaian Pembelajaran (CP)
                    </td>
                    <td className="p-2 text-justify">{ppmData.desainPembelajaran.capaianPembelajaran}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">b.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Lintas Disiplin Ilmu
                    </td>
                    <td className="p-2 text-justify">{ppmData.desainPembelajaran.lintasDisiplinIlmu}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">c.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Tujuan Pembelajaran (TP)
                    </td>
                    <td className="p-2 text-justify whitespace-pre-line">
                      {ppmData.desainPembelajaran.tujuanPembelajaran}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">d.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Topik Pembelajaran
                    </td>
                    <td className="p-2 text-justify">{ppmData.desainPembelajaran.topikPembelajaran}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">e.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Praktik Pedagogis per Pertemuan
                    </td>
                    <td className="p-2 text-justify font-medium">
                      {ppmData.desainPembelajaran.praktikPedagogisRingkasan}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">f.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Kemitraan Pembelajaran
                    </td>
                    <td className="p-2 text-justify">{ppmData.desainPembelajaran.kemitraanPembelajaran}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">g.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Lingkungan Pembelajaran
                    </td>
                    <td className="p-2 text-justify">{ppmData.desainPembelajaran.lingkunganPembelajaran}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">h.</td>
                    <td className="p-2 border-r border-slate-300 font-semibold align-top">
                      Pemanfaatan Digital
                    </td>
                    <td className="p-2 text-justify">
                      <p>{ppmData.desainPembelajaran.pemanfaatanDigital.deskripsi}</p>
                      <ul className="mt-1 list-disc list-inside text-[10pt] text-slate-700 space-y-0.5">
                        {ppmData.desainPembelajaran.pemanfaatanDigital.toolsOnline.map((tool, idx) => (
                          <li key={idx}>{tool}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 4: PENGALAMAN BELAJAR (MEMAHAMI, MENGAPLIKASI, REFLEKSI) */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                TABEL 4
              </span>
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                PENGALAMAN BELAJAR (MEMAHAMI, MENGAPLIKASI, REFLEKSI)
              </h2>
            </div>
            <p className="text-[10pt] text-slate-600 mb-2 italic">
              Disusun rinci untuk {ppmData.pengalamanBelajar.length} pertemuan dengan materi yang dipecah menjadi sub-topik terfokus serta sintaks model pedagogis yang sinkron.
            </p>

            <div className="overflow-x-auto border border-slate-400 rounded">
              <table className="w-full border-collapse text-left" style={{ fontSize: '11pt' }}>
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400">
                    <th className="p-2 border-r border-slate-400 w-1/4 font-bold">Pertemuan & Sub Topik</th>
                    <th className="p-2 border-r border-slate-400 w-1/4 font-bold">Pilar & Tahapan</th>
                    <th className="p-2 font-bold">Langkah-Langkah & Sintaks Aktivitas Mendalam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-400">
                  {ppmData.pengalamanBelajar.map((pb, pbIdx) => (
                    <React.Fragment key={pbIdx}>
                      {/* Sub row 1: Kegiatan Awal (Memahami) */}
                      <tr className="border-t-2 border-slate-400">
                        <td
                          rowSpan={3}
                          className="p-3 border-r border-slate-400 align-top bg-slate-50/70"
                        >
                          <div className="font-black text-slate-900 text-xs uppercase tracking-wider">
                            PERTEMUAN {pb.pertemuanKe}
                          </div>
                          <div className="text-[10pt] font-semibold text-emerald-800 mt-1">
                            Model: {pb.praktikPedagogis}
                          </div>
                          <div className="text-[10pt] text-slate-600">Durasi: {pb.durasi}</div>
                          <div className="mt-2.5 pt-2 border-t border-slate-200">
                            <span className="font-bold text-[10pt] text-slate-800 block">Sub Topik:</span>
                            <span className="text-[10pt] text-slate-700 italic block">{pb.subTopik}</span>
                          </div>
                        </td>

                        <td className="p-2.5 border-r border-slate-300 align-top bg-blue-50/30">
                          <div className="font-bold text-xs text-blue-900">1. KEGIATAN AWAL</div>
                          <div className="font-semibold text-[10pt] text-blue-800 mt-0.5">
                            {pb.kegiatanAwal.labelPrinsip}
                          </div>
                          <div className="text-[9pt] text-slate-500 italic mt-1">
                            Alokasi: {pb.kegiatanAwal.alokasiWaktu}
                          </div>
                        </td>

                        <td className="p-2.5 align-top text-justify">
                          <p className="text-[10pt] text-slate-600 italic mb-2">
                            {pb.kegiatanAwal.deskripsiKegiatan}
                          </p>
                          <ul className="space-y-1.5 list-disc list-inside">
                            {pb.kegiatanAwal.langkahLangkah.map((step, sIdx) => (
                              <li key={sIdx} className="text-slate-800">
                                {step}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>

                      {/* Sub row 2: Kegiatan Inti (Mengaplikasi) */}
                      <tr className="border-t border-slate-300">
                        <td className="p-2.5 border-r border-slate-300 align-top bg-emerald-50/30">
                          <div className="font-bold text-xs text-emerald-900">2. KEGIATAN INTI</div>
                          <div className="font-semibold text-[10pt] text-emerald-800 mt-0.5">
                            {pb.kegiatanInti.labelPrinsip}
                          </div>
                          <div className="text-[9pt] text-slate-500 italic mt-1">
                            Alokasi: {pb.kegiatanInti.alokasiWaktu}
                          </div>
                        </td>

                        <td className="p-2.5 align-top text-justify space-y-2.5">
                          <p className="text-[10pt] text-slate-600 italic">
                            {pb.kegiatanInti.deskripsiKegiatan}
                          </p>
                          <div className="space-y-2">
                            {pb.kegiatanInti.sintaks.map((stx, stxIdx) => (
                              <div key={stxIdx} className="p-2 bg-slate-50 rounded border border-slate-200">
                                <span className="font-bold text-slate-900 block text-[10pt]">
                                  {stx.tahap}
                                </span>
                                <span className="text-slate-800 text-justify block mt-0.5">
                                  {stx.aktivitas}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>

                      {/* Sub row 3: Kegiatan Penutup (Refleksi) */}
                      <tr className="border-t border-slate-300">
                        <td className="p-2.5 border-r border-slate-300 align-top bg-purple-50/30">
                          <div className="font-bold text-xs text-purple-900">3. KEGIATAN PENUTUP</div>
                          <div className="font-semibold text-[10pt] text-purple-800 mt-0.5">
                            {pb.kegiatanPenutup.labelPrinsip}
                          </div>
                          <div className="text-[9pt] text-slate-500 italic mt-1">
                            Alokasi: {pb.kegiatanPenutup.alokasiWaktu}
                          </div>
                        </td>

                        <td className="p-2.5 align-top text-justify">
                          <p className="text-[10pt] text-slate-600 italic mb-2">
                            {pb.kegiatanPenutup.deskripsiKegiatan}
                          </p>
                          <ul className="space-y-1.5 list-disc list-inside">
                            {pb.kegiatanPenutup.langkahLangkah.map((step, sIdx) => (
                              <li key={sIdx} className="text-slate-800">
                                {step}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 5: ASESMEN PEMBELAJARAN */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                TABEL 5
              </span>
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                ASESMEN PEMBELAJARAN
              </h2>
            </div>

            <div className="overflow-x-auto border border-slate-400 rounded">
              <table className="w-full border-collapse text-left" style={{ fontSize: '11pt' }}>
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400">
                    <th className="p-2 border-r border-slate-400 w-12 text-center font-bold">No</th>
                    <th className="p-2 border-r border-slate-400 w-1/4 font-bold">Jenis Asesmen</th>
                    <th className="p-2 border-r border-slate-400 w-1/4 font-bold">Teknik & Instrumen</th>
                    <th className="p-2 font-bold">Deskripsi & Rubrik / Indikator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {/* Asesmen Awal */}
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">1.</td>
                    <td className="p-2 border-r border-slate-300 align-top">
                      <div className="font-bold text-slate-900">Asesmen Awal</div>
                      <div className="text-[10pt] text-slate-600 italic">(Diagnostik / Apersepsi)</div>
                    </td>
                    <td className="p-2 border-r border-slate-300 align-top text-[10pt]">
                      <div>
                        <strong>Teknik:</strong> {ppmData.asesmenPembelajaran.asesmenAwal.teknik}
                      </div>
                      <div className="mt-1">
                        <strong>Instrumen:</strong> {ppmData.asesmenPembelajaran.asesmenAwal.instrumen}
                      </div>
                    </td>
                    <td className="p-2 text-justify align-top space-y-1">
                      <p>{ppmData.asesmenPembelajaran.asesmenAwal.deskripsi}</p>
                      <div className="pt-1">
                        <span className="font-bold text-[10pt] block">Contoh Pertanyaan Pemantik:</span>
                        <ul className="list-disc list-inside text-[10pt] text-slate-700 space-y-0.5">
                          {ppmData.asesmenPembelajaran.asesmenAwal.indikatorPertanyaan.map((q, qIdx) => (
                            <li key={qIdx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* Asesmen Proses */}
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">2.</td>
                    <td className="p-2 border-r border-slate-300 align-top">
                      <div className="font-bold text-slate-900">Asesmen Proses</div>
                      <div className="text-[10pt] text-slate-600 italic">(Formatif / Observasi / Diskusi)</div>
                    </td>
                    <td className="p-2 border-r border-slate-300 align-top text-[10pt]">
                      <div>
                        <strong>Teknik:</strong> {ppmData.asesmenPembelajaran.asesmenProses.teknik}
                      </div>
                      <div className="mt-1">
                        <strong>Instrumen:</strong> {ppmData.asesmenPembelajaran.asesmenProses.instrumen}
                      </div>
                    </td>
                    <td className="p-2 text-justify align-top space-y-1">
                      <p>{ppmData.asesmenPembelajaran.asesmenProses.deskripsi}</p>
                      <div className="pt-1">
                        <span className="font-bold text-[10pt] block">Rubrik Observasi Profil Lulusan:</span>
                        <ul className="list-disc list-inside text-[10pt] text-slate-700 space-y-0.5">
                          {ppmData.asesmenPembelajaran.asesmenProses.rubrikObservasi.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* Asesmen Akhir */}
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold align-top">3.</td>
                    <td className="p-2 border-r border-slate-300 align-top">
                      <div className="font-bold text-slate-900">Asesmen Akhir</div>
                      <div className="text-[10pt] text-slate-600 italic">(Sumatif / Produk / Portofolio)</div>
                    </td>
                    <td className="p-2 border-r border-slate-300 align-top text-[10pt]">
                      <div>
                        <strong>Teknik:</strong> {ppmData.asesmenPembelajaran.asesmenAkhir.teknik}
                      </div>
                      <div className="mt-1">
                        <strong>Instrumen:</strong> {ppmData.asesmenPembelajaran.asesmenAkhir.instrumen}
                      </div>
                    </td>
                    <td className="p-2 text-justify align-top space-y-1">
                      <p>{ppmData.asesmenPembelajaran.asesmenAkhir.deskripsi}</p>
                      <div className="pt-1">
                        <span className="font-bold text-[10pt] block">Kriteria Ketercapaian Hasil Belajar:</span>
                        <ul className="list-disc list-inside text-[10pt] text-slate-700 space-y-0.5">
                          {ppmData.asesmenPembelajaran.asesmenAkhir.kriteriaKetercapaian.map((k, kIdx) => (
                            <li key={kIdx}>{k}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TANGGAL DAN PENGESAHAN TANDA TANGAN */}
          {/* Sesuai instruksi:
              - Di bagian akhir sebelah kanan: nama kabupaten & tanggal pembuatan
              - Tempat tanda tangan di bawah sendiri:
                * Sebelah kiri bertuliskan Kepala Satuan Pendidikan (nama satuan pendidikan sesuaikan input)
                * Sebelah kanan dituliskan Guru mata pelajaran (mata pelajaran sesuaikan input)
                * Diberi stand kosong untuk tempat tanda tangan
                * Di bawah kepala satuan pendidikan: Nama Kepala Sekolah dan NIP
                * Di bawah guru mata pelajaran: Nama Guru dan NIP
          */}
          <div className="mt-12 break-inside-avoid">
            {/* Tanggal di sebelah kanan */}
            <div className="flex justify-end mb-4">
              <p className="text-right font-medium">
                {ppmData.pengesahan.namaKabupaten}, {ppmData.pengesahan.tanggalPembuatan}
              </p>
            </div>

            {/* Block Tanda Tangan: Kiri Kepala Sekolah, Kanan Guru */}
            <div className="grid grid-cols-2 gap-8 text-center pt-2">
              {/* Kolom Kiri: Kepala Satuan Pendidikan */}
              <div className="flex flex-col items-center">
                <p className="text-xs text-slate-600">Mengetahui,</p>
                <p className="font-bold">Kepala Satuan Pendidikan</p>
                <p className="font-medium text-slate-800">{ppmData.pengesahan.namaSatuanPendidikan}</p>

                {/* Stand kosong tanda tangan */}
                <div className="h-24 sm:h-28 w-40 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 select-none print:hidden">
                    [Tempat Tanda Tangan]
                  </span>
                </div>

                <p className="font-bold underline text-slate-900">
                  {ppmData.pengesahan.namaKepalaSekolah}
                </p>
                <p className="text-xs text-slate-700">
                  NIP. {ppmData.pengesahan.nipKepalaSekolah}
                </p>
              </div>

              {/* Kolom Kanan: Guru Mata Pelajaran */}
              <div className="flex flex-col items-center">
                <p className="font-bold">Guru Mata Pelajaran</p>
                <p className="font-medium text-slate-800">{ppmData.pengesahan.namaMapel}</p>

                {/* Stand kosong tanda tangan */}
                <div className="h-24 sm:h-28 w-40 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 select-none print:hidden">
                    [Tempat Tanda Tangan]
                  </span>
                </div>

                <p className="font-bold underline text-slate-900">
                  {ppmData.pengesahan.namaGuru}
                </p>
                <p className="text-xs text-slate-700">
                  NIP. {ppmData.pengesahan.nipGuru}
                </p>
              </div>
            </div>
          </div>

          {/* Footer watermark branding */}
          <div className="mt-14 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 print:hidden">
            <span>Dihasilkan oleh: Generator PPM by "PakGuruMassof"</span>
            <span>Standar Pembelajaran Mendalam • Kemendikbudristek</span>
          </div>
        </div>
      </div>
    </div>
  );
};
