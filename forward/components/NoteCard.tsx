import { FC } from 'react';
import { IoDocument } from 'react-icons/io5';
import Link from 'next/link';

interface NoteCardProps {
  title: string;
  path: string;
  lastModified?: string;
}

const NoteCard: FC<NoteCardProps> = ({ title, path, lastModified }) => {
  return (
    <Link href={`/note/${encodeURIComponent(path)}`}>
      <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow bg-white cursor-pointer">
        <div className="flex items-center space-x-3">
          <IoDocument className="text-blue-500 text-xl" />
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
        {lastModified && (
          <p className="mt-2 text-sm text-gray-500">
            最后修改: {lastModified}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NoteCard;