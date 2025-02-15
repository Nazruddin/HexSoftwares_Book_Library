import React, { useState, useMemo } from 'react';
import { Book } from './types';
import { initialBooks } from './data';
import { BookCard } from './components/BookCard';
import { Search, Library, Filter, SlidersHorizontal, Tag } from 'lucide-react';

function App() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = useMemo(() => 
    Array.from(new Set(books.map(book => book.category))),
    [books]
  );

  const subcategories = useMemo(() => 
    Array.from(new Set(books.map(book => book.subcategory))),
    [books]
  );

  const languages = useMemo(() => 
    Array.from(new Set(books.map(book => book.language))),
    [books]
  );

  const allTags = useMemo(() => 
    Array.from(new Set(books.flatMap(book => book.tags))),
    [books]
  );

  const filteredBooks = useMemo(() => 
    books.filter(book => 
      (book.title.toLowerCase().includes(search.toLowerCase()) ||
       book.author.toLowerCase().includes(search.toLowerCase()) ||
       book.description.toLowerCase().includes(search.toLowerCase())) &&
      (!selectedCategory || book.category === selectedCategory) &&
      (!selectedSubcategory || book.subcategory === selectedSubcategory) &&
      (!selectedLanguage || book.language === selectedLanguage) &&
      (book.rating >= minRating) &&
      (selectedTags.length === 0 || selectedTags.every(tag => book.tags.includes(tag)))
    ),
    [books, search, selectedCategory, selectedSubcategory, selectedLanguage, minRating, selectedTags]
  );

  const handleBorrow = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId
        ? {
            ...book,
            status: 'borrowed',
            borrowHistory: [
              ...book.borrowHistory,
              {
                borrowDate: new Date(),
                returnDate: null,
                borrower: 'Current User',
                condition: 'good'
              }
            ]
          }
        : book
    ));
  };

  const handleReturn = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId
        ? {
            ...book,
            status: 'available',
            borrowHistory: book.borrowHistory.map((record, index) => 
              index === book.borrowHistory.length - 1
                ? { ...record, returnDate: new Date() }
                : record
            )
          }
        : book
    ));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Library className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Personal Library</h1>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {showAdvancedFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Subcategories</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Languages</option>
                    {languages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">{minRating} stars and above</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Tag size={14} className="mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={handleBorrow}
              onReturn={handleReturn}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;