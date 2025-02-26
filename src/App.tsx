import { useState, useEffect } from 'react';
import EmojiPasswordInput from './components/EmojiPasswordInput';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import PasswordMetrics from './components/PasswordMetrics';
import { calculatePasswordStrength } from './utils/passwordUtils';

function App() {
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState('');
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);
  const [creationStartTime] = useState<number>(Date.now());
  const [creationTime, setCreationTime] = useState<number>(0);
  const [loginStartTime, setLoginStartTime] = useState<number | null>(null);
  const [loginTime, setLoginTime] = useState<number | null>(null);

  const passwordStrength = calculatePasswordStrength(password);

  useEffect(() => {
    if (registered && loginSuccess === null && loginStartTime === null) {
      setLoginStartTime(Date.now());
    }
  }, [registered, loginSuccess, loginStartTime]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirmedPassword) {
      setCreationTime((Date.now() - creationStartTime) / 1000);
      setRegistered(true);
      localStorage.setItem('emojiPassword', password);
    } else {
      alert('Passwords do not match or are empty!');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('emojiPassword');
    const endTime = Date.now();
    const timeToLogin = loginStartTime ? (endTime - loginStartTime) / 1000 : 0;
    setLoginTime(timeToLogin);

    if (loginAttempt === storedPassword) {
      setLoginSuccess(true);
    } else {
      setLoginSuccess(false);
    }
  };

  const handleReset = () => {
    setRegistered(false);
    setLoginSuccess(null);
    setPassword('');
    setConfirmedPassword('');
    setLoginAttempt('');
    setLoginStartTime(null);
    setLoginTime(null);
    localStorage.removeItem('emojiPassword');
  };

  if (!registered) {
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-blue-600 mb-2'>
          EmojiPassword Study
        </h1>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-3 mb-6'>
          <h2 className='text-lg font-medium text-blue-800 mb-1'>
            Research Purpose
          </h2>
          <p className='text-sm text-blue-700 mb-2'>
            This study examines how emojis in passwords affect usability and
            security. We're evaluating if emoji-enhanced passwords are more
            memorable while maintaining security.
          </p>
          <p className='text-sm text-blue-700'>
            Your participation helps us understand best practices for password
            design. All data collected is anonymous and used for research
            purposes only.
          </p>
        </div>

        <p className='mb-4 text-gray-700'>
          Create a password using a combination of text and emojis
        </p>

        <form onSubmit={handleRegister}>
          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block mb-2 font-medium text-gray-700'
            >
              Create Password:
            </label>
            <EmojiPasswordInput
              value={password}
              onChange={setPassword}
              placeholder='Enter password with emojis'
            />
            <PasswordStrengthMeter strength={passwordStrength} />
            <p className='mt-1 text-sm text-gray-500'>
              Tip: Adding emojis increases password strength!
            </p>
          </div>

          <div className='mb-6'>
            <label
              htmlFor='confirmPassword'
              className='block mb-2 font-medium text-gray-700'
            >
              Confirm Password:
            </label>
            <EmojiPasswordInput
              value={confirmedPassword}
              onChange={setConfirmedPassword}
              placeholder='Confirm your password'
            />
          </div>

          <button
            type='submit'
            className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
          >
            Register
          </button>
        </form>
      </div>
    );
  }

  if (registered && loginSuccess === null) {
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-blue-600 mb-4'>
          Password Created Successfully
        </h1>

        <PasswordMetrics
          password={password}
          creationTime={creationTime}
          passwordStrength={passwordStrength}
        />

        <div className='mt-6 mb-4'>
          <h2 className='text-lg font-medium text-gray-800 mb-2'>
            Now Try Logging In
          </h2>
          <p className='text-sm text-gray-600 mb-4'>
            Test if you can remember your emoji password
          </p>

          <form onSubmit={handleLogin}>
            <div className='mb-4'>
              <label
                htmlFor='loginPassword'
                className='block mb-2 font-medium text-gray-700'
              >
                Enter your password:
              </label>
              <EmojiPasswordInput
                value={loginAttempt}
                onChange={setLoginAttempt}
                placeholder='Enter your password'
              />
            </div>
            <button
              type='submit'
              className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        {loginSuccess ? 'Login Successful! 🎉' : 'Login Failed! ❌'}
      </h1>
      <p className='mb-4 text-gray-700 text-center'>
        {loginSuccess
          ? 'You have successfully logged in with your emoji password.'
          : 'Your password was incorrect. Please try again.'}
      </p>

      {loginTime !== null && (
        <div className='mb-6 p-3 bg-gray-50 rounded-lg border'>
          <p className='text-sm font-medium text-gray-700'>
            Login time: {loginTime.toFixed(1)} seconds
          </p>
          {loginSuccess ? (
            <p className='text-sm text-green-600'>Authentication successful</p>
          ) : (
            <p className='text-sm text-red-600'>Authentication failed</p>
          )}
        </div>
      )}

      <button
        onClick={handleReset}
        className='w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors border border-gray-300'
      >
        Reset Demo
      </button>
    </div>
  );
}

export default App;
