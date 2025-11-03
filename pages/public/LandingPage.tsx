
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../types';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import IntegrateInstituteModal from '../../components/shared/IntegrateInstituteModal';

const LandingPage: React.FC = () => {
  const [isIntegrateModalOpen, setIsIntegrateModalOpen] = useState(false);
  const navigate = useNavigate();

  const openLoginPortal = (role: Role) => {
    navigate(`/login/${role}`);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const portalCards = [
    { role: Role.Student, title: 'Student Portal', icon: '🎓' },
    { role: Role.Lecturer, title: 'Lecturer Portal', icon: '👩‍🏫' },
    { role: Role.Parent, title: 'Parent Portal', icon: '👨‍👩‍👧‍👦' },
    { role: Role.Principal, title: 'Principal Portal', icon: '🏛️' },
  ];

  const featureCards = [
    { title: 'AI Study Buddy', description: 'Personalized AI tutor available 24/7 to help students with their questions.', icon: '🤖' },
    { title: 'Automated Feedback', description: 'Instant, constructive feedback on assignments powered by advanced AI.', icon: '📝' },
    { title: 'Real-time Tracking', description: 'Parents and staff can monitor student progress and activity in real-time.', icon: '📊' },
    { title: 'Efficient Administration', description: 'Powerful tools for admins to manage users, security, and system settings.', icon: '⚙️' },
    { title: 'Question Paper Generation', description: 'Lecturers can generate custom exam papers in minutes with AI assistance.', icon: '📄' },
    { title: 'Gamified Rewards', description: 'Engage students with a rewards system for milestones like attendance streaks.', icon: '🏆' },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      <Header onIntegrateClick={() => setIsIntegrateModalOpen(true)} />

      <main>
        {/* Hero Section */}
        <section className="bg-white pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-600 mb-4">Welcome to EDUCANTPRO</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The all-in-one platform revolutionizing education with AI-powered tools, seamless communication, and comprehensive management for the next generation of learning.
            </p>
            <div className="flex justify-center">
                <button
                    onClick={() => scrollTo('portals')}
                    className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-primary-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Get Started
                </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCards.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-primary-600">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portals Section */}
        <section id="portals" className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Login Portals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {portalCards.map(({ role, title, icon }) => (
                <button
                  key={role}
                  onClick={() => openLoginPortal(role)}
                  className="group p-8 bg-gray-50 rounded-lg shadow-md hover:bg-primary-100 transition-all duration-300 text-center transform hover:-translate-y-1"
                >
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <IntegrateInstituteModal
        isOpen={isIntegrateModalOpen}
        onClose={() => setIsIntegrateModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
