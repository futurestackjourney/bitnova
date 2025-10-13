

import { FaWhatsapp } from "react-icons/fa";

export default function ContactBot() {
 const phoneNumber = "923231242966"; // Replace with your WhatsApp number (country code + number)
  const message = "Hello! I want to contact you."; // Optional default message

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;


  return (
    <a
      href={whatsappUrl} // or WhatsApp / Telegram link
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-10 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
    >
      <FaWhatsapp size={24} />
    </a>
  );
}
// import React from "react";
// import { FaWhatsapp } from "react-icons/fa"; // or any icon you like

// export default function ContactBot() {
//   return (
//     <a
//       href="mailto:youremail@example.com" // or WhatsApp / Telegram link
//       target="_blank"
//       rel="noopener noreferrer"
//       className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
//     >
//       <FaWhatsapp size={24} />
//     </a>
//   );
// }
