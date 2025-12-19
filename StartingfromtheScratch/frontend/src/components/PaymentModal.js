import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess, rechargeData }) => {
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'wallet', name: 'Wallet', icon: '💳', color: '#667eea' },
    { id: 'upi', name: 'UPI', icon: '📱', color: '#11998e' },
    { id: 'google_pay', name: 'Google Pay', icon: 'G', color: '#4285F4' },
    { id: 'phonepe', name: 'PhonePe', icon: 'P', color: '#5F259F' },
    { id: 'paytm', name: 'Paytm', icon: 'P', color: '#00BAF2' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', color: '#f093fb' },
    { id: 'card', name: 'Debit/Credit Card', icon: '💳', color: '#f5576c' }
  ];

  const validateUPI = (upi) => {
    // UPI ID format: username@paytm or username@upi
    const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiPattern.test(upi);
  };

  const validateCard = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;
    // Card number should be 16 digits
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return false;
    // Expiry date should be MM/YY format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    // CVV should be 3 or 4 digits
    if (!/^\d{3,4}$/.test(cvv)) return false;
    // Cardholder name should not be empty
    if (!cardholderName.trim()) return false;
    return true;
  };

  const handlePayment = async () => {
    // Validate based on selected method
    if (selectedMethod === 'upi') {
      if (!upiId.trim()) {
        alert('Please enter your UPI ID');
        return;
      }
      if (!validateUPI(upiId)) {
        alert('Please enter a valid UPI ID (e.g., username@paytm)');
        return;
      }
    } else if (selectedMethod === 'card') {
      if (!validateCard()) {
        alert('Please fill all card details correctly');
        return;
      }
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      const paymentData = {
        method: selectedMethod,
        ...(selectedMethod === 'upi' && { upiId }),
        ...(selectedMethod === 'card' && { cardDetails })
      };
      onPaymentSuccess(paymentData);
      onClose();
    }, 2000);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      // Add spaces every 4 digits
      value = value.match(/.{1,4}/g)?.join(' ') || value;
      setCardDetails({ ...cardDetails, cardNumber: value });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      setCardDetails({ ...cardDetails, expiryDate: value });
    }
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const handleMethodChange = (methodId) => {
    setSelectedMethod(methodId);
    // Reset form fields when switching methods
    setUpiId('');
    setCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Choose Payment Method</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-amount-section">
          <div className="amount-label">Amount to Pay</div>
          <div className="amount-value">₹{amount}</div>
        </div>

        <div className="payment-methods-grid">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => handleMethodChange(method.id)}
              style={{ '--method-color': method.color }}
            >
              <div className="payment-method-icon" style={{ backgroundColor: method.color }}>
                {method.icon}
              </div>
              <div className="payment-method-name">{method.name}</div>
              {selectedMethod === method.id && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* UPI ID Input */}
        {selectedMethod === 'upi' && (
          <div className="payment-details-section">
            <div className="payment-details-header">
              <h3>Enter UPI ID</h3>
            </div>
            <div className="payment-details-form">
              <div className="form-group">
                <label htmlFor="upiId">UPI ID</label>
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@paytm"
                  className="form-input"
                />
                <small className="form-hint">Enter your UPI ID (e.g., username@paytm, username@upi)</small>
              </div>
            </div>
          </div>
        )}

        {/* Card Details Input */}
        {selectedMethod === 'card' && (
          <div className="payment-details-section">
            <div className="payment-details-header">
              <h3>Enter Card Details</h3>
            </div>
            <div className="payment-details-form">
              <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    maxLength="4"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="payment-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

