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
          <h4 className="text-lg font-bold text-slate-400 mb-4">Connect with Us</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://discord.gg/hackathon"
                className="hover:text-blue-500"
              >
                Discord (Where the Real Chaos Happens)
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/hackathon"
                className="hover:text-blue-500"
              >
                Twitter (We Post Memes)
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/hackathon"
                className="hover:text-blue-500"
              >
                LinkedIn (Because Why Not?)
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/hackathon"
                className="hover:text-blue-500"
              >
                Instagram (Photos of Pizza)
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@hackathon.com"
                className="hover:text-blue-500"
              >
                Email (We Might Reply)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="footer-section">
          <h4 className="text-lg font-bold text-slate-400 mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#getting-started" className="hover:text-blue-500">
                Getting Started (Good Luck)
              </a>
            </li>
            <li>
              <a href="#code-of-conduct" className="hover:text-blue-500">
                Code of Conduct (Read This, Please)
              </a>
            </li>
            <li>
              <a href="#template-library" className="hover:text-blue-500">
                Template Library (Because You Procrastinated)
              </a>
            </li>
            <li>
              <a href="#submission-guide" className="hover:text-blue-500">
                Submission Guide (Better Hurry Up)
              </a>
            </li>
            <li>
              <a href="#debugging-101" className="hover:text-blue-500">
                Debugging 101 (When Everything Fails)
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="text-lg font-bold text-slate-400 mb-4">
            Legal & Fine Print
          </h4>
          <p className="text-sm leading-6">
            Hackathon 2025. All rights reserved (or maybe not). By
            participating, you agree to our terms of service, privacy policy,
            and probably some other things we forgot to mention. No developers
            were harmed (much) during the making of this hackathon. Use at your
            own risk.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="text-lg font-bold text-slate-400 mb-4">About Us</h4>
          <p className="text-sm leading-6">
            Hackathon Dev Team is a group of sleep-deprived coders fueled by
            caffeine, ramen, and sheer determination. Our mission? To bring
            chaos and creativity to every hackathon.
          </p>
          <a
            href="https://github.com/"
            className="block mt-4 text-blue-500 hover:text-yellow-500"
          >
            Contribute on GitHub
          </a>
        </div>
      </div>

      <div className="text-center text-sm mt-12 text-slate-400">
        Made with ♥, ☕, and a lot of last-minute coding by{" "}
        <a href="https://github.com/" className="hover:text-blue-500">
          Hackathon Dev Team
        </a>
        . Open source? Maybe someday. Probably not.
      </div>
    </footer>
  );
};

export default Footer;
