import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign,
  ShadingType,
} from 'docx';
import type { PPMOutputData } from '../types/ppm';

// Helper to create Arial 11pt paragraph
function createP(
  text: string,
  options: {
    bold?: boolean;
    italic?: boolean;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spaceBefore?: number;
    spaceAfter?: number;
    bullet?: boolean;
  } = {}
): Paragraph {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: {
      before: options.spaceBefore ?? 60,
      after: options.spaceAfter ?? 60,
      line: 276, // 1.15 line spacing
    },
    bullet: options.bullet ? { level: 0 } : undefined,
    children: [
      new TextRun({
        text,
        font: 'Arial',
        size: 22, // 11pt in half-points
        bold: options.bold,
        italics: options.italic,
      }),
    ],
  });
}

// Helper to create table cell with clean border and padding
function createCell(
  paragraphs: Paragraph[],
  options: {
    widthPercent?: number;
    isHeader?: boolean;
    bgColor?: string;
    colSpan?: number;
    rowSpan?: number;
  } = {}
): TableCell {
  return new TableCell({
    width: options.widthPercent ? { size: options.widthPercent, type: WidthType.PERCENTAGE } : undefined,
    columnSpan: options.colSpan,
    rowSpan: options.rowSpan,
    verticalAlign: VerticalAlign.TOP,
    shading: options.bgColor
      ? {
          type: ShadingType.CLEAR,
          fill: options.bgColor,
          color: 'auto',
        }
      : options.isHeader
      ? {
          type: ShadingType.CLEAR,
          fill: 'F1F5F9', // light slate
          color: 'auto',
        }
      : undefined,
    margins: {
      top: 120, // ~6pt
      bottom: 120,
      left: 140, // ~7pt
      right: 140,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    },
    children: paragraphs,
  });
}

