import { Link } from "react-router-dom";
import { Eye, Mail, Twitter, Github } from "lucide-react"; // Assuming you use lucide-react for icons

export function Footer() {
  return (
    <footer className="bg-hero text-hero-foreground border-t border-hero-foreground/10 pt-16 pb-8">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission Column */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-accent" />
              <h2 className="text-xl font-display font-bold">FedhaWatch</h2>
            </div>
            <p className="text-sm text-hero-foreground/80 leading-relaxed">
              Revealing the Shadow Budget. Civic accountability through transparent political finance tracking.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-hero-foreground/60 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-hero-foreground/60 hover:text-accent transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-hero-foreground/60 hover:text-accent transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold mb-4 text-hero-foreground">Platform</h3>
            <ul className="space-y-3 text-sm text-hero-foreground/70">
              <li>
                <Link to="/explorer" className="hover:text-accent transition-colors">Top Flagged Entities</Link>
              </li>
              <li>
                <Link to="/parties" className="hover:text-accent transition-colors">Political Parties</Link>
              </li>
              <li>
                <Link to="/counties" className="hover:text-accent transition-colors">County Data</Link>
              </li>
              <li>
                <Link to="/risk-map" className="hover:text-accent transition-colors">Risk Heatmap</Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold mb-4 text-hero-foreground">Resources</h3>
            <ul className="space-y-3 text-sm text-hero-foreground/70">
              <li>
                <Link to="/methodology" className="hover:text-accent transition-colors">Data Methodology</Link>
              </li>
              <li>
                <Link to="/glossary" className="hover:text-accent transition-colors">Financial Glossary</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-accent transition-colors">Monthly Reports</Link>
              </li>
              <li>
                <Link to="/api" className="hover:text-accent transition-colors">API Access</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Action Column */}
          <div>
            <h3 className="font-semibold mb-4 text-hero-foreground">Get Involved</h3>
            <p className="text-sm text-hero-foreground/70 mb-4">
              Help us expand our shadow observation networks. Report an anomaly anonymously.
            </p>
            <Link to="/report" onClick={() => window.scrollTo(0, 0)} className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto">
              Submit a Tip
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-hero-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-hero-foreground/60">
          <p>© {new Date().getFullYear()} FedhaWatch. All rights reserved.</p>
          <p className="text-center md:text-right">
            All data sourced from public filings and shadow observation networks.
          </p>
        </div>
      </div>
    </footer>
  );
}