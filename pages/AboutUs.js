// pages/about.js

const AboutPage = () => {
    return (
      <div className="min-h-screen px-6 py-12 mt-[50px] mb-[-150px]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Text Section */}
            <div>
              <h1 className="text-4xl font-bold mb-4">About us</h1> {/* Reduced font size */}
              <h2 className="text-2xl text-gray-600 mb-4">Who we are?</h2> {/* Reduced font size */}
              <p className="text-gray-600 mb-4 text-lg">
                At Booking My Appointment, our dedicated team is on a mission to transform how businesses and customers manage appointments. We’re passionate about creating an intuitive platform that simplifies scheduling, making it easier for businesses to thrive and customers to connect with the services they need.
              </p>
              <p className="text-gray-600 mb-4 text-lg">
                Our goal is to empower businesses with tools that streamline appointments, reduce stress, and enhance customer satisfaction. We believe that with the right support, businesses can focus on delivering exceptional service, while customers enjoy a seamless booking experience.
              </p>
              <p className="text-gray-600 text-lg">
                Driven by innovation and a commitment to excellence, our team works tirelessly to ensure Booking My Appointment meets the evolving needs of our users. Together, we’re making appointment management effortless, efficient, and stress-free.
              </p>
            </div>
  
            {/* Image Section */}
            <div className="flex justify-center">
              <img
                src="/About.svg" // Adjust this to the correct path of your image
                alt="Team Working"
                className="w-9/12 h-auto rounded-lg shadow-lg" // Reduced image width
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutPage;
  