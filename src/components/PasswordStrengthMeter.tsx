interface PasswordStrengthMeterProps {
  strength: number;
}

const PasswordStrengthMeter = ({ strength }: PasswordStrengthMeterProps) => {
  const getStrengthText = () => {
    if (strength <= 0) return '';
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Medium';
    return 'Strong';
  };

  const getStrengthClass = () => {
    if (strength <= 0) return '';
    if (strength < 30) return 'weak';
    if (strength < 60) return 'medium';
    return 'strong';
  };

  const strengthColorClass = () => {
    if (strength <= 0) return 'bg-gray-200';
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const textColorClass = () => {
    if (strength <= 0) return 'text-gray-500';
    if (strength < 30) return 'text-red-500';
    if (strength < 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className='mt-2'>
      <div className='h-1 w-full bg-gray-200 rounded-full overflow-hidden'>
        <div
          className={`h-full ${strengthColorClass()} transition-all duration-300`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      <div className='flex justify-end mt-1'>
        <span className={`text-xs ${textColorClass()}`}>
          {getStrengthText()}
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
