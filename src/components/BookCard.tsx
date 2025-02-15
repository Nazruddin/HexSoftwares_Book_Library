import React, { useState } from 'react';
import { Book } from '../types';
import { format } from 'date-fns';
import { BookOpen, UserCheck, Calendar, Star, Info, MapPin, Tag, BookCopy } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

export function BookCard({ book, onBorrow, onReturn }: BookCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{book.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-500 hover:text-blue-600"
          >
            <Info size={20} />
          </button>
        </div>

        <div className="flex items-center mt-2 text-sm text-gray-500">
          <BookOpen size={16} className="mr-1" />
          <span>{book.category} / {book.subcategory}</span>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-2 text-sm border-t pt-4">
            <p className="text-gray-700">{book.description}</p>
            
            <div className="flex items-center text-gray-600">
              <BookCopy size={16} className="mr-1" />
              <span>ISBN: {book.isbn}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>Location: {book.location}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {book.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Published:</span> {book.publishedYear}
              </div>
              <div>
                <span className="font-medium">Pages:</span> {book.pages}
              </div>
              <div>
                <span className="font-medium">Publisher:</span> {book.publisher}
              </div>
              <div>
                <span className="font-medium">Language:</span> {book.language}
              </div>
            </div>
          </div>
        )}
        
        {book.status === 'borrowed' && book.borrowHistory.length > 0 && (
          <div className="mt-4 text-sm border-t pt-4">
            <div className="flex items-center text-amber-600">
              <UserCheck size={16} className="mr-1" />
              <span>Borrowed by: {book.borrowHistory[book.borrowHistory.length - 1].borrower}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar size={16} className="mr-1" />
              <span>Since: {format(book.borrowHistory[book.borrowHistory.length - 1].borrowDate, 'MMM d, yyyy')}</span>
            </div>
            {book.borrowHistory[book.borrowHistory.length - 1].notes && (
              <p className="mt-1 text-gray-600 italic">
                Note: {book.borrowHistory[book.borrowHistory.length - 1].notes}
              </p>
            )}
          </div>
        )}
        
        <button
          onClick={() => book.status === 'available' ? onBorrow(book.id) : onReturn(book.id)}
          className={`mt-4 w-full py-2 px-4 rounded-md text-sm font-medium ${
            book.status === 'available'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {book.status === 'available' ? 'Borrow Book' : 'Return Book'}
        </button>
      </div>
    </div>
  );
}