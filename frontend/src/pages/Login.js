import React from 'react';

const Login = () => {
  const googleAuth = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  const facebookAuth = () => {
    window.open('http://localhost:5000/api/auth/facebook', '_self');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-centre"  style={{ backgroundImage: "url('/images/loginscene4.jpg')" }}>
      <div className="max-w-md w-full bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl space-y-6 text-center float" >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to SoulSpace</h1>

        <button 
  onClick={googleAuth} 
  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-400 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition"

>
  <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
  Login with Google
</button>


       <button 
  onClick={facebookAuth} 
  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-400 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition"

>
  <img src="https://img.icons8.com/color/24/000000/facebook-new.png" alt="Facebook" />
  Login with Facebook
</button>


        <button 
  onClick={() => window.location.href = '/manual-login'} 
  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-400 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition"

>
  <img src="https://img.icons8.com/ios-filled/24/000000/new-post.png" alt="Email" />
  Login with Email
</button>

      </div>
    </div>
  );
};

export default Login;
