export const FAKULTAS_UNSRAT = {
  "Fakultas Kedokteran": [
    "Pendidikan Dokter",
    "Ilmu Keperawatan",
  ],
  "Fakultas Teknik": [
    "Teknik Elektro",
    "Teknik Mesin",
    "Teknik Sipil",
    "Arsitektur",
    "Perencanaan Wilayah dan Kota",
    "Teknik Informatika",
  ],
  "Fakultas Pertanian": [
    "Agroteknologi",
    "Agribisnis",
    "Ilmu dan Teknologi Pangan",
  ],
  "Fakultas Peternakan": [
    "Peternakan",
  ],
  "Fakultas Perikanan dan Ilmu Kelautan": [
    "Manajemen Sumberdaya Perairan",
    "Budidaya Perairan",
    "Agrobisnis Perikanan",
    "Ilmu Kelautan",
  ],
  "Fakultas Ekonomi dan Bisnis": [
    "Ekonomi Pembangunan",
    "Manajemen",
    "Akuntansi",
  ],
  "Fakultas Hukum": [
    "Ilmu Hukum",
  ],
  "Fakultas Ilmu Sosial dan Politik": [
    "Ilmu Administrasi Negara",
    "Ilmu Komunikasi",
    "Sosiologi",
    "Ilmu Pemerintahan",
  ],
  "Fakultas Sastra": [
    "Sastra Indonesia",
    "Sastra Inggris",
    "Sastra Jepang",
    "Ilmu Sejarah",
  ],
  "Fakultas Matematika dan Ilmu Pengetahuan Alam": [
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
    "Farmasi",
  ],
  "Fakultas Kesehatan Masyarakat": [
    "Kesehatan Masyarakat",
  ],
} as const;

export type Fakultas = keyof typeof FAKULTAS_UNSRAT;
export type Prodi<F extends Fakultas> = (typeof FAKULTAS_UNSRAT)[F][number];

export const FAKULTAS_LIST = Object.keys(FAKULTAS_UNSRAT) as Fakultas[];

export function getProdiList(fakultas: Fakultas): readonly string[] {
  return FAKULTAS_UNSRAT[fakultas] || [];
}

export function generateAngkatanOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear; i >= currentYear - 7; i--) {
    years.push(i);
  }
  return years;
}

export const VALID_EMAIL_DOMAIN = "@student.unsrat.ac.id";

export function isValidUnsratEmail(email: string): boolean {
  return email.toLowerCase().endsWith(VALID_EMAIL_DOMAIN);
}
