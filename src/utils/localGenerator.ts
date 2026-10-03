import type { PPMInput, PPMOutputData, PengalamanBelajarPertemuan } from '../types/ppm';

export const SINTAKS_MODEL_MAP: Record<string, { tahapan: string[]; fokus: string }> = {
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

export function generateClientFallbackPPM(input: PPMInput): PPMOutputData {
  const {
    namaSatuanPendidikan,
    namaGuru,
    nipGuru,
    namaKepalaSekolah,
    nipKepalaSekolah,
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

  const lintasDisiplin = `${mapel} terintegrasi secara kontekstual dengan Bahasa Indonesia (keterampilan komunikasi dan penalaran logis), Pendidikan Pancasila (kerja sama, empati, dan gotong royong), serta Literasi Digital (pemanfaatan sumber belajar interaktif dan etika informasi).`;

  const tools = [
    'Canva for Education (pembuatan infografis & presentasi hasil karya)',
    'Quizizz / Kahoot! (asesmen diagnostik & kuis interaktif)',
    'Google Workspace for Education (Docs/Slides kolaboratif)',
    'Padlet / Miro (papan kolaborasi ide & refleksi digital)',
    'YouTube Edukasi / Rumah Belajar Kemendikbudristek (video stimulus kontekstual)',
  ];

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
