import Link from 'next/link';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-5xl font-bold mb-10">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <form>
              <div className="mb-6">
                <label className="block text-lg font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-bold mb-2" htmlFor="surname">
                  Surname
                </label>
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  type="text"
                  id="surname"
                  placeholder="Enter your surname"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-bold mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  id="message"
                  rows="5"
                  placeholder="Enter your message"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#6A3FF0] text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all duration-300"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Image */}
          <div className="flex items-center justify-center">
            <img
              src="/contact.svg" // Replace this with the actual path of your image
              alt="Contact Us"
              className="w-[650px] h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
