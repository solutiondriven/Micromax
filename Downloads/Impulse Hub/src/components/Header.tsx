export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl tracking-tight text-black">TradersHub</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              All Traders
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              Top Performers
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              Strategies
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              About
            </a>
          </nav>
          
          <div className="flex items-center">
            <button className="text-gray-600 hover:text-black transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}