import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="hero"
      className=" flex flex-col items-center justify-center px-4"
    >
      <h1 className="font-poppins font-bold tracking-tight text-pink-500 text-[4ch]/12 pt-8 md:flex md:flex-col md:text-[6ch]/20  ">
        Dari batamang sampe<span>baku pangge sayang</span>
      </h1>
      <p className="pt-6 text-xl md:text-2xl md:w-[60%]">
        Buat koneksi yang nyata dengan sesama mahasiswa dan alumni dari
        universitasmu. Aman, nyaman, dan hanya untuk komunitasmu.
      </p>
      <div id="cta" className="pt-6 flex gap-8  ">
        <Link
          href="/login"
          className="text-[20px] border-2 py-2 px-6 rounded-xl  text-pink-500 hover:scale-[1.2] transition-all"
        >
          {" "}
          Get started
        </Link>
        {/* <a
          href="#"
          className=" bg-pink-500 text-white text-[20px] py-2 px-6 rounded-xl ease-in transition-all hover:scale-[1.2]"
        >
          Get started
        </a> */}
      </div>
    </section>
  );
};
export default Hero;
