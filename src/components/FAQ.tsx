const FAQ2 = () => {
  return (
    <section className="container mx-auto">
      <h2 className="text-2xl font-poppins my-8 text-center">
        Frequently Asked Questions
      </h2>
      <ul className="max-w-2xl mx-auto  shadow  rounded-xl">
        <li>
          <details className="group">
            <summary className="flex items-center gap-3 px-4 py-3 font-medium marker:content-none hover:cursor-pointer">
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                ></path>
              </svg>
              <span>Siapa saja yang bisa bergabung di situs ini?</span>
            </summary>

            <article className="px-4 pb-4">
              <p>
                Hanya mahasiswa aktif dan alumni dari UNSRAT yang bisa
                bergabung. Kami melakukan verifikasi alamat email universitas
                saat pendaftaran untuk memastikan bahwa komunitas ini tetap
                spesifik untuk lingkungan kampus dan autentik.
              </p>
            </article>
          </details>
        </li>
        <li>
          <details className="group">
            <summary className="flex items-center gap-3 px-4 py-3 font-medium marker:content-none hover:cursor-pointer">
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                ></path>
              </svg>
              <span>
                Apakah saya masih bisa menggunakan platform ini setelah lulus?
              </span>
            </summary>

            <article className="px-4 pb-4">
              <p>
                Ya, alumni masih dapat menggunakan situs ini hingga 2 tahun
                setelah kelulusan, asalkan sudah diverifikasi saat masih
                terdaftar sebagai mahasiswa. Setelah itu, akses mungkin akan
                dibatasi.
              </p>
            </article>
          </details>
        </li>
        <li>
          <details className="group">
            <summary className="flex items-center gap-3 px-4 py-3 font-medium marker:content-none hover:cursor-pointer">
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                ></path>
              </svg>
              <span>
                Apa yang membedakan platform ini dari aplikasi dating lainnya?{" "}
              </span>
            </summary>

            <article className="px-4 pb-4">
              <p>
                Platform ini dibuat khusus untuk komunitas UNSRAT, jadi kamu
                lebih mungkin terhubung dengan orang-orang yang mengikuti kelas
                yang sama, memiliki minat serupa, atau berbagi pengalaman hidup
                sebagai mahasiswa. Seperti bertemu seseorang di kampus—hanya
                saja secara online.
              </p>
            </article>
          </details>
        </li>
        <li>
          <details className="group">
            <summary className="flex items-center gap-3 px-4 py-3 font-medium marker:content-none hover:cursor-pointer">
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                ></path>
              </svg>
              <span>Apakah platform ini aman untuk digunakan?</span>
            </summary>

            <article className="px-4 pb-4">
              <p>
                Kami mengutamakan keamanan. Jika ada seseorang yang mengirim
                pesan tidak senonoh, pengguna dapat melaporkan atau memblokir
                orang tersebut. Kami juga mewajibkan akun mahasiswa untuk
                mengurangi akun palsu.
              </p>
            </article>
          </details>
        </li>
      </ul>
    </section>
  );
};
export default FAQ2;
