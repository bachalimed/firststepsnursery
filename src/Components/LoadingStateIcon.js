import { Puff } from 'react-loading-icons';

export default function LoadingStateIcon() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Puff 
        stroke="#703eb0" 
        strokeOpacity={0.125} 
        speed={0.75} 
        width={150}   // Adjust size here
        height={150}  // Adjust size here
      />
    </div>
  );
}
