import React, { useState, useEffect } from 'react';
import { Brain, Zap, Share2, ChevronRight, Sparkles, BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuizzlerLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const navigate=useNavigate()

  const handleAuthClick = (mode = 'login') => {
  navigate(`/auth?mode=${mode}`);
};

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
          style={{
            top: '20%',
            left: '10%',
            animation: 'blob 7s infinite'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"
          style={{
            top: '60%',
            right: '10%',
            animation: 'blob 7s infinite 2s'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"
          style={{
            bottom: '20%',
            left: '50%',
            animation: 'blob 7s infinite 4s'
          }}
        />
      </div>

      {/* Floating cursor glow */}
      <div 
        className="absolute w-64 h-64 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none transition-all duration-300"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128
        }}
      />

      {/* Navigation */}
      <nav className={`relative z-10 px-6 py-6 flex items-center justify-between transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="relative">
            <Brain className="w-10 h-10 text-green-500 transform group-hover:rotate-12 transition-transform duration-300" />
            <Sparkles className="w-4 h-4 text-green-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-3xl font-bold text-white">
            Quizzler
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={()=>handleAuthClick('login')}
            className="px-6 py-2.5 text-white font-medium hover:text-green-500 transition-colors duration-300 relative group"
          >
            Login
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
          </button>
          <button 
                        onClick={()=>handleAuthClick('sigup')}

            className="px-8 py-2.5 bg-green-700 hover:bg-green-600 rounded font-semibold transform hover:scale-105 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-6 py-2 mb-8 border border-gray-800">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Create & Share Quizzes Instantly</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            Build Quizzes
            <span className="block text-green-500">
              In Minutes
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create custom quizzes, share them with anyone, and track responses in real-time. No complex setup required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={handleAuthClick}
              className="group px-10 py-5 bg-green-700 hover:bg-green-600 rounded font-bold text-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <Plus className="w-5 h-5" />
              <span>Start Creating Now</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`grid md:grid-cols-3 gap-8 mt-32 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            {
              icon: Zap,
              title: 'Create Quizzes',
              description: 'Build custom quizzes in minutes with our intuitive editor',
              gradient: 'bg-gray-900'
            },
            {
              icon: Share2,
              title: 'Share Quickly',
              description: 'Share your quizzes instantly with a unique link',
              gradient: 'bg-gray-900'
            },
            {
              icon: BarChart3,
              title: 'See the Data',
              description: 'Track responses and analyze results in real-time',
              gradient: 'bg-gray-900'
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className="group relative bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-green-700 transition-all duration-500 cursor-pointer hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-700 rounded-lg mb-6 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}