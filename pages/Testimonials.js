import Link from 'next/link';

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Testimonials Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-8">Testimonials</h1>
        <p className="text-2xl text-gray-600 mb-12">What our clients say about us</p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Testimonial 1 */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-3xl font-bold mb-4">Glow Beauty Lounge</h3>
            <div className="flex items-center mb-4">
              <img
                src="/client1.png" // Replace with actual image path
                alt="Jane Doe"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <p className="text-xl font-semibold text-gray-700">Jane Doe</p>
            </div>
            <p className="text-gray-600 text-lg">
              The intuitive scheduling and automated reminders have drastically reduced no-shows
              and improved our client experience.
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-3xl font-bold mb-4">FitZone Gym</h3>
            <div className="flex items-center mb-4">
              <img
                src="/client2.png" // Replace with actual image path
                alt="John Smith"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <p className="text-xl font-semibold text-gray-700">John Smith</p>
            </div>
            <p className="text-gray-600 text-lg">
              Integration with my calendar and payment systems has streamlined my operations and
              allowed me to focus more on my clients.
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-3xl font-bold mb-4">Hih Smiles Dental Clinic</h3>
            <div className="flex items-center mb-4">
              <img
                src="/client3.png" // Replace with actual image path
                alt="Michael Lee"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <p className="text-xl font-semibold text-gray-700">Michael Lee</p>
            </div>
            <p className="text-gray-600 text-lg">
              Managing appointments and communicating with patients is now effortless, thanks to the
              seamless features of Book My Appointment.
            </p>
          </div>

          {/* Testimonial 4 */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-3xl font-bold mb-4">ConsultPro Services</h3>
            <div className="flex items-center mb-4">
              <img
                src="/client4.png" // Replace with actual image path
                alt="Sara Kim"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <p className="text-xl font-semibold text-gray-700">Sara Kim</p>
            </div>
            <p className="text-gray-600 text-lg">
              The user-friendly interface and reliable notifications have simplified my appointment
              management and enhanced my productivity.
            </p>
          </div>

          {/* Testimonial 5 */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-3xl font-bold mb-4">Urban Spa Retreat</h3>
            <div className="flex items-center mb-4">
              <img
                src="/client5.png" // Replace with actual image path
                alt="Emily Johnson"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <p className="text-xl font-semibold text-gray-700">Emily Johnson</p>
            </div>
            <p className="text-gray-600 text-lg">
              Our booking process is now smooth and efficient, with real-time availability and easy
              client access that have elevated our service.
            </p>
          </div>

          {/* Testimonial 6 */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-3xl font-bold mb-4">Tech Solutions Inc.</h3>
            <div className="flex items-center mb-4">
              <img
                src="/client6.png" // Replace with actual image path
                alt="Alex Turner"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <p className="text-xl font-semibold text-gray-700">Alex Turner</p>
            </div>
            <p className="text-gray-600 text-lg">
              The customizable scheduling and seamless integration with our tools have significantly
              boosted our team's efficiency and client satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
