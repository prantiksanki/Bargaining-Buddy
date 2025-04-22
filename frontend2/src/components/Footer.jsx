const Footer = () => {
    return (
      <footer className="bg-[#0a0f1c] text-gray-400 px-6 py-4 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>© 2025 BargainBuddy | Made with 💗</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  