import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

interface IntegrateInstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntegrateInstituteModal: React.FC<IntegrateInstituteModalProps> = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState({
    instituteName: '',
    contactName: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.instituteName || !formState.contactName || !formState.email) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log('Integration Request:', formState);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormState({ instituteName: '', contactName: '', email: '', phone: '' });
      }, 2000);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Integrate Your Institute">
      {isSuccess ? (
        <div className="text-center">
          <svg className="mx-auto mb-4 w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-lg font-medium text-gray-900">Request Submitted!</h3>
          <p className="text-sm text-gray-500">Our team will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block mb-2 text-sm font-medium">Institute Name *</label>
            <input name="instituteName" value={formState.instituteName} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Contact Name *</label>
            <input name="contactName" value={formState.contactName} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Email *</label>
            <input type="email" name="email" value={formState.email} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Phone</label>
            <input type="tel" name="phone" value={formState.phone} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
          >
            {isLoading ? <Spinner size="sm" /> : 'Submit Request'}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default IntegrateInstituteModal;