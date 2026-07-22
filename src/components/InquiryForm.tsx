'use client';

import { useState } from 'react';
import styles from '../app/page.module.css';

export default function InquiryForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        body: formData,
      });

      // Handle the redirect response from the API
      if (response.redirected) {
        setStatus({ type: 'success', message: "Thank you! Your inquiry has been sent successfully." });
        (e.target as HTMLFormElement).reset();
      } else {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to submit');
        setStatus({ type: 'success', message: "Thank you! Your inquiry has been sent successfully." });
        (e.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {status && (
        <div style={{ 
          backgroundColor: status.type === 'success' ? '#e8f5e9' : '#ffebee', 
          color: status.type === 'success' ? '#2e7d32' : '#c62828', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          textAlign: 'center',
          fontWeight: '500',
          border: `1px solid ${status.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`
        }}>
          {status.message}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required placeholder="John Doe" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required placeholder="john@example.com" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">How can we help?</label>
          <textarea id="message" name="message" required placeholder="Tell us about your project..." rows={4}></textarea>
        </div>
        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}
