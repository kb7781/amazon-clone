import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  {
    title: 'Get to Know Us',
    links: ['About Amazon', 'Careers', 'Press Releases', 'Amazon Science'],
  },
  {
    title: 'Connect with Us',
    links: ['Facebook', 'Twitter', 'Instagram'],
  },
  {
    title: 'Make Money with Us',
    links: ['Sell on Amazon', 'Become an Affiliate', 'Advertise Your Products', 'Fulfillment by Amazon'],
  },
  {
    title: 'Let Us Help You',
    links: ['COVID-19 and Amazon', 'Your Account', 'Returns Centre', 'Recalls and Product Safety Alerts', 'Amazon App', 'Help'],
  },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="mt-8">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-amazon-blue text-white py-3 text-sm font-medium hover:bg-amazon-light transition-colors"
      >
        ↑ Back to top
      </button>

      {/* Main footer */}
      <div className="bg-amazon-dark text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sub footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-3">
            {/* Logo */}
            <div className="text-white font-extrabold text-2xl tracking-tighter">
              amazon<span className="text-amazon">.clone</span>
            </div>
            {/* Legal links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              {['Conditions of Use', 'Privacy Notice', 'Interest-Based Ads', 'Cookie Notice'].map((l) => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              © 2024 Amazon Clone. All rights reserved. Built for educational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
