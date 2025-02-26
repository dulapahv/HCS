import { countEmojis, getUniqueEmojis } from '../utils/emojiUtils';

interface PasswordMetricsProps {
  password: string;
  creationTime: number;
  passwordStrength: number;
}

const PasswordMetrics = ({
  password,
  creationTime,
  passwordStrength,
}: PasswordMetricsProps) => {
  // Stats about the password
  const emojiCount = countEmojis(password);
  const uniqueEmojis = getUniqueEmojis(password);
  const textLength = password.length - emojiCount;
  const emojiPercentage =
    password.length > 0 ? Math.round((emojiCount / password.length) * 100) : 0;

  // Create a JSON string for easy copying
  const metricsData = JSON.stringify(
    {
      password: password,
      totalLength: password.length,
      textCharacters: textLength,
      emojiCount: emojiCount,
      uniqueEmojiCount: uniqueEmojis.length,
      emojiPercentage: emojiPercentage,
      creationTimeSeconds: creationTime.toFixed(1),
      passwordStrength: passwordStrength,
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );

  const copyMetricsToClipboard = () => {
    navigator.clipboard
      .writeText(metricsData)
      .then(() => alert('Metrics copied to clipboard!'))
      .catch((err) => console.error('Failed to copy metrics: ', err));
  };

  return (
    <div className='bg-gray-50 rounded-lg border border-gray-200 p-4'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-lg font-medium text-gray-900'>Password Metrics</h3>
        <button
          onClick={copyMetricsToClipboard}
          className='text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors'
          title='Copy metrics for Microsoft Form'
        >
          Copy Metrics
        </button>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-4'>
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
      </div>

      <div className='mb-3'>
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

      <div>
        <div className='text-sm text-gray-500 mb-1'>
          Unique Emojis Used ({uniqueEmojis.length})
        </div>
        <div className='text-2xl'>
          {uniqueEmojis.length > 0 ? uniqueEmojis.join(' ') : '-'}
        </div>
      </div>

      <div className='mt-4 border-t pt-3'>
        <p className='text-xs text-gray-500'>
          Please copy these metrics (using the button above) and paste them into
          the Microsoft Form to complete the study. Thank you for your
          participation!
        </p>
      </div>
    </div>
  );
};

export default PasswordMetrics;
