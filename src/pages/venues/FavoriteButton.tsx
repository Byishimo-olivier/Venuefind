import type { MouseEvent } from 'react';

export function FavoriteButton({
  isSaved,
  label,
  onToggle,
}: {
  isSaved: boolean;
  label: string;
  onToggle: () => void;
}) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onToggle();
  }

  return (
    <button
      type="button"
      className={`favorite-button ${isSaved ? 'saved' : ''}`}
      aria-label={isSaved ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
      title={isSaved ? 'Favorited' : 'Add to favorites'}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20.3l-.95-.86C5.4 14.3 2 11.22 2 7.43 2 4.35 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.08A5.94 5.94 0 0 1 16.5 2C19.58 2 22 4.35 22 7.43c0 3.79-3.4 6.87-9.05 12.01l-.95.86z" />
      </svg>
    </button>
  );
}
