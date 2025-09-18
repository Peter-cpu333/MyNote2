import { FC } from 'react';
import { IoDocument } from 'react-icons/io5';
import Link from 'next/link';

interface NoteCardProps {
  title: string;
  path: string;
  lastModified?: string;
  preview?: string;
}

const NoteCard: FC<NoteCardProps> = ({ title, path, lastModified, preview }) => {
  return (
    <Link href={`/note/${encodeURIComponent(path)}`}>
      <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow bg-white cursor-pointer">
        <div className="flex items-start space-x-3">
          <IoDocument className="text-blue-500 text-xl flex-shrink-0" />
          <h3 className="text-lg font-medium text-gray-800 flex-1 break-words">{title}</h3>
        </div>
        {preview && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {preview}
          </p>
        )}
        {lastModified && (
          <p className="mt-2 text-sm text-gray-500">
          {lastModified}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NoteCard;