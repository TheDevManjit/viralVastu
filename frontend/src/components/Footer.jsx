import { TrendingUp, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-500" />
              <span className="text-white font-semibold">ViralVastu</span>
            </div>
            <p className="text-gray-400">
              Your destination for trending products from around the world. Quality guaranteed, happiness delivered.
            </p>
            <div className="flex gap-4 text-gray-400">
              <Link to="/under-construction" className="hover:text-purple-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="/under-construction" className="hover:text-purple-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link to="/under-construction" className="hover:text-purple-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="/under-construction" className="hover:text-purple-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">All Products</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Trending Now</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">New Arrivals</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Help Center</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Shipping Info</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Returns</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">About Us</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Careers</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/under-construction" className="hover:text-purple-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 <span className="text-purple-400 font-semibold">ViralVastu</span>. All rights reserved.  
            Making trends accessible worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
