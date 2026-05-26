import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRate, size = 'md', readonly = false }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star} type="button" disabled={readonly}
          onClick={() => !readonly && onRate && onRate(star)}
          className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star className={`${sizes[size]} ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-dark-600'} transition-colors duration-150`} />
        </button>
      ))}
    </div>
  );
};
export default StarRating;
