import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='max-w-2xl mx-auto my-12 p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold text-center text-blue-600 mb-4'>
        EmojiPass Study
      </h1>

      <div className='bg-blue-50 border border-blue-200 rounded-md p-4 mb-8'>
        <h2 className='text-xl font-medium text-blue-800 mb-2'>
          About This Study
        </h2>
        <p className='text-blue-700 mb-3'>
          This study examines how emoji-based passwords compare to text-based
          passwords in terms of usability and security. Your participation helps
          us understand best practices for password design.
        </p>
        <p className='text-blue-700 mb-2'>
          All data collected is anonymous and used for research purposes only.
        </p>
        <p className='text-sm text-blue-600 italic'>
          Please select the authentication system as directed by the researcher.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all'>
          <h2 className='text-2xl font-bold text-gray-800 mb-3'>
            Text Password
          </h2>
          <p className='text-gray-600 mb-4'>
            Create and test a traditional text-based password (minimum 8
            characters).
          </p>
          <div className='flex justify-center'>
            <Link
              to='/text-password'
              className='inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            >
              Start Text Password Study
            </Link>
          </div>
        </div>

        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all'>
          <h2 className='text-2xl font-bold text-gray-800 mb-3'>
            Emoji Password
          </h2>
          <p className='text-gray-600 mb-4'>
            Create and test an emoji-based password (minimum 4 emojis).
          </p>
          <div className='flex justify-center'>
            <Link
              to='/emoji-password'
              className='inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
            >
              Start Emoji Password Study
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-12 pt-6 border-t border-gray-200'>
        <h3 className='text-xl font-semibold text-gray-700 mb-3'>
          Shoulder Surfing Experiment
        </h3>
        <p className='text-gray-600 mb-4'>
          This additional experiment tests how resistant different password
          types are to observation attacks.
        </p>
        <div className='flex justify-center'>
          <Link
            to='/shoulder-surfing'
            className='inline-block py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors'
          >
            Start Shoulder Surfing Experiment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
