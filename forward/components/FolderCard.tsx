import { FC } from 'react';
import { IoFolder } from 'react-icons/io5';

interface FolderCardProps {
  name: string;
  onClick: () => void;
}

const FolderCard: FC<FolderCardProps> = ({ name, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 border rounded-lg hover:shadow-lg transition-shadow bg-white cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <IoFolder className="text-yellow-500 text-xl" />
        <h3 className="text-lg font-medium text-gray-800">{name}</h3>
      </div>
    </div>
  );
};

export default FolderCard;