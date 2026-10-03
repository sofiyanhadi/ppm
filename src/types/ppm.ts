export type JenjangType = 'SD' | 'SMP' | 'SMA';

export interface PraktikPertemuan {
  pertemuanKe: number;
  model: string;
}

export interface PPMInput {
  namaSatuanPendidikan: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  jenjang: JenjangType;
  kelas: string;
  semester: string;
  mapel: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materiPelajaran: string;
  tahunPelajaran: string;
  jumlahPertemuan: number;
  durasiPertemuan: string;
  praktikPedagogisPerPertemuan: PraktikPertemuan[];
  dimensiProfilLulusan: string[];
  namaKabupaten: string;
  tanggalPembuatan: string;
}

export interface SintaksItem {
  tahap: string;
  aktivitas: string;
}

export interface PengalamanBelajarPertemuan {
  pertemuanKe: number;
  subTopik: string;
  praktikPedagogis: string;
  durasi: string;
  kegiatanAwal: {
    labelPrinsip: string; // e.g. "Memahami (Berkesadaran, Bermakna, Menggembirakan)"
    prinsipTerpilih: string[];
    alokasiWaktu: string;
    langkahLangkah: string[];
    deskripsiKegiatan: string;
  };
  kegiatanInti: {
    labelPrinsip: string; // e.g. "Mengaplikasi (Bermakna, Menggembirakan)"
    prinsipTerpilih: string[];
    alokasiWaktu: string;
    sintaks: SintaksItem[];
    deskripsiKegiatan: string;
  };
  kegiatanPenutup: {
    labelPrinsip: string; // e.g. "Refleksi (Berkesadaran, Bermakna)"
    prinsipTerpilih: string[];
    alokasiWaktu: string;
    langkahLangkah: string[];
    deskripsiKegiatan: string;
  };
}

export interface PPMOutputData {
  identitas: {
    namaSatuanPendidikan: string;
    mataPelajaran: string;
    kelasSemester: string;
    materiPelajaran: string;
    durasiPertemuan: string;
    tahunPelajaran: string;
  };
  identifikasi: {
    kesiapanPesertaDidik: {
      pengetahuanAwal: string;
      minat: string;
      latarBelakang: string;
      kebutuhanBelajar: string;
      ringkasan: string;
    };
    materiPelajaran: string;
    capaianDimensiProfilLulusan: string[];
  };
  desainPembelajaran: {
    capaianPembelajaran: string;
    lintasDisiplinIlmu: string;
    tujuanPembelajaran: string;
    topikPembelajaran: string;
    praktikPedagogisRingkasan: string;
    kemitraanPembelajaran: string;
    lingkunganPembelajaran: string;
    pemanfaatanDigital: {
      deskripsi: string;
      toolsOnline: string[];
    };
  };
  pengalamanBelajar: PengalamanBelajarPertemuan[];
  asesmenPembelajaran: {
    asesmenAwal: {
      jenis: string;
      deskripsi: string;
      teknik: string;
      instrumen: string;
      indikatorPertanyaan: string[];
    };
    asesmenProses: {
      jenis: string;
      deskripsi: string;
      teknik: string;
      instrumen: string;
      rubrikObservasi: string[];
    };
    asesmenAkhir: {
      jenis: string;
      deskripsi: string;
      teknik: string;
      instrumen: string;
      kriteriaKetercapaian: string[];
    };
  };
  pengesahan: {
    namaKabupaten: string;
    tanggalPembuatan: string;
    namaSatuanPendidikan: string;
    namaKepalaSekolah: string;
    nipKepalaSekolah: string;
    namaMapel: string;
    namaGuru: string;
    nipGuru: string;
  };
}
