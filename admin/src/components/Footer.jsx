import { TrendingUp, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-500" />
              <span className="text-white">ViralVastu</span>
            </div>
            <p className="text-gray-400">
              Your destination for trending products from around the world. Quality guaranteed, happiness delivered.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-purple-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-purple-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-purple-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-purple-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-500 transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Trending Now</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Best Sellers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ViralVastu. All rights reserved. Making trends accessible worldwide.</p>
        </div>
      </div>
    </footer>
  );
}