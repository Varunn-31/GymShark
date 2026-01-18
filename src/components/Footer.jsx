import React from "react";
import Logo from "../assets/images/Logo-1.png";

const Footer = () => {
  return (
    <footer className="mt-20 bg-pink-50">
      <div className="flex flex-col gap-10 items-center px-10 pt-6">
        <img src={Logo} alt="logo" className="w-[200px] h-10" />
        <p className="text-xl pb-10 mt-5 text-gray-700">
          Made with ❤️ and ☕ by Varun
        </p>
      </div>
    </footer>
  );
};

export default Footer;
