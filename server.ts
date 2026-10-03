import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import type { PPMInput, PPMOutputData, PengalamanBelajarPertemuan } from './src/types/ppm';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI with proper telemetry headers
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Pedagogical Sintaks Templates for Indonesian Learning Models
const SINTAKS_MODEL_MAP: Record<string, { tahapan: string[]; fokus: string }> = {
  'Problem Based Learning': {
    fokus: 'Pemecahan masalah autentik kontekstual',
    tahapan: [
      'Orientasi peserta didik pada masalah kontekstual',
      'Mengorganisasikan peserta didik untuk belajar',
      'Membimbing penyelidikan individu maupun kelompok',
      'Mengembangkan dan menyajikan hasil karya / solusi',
      'Menganalisis dan mengevaluasi proses pemecahan masalah',
    ],
  },
  'Problem Solving': {
    fokus: 'Pemecahan masalah sistematis',
    tahapan: [
      'Merumuskan dan mengidentifikasi masalah',
      'Menelaah masalah dan merumuskan hipotesis',
      'Mengumpulkan data dan bahan pembuktian',
      'Menguji hipotesis dan menentukan alternatif solusi',
      'Menarik kesimpulan dan merefleksikan proses',
    ],
  },
  'PjBL': {
    fokus: 'Penyelidikan mendalam menghasilkan produk nyata',
    tahapan: [
      'Menentukan pertanyaan mendasar (essential question)',
      'Mendesain perencanaan proyek secara kolaboratif',
      'Menyusun jadwal pembuatan proyek',
      'Memonitor keaktifan dan perkembangan proyek peserta didik',
      'Menguji hasil karya dan asesmen produk',
      'Mengevaluasi pengalaman dan refleksi pembelajaran',
    ],
  },
  'Inkuiri-Discovery Learning': {
    fokus: 'Penemuan konsep melalui penyelidikan aktif',
    tahapan: [
      'Pemberian rangsangan (Stimulation)',
      'Pernyataan / Identifikasi masalah (Problem Statement)',
      'Pengumpulan data (Data Collection)',
      'Pengolahan data (Data Processing)',
      'Pembuktian (Verification)',
      'Menarik simpulan / generalisasi (Generalization)',
    ],
  },
  'Discovery Learning': {
    fokus: 'Penemuan konsep mandiri terbimbing',
    tahapan: [
      'Stimulasi rangsangan fenomena nyata',
      'Identifikasi masalah dan hipotesis',
      'Pengumpulan informasi dan observasi',
      'Pengolahan data dan diskusi kelompok',
      'Verifikasi pembuktian konsep',
      'Generalisasi dan penarikan kesimpulan',
    ],
  },
  'Guided Discovery Learning': {
    fokus: 'Penemuan terbimbing dengan scaffolding bertahap',
    tahapan: [
      'Fasilitasi stimulus dan pertanyaan pemantik terarah',
      'Perumusan hipotesis dengan panduan LKPD terstruktur',
      'Eksplorasi dan pengumpulan data secara berkelompok',
      'Bimbingan penataan konsep dan analisis temuan',
      'Validasi simpulan dan penguatan pemahaman oleh guru',
    ],
  },
  'Game Based Learning': {
    fokus: 'Pembelajaran berbasis tantangan dan mekanisme permainan edukatif',
    tahapan: [
      'Pengenalan misi permainan dan aturan belajar',
      'Eksplorasi materi melalui quest / game tantangan edukasi',
      'Kolaborasi tim dalam menyelesaikan teka-teki konsep',
      'Debriefing dan pengaitan aktivitas game dengan konsep inti',
      'Refleksi capaian pembelajaran dan pemberian apresiasi',
    ],
  },
  'Station Learning': {
    fokus: 'Rotasi pos belajar dengan modalitas dan aktivitas beragam',
    tahapan: [
      'Orientasi pos belajar (stasiun literasi, audio-visual, manipulatif, diskusi)',
      'Rotasi peserta didik mengeksplorasi setiap stasiun belajar',
      'Penyelesaian tugas spesifik di masing-masing pos',
      'Konsolidasi temuan antarstasiun dalam kelompok utama',
      'Presentasi galeri belajar dan sintesis menyeluruh',
    ],
  },
};

