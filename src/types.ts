export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  subcategory: string;
  isbn: string;
  publishedYear: number;
  publisher: string;
  description: string;
  pages: number;
  language: string;
  rating: number;
  status: 'available' | 'borrowed';
  location: string;
  tags: string[];
  borrowHistory: BorrowRecord[];
}

export interface BorrowRecord {
  borrowDate: Date;
  returnDate: Date | null;
  borrower: string;
  notes?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}