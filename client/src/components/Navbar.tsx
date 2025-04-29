import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { navLinks } from '@/constants/data';
import { IconMenu, IconX } from '@/lib/icons';
import logoImg from '../assets/m-kitelogo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClickLink = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed w-full bg-white bg-opacity-95 z-50 transition-all duration-300 ${
        scrolled ? 'py-1 md:py-2 shadow-md' : 'py-1.5 md:py-2 shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center justify-center space-x-2 md:space-x-3">
          {/* Responsive logo size */}
          <img 
            src={logoImg} 
            alt="M-Kite Logo" 
            className="h-[60px] sm:h-[65px] md:h-[70px] lg:h-[75px] w-auto transition-all" 
          />
          <div className="flex flex-col items-center">
            {/* Responsive font sizes */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-['Montserrat'] font-bold tracking-tight whitespace-nowrap text-center">
              <span className="text-slate-800">M-Kite</span>
              <span className="text-amber-600"> Kitchen</span>
            </h1>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-amber-600 font-medium mt-0.5 leading-tight text-center w-full">
              Aluminum Premium Modular Kitchen Cabinets
            </span>
          </div>
        </a>
        
        {/* Desktop Navigation - Hidden on mobile, visible on medium screens and up */}
        <nav className="hidden md:flex space-x-4 lg:space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="font-medium text-slate-600 hover:text-amber-600 transition-colors text-sm lg:text-base"
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <a 
            href="#contact" 
            className="hidden md:inline-flex px-3 py-1.5 lg:px-4 lg:py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-sm text-sm lg:text-base"
          >
            Get Started
          </a>
          <button 
            className="md:hidden text-slate-800 hover:text-amber-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation - Only visible on small screens */}
      <div className={`md:hidden bg-white px-4 pb-4 border-t border-slate-100 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col space-y-3 mt-2">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="py-2 font-medium text-slate-600 hover:text-amber-600 transition-colors"
              onClick={handleClickLink}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#contact" 
            className="py-2 font-medium text-amber-600 hover:text-amber-700 transition-colors"
            onClick={handleClickLink}
          >
            Contact Us
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
