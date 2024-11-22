import React, { useState } from 'react';
import './Register.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';
import register from './register.png';
import { Link, useNavigate } from 'react-router-dom';



const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    let errors = {};

    if (!username) {
      valid = false;
      errors['username'] = 'Username is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      valid = false;
      errors['email'] = 'Valid email is required';
    }
    

    if (!password || password.length < 6) {
      valid = false;
      errors['password'] = 'Password must be at least 6 characters';
    }

    

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      try {
        await axios.post('https://sensiblet-backend-0ejj.onrender.com/api/users/register', { username,email, password });
        alert('Registration successful');
          navigate('/');
          
        
      
      }
      catch (error) {
        console.error('Error during registration:', error);
      }
      } 
     else {
      setIsSubmitted(false);
    }
  };

  
  return (
    <div>
      <div className="register-form-container">
        <div className="register-form">
          <div className="register-form__title">Register</div>
          <form onSubmit={handleSubmit}>
            <div className="register-form__input-box">
              <div className="register-form__input-wrapper">
                <input
                  type="text"
                  className="register-form__input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <i className='bx bxs-user register-form__icon'></i>
              </div>
              {errors.username && <div className="register-form__error">{errors.username}</div>}
            </div>

            <div className="register-form__input-box">
              <div className="register-form__input-wrapper">
                <input
                  type="email"
                  className="register-form__input"
                  placeholder="Email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className='bx bxs-envelope register-form__icon'></i>
              </div>
              {errors.email && <div className="register-form__error">{errors.email}</div>}
            </div>

            
            <div className="register-form__input-box">
              <div className="register-form__input-wrapper">
                <input
                  type="password"
                  className="register-form__input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className='bx bxs-lock-alt register-form__icon'></i>
              </div>
              {errors.password && <div className="register-form__error">{errors.password}</div>}
            </div>

            <div className="register-form__btn-container">
              <button type="submit" className="register-form__btn">Register</button>
            </div>
          </form>
        </div>
        <div className='register-image'>
          <img src={register} className='register-images' alt="Registration" />
        </div>
      </div>
    </div>
  );
};

export default Register;