import Image from "next/image";
import feature1 from "@/app/assets/img/feature1.png";
import feature2 from "@/app/assets/img/feature2.png";

const Features = () => {
  return (
    <section className="container mx-auto px-4 xl:max-w-[1200px]">
      <h2 className="text-pink-500 text-2xl font-bold mt-16 mb-4 text-center">
        Telah dipakai 100+ mahasiswa cari tamang
      </h2>
      <p className="tracking-wide text-base/relaxed text-center">
        Don't reinvent the wheel.
      </p>
      <p className="tracking-wide text-base/relaxed text-center">
        Adopt proven retention strategies from the industry.
      </p>

      <div className="md:flex justify-center gap-8  bg-card-green text-card-green-d px-4 mt-4 rounded-4xl">
        <div>
          <p className="uppercase text-sm font-black pt-4 pb-2 tracking-tight">
            Khusus untuk satu kampus
          </p>
          <h3 className="font-bold text-[28px]/10 ">
            Komunitas yang terverifikasi
          </h3>
          <p className="my-6">
            Setiap pengguna diverifikasi menggunakan email kampus, jadi kamu
            hanya berinteraksi dengan mahasiswa atau alumni dari universitas
            yang sama.
          </p>
        </div>
        <div className="xl:max-w-1/2">
          <Image
            src={feature1}
            className="w-full pb-2 md:pt-6"
            alt="test"
            width={1920}
            height={1080}
          />
        </div>
      </div>

      <div className="md:flex justify-center gap-8 bg-card-pink text-card-pink-d px-4 mt-4 rounded-4xl">
        <div>
          <p className="uppercase text-sm font-black pt-4 pb-2 tracking-tight">
            Lebih dari sekadar dating
          </p>
          <h3 className="font-bold text-[28px]/10 ">
            Desain simpel, cocok untuk mahasiswa
          </h3>
          <p className="my-6">
            Tanpa fitur berlebihan. Cukup daftar, lengkapi profil, dan mulai
            terhubung. Dirancang agar kamu bisa langsung fokus pada kenalan
            baru.
          </p>
        </div>
        <div className="xl:max-w-1/2">
          <Image
            src={feature1}
            className="w-full pb-2 md:pt-6"
            alt="test"
            width={1920}
            height={1080}
          />
        </div>
      </div>

      <div className="md:flex justify-center gap-8 bg-card-blue text-card-blue-d px-4 mt-4 rounded-4xl">
        <div>
          <p className="uppercase text-sm font-black pt-4 pb-2 tracking-tight">
            Lebih dari sekadar dating
          </p>
          <h3 className="font-bold text-[28px]/10 ">
            Bangun koneksi, bukan hanya romansa
          </h3>
          <p className="my-6">
            Cari teman satu minat, partner diskusi, atau bahkan teman nonton
            bareng. Platform ini mendukung hubungan dalam berbagai bentuk.
          </p>
        </div>
        <div className="xl:max-w-1/2">
          <Image
            src={feature1}
            className="w-full pb-2 md:pt-6"
            alt="test"
            width={1920}
            height={1080}
          />
        </div>
      </div>

      <div className="md:flex justify-center gap-8 bg-card-purple text-card-purbg-card-purple-d px-4 mt-4 rounded-4xl">
        <div>
          <p className="uppercase text-sm font-black pt-4 pb-2 tracking-tight">
            Jalan dua arah
          </p>
          <h3 className="font-bold text-[28px]/10 ">
            Hanya cocok jika kalian berdua setuju
          </h3>
          <p className="my-6">
            Kami menerapkan sistem saling menyukai. Tidak ada pesan yang bisa
            dikirim tanpa kecocokan dari kedua belah pihak, untuk mencegah spam
            atau gangguan.
          </p>
        </div>
        <div className="xl:max-w-1/2">
          <Image
            src={feature1}
            className="w-full pb-2 md:pt-6"
            alt="test"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </section>
  );
};
export default Features;
