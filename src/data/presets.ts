import type { PPMInput, JenjangType } from '../types/ppm';

export const DIMENSI_PROFIL_LULUSAN_OPTIONS = [
  'Keimanan & Ketakwaan',
  'Kewargaan',
  'Penalaran Kritis',
  'Kreativitas',
  'Kolaborasi',
  'Kemandirian',
  'Kesehatan',
  'Komunikasi',
];

export const PRAKTIK_PEDAGOGIS_OPTIONS = [
  'Problem Based Learning',
  'PjBL',
  'Inkuiri-Discovery Learning',
  'Discovery Learning',
  'Guided Discovery Learning',
  'Problem Solving',
  'Game Based Learning',
  'Station Learning',
];

export const JENJANG_KELAS_MAP: Record<JenjangType, string[]> = {
  SD: [
    'Kelas I (Fase A)',
    'Kelas II (Fase A)',
    'Kelas III (Fase B)',
    'Kelas IV (Fase B)',
    'Kelas V (Fase C)',
    'Kelas VI (Fase C)',
  ],
  SMP: [
    'Kelas VII (Fase D)',
    'Kelas VIII (Fase D)',
    'Kelas IX (Fase D)',
  ],
  SMA: [
    'Kelas X (Fase E)',
    'Kelas XI (Fase F)',
    'Kelas XII (Fase F)',
  ],
};

export const POPULER_MAPEL_BY_JENJANG: Record<JenjangType, string[]> = {
  SD: [
    'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    'Matematika',
    'Bahasa Indonesia',
    'Pendidikan Pancasila',
    'Pendidikan Agama dan Budi Pekerti',
    'Seni Budaya & Prakarya',
    'PJOK',
    'Bahasa Inggris',
  ],
  SMP: [
    'Ilmu Pengetahuan Alam (IPA)',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Pendidikan Pancasila',
    'Informatika',
    'Pendidikan Agama & Budi Pekerti',
    'PJOK',
    'Seni & Prakarya',
  ],
  SMA: [
    'Biologi',
    'Fisika',
    'Kimia',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Sosiologi',
    'Ekonomi',
    'Geografi',
    'Sejarah',
    'Informatika',
    'Pendidikan Pancasila',
  ],
};

