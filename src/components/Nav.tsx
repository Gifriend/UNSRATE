import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex justify-between items-center px-4 mb-16">
      <div id="logo" className="font-bold text-xl text-pink-500 ">
        unsrate
      </div>
      <ul className="flex gap-6">
        <li>
          {/* <a href="" className="">
            Login
          </a> */}
        </li>
        <li>
          <Link href="/auth" className="py-2 px-6 rounded-xl bg-pink-500 text-white">
            Get started
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Nav;
