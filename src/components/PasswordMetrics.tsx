import { countEmojis, getUniqueEmojis } from '../utils/emojiUtils';
import {
  calculatePasswordEntropy,
  estimateTimeToCrack,
  getEntropyDescription,
} from '../utils/passwordUtils';
import twemoji from 'twemoji';
import { useMemo } from 'react';

interface PasswordMetricsProps {
  password: string;
  creationTime: number;
  passwordStrength: number;
  passwordType?: 'emoji' | 'text';
  loginInfo?: {
    success: boolean;
    attempts: number;
    time: number;
  };
  isLongTerm?: boolean;
  showEmojiContent?: boolean; // Added prop to control emoji content visibility
}

const PasswordMetrics = ({
  password,
  creationTime,
  passwordStrength,
  passwordType,
  loginInfo,
  isLongTerm = false,
  showEmojiContent = true, // Default to true for backward compatibility
}: PasswordMetricsProps) => {
  // Stats about the password
  const emojiCount = countEmojis(password);
  const uniqueEmojis = getUniqueEmojis(password);
  const textLength = password.length - emojiCount;
  const emojiPercentage =
    password.length > 0 ? Math.round((emojiCount / password.length) * 100) : 0;

  // Calculate entropy
  const entropy = calculatePasswordEntropy(password);
  const entropyDescription = getEntropyDescription(entropy);
  const crackTime = estimateTimeToCrack(entropy);

  // Create a JSON string for easy copying
  const metricsData = JSON.stringify(
    {
      password_type: passwordType,
      test_type: isLongTerm ? 'long_term' : 'short_term',
      total_length: password.length,
      text_characters: textLength,
      emoji_count: passwordType === 'emoji' ? emojiCount : 0,
      unique_emoji_count: passwordType === 'emoji' ? uniqueEmojis.length : 0,
      emoji_percentage: passwordType === 'emoji' ? emojiPercentage : 0,
      entropy: entropy.toFixed(2),
      password_strength: passwordStrength,
      creation_time_seconds: creationTime.toFixed(1),
      recall: loginInfo
        ? {
            success: loginInfo.success,
            attempts: loginInfo.attempts,
            time_seconds: loginInfo.time.toFixed(1),
          }
        : null,
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );

  // Parse emojis with Twemoji
  const renderedUniqueEmojis = useMemo(() => {
    if (!uniqueEmojis.length) return '';
    return twemoji.parse(uniqueEmojis.join(' '), {
      folder: 'svg',
      ext: '.svg',
      className: 'emoji-display w-6 h-6 inline-block',
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    });
  }, [uniqueEmojis]);

  const copyMetricsToClipboard = () => {
    navigator.clipboard
      .writeText(metricsData)
      .then(() => alert('Metrics copied to clipboard!'))
      .catch((err) => console.error('Failed to copy metrics: ', err));
  };

  return (
    <div className='bg-gray-50 rounded-lg border border-gray-200 p-4'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-lg font-medium text-gray-900'>
          {isLongTerm ? 'Long-Term Recall Metrics' : 'Password Metrics'}
        </h3>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-4'>
        {!isLongTerm && (
          <>
            <div className='bg-white p-2 rounded border'>
              <div className='text-sm text-gray-500'>Total Length</div>
              <div className='text-lg font-medium'>
                {password.length} characters
              </div>
            </div>
            <div className='bg-white p-2 rounded border'>
              <div className='text-sm text-gray-500'>Creation Time</div>
              <div className='text-lg font-medium'>
                {creationTime.toFixed(1)} seconds
              </div>
            </div>

            {passwordType === 'emoji' && (
              <>
                <div className='bg-white p-2 rounded border'>
                  <div className='text-sm text-gray-500'>Text Characters</div>
                  <div className='text-lg font-medium'>
                    {textLength} ({100 - emojiPercentage}%)
                  </div>
                </div>
                <div className='bg-white p-2 rounded border'>
                  <div className='text-sm text-gray-500'>Emoji Characters</div>
                  <div className='text-lg font-medium'>
                    {emojiCount} ({emojiPercentage}%)
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {!isLongTerm && (
        <>
          <div className='mb-4'>
            <div className='text-sm text-gray-500 mb-1'>Password Strength</div>
            <div className='flex items-center'>
              <div className='flex-grow h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className={`h-full ${
                    passwordStrength < 30
                      ? 'bg-red-500'
                      : passwordStrength < 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <span className='ml-2 text-sm font-medium'>
                {passwordStrength < 30
                  ? 'Weak'
                  : passwordStrength < 60
                  ? 'Medium'
                  : 'Strong'}
              </span>
            </div>
          </div>

          <div className='mb-4 bg-white p-3 rounded border'>
            <div className='text-sm text-gray-500 mb-1'>Password Entropy</div>
            <div className='text-lg font-medium'>{entropy.toFixed(2)} bits</div>
            <div className='text-xs text-gray-600'>{entropyDescription}</div>
            <div className='mt-1 text-xs text-gray-500'>
              Est. time to crack:{' '}
              <span className='font-medium'>{crackTime}</span>
            </div>
          </div>
        </>
      )}

      {/* Only show emoji content if explicitly allowed */}
      {passwordType === 'emoji' &&
        !isLongTerm &&
        uniqueEmojis.length > 0 &&
        showEmojiContent && (
          <div className='mb-4'>
            <div className='text-sm text-gray-500 mb-1'>
              Unique Emojis Used ({uniqueEmojis.length})
            </div>
            <div
              className='text-2xl'
              dangerouslySetInnerHTML={{ __html: renderedUniqueEmojis }}
            ></div>
          </div>
        )}

      {loginInfo && (
        <div className='mb-4 bg-white p-3 rounded border'>
          <div className='text-sm text-gray-500 mb-1'>
            {isLongTerm
              ? 'Long-Term Recall Results'
              : 'Short-Term Recall Results'}
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <div className='text-xs text-gray-500'>Status</div>
              <div
                className={`text-sm font-medium ${
                  loginInfo.success ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {loginInfo.success ? 'Successful' : 'Failed'}
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500'>Attempts</div>
              <div className='text-sm font-medium'>{loginInfo.attempts}</div>
            </div>
            <div>
              <div className='text-xs text-gray-500'>Login Time</div>
              <div className='text-sm font-medium'>
                {loginInfo.time.toFixed(1)}s
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={copyMetricsToClipboard}
        className='mt-2 w-full text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
        title='Copy metrics for Microsoft Form'
      >
        Copy Result
      </button>

      <div className='mt-4 border-t pt-3'>
        <p className='text-xs text-gray-500'>
          Please copy these metrics using the button above and paste them into
          the Microsoft Form to complete the study. Thank you for your
          participation!
        </p>
      </div>
    </div>
  );
};

export default PasswordMetrics;
