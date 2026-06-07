import React from 'react';
import { FaStar } from 'react-icons/fa';

type SingleStarRatingProps = {
  rating: number; // e.g. 4.2
  maxRating?: number; // default is 5
  showNumber?: boolean;
};

const SingleStarRating: React.FC<SingleStarRatingProps> = ({
  rating,
  maxRating = 5,
  showNumber = true,
}) => {
  const fillPercent = Math.min((rating / maxRating) * 100, 100);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-6 h-6 text-gray-300">
        {/* Background star (empty) */}
        <FaStar className="absolute top-0 left-0 w-full h-full" />

        {/* Filled star overlay */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden text-orange-400"
          style={{ width: `${fillPercent}%` }}
        >
          <FaStar className="w-full h-full" />
        </div>
      </div>

      {showNumber && (
        <span className="text-sm text-gray-700">({rating.toFixed(1)} / {maxRating})</span>
      )}
    </div>
  );
};

export default SingleStarRating;
