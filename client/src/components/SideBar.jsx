import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineHashtag, HiOutlineHome, HiOutlineMenu, HiOutlinePhotograph, HiOutlineUserGroup } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import logo from "../assets/—Pngtree—sound wave music logo vector_5221287.png"

const links = [
  { name: 'Discover', to: '/session', icon: HiOutlineHome },
  { name: 'Around You', to: '/dashboard/around-you', icon: HiOutlinePhotograph },
  { name: 'Top Artists', to: '/dashboard/top-artists', icon: HiOutlineUserGroup },
  { name: 'Top Charts', to: '/dashboard/top-charts', icon: HiOutlineHashtag },
];


// eslint-disable-next-line react/prop-types
const NavLinks = () => (
  <div className="mt-10">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-[#3e6259]"
        onClick={()=>navigate(item.to)}
      >
        <item.icon className="w-6 h-6 mr-2" />
        {item.name}
      </NavLink>
    ))}
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="md:flex hidden flex-col w-[240px]  px-4 on">
        <button type="button" onClick={() => navigate('/signout')}><img src={logo} alt="logo" className="w-full h-24 object-contain" /></button>
        <NavLinks />
      </div>

      {/* Mobile sidebar */}
      <div className="absolute md:hidden block top-6 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu className="w-6 h-6 mr-2 text-white" onClick={() => setMobileMenuOpen(true)} />
        ) : (
          <RiCloseLine className="w-6 h-6 mr-2 text-white" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>

      <div className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483D8B] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
        <img src={logo} alt="logo" className="w-full h-14 object-contain" />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
