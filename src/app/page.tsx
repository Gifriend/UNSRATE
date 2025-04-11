import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import FAQ2 from "./components/FAQ";
import Image from "next/image";
import cloud2 from "@/app/assets/img/cloudy2.png";
import mikel from "@/app/assets/img/mikel.png";
import clarissa from "@/app/assets/img/clarissa.jpg";
import mario from "@/app/assets/img/mario.jpg";

const App = () => {
  return (
    <main className="w-screen pt-4">
      <div className="top-clouds">
        <Image
          src={cloud2}
          className="w-full"
          alt="test"
          width={1920}
          height={1080}
        />
      </div>
      <Nav />
      <Hero />

      <section
        id="landing-cards"
        className=" w-full px-4 mx-auto gap-5 mt-20 md:flex md:justify-center lg:gap-4 md:gap-4"
      >
        <div className="h-[400px] w-[300px] mx-auto bg-gray-400 md:mx-0 md:-rotate-2 lg:mt-20">
          <Image
            src={mikel}
            className="w-full"
            alt="test"
            width={1920}
            height={1080}
          />
        </div>
        <div className="h-[400px] w-[300px] mx-auto bg-green-400 md:mx-0 md:rotate-2 lg:rotate-0">
          <Image
            src={clarissa}
            className="w-full"
            alt="test"
            width={1920}
            height={1080}
          />
        </div>
        <div className="h-[400px] md:hidden lg:block w-[300px] md:mx-0 mx-auto md:rotate-2 bg-gray-400 lg:mt-20">
          <Image
            src={mario}
            className="w-full"
            alt="test"
            width={1920}
            height={1080}
          />
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* FAQ */}
      <FAQ2 />
      <Footer />
    </main>
  );
};
export default App;
