import Link from "next/link";
import Image from 'next/image'; // For loading the dashboard and wave images

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between">

      {/* Wave Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/wave.png" // Replace with the correct path to your wave image
          alt="Wave Background"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>

      {/* Main Content Layout */}
      <div className="relative w-full p-8 text-center z-10">
        <h1 className="text-5xl font-bold text-[#6A3FF0] mb-4">Book Online - It's Easy!</h1>
        <h2 className="text-2xl text-gray-700 mb-8">Get started today</h2>

        {/* Input and Button */}
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="email@yourbusiness.com"
            className="w-[400px] px-4 py-3 border rounded-l-full focus:outline-none"
          />
          <Link href="/register/business">
            <button className="px-6 py-3 bg-[#5b32c7] text-white font-bold rounded-r-full hover:bg-purple-700 transition-all duration-300">
              Let's go &gt;
            </button>
          </Link>
        </div>
      </div>

      {/* Dashboard Image */}
        <div className="relative flex justify-center z- mt-[-100px]"> {/* Add negative margin here */}
          <Image
            src="/dashboard.svg"
            alt="Dashboard Preview"
            width={800}
            height={500}
            className="object-contain"
          />
        </div>
    </div>
  );
}