export interface PresetTemplate {
  id: string;
  label: string;
  badge: string;
  data: PPMInput;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'sd-ipas-4',
    label: 'SD: IPAS Kelas IV - Bagian Tubuh Tumbuhan (2 Pertemuan)',
    badge: 'SD Fase B',
    data: {
      namaSatuanPendidikan: 'SD Negeri 1 Teladan',
      namaGuru: 'Siti Aminah, S.Pd., M.Pd.',
      nipGuru: '19850712 201001 2 018',
      namaKepalaSekolah: 'Drs. H. Mulyono, M.M.',
      nipKepalaSekolah: '19700315 199503 1 004',
      jenjang: 'SD',
      kelas: 'Kelas IV (Fase B)',
      semester: 'Semester 1 (Ganjil)',
      mapel: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
      capaianPembelajaran:
        'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga, buah, dan biji) serta kaitannya dengan fotosintesis dan keberlangsungan lingkungan hidup.',
      tujuanPembelajaran:
        '1. Peserta didik dapat mengidentifikasi bagian-bagian tubuh tumbuhan beserta fungsi spesifiknya bagi kelangsungan hidup tumbuhan secara kritis.\n2. Peserta didik dapat melakukan penyelidikan ilmiah sederhana tentang proses penyerapan air dan fotosintesis melalui kerja sama tim.',
      materiPelajaran: 'Bagian Tubuh Tumbuhan dan Fungsinya serta Proses Fotosintesis',
      tahunPelajaran: '2024/2025',
      jumlahPertemuan: 2,
      durasiPertemuan: '2 × 35 menit',
      praktikPedagogisPerPertemuan: [
        { pertemuanKe: 1, model: 'Inkuiri-Discovery Learning' },
        { pertemuanKe: 2, model: 'Problem Based Learning' },
      ],
      dimensiProfilLulusan: [
        'Penalaran Kritis',
        'Kolaborasi',
        'Kreativitas',
        'Kewargaan',
        'Keimanan & Ketakwaan',
      ],
      namaKabupaten: 'Kabupaten Sleman',
      tanggalPembuatan: '24 Juli 2024',
    },
  },
  {
    id: 'smp-ipa-7',
    label: 'SMP: IPA Kelas VII - Ekosistem dan Interaksi Lingkungan (2 Pertemuan)',
    badge: 'SMP Fase D',
    data: {
      namaSatuanPendidikan: 'SMP Negeri 3 Juara',
      namaGuru: 'Ahmad Sofyan, S.Si., Gr.',
      nipGuru: '19890218 201502 1 002',
      namaKepalaSekolah: 'Dra. Endang Sulastri, M.Pd.',
      nipKepalaSekolah: '19681120 199412 2 001',
      jenjang: 'SMP',
      kelas: 'Kelas VII (Fase D)',
      semester: 'Semester 2 (Genap)',
      mapel: 'Ilmu Pengetahuan Alam (IPA)',
      capaianPembelajaran:
        'Peserta didik mampu mengidentifikasi interaksi antarmakhluk hidup dan lingkungannya, serta merancang upaya-upaya solutif untuk mencegah dan mengatasi pencemaran serta perubahan iklim lokal.',
      tujuanPembelajaran:
        '1. Menganalisis pola interaksi rantai makanan dan jaring-jaring makanan dalam ekosistem terancam.\n2. Merumuskan gagasan berbasis studi kasus pencemaran perairan lokal untuk menjaga keseimbangan lingkungan hidup.',
      materiPelajaran: 'Interaksi Komponen Ekosistem dan Dinamika Jaring-Jaring Makanan',
      tahunPelajaran: '2024/2025',
      jumlahPertemuan: 2,
      durasiPertemuan: '3 × 40 menit',
      praktikPedagogisPerPertemuan: [
        { pertemuanKe: 1, model: 'Problem Based Learning' },
        { pertemuanKe: 2, model: 'PjBL' },
      ],
      dimensiProfilLulusan: [
        'Penalaran Kritis',
        'Kolaborasi',
        'Kewargaan',
        'Komunikasi',
        'Kemandirian',
      ],
      namaKabupaten: 'Kabupaten Banyumas',
      tanggalPembuatan: '06 Januari 2025',
    },
  },
  {
    id: 'sma-biologi-10',
    label: 'SMA: Biologi Kelas X - Pengelolaan Sampah & Daur Ulang (3 Pertemuan)',
    badge: 'SMA Fase E',
    data: {
      namaSatuanPendidikan: 'SMA Negeri 1 Prestasi',
      namaGuru: 'Massof Mustaqim, M.Pd.',
      nipGuru: '19860405 201101 1 013',
      namaKepalaSekolah: 'Dr. Bambang Irawan, M.Pd.',
      nipKepalaSekolah: '19660812 199103 1 007',
      jenjang: 'SMA',
      kelas: 'Kelas X (Fase E)',
      semester: 'Semester 2 (Genap)',
      mapel: 'Biologi',
      capaianPembelajaran:
        'Peserta didik memiliki kemampuan menciptakan solusi atas permasalahan-permasalahan berdasarkan isu lokal atau global terkait perubahan lingkungan melalui proyek bioteknologi ramah lingkungan.',
      tujuanPembelajaran:
        '1. Mengidentifikasi fakta-fakta perubahan lingkungan dan penumpukan limbah organik di komunitas sekitar.\n2. Menganalisis dampak akumulasi limbah terhadap kualitas tanah dan air bersih.\n3. Merancang dan menguji prototipe pembuatan eco-enzyme atau biopori sebagai solusi pelestarian lingkungan hidup.',
      materiPelajaran: 'Perubahan Lingkungan, Pengelolaan Limbah Organik, dan Biopori Konservasi',
      tahunPelajaran: '2024/2025',
      jumlahPertemuan: 3,
      durasiPertemuan: '2 × 45 menit',
      praktikPedagogisPerPertemuan: [
        { pertemuanKe: 1, model: 'Problem Based Learning' },
        { pertemuanKe: 2, model: 'PjBL' },
        { pertemuanKe: 3, model: 'Station Learning' },
      ],
      dimensiProfilLulusan: [
        'Penalaran Kritis',
        'Kreativitas',
        'Kolaborasi',
        'Kewargaan',
        'Komunikasi',
        'Kesehatan',
      ],
      namaKabupaten: 'Kota Bandung',
      tanggalPembuatan: '12 Januari 2025',
    },
  },
];
