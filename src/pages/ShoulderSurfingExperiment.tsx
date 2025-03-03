import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmojiPasswordInput from '../components/EmojiPasswordInput';
import twemoji from 'twemoji';
import { emojiCategories } from '../utils/emojiUtils';

type PasswordType = 'emoji' | 'text';

// Test passwords
const TEST_PASSWORDS = {
  emoji: [
    {
      id: 'emoji-random-4',
      value: '🐱🍍🚗💙',
      description: 'Random 4-Emoji Password',
    },
    {
      id: 'emoji-random-6',
      value: '🐼🍎🏠⚽🌸🎵',
      description: 'Random 6-Emoji Password',
    },
    {
      id: 'emoji-pattern-4',
      value: '🐶🐱🐭🐹',
      description: 'Pattern-based 4-Emoji Password (all animals)',
    },
    {
      id: 'emoji-story-4',
      value: '🏠🌧️🛌📱',
      description: 'Story-based 4-Emoji Password',
    },
  ],
  text: [
    {
      id: 'text-random-8',
      value: 'xK7$j2pL',
      description: 'Random 8-character Password',
    },
    {
      id: 'text-pattern-8',
      value: 'abcd1234',
      description: 'Pattern-based 8-character Password',
    },
    {
      id: 'text-word-8',
      value: 'Sunshine42',
      description: 'Word-based 8-character Password',
    },
  ],
};

