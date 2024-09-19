// components/Footer.js

import Link from 'next/link';

const Footer = ({ className = "" }) => {
  return (
    <footer className={`bg-[#5b32c7] text-white pt-12 py-10 ${className}`}> {/* Increased padding */}
      <div className="flex justify-between items-center h-[130px]"> {/* Increased height of footer */}

        {/* Left Section */}
        <div className="flex-1 flex flex-col items-start justify-center pl-4"> 
          <div className="flex items-center mb-4"> {/* Increased spacing between logo and text */}
            <img src="/circle.svg" alt="Logo" className="w-[64px] h-[64px] mr-4" /> {/* Increased size of logo */}
            <div className="text-left text-lg font-semibold"> {/* Increased font size */}
              <div>Book</div>
              <div>My</div>
              <div>Appointment</div>
            </div>
          </div>
          <p className="text-base mt-10"> {/* Increased text size */}
            © Copyright 2024 Book My Appointment. All rights reserved.
          </p>
        </div>

        {/* First Vertical Divider */}
        <div className="border-l border-white h-[160px] mx-6"></div> {/* Increased divider height and margin */}

        {/* Middle Section: Product and Legal */}
        <div className="flex-1 flex space-x-20 justify-center items-start"> {/* Increased space between columns */}
          <div className="flex flex-col">
            <h4 className="font-bold text-lg mb-4">Product</h4> {/* Increased heading size */}
            <ul className="space-y-2 text-base"> {/* Increased font size */}
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/testimonials">Testimonials</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-lg mb-4">Legal</h4> {/* Increased heading size */}
            <ul className="space-y-2 text-base"> {/* Increased font size */}
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Second Vertical Divider */}
        <div className="border-l border-white h-[160px] mx-6"></div> {/* Increased divider height and margin */}

        {/* Right Section: Go Mobile and Follow us on */}
        <div className="flex-1 flex justify-center items-center"> 
          <div className="bg-[rgba(247,244,255,0.15)] border border-white rounded-lg px-10 py-6 w-fit mx-auto"> {/* Increased padding */}
            <div className="flex items-start space-x-8"> {/* Align Go Mobile and Follow us side by side */}
              
              {/* Go Mobile Section */}
              <div className="flex flex-col items-center space-y-3"> 
                <h4 className="font-bold text-lg mb-1">Go Mobile</h4> {/* Increased font size */}
                <hr className="w-1/2 border-t border-white mt-1"/> 
                <img src="/googleplaystore.png" alt="Google Play" className="w-[150px]" /> {/* Increased image size */}
                <img src="/appleappstore.png" alt="App Store" className="w-[150px]" /> {/* Increased image size */}
              </div>
              
              {/* Follow us on Section */}
              <div className="flex flex-col items-center">
                <h4 className="font-bold text-lg mb-2">Follow us on:</h4> {/* Increased font size */}
                <hr className="w-1/2 border-t border-white mb-2"/> 
                <div className="flex space-x-4"> {/* Increased space between icons */}
                  <img src="/linkedin.png" alt="LinkedIn" className="w-8 h-8" /> {/* Increased icon size */}
                  <img src="/instagram.png" alt="Instagram" className="w-8 h-8" />
                  <img src="/facebook.png" alt="Facebook" className="w-8 h-8" />
                  <img src="/tiktok.png" alt="TikTok" className="w-8 h-8" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
