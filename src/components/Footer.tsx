import cloud3 from "@/app/assets/img/cloudy3.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="pt-16 relative">
      <Image
        src={cloud3}
        className="w-full"
        alt="test"
        width={1920}
        height={1080}
      />
      {/* <img src="/public/cloudy3.png" alt="sd" className="cloud1 w-full " /> */}
    </footer>
  );
};
export default Footer;
