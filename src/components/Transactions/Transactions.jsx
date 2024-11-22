import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './TransactionPage.css'; // Import the stylesheet

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('DEPOSIT');
  const [filterType, setFilterType] = useState('ALL');
  const [balance, setBalance] = useState(0);
  const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

  // Retrieve token from cookies
  const token = Cookies.get('jwt_token'); // Get token from cookies

  // Fetch transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) return alert('Please log in first');

      try {
        const response = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(response.data.transactions);
        setFilteredTransactions(response.data.transactions); // Initially show all transactions
        calculateBalance(response.data.transactions); // Update balance
      } catch (err) {
        console.error('Error fetching transactions:', err);
        alert('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, [token]);

  // Calculate balance based on transactions
  const calculateBalance = (transactions) => {
    let totalBalance = 0;
    transactions.forEach((transaction) => {
      if (transaction.transaction_type === 'DEPOSIT') {
        totalBalance += transaction.amount;
      } else if (transaction.transaction_type === 'WITHDRAWAL') {
        totalBalance -= transaction.amount;
      }
    });
    setBalance(totalBalance);
  };

  // Handle new transaction form submission
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return alert('Please enter a valid amount');

    const newTransaction = { amount, transaction_type: transactionType };

    try {
      const response = await axios.post('http://localhost:5000/api/transactions', newTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTransactions = [response.data, ...transactions];
      setTransactions(updatedTransactions); // Add new transaction to the list
      setFilteredTransactions(updatedTransactions); // Update filtered list
      calculateBalance(updatedTransactions); // Recalculate balance
      setAmount(''); // Clear form
      setShowForm(false); // Hide the form after submitting
    } catch (err) {
      console.error('Error adding transaction:', err);
      alert('Failed to add transaction');
    }
  };

  // Handle transaction status update
  const handleStatusUpdate = async (transactionId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/transactions/${transactionId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedTransactions = transactions.map((transaction) =>
        transaction._id === transactionId ? { ...transaction, status: newStatus } : transaction
      );

      setTransactions(updatedTransactions);
      filterTransactions(updatedTransactions); // Update filtered transactions
    } catch (err) {
      console.error('Error updating transaction status:', err);
      alert('Failed to update transaction status');
    }
  };

  // Filter transactions
  const filterTransactions = (transactionsList) => {
    let filtered = transactionsList || transactions;

    if (filterType !== 'ALL') {
      filtered = filtered.filter((t) => t.transaction_type === filterType);
    }

    setFilteredTransactions(filtered);
  };

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('jwt_token');
    alert('Logged out successfully');
    window.location.reload(); // Refresh the page or redirect to login page
  };

  return (
    <div className="transaction-page">
      <h2 className="page-title">Transactions</h2>

      {/* Display remaining balance */}
      <div className="balance-display">
        <h3>Remaining Balance: ${balance.toFixed(2)}</h3>
        <div>
        <button
          className="add-transaction-button"
          onClick={() => setShowForm(!showForm)}
        >
          <span className="plus-icon">+</span>
        </button>
        <button className="logout-button" onClick={handleLogout}>
          <span className="logout-icon">&#x1F6AA;</span>
        </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="filter-options">
        <label className="filter-label">
          Filter by Type:
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              filterTransactions();
            }}
            className="filter-dropdown"
          >
            <option value="ALL">All</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
          </select>
        </label>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <>
          <div className="backdrop" onClick={() => setShowForm(false)}></div>
          <form className="transaction-form" onSubmit={handleTransactionSubmit}>
            <button
              type="button"
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <div className="input-group">
              <label>Amount:</label>
              <input
                type="number"
                className="input-field"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="input-group">
              <label>Transaction Type:</label>
              <select
                className="input-field"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
              </select>
            </div>
            <button type="submit" className="submit-button">
              Add Transaction
            </button>
          </form>
        </>
      )}

      {/* Transaction List */}
      <h4 className="history-title">Transaction History</h4>
      <ul className="transaction-list">
        {filteredTransactions.map((transaction) => (
          <li key={transaction._id} className="transaction-item">
            <div className="transaction-info">
              <strong>${transaction.amount}</strong>
              <span className="transaction-type">{transaction.transaction_type}</span>
              {transaction.status === 'PENDING' ? (
                <select
                  className="status-dropdown"
                  value={transaction.status}
                  onChange={(e) => handleStatusUpdate(transaction._id, e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              ) : (
                <span className={transaction.status.toLowerCase()}>
                  {transaction.status}
                </span>
              )}
              <span className="timestamp">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TransactionPage;
