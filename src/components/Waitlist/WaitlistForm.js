import React, { useState } from 'react';
import axios from 'axios';
import './WaitlistForm.css';

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '', position: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '', position: null });

    try {
      const response = await axios.post('/api/waitlist/join', { email });
      
      setStatus({
        type: 'success',
        message: 'You\'ve been added to the waitlist!',
        position: response.data.position
      });
      setEmail('');
    } catch (error) {
      if (error.response?.status === 409) {
        setStatus({
          type: 'info',
          message: 'This email is already on our waitlist.'
        });
      } else {
        setStatus({
          type: 'error',
          message: 'Something went wrong. Please try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="waitlist-form">
      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="email-input"
        />
        <button 
          type="submit" 
          className="button color-red"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Joining...' : 'Join Waitlist'}
        </button>
      </div>
      {status.message && (
        <div className={`status-message ${status.type}`}>
          <p>{status.message}</p>
          {status.position && (
            <p className="position-info">
              You are #{status.position} on the waitlist
            </p>
          )}
        </div>
      )}
    </form>
  );
};

export default WaitlistForm;
