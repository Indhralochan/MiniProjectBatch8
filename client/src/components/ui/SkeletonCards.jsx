import Skeleton from '@mui/material/Skeleton';

const SkeletonCards = () => {
  return (
        <div className="w-full px-4 mb-4 rounded-lg">
          <div className="bg-gray-600 p-4 rounded-xl">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="h-4"></div>
            <div className="h-4 w-3/4"></div>
            <div className="h-4 w-1/2 mt-2"></div>
            <Skeleton variant="rectangular" height={190} />
            <div className="h-4 mb-6"></div>
            <div className="h-4 w-3/4"></div>
          </div>
    </div>
  );
};

export default SkeletonCards;
