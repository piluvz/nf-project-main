import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <p>Login form will go here</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default Login;