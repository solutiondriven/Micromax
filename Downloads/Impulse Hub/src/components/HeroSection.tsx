import { TrendingUp, Users, Award, BarChart3 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover Top
            <span className="text-primary"> Trading </span>
            Talent
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Connect with verified traders, explore proven strategies, and track performance metrics. 
            Join the premier platform for trading professionals and enthusiasts.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">$2.1B+</h3>
              <p className="text-sm text-muted-foreground">Assets Managed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">50K+</h3>
              <p className="text-sm text-muted-foreground">Active Traders</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">98%</h3>
              <p className="text-sm text-muted-foreground">Verified Profiles</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">24.5%</h3>
              <p className="text-sm text-muted-foreground">Avg. Returns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}