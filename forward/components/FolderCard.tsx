import { FC } from 'react';
import { IoFolder , IoTrash} from 'react-icons/io5';

interface FolderCardProps {
  name: string;
  onClick: () => void;
  onDelete?: () => void;
}

const FolderCard: FC<FolderCardProps> = ({ name, onClick, onDelete}) => {
  return (
    <div
      onClick={onClick}
      className="relative p-4 sm:p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white cursor-pointer"
    >

      <div className="flex items-center space-x-3">
        <IoFolder className="text-yellow-500 text-xl sm:text-2xl flex-shrink-0" />
        <h3 className="text-base sm:text-lg font-medium text-gray-800 truncate">{name}</h3>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <IoTrash className="text-lg sm:text-xl" />
        </button>
      )}
    </div>
  );
};

export default FolderCard;