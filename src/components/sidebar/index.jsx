/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

// import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`
    }
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        {/* helloo */}
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        {/* <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          Saboo RK
        </div> */}
        <img
              src="https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/logo.png"
              alt="Logo"
              height="400"
              width="150"
              // style={{ marginRight: "16px", marginTop: "-20px" }}
            />
       
      </div>
      <span class="  mx-[76px]   h-2 font-poppins text-[26px] font-medium  uppercase text-navy-700 dark:text-white">Service</span>
      <div class="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      
      <div className="flex justify-center">
        {/* <SidebarCard /> */}
      </div>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
