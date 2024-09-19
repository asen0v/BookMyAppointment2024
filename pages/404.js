import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-between mt-[-250px]"> {/* Ensuring the entire height fits within the screen */}
      
      {/* Main 404 Content */}
      <div className="text-center flex-grow flex flex-col justify-center mb-[50px]"> {/* Reduced margin-bottom to bring text closer to the image */}
        <h1 className="text-4xl font-bold mb-2">Oops! Looks Like This Page is in the Doghouse 🐶</h1> {/* Reduced text size */}
        <p className="text-lg text-gray-600 mb-1"> {/* Reduced margin-bottom */}
          It seems this page has gone on a walk and we can't fetch it right now.
        </p>
        <p className="text-md text-gray-500 mb-4"> {/* Added small margin-bottom */}
          But don’t worry, our trusty dog is on the case, sniffing out the problem!
        </p>
      </div>

      {/* Dog Image */}
      <div className="flex justify-center items-center flex-shrink-0 mt-[-500px]"> {/* Reduced negative margin-top */}
        <img src="/dog.png" alt="Dog Image" className="w-full max-w-[800px] object-contain" /> {/* Adjusted width for better responsiveness */}
      </div>
    </div>
  );
};

export default Custom404;
