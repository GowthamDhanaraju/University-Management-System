import React, { useState } from "react";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/topbar";
import { FaUniversity } from "react-icons/fa";
import { Typography } from "@mui/material";

interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    isbn: string;
    publisher: string;
    copies: number;
    available: number;
    location: string;
  }
  
  interface BorrowedBook extends Book {
    borrowDate: string;
    dueDate: string;
  }

const StudentBooks = () => {

    const [books, setBooks] = useState<Book[]>([
        // Mathematics
        {
          id: "BK001",
          title: "Calculus Made Easy",
          author: "Silvanus P. Thompson",
          category: "Mathematics",
          isbn: "9780312185480",
          publisher: "St. Martin's Press",
          copies: 5,
          available: 3,
          location: "Shelf A1",
        },
        {
          id: "BK002",
          title: "Linear Algebra Done Right",
          author: "Sheldon Axler",
          category: "Mathematics",
          isbn: "9783319110790",
          publisher: "Springer",
          copies: 4,
          available: 4,
          location: "Shelf A1",
        },
        // ...existing code with more books...
      ]);
    
      // Student's borrowed books
      const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
      const [searchQuery, setSearchQuery] = useState("");
      const [selectedCategory, setSelectedCategory] = useState<string>("All");
    
      // Generate due date (14 days from today)
      const generateDueDate = (): string => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
      };
    
      // Borrow a book
      const borrowBook = (book: Book) => {
        if (book.available <= 0) {
          alert("Sorry, this book is not available for borrowing");
          return;
        }
    
        // Check if student already has this book
        if (borrowedBooks.some(b => b.id === book.id)) {
          alert("You have already borrowed this book");
          return;
        }
    
        // Update available count in books list
        const updatedBooks = books.map(b => 
          b.id === book.id ? { ...b, available: b.available - 1 } : b
        );
        
        // Add to borrowed books
        const borrowedBook: BorrowedBook = {
          ...book,
          borrowDate: new Date().toISOString().split('T')[0],
          dueDate: generateDueDate(),
        };
    
        setBorrowedBooks([...borrowedBooks, borrowedBook]);
        setBooks(updatedBooks);
      };
    
      // Return a book
      const returnBook = (bookId: string) => {
        // Remove from borrowed books
        const updatedBorrowedBooks = borrowedBooks.filter(b => b.id !== bookId);
        
        // Update available count in books list
        const updatedBooks = books.map(b => 
          b.id === bookId ? { ...b, available: b.available + 1 } : b
        );
    
        setBorrowedBooks(updatedBorrowedBooks);
        setBooks(updatedBooks);
      };
    
      // Get unique categories
      const categories = ["All", ...new Set(books.map(book => book.category))];
    
      // Filter books based on search query and category
      const filteredBooks = books.filter(book => {
        const matchesSearch = `${book.title} ${book.author} ${book.category}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    
      // Group filtered books by category
      const groupedBooks = filteredBooks.reduce((acc, book) => {
        if (selectedCategory !== "All") {
          // When a category is selected, don't group
          acc["Selected"] = acc["Selected"] || [];
          acc["Selected"].push(book);
        } else {
          // Group by category when "All" is selected
          acc[book.category] = acc[book.category] || [];
          acc[book.category].push(book);
        }
        return acc;
      }, {} as { [key: string]: Book[] });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />

        <div className="flex justify-between items-center mb-8 mt-4 ml-2">
          <div className="flex items-center ml-2">
            <div className="p-3 mr-4 bg-green-600 rounded-xl shadow-lg">
              <FaUniversity className="text-gray-100 text-2xl" />
            </div>
            <Typography
              variant="h4"
              component="h1"
              className="font-bold bg-green-600 bg-clip-text text-transparent"
            >
              Library Books
            </Typography>
          </div>
        </div>

        {/* Borrowed Books Section */}
        <div className="bg-gray-800 p-6 rounded shadow-md mb-8 ml-5">
          <h2 className="text-lg font-semibold mb-4">My Borrowed Books</h2>
          
          {borrowedBooks.length === 0 ? (
            <p className="text-gray-400">You haven't borrowed any books yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="text-indigo-300">
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2">Author</th>
                    <th className="p-2">Borrow Date</th>
                    <th className="p-2">Due Date</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedBooks.map((book) => (
                    <tr key={book.id} className="border-t border-gray-700">
                      <td className="p-2">{book.title}</td>
                      <td className="p-2">{book.author}</td>
                      <td className="p-2">{book.borrowDate}</td>
                      <td className="p-2">{book.dueDate}</td>
                      <td className="p-2">
                        <button
                          onClick={() => returnBook(book.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Available Books Section */}
        <div className="bg-gray-800 p-6 rounded shadow-md mb-8 ml-5">
          <h2 className="text-lg font-semibold mb-4">Available Books</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search by title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-2 bg-gray-700 text-white rounded"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 bg-gray-700 text-white rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {Object.entries(groupedBooks).map(([category, booksInCategory]) => (
            <div key={category} className="mb-6">
              <h3 className="text-indigo-400 font-semibold mb-2">
                📘 {category === "Selected" ? selectedCategory : category}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead className="text-indigo-300">
                    <tr>
                      <th className="p-2">Title</th>
                      <th className="p-2">Author</th>
                      <th className="p-2">Available</th>
                      <th className="p-2">Location</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booksInCategory.map((book) => (
                      <tr key={book.id} className="border-t border-gray-700">
                        <td className="p-2">{book.title}</td>
                        <td className="p-2">{book.author}</td>
                        <td className="p-2">
                          {book.available}/{book.copies}
                        </td>
                        <td className="p-2">{book.location}</td>
                        <td className="p-2">
                          <button
                            onClick={() => borrowBook(book)}
                            disabled={book.available <= 0}
                            className={`px-3 py-1 rounded ${
                              book.available > 0
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {book.available > 0 ? "Borrow" : "Unavailable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default StudentBooks;