export async function exportPPMToWord(ppm: PPMOutputData): Promise<void> {
  const sectionsChildren: (Paragraph | Table)[] = [];

  // Document Title Header
  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 100 },
      children: [
        new TextRun({
          text: 'PERENCANAAN PEMBELAJARAN MENDALAM (PPM)',
          font: 'Arial',
          size: 28, // 14pt
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300 },
      children: [
        new TextRun({
          text: `${ppm.identitas.namaSatuanPendidikan.toUpperCase()} - TAHUN AJARAN ${ppm.identitas.tahunPelajaran}`,
          font: 'Arial',
          size: 22,
          bold: true,
        }),
      ],
    })
  );

  // Section 1 Header
  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'TABEL 1: IDENTITAS PEMBELAJARAN',
          font: 'Arial',
          size: 24, // 12pt
          bold: true,
        }),
      ],
    })
  );

  // Table 1: Identitas
  const table1Rows: TableRow[] = [
    new TableRow({
      children: [
        createCell([createP('No', { bold: true, alignment: AlignmentType.CENTER })], { widthPercent: 8, isHeader: true }),
        createCell([createP('Komponen Identitas', { bold: true })], { widthPercent: 35, isHeader: true }),
        createCell([createP('Deskripsi / Informasi', { bold: true })], { widthPercent: 57, isHeader: true }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('a.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Nama Satuan Pendidikan', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.identitas.namaSatuanPendidikan)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('b.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Mata Pelajaran', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.identitas.mataPelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('c.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Kelas / Semester', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.identitas.kelasSemester)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('d.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Materi Pelajaran', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.identitas.materiPelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('e.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Durasi Pertemuan', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.identitas.durasiPertemuan)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('f.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Tahun Pelajaran', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.identitas.tahunPelajaran)], { widthPercent: 57 }),
      ],
    }),
  ];

  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: table1Rows,
    }),
    new Paragraph({ spacing: { before: 150, after: 100 } })
  );

  // Section 2 Header
  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'TABEL 2: IDENTIFIKASI KESIAPAN DAN PROFIL LULUSAN',
          font: 'Arial',
          size: 24,
          bold: true,
        }),
      ],
    })
  );

  // Table 2: Identifikasi
  const kesiapanP = [
    createP(`1) Pengetahuan Awal: ${ppm.identifikasi.kesiapanPesertaDidik.pengetahuanAwal}`),
    createP(`2) Minat Belajar: ${ppm.identifikasi.kesiapanPesertaDidik.minat}`),
    createP(`3) Latar Belakang: ${ppm.identifikasi.kesiapanPesertaDidik.latarBelakang}`),
    createP(`4) Kebutuhan Belajar: ${ppm.identifikasi.kesiapanPesertaDidik.kebutuhanBelajar}`),
  ];

  const dimensiParagraphs = ppm.identifikasi.capaianDimensiProfilLulusan.map((dimensi) =>
    createP(`• ${dimensi}`)
  );

  const table2Rows: TableRow[] = [
    new TableRow({
      children: [
        createCell([createP('No', { bold: true, alignment: AlignmentType.CENTER })], { widthPercent: 8, isHeader: true }),
        createCell([createP('Aspek Identifikasi', { bold: true })], { widthPercent: 35, isHeader: true }),
        createCell([createP('Uraian Identifikasi Pembelajaran Mendalam', { bold: true })], { widthPercent: 57, isHeader: true }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('a.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell(
          [
            createP('Peserta Didik', { bold: true }),
            createP('(Identifikasi kesiapan sebelum belajar: pengetahuan awal, minat, latar belakang, & kebutuhan belajar)', { italic: true }),
          ],
          { widthPercent: 35 }
        ),
        createCell(kesiapanP, { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('b.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Materi Pelajaran', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.identifikasi.materiPelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('c.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Capaian Dimensi Profil Lulusan', { bold: true })], { widthPercent: 35 }),
        createCell(dimensiParagraphs, { widthPercent: 57 }),
      ],
    }),
  ];

  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: table2Rows,
    }),
    new Paragraph({ spacing: { before: 150, after: 100 } })
  );

  // Section 3 Header
  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'TABEL 3: DESAIN PEMBELAJARAN MENDALAM',
          font: 'Arial',
          size: 24,
          bold: true,
        }),
      ],
    })
  );

  // Table 3: Desain Pembelajaran
  const digitalToolsP = [
    createP(ppm.desainPembelajaran.pemanfaatanDigital.deskripsi),
    ...ppm.desainPembelajaran.pemanfaatanDigital.toolsOnline.map((t) => createP(`• ${t}`)),
  ];

  const table3Rows: TableRow[] = [
    new TableRow({
      children: [
        createCell([createP('No', { bold: true, alignment: AlignmentType.CENTER })], { widthPercent: 8, isHeader: true }),
        createCell([createP('Elemen Desain', { bold: true })], { widthPercent: 35, isHeader: true }),
        createCell([createP('Rancangan Pedagogis Mendalam', { bold: true })], { widthPercent: 57, isHeader: true }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('a.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Capaian Pembelajaran (CP)', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.desainPembelajaran.capaianPembelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('b.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Lintas Disiplin Ilmu', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.desainPembelajaran.lintasDisiplinIlmu)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('c.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Tujuan Pembelajaran (TP)', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.desainPembelajaran.tujuanPembelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('d.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Topik Pembelajaran', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.desainPembelajaran.topikPembelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('e.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Praktik Pedagogis per Pertemuan', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.desainPembelajaran.praktikPedagogisRingkasan)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('f.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Kemitraan Pembelajaran', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.desainPembelajaran.kemitraanPembelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('g.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Lingkungan Pembelajaran', { bold: true })], { widthPercent: 35 }),
        createCell([createP(ppm.desainPembelajaran.lingkunganPembelajaran)], { widthPercent: 57 }),
      ],
    }),
    new TableRow({
      children: [
        createCell([createP('h.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell([createP('Pemanfaatan Digital', { bold: true })], { widthPercent: 35 }),
        createCell(digitalToolsP, { widthPercent: 57 }),
      ],
    }),
  ];

  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: table3Rows,
    }),
    new Paragraph({ spacing: { before: 150, after: 100 } })
  );

  // Section 4 Header
  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'TABEL 4: PENGALAMAN BELAJAR (MEMAHAMI, MENGAPLIKASI, REFLEKSI)',
          font: 'Arial',
          size: 24,
          bold: true,
        }),
      ],
    })
  );

  // Table 4: Pengalaman Belajar (Supports multi-meeting)
  const table4Rows: TableRow[] = [
    new TableRow({
      children: [
        createCell([createP('Pertemuan & Sub Topik', { bold: true, alignment: AlignmentType.CENTER })], { widthPercent: 25, isHeader: true }),
        createCell([createP('Pilar & Tahapan Pembelajaran', { bold: true })], { widthPercent: 25, isHeader: true }),
        createCell([createP('Langkah-Langkah & Sintaks Aktivitas Mendalam', { bold: true })], { widthPercent: 50, isHeader: true }),
      ],
    }),
  ];

  ppm.pengalamanBelajar.forEach((pb) => {
    // 1. Memahami (Awal)
    table4Rows.push(
      new TableRow({
        children: [
          createCell(
            [
              createP(`PERTEMUAN ${pb.pertemuanKe}`, { bold: true }),
              createP(`Model: ${pb.praktikPedagogis}`),
              createP(`Durasi: ${pb.durasi}`),
              createP(`Sub Topik:`, { bold: true }),
              createP(pb.subTopik),
            ],
            { widthPercent: 25, rowSpan: 3, bgColor: 'F8FAFC' }
          ),
          createCell(
            [
              createP('1. KEGIATAN AWAL', { bold: true }),
              createP(pb.kegiatanAwal.labelPrinsip, { bold: true }),
              createP(`Waktu: ${pb.kegiatanAwal.alokasiWaktu}`, { italic: true }),
            ],
            { widthPercent: 25 }
          ),
          createCell(
            [
              createP(pb.kegiatanAwal.deskripsiKegiatan, { italic: true }),
              ...pb.kegiatanAwal.langkahLangkah.map((step) => createP(`• ${step}`)),
            ],
            { widthPercent: 50 }
          ),
        ],
      })
    );

    // 2. Mengaplikasi (Inti)
    const intiParagraphs: Paragraph[] = [
      createP(pb.kegiatanInti.deskripsiKegiatan, { italic: true }),
    ];
    pb.kegiatanInti.sintaks.forEach((item) => {
      intiParagraphs.push(
        createP(item.tahap, { bold: true, spaceBefore: 80 }),
        createP(item.aktivitas)
      );
    });

    table4Rows.push(
      new TableRow({
        children: [
          createCell(
            [
              createP('2. KEGIATAN INTI', { bold: true }),
              createP(pb.kegiatanInti.labelPrinsip, { bold: true }),
              createP(`Waktu: ${pb.kegiatanInti.alokasiWaktu}`, { italic: true }),
            ],
            { widthPercent: 25 }
          ),
          createCell(intiParagraphs, { widthPercent: 50 }),
        ],
      })
    );

    // 3. Refleksi (Penutup)
    table4Rows.push(
      new TableRow({
        children: [
          createCell(
            [
              createP('3. KEGIATAN PENUTUP', { bold: true }),
              createP(pb.kegiatanPenutup.labelPrinsip, { bold: true }),
              createP(`Waktu: ${pb.kegiatanPenutup.alokasiWaktu}`, { italic: true }),
            ],
            { widthPercent: 25 }
          ),
          createCell(
            [
              createP(pb.kegiatanPenutup.deskripsiKegiatan, { italic: true }),
              ...pb.kegiatanPenutup.langkahLangkah.map((step) => createP(`• ${step}`)),
            ],
            { widthPercent: 50 }
          ),
        ],
      })
    );
  });

  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: table4Rows,
    }),
    new Paragraph({ spacing: { before: 150, after: 100 } })
  );

  // Section 5 Header
  sectionsChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'TABEL 5: ASESMEN PEMBELAJARAN',
          font: 'Arial',
          size: 24,
          bold: true,
        }),
      ],
    })
  );

  // Table 5: Asesmen
  const table5Rows: TableRow[] = [
    new TableRow({
      children: [
        createCell([createP('No', { bold: true, alignment: AlignmentType.CENTER })], { widthPercent: 8, isHeader: true }),
        createCell([createP('Jenis Asesmen', { bold: true })], { widthPercent: 25, isHeader: true }),
        createCell([createP('Teknik & Instrumen', { bold: true })], { widthPercent: 27, isHeader: true }),
        createCell([createP('Deskripsi & Rubrik / Indikator Penilaian', { bold: true })], { widthPercent: 40, isHeader: true }),
      ],
    }),
    // Asesmen Awal
    new TableRow({
      children: [
        createCell([createP('1.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell(
          [
            createP('Asesmen Awal', { bold: true }),
            createP('(Diagnostik / Apersepsi)', { italic: true }),
          ],
          { widthPercent: 25 }
        ),
        createCell(
          [
            createP(`Teknik: ${ppm.asesmenPembelajaran.asesmenAwal.teknik}`),
            createP(`Instrumen: ${ppm.asesmenPembelajaran.asesmenAwal.instrumen}`),
          ],
          { widthPercent: 27 }
        ),
        createCell(
          [
            createP(ppm.asesmenPembelajaran.asesmenAwal.deskripsi),
            createP('Contoh Pertanyaan Pemantik:', { bold: true }),
            ...ppm.asesmenPembelajaran.asesmenAwal.indikatorPertanyaan.map((q) => createP(`• ${q}`)),
          ],
          { widthPercent: 40 }
        ),
      ],
    }),
    // Asesmen Proses
    new TableRow({
      children: [
        createCell([createP('2.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell(
          [
            createP('Asesmen Proses', { bold: true }),
            createP('(Formatif / Observasi / Diskusi)', { italic: true }),
          ],
          { widthPercent: 25 }
        ),
        createCell(
          [
            createP(`Teknik: ${ppm.asesmenPembelajaran.asesmenProses.teknik}`),
            createP(`Instrumen: ${ppm.asesmenPembelajaran.asesmenProses.instrumen}`),
          ],
          { widthPercent: 27 }
        ),
        createCell(
          [
            createP(ppm.asesmenPembelajaran.asesmenProses.deskripsi),
            createP('Rubrik Observasi & Sikap Profil Lulusan:', { bold: true }),
            ...ppm.asesmenPembelajaran.asesmenProses.rubrikObservasi.map((r) => createP(`• ${r}`)),
          ],
          { widthPercent: 40 }
        ),
      ],
    }),
    // Asesmen Akhir
    new TableRow({
      children: [
        createCell([createP('3.', { alignment: AlignmentType.CENTER })], { widthPercent: 8 }),
        createCell(
          [
            createP('Asesmen Akhir', { bold: true }),
            createP('(Sumatif / Produk / Portofolio)', { italic: true }),
          ],
          { widthPercent: 25 }
        ),
        createCell(
          [
            createP(`Teknik: ${ppm.asesmenPembelajaran.asesmenAkhir.teknik}`),
            createP(`Instrumen: ${ppm.asesmenPembelajaran.asesmenAkhir.instrumen}`),
          ],
          { widthPercent: 27 }
        ),
        createCell(
          [
            createP(ppm.asesmenPembelajaran.asesmenAkhir.deskripsi),
            createP('Kriteria Ketercapaian Hasil Belajar:', { bold: true }),
            ...ppm.asesmenPembelajaran.asesmenAkhir.kriteriaKetercapaian.map((k) => createP(`• ${k}`)),
          ],
          { widthPercent: 40 }
        ),
      ],
    }),
  ];

  sectionsChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: table5Rows,
    }),
    new Paragraph({ spacing: { before: 200, after: 100 } })
  );

  // Date and Kabupaten on the top-right of signature block
  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 250, after: 100 },
      children: [
        new TextRun({
          text: `${ppm.pengesahan.namaKabupaten}, ${ppm.pengesahan.tanggalPembuatan}`,
          font: 'Arial',
          size: 22,
        }),
      ],
    })
  );

  // Signature Block Table:
  // Left: Kepala Satuan Pendidikan, stand kosong tanda tangan, Nama Kepala Sekolah, NIP.
  // Right: Guru Mata Pelajaran, stand kosong tanda tangan, Nama Guru, NIP.
  const signatureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Mengetahui,',
                    font: 'Arial',
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Kepala Satuan Pendidikan`,
                    font: 'Arial',
                    size: 22,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: ppm.pengesahan.namaSatuanPendidikan,
                    font: 'Arial',
                    size: 22,
                  }),
                ],
              }),
              // Stand kosong untuk tanda tangan
              new Paragraph({
                spacing: { before: 700, after: 0 },
                children: [],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: ppm.pengesahan.namaKepalaSekolah,
                    font: 'Arial',
                    size: 22,
                    bold: true,
                    underline: {},
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `NIP. ${ppm.pengesahan.nipKepalaSekolah}`,
                    font: 'Arial',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Guru Mata Pelajaran,',
                    font: 'Arial',
                    size: 22,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: ppm.pengesahan.namaMapel,
                    font: 'Arial',
                    size: 22,
                  }),
                ],
              }),
              // Stand kosong untuk tanda tangan
              new Paragraph({
                spacing: { before: 880, after: 0 },
                children: [],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: ppm.pengesahan.namaGuru,
                    font: 'Arial',
                    size: 22,
                    bold: true,
                    underline: {},
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `NIP. ${ppm.pengesahan.nipGuru}`,
                    font: 'Arial',
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  sectionsChildren.push(signatureTable);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 standard width in twips (210mm)
              height: 16838, // A4 standard height in twips (297mm)
            },
            margin: {
              top: 1440, // 2.54 cm / 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: sectionsChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `PPM_${ppm.identitas.mataPelajaran.replace(/\s+/g, '_')}_${ppm.identitas.namaSatuanPendidikan.replace(/\s+/g, '_')}.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
