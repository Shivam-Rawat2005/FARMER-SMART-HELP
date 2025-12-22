import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, BarChart3, Users, Cloud, MessageCircle, TrendingUp, Award, Zap, Shield, Smartphone, Globe, Sprout, Star } from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const [activeTab, setActiveTab] = useState(0);

  const testimonials = [
    { name: "Rajesh Kumar", role: "Farmer, Punjab", text: "NaapTol increased my yield by 35%! Amazing tool!", rating: 5 },
    { name: "Priya Singh", role: "Farmer, Haryana", text: "Weather alerts saved my crop. Highly recommended!", rating: 5 },
    { name: "Arjun Patel", role: "Farmer, Gujarat", text: "Best decision for my farm. Analytics are fantastic!", rating: 5 },
  ];

  const features = [
    { title: "NaapTol Crop Tracking", icon: Leaf, desc: "Measure crops with precision", color: "bg-green-100", iconColor: "text-green-600" },
    { title: "Advanced Analytics", icon: BarChart3, desc: "Beautiful charts & insights", color: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Weather Forecast", icon: Cloud, desc: "Real-time weather updates", color: "bg-cyan-100", iconColor: "text-cyan-600" },
    { title: "Dealer Network", icon: Users, desc: "Connect for best prices", color: "bg-purple-100", iconColor: "text-purple-600" },
    { title: "Expert Tips", icon: TrendingUp, desc: "Personalized farming advice", color: "bg-orange-100", iconColor: "text-orange-600" },
    { title: "Real-time Chat", icon: MessageCircle, desc: "Connect with farmers instantly", color: "bg-pink-100", iconColor: "text-pink-600" },
  ];

  const faqs = [
    { q: "Is NaapTol really free?", a: "Yes! Completely free with no hidden charges." },
    { q: "Can I use on mobile?", a: "Yes, fully responsive on all devices." },
    { q: "How do I get expert advice?", a: "Connect through our chat and community features." },
    { q: "Is my data secure?", a: "Yes, with industry-standard encryption." },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">NaapTol</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 text-emerald-600 font-semibold hover:bg-green-50 rounded-lg transition">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition transform">
            Register Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 text-center max-w-6xl mx-auto">
        <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 font-semibold mb-6">
          🌾 Welcome to Smart Farming Revolution
        </div>
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Smart Farming <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Made Simple</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Empower your farming with real-time analytics, crop management, market insights, and expert guidance. Join 50K+ farmers transforming their harvest.
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition transform flex items-center gap-2 group">
            Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
          <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-green-50 transition">
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12">
          <div className="hover:scale-110 transition transform">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">50K+</div>
            <p className="text-gray-600 mt-2 font-semibold">Active Farmers</p>
          </div>
          <div className="hover:scale-110 transition transform">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">10M+</div>
            <p className="text-gray-600 mt-2 font-semibold">Crops Tracked</p>
          </div>
          <div className="hover:scale-110 transition transform">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">98%</div>
            <p className="text-gray-600 mt-2 font-semibold">Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className={`${feature.color} p-8 rounded-2xl hover:shadow-xl transition transform hover:scale-105 border-2 border-white`}>
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4">
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-8 py-20 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500">
        <div className="max-w-6xl mx-auto text-white">
          <h2 className="text-5xl font-bold text-center mb-16">Why 50K+ Farmers Trust NaapTol</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Zap className="w-10 h-10 mb-4 text-yellow-300" />
              <h3 className="text-2xl font-bold mb-3">Increase Yield by 35%</h3>
              <p className="text-white/90">Data-driven insights to optimize farming.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <TrendingUp className="w-10 h-10 mb-4 text-green-300" />
              <h3 className="text-2xl font-bold mb-3">Save 25% on Costs</h3>
              <p className="text-white/90">Smart resource management saves money.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Shield className="w-10 h-10 mb-4 text-blue-300" />
              <h3 className="text-2xl font-bold mb-3">Secure & Reliable</h3>
              <p className="text-white/90">99.9% uptime with encrypted data.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Smartphone className="w-10 h-10 mb-4 text-purple-300" />
              <h3 className="text-2xl font-bold mb-3">Mobile Friendly</h3>
              <p className="text-white/90">Use on any device, anytime.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Globe className="w-10 h-10 mb-4 text-red-300" />
              <h3 className="text-2xl font-bold mb-3">Local Support</h3>
              <p className="text-white/90">Expert guidance in your region.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Award className="w-10 h-10 mb-4 text-orange-300" />
              <h3 className="text-2xl font-bold mb-3">Award Winning</h3>
              <p className="text-white/90">Recognized by agriculture organizations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-900">What Farmers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-100 hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="border-t border-blue-200 pt-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 py-20 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-900">FAQ</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden hover:shadow-lg transition">
                <button
                  onClick={() => setActiveTab(activeTab === idx ? -1 : idx)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-purple-50 transition"
                >
                  <h3 className="text-lg font-bold text-gray-900">{faq.q}</h3>
                  <span className={`text-purple-600 font-bold transition transform ${activeTab === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeTab === idx && (
                  <div className="px-6 pb-6 border-t border-purple-200 text-gray-700">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-8 py-16 bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <div className="text-3xl font-bold">Real-Time</div>
              <p className="text-white/80">Updates</p>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <p className="text-white/80">Support</p>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <p className="text-white/80">Free</p>
            </div>
            <div>
              <div className="text-3xl font-bold">Instant</div>
              <p className="text-white/80">Alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-8 py-24 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Transform?</h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of successful farmers. Start free today!
          </p>
          <Link to="/register" className="inline-block px-12 py-4 bg-white text-red-500 font-bold text-lg rounded-lg hover:shadow-2xl hover:scale-110 transition transform">
            Start Your Free Account →
          </Link>
          <p className="text-white/80 mt-6">No credit card • Instant access • Completely free</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold">NaapTol</span>
              </div>
              <p className="text-gray-400">Smart farming for better harvest</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-400">Features</h4>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white transition">Crop Tracking</a></li>
                <li><a href="#" className="hover:text-white transition">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition">Weather</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-400">Company</h4>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-400">Support</h4>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-400">Follow</h4>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NaapTol - Farmers Smart Help. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
