

import React, { useState } from 'react';
import './Login.css';
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import login from './login.png';
import Cookies from 'js-cookie';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    let errors = {};

    if (!id) {
      valid = false;
      errors['id'] = 'Valid email is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!id || !emailPattern.test(id)) {
      valid = false;
      errors['id'] = 'Valid email is required';
    }

    if (!password) {
      valid = false;
      errors['password'] = 'Password is required';
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post("http://localhost:5000/api/users/login", {
          email: id,
          password: password
        });

        const { token } = response.data;
        console.log(token)

        Cookies.set('jwt_token', token, { expires: 30 });


        navigate('/transactions', { state: { email: id } });
      } catch (error) {
        toast.info('Invalid login credentials!');
      }
    }
  };

  return (
    <div>
      <div className="login-form-container">
        <div className='login-image'>
          <img src={login} className='login-images' />
        </div>
        <div className="login-form">
          <h1 className="login-form__title">Login</h1>
          <form className="login-form__form" onSubmit={handleSubmit}>
            <div className="login-form__input-box">
              <input
                type="email"
                placeholder="Employee Email"
                required
                className="login-form__input"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <i className='bx bxs-envelope login-form__icon'></i>
              {errors.id && <div className="login-form__error">{errors.id}</div>}
            </div>
            <div className="login-form__input-box">
              <input
                type="password"
                placeholder="Password"
                required
                className="login-form__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className='bx bxs-lock-alt login-form__icon'></i>
              {errors.password && <div className="login-form__error">{errors.password}</div>}
            </div>
            <div className="login-form__remember-forgot">
              <label className="login-form__checkbox-label">
                <input type="checkbox" required className="login-form__checkbox" />Remember Me
              </label>
              <a href="#" className="login-form__forgot-link">Forgot Password</a>
            </div>
            <button type="submit" className="login-form__btn">Login</button>
            <div className="login-form__register-link">
              <p>Don't have an account? <a href="/Register" className="login-form__register-link-anchor">Register</a></p>
            </div>
          </form>
        </div>
        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default Login;