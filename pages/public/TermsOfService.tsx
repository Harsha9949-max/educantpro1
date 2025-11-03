import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../constants';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-6">Terms of Service</h1>
        <div className="space-y-4 text-gray-600">
          <p>This is a placeholder for the EDUCANTPRO Terms of Service. This document would govern the use of the platform and outline the rights and responsibilities of users.</p>
          <h2 className="text-xl font-semibold pt-4">1. Acceptance of Terms</h2>
          <p>By accessing or using our services, you agree to be bound by these terms.</p>
          <h2 className="text-xl font-semibold pt-4">2. User Conduct</h2>
          <p>You agree not to use the service for any unlawful purpose or to engage in any conduct that could damage, disable, or impair the service.</p>
          <h2 className="text-xl font-semibold pt-4">3. Termination</h2>
          <p>We may terminate or suspend your access to our service at any time, without prior notice, for conduct that we believe violates these Terms.</p>
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

export default TermsOfService;