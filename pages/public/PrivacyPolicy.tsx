import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../constants';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-gray-600">
          <p>This is a placeholder for the EDUCANTPRO Privacy Policy. In a real application, this page would detail how user data is collected, used, and protected.</p>
          <h2 className="text-xl font-semibold pt-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, as well as information collected automatically, like usage data.</p>
          <h2 className="text-xl font-semibold pt-4">2. How We Use Information</h2>
          <p>Your information is used to provide, maintain, and improve our services, including personalizing your experience and communicating with you.</p>
          <h2 className="text-xl font-semibold pt-4">3. Data Security</h2>
          <p>We take reasonable measures to protect your information from loss, theft, misuse, and unauthorized access.</p>
        </div>
        <div className="mt-8 text-center">
          <Link to={PATHS.LANDING} className="text-primary-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;