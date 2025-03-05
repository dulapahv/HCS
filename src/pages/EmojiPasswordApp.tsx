import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmojiPasswordInput from '../components/EmojiPasswordInput';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import PasswordMetrics from '../components/PasswordMetrics';
import {
  calculatePasswordStrength,
  hashPassword,
  verifyPassword,
  getUserData,
  saveUserData,
  generateUserId,
  getCurrentUserId,
  setCurrentUserId,
  UserData,
} from '../utils/passwordUtils';
import { countEmojis } from '../utils/emojiUtils';

function EmojiPasswordApp() {
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState('');
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);
  const [creationStartTime] = useState<number>(Date.now());
  const [creationTime, setCreationTime] = useState<number>(0);
  const [loginStartTime, setLoginStartTime] = useState<number | null>(null);
  const [, setLoginTime] = useState<number | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [passwordHash, setPasswordHash] = useState<string>('');
  const [returningUser, setReturningUser] = useState<boolean>(false);
  const [shortTermRecallInfo, setShortTermRecallInfo] = useState<{
    success: boolean;
    attempts: number;
    time: number;
  } | null>(null);
  const [maxAttempts] = useState<number>(5);
  const [longTermRecallInfo, setLongTermRecallInfo] = useState<{
    success: boolean;
    attempts: number;
    time: number;
  } | null>(null);

  const passwordStrength = calculatePasswordStrength(password);

  // Check for returning user
  useEffect(() => {
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      const userData = getUserData(currentUserId);
      if (userData && userData.type === 'emoji') {
        setUserId(currentUserId);
        setPasswordHash(userData.passwordHash);
        setReturningUser(true);
        setRegistered(true);
      } else {
        // Generate new user ID if existing one doesn't match type
        const newUserId = generateUserId();
        setUserId(newUserId);
        setCurrentUserId(newUserId);
      }
    } else {
      // Generate new user ID if none exists
      const newUserId = generateUserId();
      setUserId(newUserId);
      setCurrentUserId(newUserId);
    }
  }, []);

  useEffect(() => {
    if (registered && loginSuccess === null && loginStartTime === null) {
      setLoginStartTime(Date.now());
    }
  }, [registered, loginSuccess, loginStartTime]);

  const validateEmojiPassword = (pass: string): boolean => {
    const emojiCount = countEmojis(pass);
    return emojiCount >= 4;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmojiPassword(password)) {
      alert('Your password must contain at least 4 emojis!');
      return;
    }

    if (password && password === confirmedPassword) {
      const endTime = Date.now();
      const timeToCreate = (endTime - creationStartTime) / 1000;
      setCreationTime(timeToCreate);

      // Hash the password
      const hash = hashPassword(password);
      setPasswordHash(hash);

      // Save user data
      const userData: UserData = {
        passwordHash: hash,
        creationTime: timeToCreate,
        loginAttempts: [],
        loginTimes: [],
        lastLogin: Date.now(),
        type: 'emoji',
        shortTermCorrect: false,
        shortTermAttempts: 0,
        shortTermTime: 0,
      };

      saveUserData(userId, userData);
      setRegistered(true);
    } else {
      alert('Passwords do not match or are empty!');
    }
  };

  // Add this function to handle input changes and start timing
  const handleLoginInputChange = (value: string) => {
    // Start timer on first keystroke
    if (loginStartTime === null && value.length === 1) {
      setLoginStartTime(Date.now());
    }
    setLoginAttempt(value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const endTime = Date.now();
    const timeToLogin = loginStartTime ? (endTime - loginStartTime) / 1000 : 0;
    setLoginTime(timeToLogin);
    setLoginAttempts(loginAttempts + 1);

    // Verify against hashed password
    const isCorrect = verifyPassword(loginAttempt, passwordHash);

    // Only set success if correct or max attempts reached
    if (isCorrect || loginAttempts + 1 >= maxAttempts) {
      setLoginSuccess(isCorrect);

      // Update user data with short-term recall results
      const userData = getUserData(userId);
      if (userData) {
        userData.shortTermCorrect = isCorrect;
        userData.shortTermAttempts = loginAttempts + 1;
        userData.shortTermTime = timeToLogin;
        saveUserData(userId, userData);
      }

      // Save short-term recall info for metrics display
      setShortTermRecallInfo({
        success: isCorrect,
        attempts: loginAttempts + 1,
        time: timeToLogin,
      });
    } else {
      // Clear input for next attempt
      setLoginAttempt('');
      alert(
        `Incorrect password. Attempts: ${loginAttempts + 1}/${maxAttempts}`
      );
    }
  };

  const handleReturningUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const endTime = Date.now();
    const timeToLogin = loginStartTime ? (endTime - loginStartTime) / 1000 : 0;
    setLoginTime(timeToLogin);
    setLoginAttempts(loginAttempts + 1);

    // Verify against hashed password
    const isCorrect = verifyPassword(loginAttempt, passwordHash);

    // Only set success if correct or max attempts reached
    if (isCorrect || loginAttempts + 1 >= maxAttempts) {
      setLoginSuccess(isCorrect);

      // Update user data with long-term recall results
      const userData = getUserData(userId);
      if (userData) {
        userData.longTermCorrect = isCorrect;
        userData.longTermAttempts = loginAttempts + 1;
        userData.longTermTime = timeToLogin;
        saveUserData(userId, userData);
      }

      // Save long-term recall info for metrics display
      setLongTermRecallInfo({
        success: isCorrect,
        attempts: loginAttempts + 1,
        time: timeToLogin,
      });
    } else {
      // Clear input for next attempt
      setLoginAttempt('');
      alert(
        `Incorrect password. Attempts: ${loginAttempts + 1}/${maxAttempts}`
      );
    }
  };

  const handleReset = () => {
    // Generate new user ID
    const newUserId = generateUserId();
    setUserId(newUserId);
    setCurrentUserId(newUserId);

    setRegistered(false);
    setLoginSuccess(null);
    setPassword('');
    setConfirmedPassword('');
    setLoginAttempt('');
    setLoginStartTime(null);
    setLoginTime(null);
    setLoginAttempts(0);
    setReturningUser(false);
    setShortTermRecallInfo(null);
    setLongTermRecallInfo(null);
  };

  // If returning user, show login screen directly
  if (returningUser && loginSuccess === null) {
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-blue-600'>
            EmojiPass Study - Long-Term Recall
          </h1>
          <button
            onClick={handleReset}
            className='text-blue-600 hover:text-blue-800 text-sm'
          >
            Reset Study
          </button>
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-3 mb-6'>
          <h2 className='text-lg font-medium text-blue-800 mb-1'>
            Welcome Back!
          </h2>
          <p className='text-sm text-blue-700 mb-2'>
            Please try to recall your emoji password from your previous session.
          </p>
        </div>

        <form onSubmit={handleReturningUserLogin}>
          <div className='mb-4'>
            <label
              htmlFor='loginPassword'
              className='block mb-2 font-medium text-gray-700'
            >
              Enter your emoji password:
            </label>
            <EmojiPasswordInput
              value={loginAttempt}
              onChange={handleLoginInputChange}
              placeholder='Enter your password'
              hideRecentEmojis={true}
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

  // New user registration
  if (!registered) {
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-blue-600'>EmojiPass Study</h1>
          <Link to='/' className='text-blue-600 hover:text-blue-800 text-sm'>
            Back to Home
          </Link>
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-3 mb-6'>
          <h2 className='text-lg font-medium text-blue-800 mb-1'>
            Emoji Password Creation
          </h2>
          <p className='text-sm text-blue-700 mb-2'>
            Create a password using at least 4 emojis. This password should be
            something you can remember, but others would find hard to guess.
          </p>
        </div>

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
              placeholder='Enter password (min 4 emojis)'
              hideRecentEmojis={true}
            />
            <PasswordStrengthMeter strength={passwordStrength} />
            <div className='mt-2 flex items-center text-sm text-gray-500'>
              <div className='mr-2 w-4 h-4 flex items-center justify-center bg-blue-100 rounded-full text-blue-600'>
                ℹ️
              </div>
              <p>Your password must contain at least 4 emojis</p>
            </div>
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
              hideRecentEmojis={true}
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

  // Short-term recall test
  if (registered && loginSuccess === null) {
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-blue-600'>
            Emoji Password Created
          </h1>
          <button
            onClick={handleReset}
            className='text-blue-600 hover:text-blue-800 text-sm'
          >
            Reset Study
          </button>
        </div>

        <PasswordMetrics
          password={password}
          creationTime={creationTime}
          passwordStrength={passwordStrength}
          passwordType='emoji'
          showEmojiContent={false}
        />

        <div className='mt-6 mb-4'>
          <h2 className='text-lg font-medium text-gray-800 mb-2'>
            Short-Term Memory Test
          </h2>
          <p className='text-sm text-gray-600 mb-4'>
            Now try to recall the emoji password you just created
          </p>

          <form onSubmit={handleLogin}>
            <div className='mb-4'>
              <label
                htmlFor='loginPassword'
                className='block mb-2 font-medium text-gray-700'
              >
                Enter your emoji password:
              </label>
              <EmojiPasswordInput
                value={loginAttempt}
                onChange={handleLoginInputChange}
                placeholder='Enter your password'
                hideRecentEmojis={true}
              />
            </div>
            <button
              type='submit'
              className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            >
              Test Memory
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Display results after login attempt
  return (
    <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold mb-4'>
          {loginSuccess ? 'Login Successful! 🎉' : 'Login Failed! ❌'}
        </h1>
        <Link to='/' className='text-blue-600 hover:text-blue-800 text-sm'>
          Back to Home
        </Link>
      </div>

      <div
        className={`p-4 mb-6 rounded-md ${
          loginSuccess
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}
      >
        <p className={`${loginSuccess ? 'text-green-800' : 'text-red-800'}`}>
          {returningUser
            ? loginSuccess
              ? 'Great job! You successfully remembered your emoji password from a previous session.'
              : 'You were unable to recall your password from the previous session.'
            : loginSuccess
            ? 'You successfully recalled your newly created emoji password.'
            : 'You were unable to recall your newly created password.'}
        </p>
      </div>

      {!returningUser && (
        <PasswordMetrics
          password={password}
          creationTime={creationTime}
          passwordStrength={passwordStrength}
          passwordType='emoji'
          loginInfo={shortTermRecallInfo || undefined}
          showEmojiContent={false}
        />
      )}

      {returningUser && loginSuccess !== null && (
        <PasswordMetrics
          password='********' // Password is hidden for security
          creationTime={0} // Not applicable for returning users
          passwordStrength={0} // Not applicable for returning users
          passwordType='emoji'
          loginInfo={longTermRecallInfo || undefined}
          isLongTerm={true}
        />
      )}

      <div className='mt-6 flex gap-4'>
        <button
          onClick={handleReset}
          className='flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
        >
          Start New Test
        </button>
        <Link
          to='/'
          className='flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors border border-gray-300 text-center'
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default EmojiPasswordApp;