function ShoulderSurfingExperiment() {
  // Current experiment state
  const [passwordType, setPasswordType] = useState<PasswordType>('emoji');
  const [observerMode, setObserverMode] = useState(false);
  const [targetMode, setTargetMode] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [guessAttempt, setGuessAttempt] = useState('');
  const [guessResult, setGuessResult] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const [showPassword, setShowPassword] = useState(false);
  const [results, setResults] = useState<
    { id: string; correct: boolean; attempts: number }[]
  >([]);
  const [targetEntered, setTargetEntered] = useState(false);

  // Reset experiment when password type changes
  useEffect(() => {
    setObserverMode(false);
    setTargetMode(false);
    setSelectedPasswordId('');
    setCurrentPassword('');
    setGuessAttempt('');
    setGuessResult(null);
    setAttempts(0);
    setTargetEntered(false);
  }, [passwordType]);

  // Start target display (what the observer will try to shoulder surf)
  const startTargetDisplay = () => {
    if (!selectedPasswordId) {
      alert('Please select a password to display');
      return;
    }

    const passwordObj = TEST_PASSWORDS[passwordType].find(
      (p) => p.id === selectedPasswordId
    );
    if (passwordObj) {
      setCurrentPassword(randomPassword(passwordType, passwordObj.value));
      setTargetMode(true);
    }
  };

  const randomPassword = (type: PasswordType, reference: string): string => {
    // Correctly count emoji characters using Array.from for emoji type
    const len =
      type === 'emoji' ? Array.from(reference).length : reference.length;

    if (type === 'emoji') {
      const emojis = [
        ...emojiCategories.activities,
        ...emojiCategories.animals,
        ...emojiCategories.food,
        ...emojiCategories.faces,
        ...emojiCategories.people,
        ...emojiCategories.objects,
        ...emojiCategories.symbols,
        ...emojiCategories.travel,
      ];
      return Array.from(
        { length: len },
        () => emojis[Math.floor(Math.random() * emojis.length)]
      ).join('');
    } else {
      const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from(
        { length: len },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    }
  };

  // Simulate target entering password - this is what the observer would watch
  const simulateTargetEntry = () => {
    setTargetEntered(true);
  };

  // Start observer mode (where observer tries to guess the password)
  const startObserverMode = () => {
    setTargetMode(false);
    setObserverMode(true);
    setGuessAttempt('');
    setGuessResult(null);
    setAttempts(0);
  };

  // Handle password guess submission
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempts(attempts + 1);

    if (guessAttempt === currentPassword) {
      setGuessResult(true);
      setResults([
        ...results,
        {
          id: selectedPasswordId,
          correct: true,
          attempts: attempts + 1,
        },
      ]);
    } else if (attempts + 1 >= maxAttempts) {
      setGuessResult(false);
      setResults([
        ...results,
        {
          id: selectedPasswordId,
          correct: false,
          attempts: attempts + 1,
        },
      ]);
    }
  };

  // Reset the entire experiment
  const resetExperiment = () => {
    setObserverMode(false);
    setTargetMode(false);
    setSelectedPasswordId('');
    setCurrentPassword('');
    setGuessAttempt('');
    setGuessResult(null);
    setAttempts(0);
    setTargetEntered(false);
  };

  // Render emoji with Twemoji
  const renderEmojiWithTwemoji = (text: string) => {
    return {
      __html: twemoji.parse(text, {
        folder: 'svg',
        ext: '.svg',
        className: 'inline-block h-8',
        base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
      }),
    };
  };

  // Main experiment selection screen
  if (!targetMode && !observerMode) {
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-blue-600'>
            Shoulder Surfing Experiment
          </h1>
          <Link to='/' className='text-blue-600 hover:text-blue-800 text-sm'>
            Back to Home
          </Link>
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-3 mb-6'>
          <h2 className='text-lg font-medium text-blue-800 mb-1'>
            How This Experiment Works
          </h2>
          <p className='text-sm text-blue-700 mb-2'>
            This experiment tests how vulnerable different password types are to
            "shoulder surfing" (when someone watches you enter your password).
          </p>
          <ol className='text-sm text-blue-700 list-decimal pl-5 space-y-2'>
            <li>
              <strong>Step 1:</strong> Select password type and a specific test
              password.
            </li>
            <li>
              <strong>Step 2:</strong> The "target" person will see the password
              and enter it while the "observer" watches.
            </li>
            <li>
              <strong>Step 3:</strong> The observer then tries to recreate the
              password they saw being entered.
            </li>
          </ol>
        </div>

        <div className='mb-6'>
          <h3 className='text-md font-medium text-gray-700 mb-2'>
            Password Type:
          </h3>
          <div className='flex gap-4 mb-4'>
            <button
              className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                passwordType === 'emoji'
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setPasswordType('emoji')}
            >
              Emoji Password
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                passwordType === 'text'
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setPasswordType('text')}
            >
              Text Password
            </button>
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-md font-medium text-gray-700 mb-2'>
            Select Test Password:
          </h3>
          <div className='space-y-2'>
            {TEST_PASSWORDS[passwordType].map((password) => (
              <div
                key={password.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedPasswordId === password.id
                    ? 'bg-blue-50 border-blue-500'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
                onClick={() => setSelectedPasswordId(password.id)}
              >
                <div className='font-medium'>{password.description}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={startTargetDisplay}
          disabled={!selectedPasswordId}
          className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          Start Target Display
        </button>

        {results.length > 0 && (
          <div className='mt-8 border-t pt-4'>
            <h3 className='text-lg font-medium text-gray-800 mb-2'>
              Previous Results:
            </h3>
            <div className='space-y-2'>
              {results.map((result, index) => {
                const password = [
                  ...TEST_PASSWORDS.emoji,
                  ...TEST_PASSWORDS.text,
                ].find((p) => p.id === result.id);
                return (
                  <div key={index} className='p-2 border rounded-md bg-gray-50'>
                    <div className='flex justify-between'>
                      <span>{password?.description}</span>
                      <span
                        className={
                          result.correct ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {result.correct ? 'Guessed' : 'Failed'} (
                        {result.attempts} attempts)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Target display screen (the person being observed)
  if (targetMode) {
    const passwordObj = TEST_PASSWORDS[passwordType].find(
      (p) => p.id === selectedPasswordId
    );

    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-blue-600 mb-4'>
          Target Display - {passwordObj?.description}
        </h1>

        <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6'>
          <h3 className='text-md font-medium text-yellow-800 mb-2'>
            Instructions for the Target:
          </h3>
          <ol className='text-sm text-yellow-800 list-decimal pl-5 space-y-1'>
            <li>
              First, memorize the password shown below (toggle to view it).
            </li>
            <li>Click "Enter Password" to simulate typing it.</li>
            <li>Make sure the observer can see your screen as you type.</li>
            <li>
              After you're done, click "Continue to Observer Mode" so they can
              try to recreate what they saw.
            </li>
          </ol>
        </div>

        <div className='mb-6'>
          <div className='flex justify-between items-center mb-2'>
            <h3 className='font-medium text-gray-700'>Your Password:</h3>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
          </div>

          {showPassword ? (
            <div className='p-3 bg-white border rounded-md text-center text-xl'>
              {passwordType === 'emoji' ? (
                <span
                  dangerouslySetInnerHTML={renderEmojiWithTwemoji(
                    currentPassword
                  )}
                />
              ) : (
                currentPassword
              )}
            </div>
          ) : (
            <div className='p-3 bg-white border rounded-md text-center text-xl'>
              {currentPassword.replace(/./g, '•')}
            </div>
          )}
        </div>

        {!targetEntered ? (
          <button
            onClick={simulateTargetEntry}
            className='w-full py-2 px-4 mb-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors'
          >
            Enter Password (While Observer Watches)
          </button>
        ) : (
          <div className='p-3 bg-green-50 border border-green-200 rounded-md mb-4 text-center'>
            <p className='text-green-700'>Password successfully entered!</p>
            <p className='text-sm text-green-600'>
              The observer should now have seen your input.
            </p>
          </div>
        )}

        <div className='flex gap-4'>
          <button
            onClick={startObserverMode}
            className='flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            disabled={!targetEntered}
          >
            Continue to Observer Mode
          </button>
          <button
            onClick={resetExperiment}
            className='flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors border border-gray-300'
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Observer attempt screen
  if (observerMode) {
    const passwordObj = TEST_PASSWORDS[passwordType].find(
      (p) => p.id === selectedPasswordId
    );

    // If observation is complete (success or max attempts reached)
    if (guessResult !== null) {
      return (
        <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold text-center mb-4'>
            {guessResult ? 'Correct Guess! 🎉' : 'Incorrect Guess! ❌'}
          </h1>

          <div
            className={`p-4 rounded-md mb-6 ${
              guessResult
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p
              className={`text-center ${
                guessResult ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {guessResult
                ? 'The observer successfully guessed the password!'
                : `Maximum attempts (${maxAttempts}) reached without success.`}
            </p>
          </div>

          <div className='mb-6'>
            <h3 className='font-medium text-gray-700 mb-2'>
              Password Details:
            </h3>
            <div className='space-y-2 p-3 bg-gray-50 rounded-md border'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Type:</span>
                <span className='font-medium'>
                  {passwordType === 'emoji'
                    ? 'Emoji Password'
                    : 'Text Password'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Style:</span>
                <span className='font-medium'>{passwordObj?.description}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Actual Password:</span>
                <span className='font-medium'>
                  {passwordType === 'emoji' ? (
                    <span
                      dangerouslySetInnerHTML={renderEmojiWithTwemoji(
                        currentPassword
                      )}
                    />
                  ) : (
                    currentPassword
                  )}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Last Attempt:</span>
                <span className='font-medium'>
                  {passwordType === 'emoji' && guessAttempt ? (
                    <span
                      dangerouslySetInnerHTML={renderEmojiWithTwemoji(
                        guessAttempt
                      )}
                    />
                  ) : (
                    guessAttempt
                  )}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Attempts:</span>
                <span className='font-medium'>
                  {attempts} of {maxAttempts}
                </span>
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={resetExperiment}
              className='flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            >
              Try Another Password
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

    // Observer actively guessing
    return (
      <div className='max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-blue-600 mb-4'>
          Observer Mode - Guess the Password
        </h1>

        <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6'>
          <h3 className='text-md font-medium text-yellow-800 mb-2'>
            Instructions for the Observer:
          </h3>
          <p className='text-sm text-yellow-800'>
            Try to enter the password you just observed the target typing. You
            have {maxAttempts} attempts.
          </p>
          <p className='text-sm text-yellow-800 mt-1'>
            <strong>Current attempt:</strong> {attempts + 1} of {maxAttempts}
          </p>
        </div>

        <form onSubmit={handleGuessSubmit}>
          {passwordType === 'emoji' ? (
            <div className='mb-6'>
              <h3 className='font-medium text-gray-700 mb-2'>
                Enter Guessed Password:
              </h3>
              <EmojiPasswordInput
                value={guessAttempt}
                onChange={setGuessAttempt}
                placeholder='Enter your guess'
              />
            </div>
          ) : (
            <div className='mb-6'>
              <h3 className='font-medium text-gray-700 mb-2'>
                Enter Guessed Password:
              </h3>
              <div className='relative'>
                <input
                  type='text'
                  value={guessAttempt}
                  onChange={(e) => setGuessAttempt(e.target.value)}
                  className='w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter your guess'
                />
              </div>
            </div>
          )}

          <div className='flex gap-4'>
            <button
              type='submit'
              className='flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            >
              Submit Guess
            </button>
            <button
              type='button'
              onClick={resetExperiment}
              className='flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors border border-gray-300'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}

export default ShoulderSurfingExperiment;
