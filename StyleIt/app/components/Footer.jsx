import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f7] text-slate-400 py-12 px-6 text-sm">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
        <div className="footer-section">
          <h4 className="text-lg font-bold text-slate-400 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#rules" className="hover:text-blue-500">
                Hackathon Rules
              </a>
            </li>
            <li>
              <a href="#schedule" className="hover:text-blue-500">
                Schedule (Subject to Constant Change)
              </a>
            </li>
            <li>
              <a href="#prizes" className="hover:text-blue-500">
                Overpromised Prizes
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-blue-500">
                FAQs We Barely Answered
              </a>
            </li>
            <li>
              <a href="#leaderboard" className="hover:text-blue-500">
                Leaderboard (Rigged Edition)
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="text-lg font-bold text-slate-400 mb-4">Sponsors</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.fakecloud.com"
                className="hover:text-blue-500"
              >
                FakeCloud Inc.
              </a>
            </li>
            <li>
              <a
                href="https://www.noodlesponsor.com"
                className="hover:text-blue-500"
              >
                Infinite Noodles Co.
              </a>
            </li>
            <li>
              <a
                href="https://www.sleeplessdevs.org"
                className="hover:text-blue-500"
              >
                Sleepless Devs Foundation
              </a>
            </li>
            <li>
              <a
                href="https://www.jsframeworkoftheweek.com"
                className="hover:text-blue-500"
              >
                JS Framework of the Week
              </a>
            </li>
            <li>
              <a
                href="https://www.cryptogiggles.io"
                className="hover:text-blue-500"
              >
                Crypto Giggles
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="text-lg font-bold text-slate-400 mb-4">
            Connect with Us
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://discord.gg/"
                className="hover:text-blue-500"
              >
                Discord
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/"
                className="hover:text-blue-500"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/stephen-dong/"
                className="hover:text-blue-500"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/"
                className="hover:text-blue-500"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@hackathon.com"
                className="hover:text-blue-500"
              >
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"></div>

      <div className="text-center text-sm mt-4 text-slate-400">
        Made with ♥, ☕, and a lot of last-minute coding by{" "}
        <a href="https://github.com/Leg3ndary/StyleIt" className="hover:text-blue-500">
          StyleIT Dev Team.
        </a>
      </div>
    </footer>
  );
};

export default Footer;
