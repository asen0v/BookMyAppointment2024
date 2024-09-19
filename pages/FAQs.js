import { useState } from 'react';

const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* FAQ Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-10">FAQs</h1>
        <p className="text-2xl text-gray-600 mb-12">
          Find answers to common questions about Book My Appointment
        </p>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg"
              onClick={() => toggleQuestion(index)}
            >
              <div className="bg-gray-100 p-6 cursor-pointer flex justify-between items-center">
                <h3 className="text-2xl font-semibold">{faq.question}</h3>
                <span className="text-2xl">{openIndex === index ? '-' : '+'}</span>
              </div>
              {openIndex === index && (
                <div className="p-6 bg-white border-t border-gray-200">
                  <p className="text-lg text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Example FAQ data
const faqData = [
  {
    question: 'How does the automated reminder system work?',
    answer:
      'Our automated reminder system is designed to help reduce no-shows by sending timely notifications to customers. Once an appointment is booked, the system sends a confirmation email or SMS to the customer. As the appointment date approaches, additional reminders are sent—typically 24 hours and 1 hour before the appointment. These reminders can be customized by the business to suit their specific needs, ensuring customers are always informed and on time.',
  },
  {
    question: 'Can I integrate Book My Appointment with my existing calendar?',
    answer:
      'Yes, Book My Appointment allows integration with popular calendar applications such as Google Calendar, Outlook, and Apple Calendar. This ensures that your appointments sync seamlessly and prevents double bookings.',
  },
  {
    question: 'What payment systems can be integrated with the platform?',
    answer:
      'Book My Appointment supports integration with multiple payment systems, including PayPal, Stripe, and Square. You can choose the payment processor that best fits your business needs and easily accept payments from customers during booking.',
  },
  {
    question: 'How do I customize the booking page to match my brand?',
    answer:
      'You can fully customize your booking page by adding your business logo, changing the colors to match your brand, and including any relevant information about your services. The customization options allow you to offer a personalized experience to your customers.',
  },
  {
    question: 'Is there a mobile app available for managing appointments on the go?',
    answer:
      'Yes, Book My Appointment provides a mobile app for both iOS and Android. With the mobile app, you can manage your appointments, communicate with customers, and check your schedule anytime, anywhere.',
  },
];

export default FAQsPage;
