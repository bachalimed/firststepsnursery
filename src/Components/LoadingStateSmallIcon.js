import { Puff } from 'react-loading-icons';

export default function LoadingStateSmallIcon() {
  return (
    <div className="flex justify-center items-center ">
      <Puff 
        stroke="#703eb0" 
        strokeOpacity={0.125} 
        speed={0.75} 
        width={25}   // Adjust size here
        height={25}  // Adjust size here
      />
    </div>
  );
}
