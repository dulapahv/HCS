import { useState } from 'react';
import EmojiPasswordInput from './components/EmojiPasswordInput';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import { calculatePasswordStrength } from './utils/passwordUtils';

function App() {
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState('');
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);

  const passwordStrength = calculatePasswordStrength(password);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirmedPassword) {
      setRegistered(true);
      localStorage.setItem('emojiPassword', password);
    } else {
      alert('Passwords do not match or are empty!');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('emojiPassword');
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
    localStorage.removeItem('emojiPassword');
  };

  if (!registered) {
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-blue-600 mb-4'>
          EmojiPassword Study Prototype
        </h1>
        <p className='mb-6 text-gray-700'>
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
          Login with your Emoji Password
        </h1>
        <form onSubmit={handleLogin}>
          <div className='mb-6'>
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
    );
  }

  return (
    <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        {loginSuccess ? 'Login Successful! 🎉' : 'Login Failed! ❌'}
      </h1>
      <p className='mb-6 text-gray-700 text-center'>
        {loginSuccess
          ? 'You have successfully logged in with your emoji password.'
          : 'Your password was incorrect. Please try again.'}
      </p>
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