// Fallback Heuristic Generator for high-fidelity PPM
function generateFallbackPPM(input: PPMInput): PPMOutputData {
  const {
    namaSatuanPendidikan,
    namaGuru,
    nipGuru,
    namaKepalaSekolah,
    nipKepalaSekolah,
    jenjang,
    kelas,
    semester,
    mapel,
    capaianPembelajaran,
    tujuanPembelajaran,
    materiPelajaran,
    tahunPelajaran,
    jumlahPertemuan,
    durasiPertemuan,
    praktikPedagogisPerPertemuan,
    dimensiProfilLulusan,
    namaKabupaten,
    tanggalPembuatan,
  } = input;

  // Lintas disiplin ilmu logic
  const lintasDisiplin = `${mapel} terintegrasi dengan Bahasa Indonesia (keterampilan komunikasi dan penalaran logis), Pendidikan Pancasila (kerja sama, empati, dan gotong royong), serta Literasi Digital (pemanfaatan sumber belajar interaktif dan etika informasi).`;

  // Rekomendasi tools digital
  const tools = [
    'Canva for Education (pembuatan infografis & presentasi hasil karya)',
    'Quizizz / Kahoot! (asesmen diagnostik & kuis interaktif)',
    'Google Workspace for Education (Docs/Slides kolaboratif)',
    'Padlet / Miro (papan kolaborasi ide & refleksi digital)',
    'YouTube Edukasi / Rumah Belajar Kemendikbudristek (video stimulus kontekstual)',
  ];

  // Break subtopics per meeting
  const subTopikList: string[] = [];
  for (let i = 1; i <= jumlahPertemuan; i++) {
    if (jumlahPertemuan === 1) {
      subTopikList.push(`Konsep Inti, Eksplorasi, dan Aplikasi ${materiPelajaran}`);
    } else if (i === 1) {
      subTopikList.push(`Fondasi Dasar dan Identifikasi Masalah: ${materiPelajaran}`);
    } else if (i === jumlahPertemuan) {
      subTopikList.push(`Aplikasi Lanjutan, Pembuatan Produk/Solusi, dan Evaluasi ${materiPelajaran}`);
    } else {
      subTopikList.push(`Penyelidikan Mendalam dan Kolaborasi Praktik ${materiPelajaran} (Bagian ${i})`);
    }
  }

  // Generate Pengalaman Belajar per Pertemuan
  const pengalamanBelajar: PengalamanBelajarPertemuan[] = [];

  for (let i = 0; i < jumlahPertemuan; i++) {
    const pKe = i + 1;
    const modelConfig = praktikPedagogisPerPertemuan[i] || {
      pertemuanKe: pKe,
      model: 'Problem Based Learning',
    };
    const modelName = modelConfig.model || 'Problem Based Learning';
    const subTopik = subTopikList[i] || `Eksplorasi ${materiPelajaran} Bagian ${pKe}`;
    const sintaksInfo = SINTAKS_MODEL_MAP[modelName] || SINTAKS_MODEL_MAP['Problem Based Learning'];

    // Menentukan penekanan pilar pengalaman belajar
    const prinsipAwal = ['berkesadaran', 'bermakna', 'menggembirakan'];
    const prinsipInti = ['bermakna', 'menggembirakan', 'berkesadaran'];
    const prinsipPenutup = ['berkesadaran', 'bermakna'];

    pengalamanBelajar.push({
      pertemuanKe: pKe,
      subTopik,
      praktikPedagogis: modelName,
      durasi: durasiPertemuan,
      kegiatanAwal: {
        labelPrinsip: 'Memahami (Berkesadaran, Bermakna, Menggembirakan)',
        prinsipTerpilih: ['Berkesadaran', 'Bermakna', 'Menggembirakan'],
        alokasiWaktu: '10 - 15 Menit',
        langkahLangkah: [
          `Guru membuka pembelajaran dengan salam ramah, berdoa bersama, dan menyapa peserta didik dengan penuh kehangatan (Berkesadaran).`,
          `Melakukan aktivitas mindful breathing atau ice-breaking relaksasi sederhana untuk menumbuhkan kesiapan belajar dan fokus siswa (Menggembirakan).`,
          `Mengajukan pertanyaan pemantik kontekstual terkait kehidupan nyata siswa yang dihubungkan dengan topik "${subTopik}" (Bermakna).`,
          `Melakukan asesmen awal / apersepsi diagnostik cepat guna memetakan pengetahuan awal siswa tentang ${materiPelajaran}.`,
          `Menyampaikan tujuan pembelajaran, dimensi profil lulusan yang dikembangkan, dan gambaran kegiatan serta manfaatnya dalam kehidupan nyata.`,
        ],
        deskripsiKegiatan: `Pada tahap awal, peserta didik diajak memahami keterkaitan konsep dengan realitas hidup mereka secara sadar (mindful), menemukan nilai esensial pembelajaran, dan dibangun suasana psikologis yang positif serta menggembirakan.`,
      },
      kegiatanInti: {
        labelPrinsip: `Mengaplikasi (Bermakna, Menggembirakan, Berkesadaran) - Sintaks: ${modelName}`,
        prinsipTerpilih: ['Bermakna', 'Menggembirakan', 'Berkesadaran'],
        alokasiWaktu: '45 - 55 Menit',
        sintaks: sintaksInfo.tahapan.map((tahap, idx) => {
          let act = '';
          if (idx === 0) {
            act = `Peserta didik mengamati stimulus fenomena nyata terkait "${subTopik}" melalui tayangan multimedia interaktif / studi kasus lingkungan sekitar. Guru merangsang rasa ingin tahu siswa dengan pertanyaan investigatif.`;
          } else if (idx === 1) {
            act = `Peserta didik membentuk kelompok kolaboratif heterogen, menerima Lembar Kerja Peserta Didik (LKPD) berbasis tantangan, dan berdiskusi membagi peran aktif setiap anggota tim.`;
          } else if (idx === 2) {
            act = `Peserta didik melakukan penyelidikan mandiri dan kelompok dengan mengeksplorasi referensi buku, media digital, atau eksperimen langsung. Guru mendampingi dengan teknik scaffolding sesuai kebutuhan belajar murid.`;
          } else if (idx === 3) {
            act = `Kelompok menyusun draf karya, simpulan temuan, atau prototipe solusi. Setiap perwakilan mempresentasikan hasil eksplorasi secara komunikatif, sementara kelompok lain memberikan tanggapan apresiatif (peer feedback).`;
          } else {
            act = `Guru bersama peserta didik mengonfirmasi temuan konsep, meluruskan miskonsepsi, dan menyimpulkan kaidah mendalam terkait ${subTopik}.`;
          }
          return {
            tahap: `Tahap ${idx + 1}: ${tahap}`,
            aktivitas: act,
          };
        }),
        deskripsiKegiatan: `Peserta didik mengaplikasikan pengetahuan melalui sintaks model ${modelName}, mengalami proses penyelidikan aktif yang bermakna, berkolaborasi dalam suasana menggembirakan, dan menumbuhkan daya nalar kritis secara berkesadaran.`,
      },
      kegiatanPenutup: {
        labelPrinsip: 'Refleksi (Berkesadaran, Bermakna)',
        prinsipTerpilih: ['Berkesadaran', 'Bermakna'],
        alokasiWaktu: '10 - 15 Menit',
        langkahLangkah: [
          `Peserta didik bersama guru merangkum poin-poin esensial dan nilai moral dari pembelajaran yang telah dilalui.`,
          `Peserta didik melakukan refleksi berkesadaran menggunakan teknik 3-2-1 (3 hal baru yang dipahami, 2 hal yang paling menarik, 1 hal yang masih ingin dipelajari lebih lanjut) atau emotikon refleksi.`,
          `Guru memberikan umpan balik konstruktif, penguatan dimensi Profil Lulusan, serta apresiasi setinggi-tingginya atas partisipasi aktif peserta didik.`,
          `Menyampaikan arahan tindak lanjut dan topik untuk pertemuan berikutnya, kemudian menutup kelas dengan doa bersama dan salam penutup.`,
        ],
        deskripsiKegiatan: `Tahap refleksi memberikan ruang kesadaran penuh bagi siswa untuk mengendapkan pemahaman (metakognisi), mengenali perkembangan diri, serta menyadari kebermaknaan ilmu bagi kehidupannya.`,
      },
    });
  }

  return {
    identitas: {
      namaSatuanPendidikan,
      mataPelajaran: mapel,
      kelasSemester: `${kelas} / ${semester}`,
      materiPelajaran,
      durasiPertemuan,
      tahunPelajaran,
    },
    identifikasi: {
      kesiapanPesertaDidik: {
        pengetahuanAwal: `Sebagian besar peserta didik telah memiliki pengetahuan dasar terkait topik melalui pengalaman konkret sehari-hari, namun memerlukan penguatan konsep terstruktur dan pengkaitan ilmiah.`,
        minat: `Peserta didik memiliki antusiasme tinggi terhadap aktivitas belajar yang melibatkan media visual, diskusi kelompok dinamis, studi kasus kontekstual, dan aktivitas berbasis teknologi edukasi.`,
        latarBelakang: `Latar belakang sosial budaya peserta didik majemuk dengan kecenderungan gaya belajar variatif (visual, auditori, dan kinestetik) yang menuntut pendekatan diferensiasi proses dan konten.`,
        kebutuhanBelajar: `Memerlukan fasilitasi pembelajaran berdiferensiasi: siswa cepat memerlukan tantangan pengayaan (higher-order thinking), sedangkan siswa yang memerlukan bimbingan diberikan pendampingan bertahap (scaffolding).`,
        ringkasan: `Peserta didik menunjukkan kesiapan belajar yang beragam; intervensi difokuskan pada penguatan literasi konsep, pengalaman belajar bermakna, dan penanaman rasa percaya diri melalui kolaborasi suportif.`,
      },
      materiPelajaran,
      capaianDimensiProfilLulusan: dimensiProfilLulusan,
    },
    desainPembelajaran: {
      capaianPembelajaran,
      lintasDisiplinIlmu: lintasDisiplin,
      tujuanPembelajaran,
      topikPembelajaran: `${materiPelajaran}: Eksplorasi Konseptual, Penyelidikan Kontekstual, dan Aplikasi Solutif`,
      praktikPedagogisRingkasan: praktikPedagogisPerPertemuan
        .map((p) => `Pertemuan ${p.pertemuanKe}: ${p.model}`)
        .join('; '),
      kemitraanPembelajaran: `Kolaborasi aktif antara Guru Kelas/Mapel dengan Orang Tua/Wali Murid (sebagai pendamping refleksi di rumah), Komunitas Belajar Sekolah (diskusi peer-teacher), serta narasumber praktisi atau lingkungan masyarakat sekitar.`,
      lingkunganPembelajaran: `Ruang kelas yang fleksibel dan interaktif dengan penataan meja berkelompok (student-centered), perpustakaan sekolah, laboratorium/pojok literasi digital, serta lingkungan alam terbuka di area sekolah yang aman dan inspiratif.`,
      pemanfaatanDigital: {
        deskripsi: `Integrasi teknologi digital yang beretika, interaktif, dan memperkaya kedalaman penyelidikan siswa.`,
        toolsOnline: tools,
      },
    },
    pengalamanBelajar,
    asesmenPembelajaran: {
      asesmenAwal: {
        jenis: 'Asesmen Diagnostik Kognitif & Non-Kognitif (Apersepsi)',
        deskripsi: `Dilakukan sebelum pembelajaran dimulai untuk memetakan kesiapan kognitif, minat, dan kondisi emosional murid.`,
        teknik: 'Kuis interaktif singkat (mentimeter/quizizz/flashcard), tanya jawab lisan pemantik.',
        instrumen: 'Lembar ceklis kesiapan belajar dan daftar pertanyaan apersepsi diagnostik.',
        indikatorPertanyaan: [
          `"Pernahkah kalian menjumpai fenomena terkait ${materiPelajaran} dalam kehidupan sehari-hari?"`,
          `"Menurut kalian, mengapa hal tersebut dapat terjadi dan apa pengaruhnya bagi kita?"`,
          `"Apa harapan atau hal yang paling ingin kalian ketahui lebih dalam pada materi ini?"`,
        ],
      },
      asesmenProses: {
        jenis: 'Asesmen Formatif Berkelanjutan (Assessment for & as Learning)',
        deskripsi: `Dilakukan selama proses pembelajaran berlangsung guna memantau perkembangan pemahaman, dimensi profil lulusan, dan keaktifan kolaborasi.`,
        teknik: 'Observasi kinerja kelompok, penilaian antar-teman (peer-assessment), dan rubrik diskusi.',
        instrumen: 'Lembar observasi dimensi Profil Lulusan dan rubrik unjuk kerja pemecahan masalah / LKPD.',
        rubrikObservasi: [
          `Partisipasi aktif dan kontribusi ide dalam diskusi kelompok (Kolaborasi).`,
          `Kemampuan mengajukan pertanyaan kritis dan menganalisis argumen berdasarkan bukti (Penalaran Kritis).`,
          `Kreativitas dalam mengolah data serta menyajikan ide atau prototipe karya (Kreativitas).`,
          `Sikap saling menghargai, gotong royong, dan kedisiplinan mengelola waktu (Kemandirian & Keimanan/Kewargaan).`,
        ],
      },
      asesmenAkhir: {
        jenis: 'Asesmen Sumatif (Assessment of Learning)',
        deskripsi: `Dilakukan pada akhir rangkaian pertemuan untuk mengukur ketercapaian Tujuan Pembelajaran secara holistik.`,
        teknik: 'Penilaian produk hasil karya / portofolio / presentasi proyek dan tes tertulis pemahaman konsep.',
        instrumen: 'Rubrik penilaian produk autentik dan soal uraian berbasis Higher Order Thinking Skills (HOTS).',
        kriteriaKetercapaian: [
          `Ketepatan penjelasan konsep esensial sesuai Tujuan Pembelajaran (Kognitif).`,
          `Kualitas solusi atau produk yang dihasilkan, kerapian, orisinalitas, dan kegunaannya (Produk/Karya).`,
          `Keterampilan komunikasi artikulatif saat menyajikan hasil dan menjawab pertanyaan (Komunikasi).`,
          `Kematangan refleksi diri mengenai makna pembelajaran yang didapat (Metakognisi).`,
        ],
      },
    },
    pengesahan: {
      namaKabupaten,
      tanggalPembuatan,
      namaSatuanPendidikan,
      namaKepalaSekolah,
      nipKepalaSekolah,
      namaMapel: mapel,
      namaGuru,
      nipGuru,
    },
  };
}

