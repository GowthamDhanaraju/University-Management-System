import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Authentication check
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "student") {
      router.push("/");
      return;
    }

    const fetchBooks = async () => {
      try {
        setLoading(true);

        // Fetch available books
        const booksResponse = await fetch("/api/library/books");

        if (!booksResponse.ok) {
          throw new Error(`Error ${booksResponse.status}: ${booksResponse.statusText}`);
        }

        const booksData = await booksResponse.json();

        if (booksData.success) {
          setBooks(booksData.data || []);
        } else {
          setError(booksData.message || "Failed to load books");
        }

        // Fetch student's borrowed books
        const studentId = localStorage.getItem("userId") || "";
        const borrowedResponse = await fetch(`/api/students/${studentId}/borrowed-books`);

        if (borrowedResponse.ok) {
          const borrowedData = await borrowedResponse.json();

          if (borrowedData.success) {
            setBorrowedBooks(borrowedData.data || []);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to fetch books: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [router]);

  // Generate a due date 14 days from now
  const generateDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  };

  // Borrow a book
  const borrowBook = async (book: Book) => {
    try {
      // Check if student already has this book
      if (borrowedBooks.some((b) => b.id === book.id)) {
        alert("You have already borrowed this book");
        return;
      }

      if (book.available <= 0) {
        alert("This book is not available for borrowing");
        return;
      }

      const studentId = localStorage.getItem("userId") || "";
      const response = await fetch("/api/library/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          bookId: book.id,
          borrowDate: new Date().toISOString().split("T")[0],
          dueDate: generateDueDate(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update available count in books list
        const updatedBooks = books.map((b) =>
          b.id === book.id ? { ...b, available: b.available - 1 } : b
        );

        // Add to borrowed books
        const borrowedBook: BorrowedBook = {
          ...book,
          borrowDate: new Date().toISOString().split("T")[0],
          dueDate: generateDueDate(),
        };

        setBooks(updatedBooks);
        setBorrowedBooks([...borrowedBooks, borrowedBook]);
        alert("Book borrowed successfully!");
      } else {
        alert(data.message || "Failed to borrow book");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Error borrowing book: ${errorMessage}`);
      console.error(err);
    }
  };

  // Return a book
  const returnBook = async (bookId: string) => {
    try {
      const studentId = localStorage.getItem("userId") || "";
      const response = await fetch("/api/library/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          bookId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Remove from borrowed books
        const updatedBorrowedBooks = borrowedBooks.filter((b) => b.id !== bookId);

        // Update available count in books list
        const updatedBooks = books.map((b) =>
          b.id === bookId ? { ...b, available: b.available + 1 } : b
        );

        setBorrowedBooks(updatedBorrowedBooks);
        setBooks(updatedBooks);
        alert("Book returned successfully!");
      } else {
        alert(data.message || "Failed to return book");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Error returning book: ${errorMessage}`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex">
        <StudentSidebar />
        <div className="flex-1 p-6 ml-16">
          <TopBar />
          <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div>
            <span className="ml-3 text-xl">Loading library data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex">
        <StudentSidebar />
        <div className="flex-1 p-6 ml-16">
          <TopBar />
          <div className="flex justify-center items-center h-[80vh] flex-col">
            <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg max-w-md">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm underline hover:text-white"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = ["All", ...new Set(books.map((book) => book.category))];

  // Filter books based on search query and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch = `${book.title} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory = category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  // Group filtered books by category
  const groupedBooks = filteredBooks.reduce((acc, book) => {
    if (category !== "All") {
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 bg-gray-700 text-white rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {Object.entries(groupedBooks).map(([category, booksInCategory]) => (
            <div key={category} className="mb-6">
              <h3 className="text-indigo-400 font-semibold mb-2">
                📘 {category === "Selected" ? category : category}
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