// API endpoint to generate complete PPM
app.post('/api/generate-ppm', async (req: Request, res: Response) => {
  try {
    const input: PPMInput = req.body;

    if (!input.namaSatuanPendidikan || !input.namaGuru || !input.mapel) {
      res.status(400).json({ error: 'Data input wajib diisi secara lengkap.' });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log('Gemini API key not found, using high-fidelity pedagogical fallback generator.');
      const fallbackResult = generateFallbackPPM(input);
      res.json({ data: fallbackResult, source: 'heuristic' });
      return;
    }

    // Build comprehensive prompt for Gemini
    const prompt = `
Anda adalah konsultan ahli kurikulum dan perancang Perencanaan Pembelajaran Mendalam (PPM) / Deep Learning bertaraf nasional di Indonesia.
Buatkan dokumen resmi Perencanaan Pembelajaran Mendalam (PPM) yang sangat lengkap, komprehensif, akademis, dan terstruktur sesuai regulasi dan pedoman Pembelajaran Mendalam Kementerian Pendidikan.

DATA INPUT DARI PENGGUNA:
- Nama Satuan Pendidikan: ${input.namaSatuanPendidikan}
- Jenjang: ${input.jenjang}
- Kelas: ${input.kelas}
- Semester: ${input.semester}
- Mata Pelajaran: ${input.mapel}
- Tahun Pelajaran: ${input.tahunPelajaran}
- Materi Pelajaran: ${input.materiPelajaran}
- Capaian Pembelajaran (CP): ${input.capaianPembelajaran}
- Tujuan Pembelajaran (TP): ${input.tujuanPembelajaran}
- Jumlah Pertemuan: ${input.jumlahPertemuan}
- Durasi Setiap Pertemuan: ${input.durasiPertemuan}
- Praktik Pedagogis per Pertemuan: ${JSON.stringify(input.praktikPedagogisPerPertemuan)}
- Dimensi Profil Lulusan: ${input.dimensiProfilLulusan.join(', ')}
- Nama Kepala Sekolah: ${input.namaKepalaSekolah} (NIP: ${input.nipKepalaSekolah})
- Nama Guru: ${input.namaGuru} (NIP: ${input.nipGuru})
- Kabupaten: ${input.namaKabupaten}
- Tanggal Pembuatan: ${input.tanggalPembuatan}

KETENTUAN STRUKTUR OUTPUT (5 TABEL UTAMA):
1. Tabel 1 (Identitas):
   - Nama Satuan Pendidikan
   - Mata Pelajaran
   - Kelas/Semester
   - Materi Pelajaran
   - Durasi Pertemuan
   - Tahun Pelajaran
2. Tabel 2 (Identifikasi):
   - Kesiapan Peserta Didik (pengetahuan awal, minat, latar belakang, kebutuhan belajar)
   - Materi Pelajaran
   - Capaian Dimensi Profil Lulusan
3. Tabel 3 (Desain Pembelajaran):
   - Capaian Pembelajaran
   - Lintas Disiplin Ilmu (generate otomatis integrasi mata pelajaran lain)
   - Tujuan Pembelajaran
   - Topik Pembelajaran (disesuaikan AI dari materi)
   - Praktik Pedagogis per Pertemuan (jabarkan model tiap pertemuan)
   - Kemitraan Pembelajaran (orang tua, komunitas, mitra lokal, dsb.)
   - Lingkungan Pembelajaran (ruang kelas, lab, alam terbuka, perpus)
   - Pemanfaatan Digital (rekomendasi tools online aplikatif seperti Canva, Quizizz, PhET, Google Workspace, Padlet, dsb.)
4. Tabel 4 (Pengalaman Belajar):
   - Jika terdapat ${input.jumlahPertemuan} pertemuan, BUAT PENGALAMAN BELAJAR LENGKAP SEBANYAK ${input.jumlahPertemuan} PERTEMUAN!
   - Untuk setiap pertemuan, pecah materi dari Tujuan Pembelajaran menjadi sub topik yang jelas dan runtut.
   - Tiga Pilar Pembelajaran Mendalam per pertemuan:
     a) Memahami (Berkesadaran, Bermakna, Menggembirakan) -> jabarkan kegiatan awal secara detail dan operasional.
     b) Mengaplikasi (Berkesadaran, Bermakna, Menggembirakan) -> jabarkan kegiatan inti sesuai SINTAKS PERSIS dari model pedagogis yang dipilih di pertemuan tersebut! (misal: tahap 1 sampai tahap 5/6 lengkap dengan aktivitas guru dan siswa).
     c) Refleksi (Berkesadaran, Bermakna, Menggembirakan) -> jabarkan kegiatan penutup secara mendalam (umpan balik, metakognisi, tindak lanjut).
5. Tabel 5 (Asesmen Pembelajaran):
   - Asesmen Awal (diagnostik/apersepsi): jenis, teknik, instrumen, contoh pertanyaan.
   - Asesmen Proses (formatif, observasi, rubrik): teknik, instrumen, rubrik observasi profil lulusan.
   - Asesmen Akhir (sumatif, produk, tugas, portofolio): teknik, instrumen, kriteria ketercapaian.

Keluarkan hasil HANYA DALAM FORMAT JSON yang valid sesuai schema berikut:
{
  "identitas": {
    "namaSatuanPendidikan": string,
    "mataPelajaran": string,
    "kelasSemester": string,
    "materiPelajaran": string,
    "durasiPertemuan": string,
    "tahunPelajaran": string
  },
  "identifikasi": {
    "kesiapanPesertaDidik": {
      "pengetahuanAwal": string,
      "minat": string,
      "latarBelakang": string,
      "kebutuhanBelajar": string,
      "ringkasan": string
    },
    "materiPelajaran": string,
    "capaianDimensiProfilLulusan": string[]
  },
  "desainPembelajaran": {
    "capaianPembelajaran": string,
    "lintasDisiplinIlmu": string,
    "tujuanPembelajaran": string,
    "topikPembelajaran": string,
    "praktikPedagogisRingkasan": string,
    "kemitraanPembelajaran": string,
    "lingkunganPembelajaran": string,
    "pemanfaatanDigital": {
      "deskripsi": string,
      "toolsOnline": string[]
    }
  },
  "pengalamanBelajar": [
    {
      "pertemuanKe": number,
      "subTopik": string,
      "praktikPedagogis": string,
      "durasi": string,
      "kegiatanAwal": {
        "labelPrinsip": string,
        "prinsipTerpilih": string[],
        "alokasiWaktu": string,
        "langkahLangkah": string[],
        "deskripsiKegiatan": string
      },
      "kegiatanInti": {
        "labelPrinsip": string,
        "prinsipTerpilih": string[],
        "alokasiWaktu": string,
        "sintaks": [
          { "tahap": string, "aktivitas": string }
        ],
        "deskripsiKegiatan": string
      },
      "kegiatanPenutup": {
        "labelPrinsip": string,
        "prinsipTerpilih": string[],
        "alokasiWaktu": string,
        "langkahLangkah": string[],
        "deskripsiKegiatan": string
      }
    }
  ],
  "asesmenPembelajaran": {
    "asesmenAwal": {
      "jenis": string,
      "deskripsi": string,
      "teknik": string,
      "instrumen": string,
      "indikatorPertanyaan": string[]
    },
    "asesmenProses": {
      "jenis": string,
      "deskripsi": string,
      "teknik": string,
      "instrumen": string,
      "rubrikObservasi": string[]
    },
    "asesmenAkhir": {
      "jenis": string,
      "deskripsi": string,
      "teknik": string,
      "instrumen": string,
      "kriteriaKetercapaian": string[]
    }
  },
  "pengesahan": {
    "namaKabupaten": string,
    "tanggalPembuatan": string,
    "namaSatuanPendidikan": string,
    "namaKepalaSekolah": string,
    "nipKepalaSekolah": string,
    "namaMapel": string,
    "namaGuru": string,
    "nipGuru": string
  }
}
Gunakan Bahasa Indonesia baku dan ejaan yang disempurnakan (PUEBI/EYD). Pastikan narasi kaya, mendalam, dan langsung dapat dipakai guru di sekolah.
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      const parsedData: PPMOutputData = JSON.parse(responseText);

      // Verify and merge pengesahan data
      parsedData.pengesahan = {
        namaKabupaten: input.namaKabupaten,
        tanggalPembuatan: input.tanggalPembuatan,
        namaSatuanPendidikan: input.namaSatuanPendidikan,
        namaKepalaSekolah: input.namaKepalaSekolah,
        nipKepalaSekolah: input.nipKepalaSekolah,
        namaMapel: input.mapel,
        namaGuru: input.namaGuru,
        nipGuru: input.nipGuru,
      };

      res.json({ data: parsedData, source: 'gemini' });
    } catch (aiError) {
      console.error('Error generating with Gemini, falling back to heuristic engine:', aiError);
      const fallbackResult = generateFallbackPPM(input);
      res.json({ data: fallbackResult, source: 'heuristic-fallback' });
    }
  } catch (error: any) {
    console.error('Server error in /api/generate-ppm:', error);
    res.status(500).json({ error: error?.message || 'Gagal membuat dokumen PPM.' });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
