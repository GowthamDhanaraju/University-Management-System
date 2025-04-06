import React, { useState } from "react";
import AdminSidebar from "@/components/admin_sidebar";

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

const BookManagement: React.FC = () => {
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
        {
          id: "BK003",
          title: "Introduction to Probability",
          author: "Dimitri P. Bertsekas",
          category: "Mathematics",
          isbn: "9781886529236",
          publisher: "Athena Scientific",
          copies: 6,
          available: 5,
          location: "Shelf A1",
        },
        {
          id: "BK004",
          title: "Principles of Mathematical Analysis",
          author: "Walter Rudin",
          category: "Mathematics",
          isbn: "9780070542358",
          publisher: "McGraw-Hill",
          copies: 3,
          available: 2,
          location: "Shelf A1",
        },
        {
          id: "BK005",
          title: "Discrete Mathematics and Its Applications",
          author: "Kenneth H. Rosen",
          category: "Mathematics",
          isbn: "9780073383095",
          publisher: "McGraw-Hill",
          copies: 5,
          available: 5,
          location: "Shelf A1",
        },
      
        // Computer Science
        {
          id: "BK006",
          title: "Introduction to Algorithms",
          author: "Cormen, Leiserson, Rivest, Stein",
          category: "Computer Science",
          isbn: "9780262033848",
          publisher: "MIT Press",
          copies: 6,
          available: 4,
          location: "Shelf B1",
        },
        {
          id: "BK007",
          title: "Clean Code",
          author: "Robert C. Martin",
          category: "Computer Science",
          isbn: "9780132350884",
          publisher: "Prentice Hall",
          copies: 3,
          available: 2,
          location: "Shelf B1",
        },
        {
          id: "BK008",
          title: "Operating System Concepts",
          author: "Silberschatz, Galvin, Gagne",
          category: "Computer Science",
          isbn: "9781118063330",
          publisher: "Wiley",
          copies: 4,
          available: 4,
          location: "Shelf B1",
        },
        {
          id: "BK009",
          title: "Computer Networking: A Top-Down Approach",
          author: "Kurose & Ross",
          category: "Computer Science",
          isbn: "9780133594140",
          publisher: "Pearson",
          copies: 5,
          available: 3,
          location: "Shelf B1",
        },
        {
          id: "BK010",
          title: "Artificial Intelligence: A Modern Approach",
          author: "Stuart Russell, Peter Norvig",
          category: "Computer Science",
          isbn: "9780134610993",
          publisher: "Pearson",
          copies: 4,
          available: 4,
          location: "Shelf B1",
        },
      
        // Physics
        {
          id: "BK011",
          title: "Fundamentals of Physics",
          author: "Halliday, Resnick, Walker",
          category: "Physics",
          isbn: "9781118230718",
          publisher: "Wiley",
          copies: 6,
          available: 6,
          location: "Shelf C1",
        },
        {
          id: "BK012",
          title: "The Feynman Lectures on Physics",
          author: "Richard Feynman",
          category: "Physics",
          isbn: "9780465023820",
          publisher: "Basic Books",
          copies: 3,
          available: 2,
          location: "Shelf C1",
        },
        {
          id: "BK013",
          title: "University Physics",
          author: "Young and Freedman",
          category: "Physics",
          isbn: "9780321696861",
          publisher: "Pearson",
          copies: 5,
          available: 4,
          location: "Shelf C1",
        },
        {
          id: "BK014",
          title: "Concepts of Modern Physics",
          author: "Arthur Beiser",
          category: "Physics",
          isbn: "9780071426114",
          publisher: "McGraw-Hill",
          copies: 4,
          available: 3,
          location: "Shelf C1",
        },
        {
          id: "BK015",
          title: "Introduction to Quantum Mechanics",
          author: "David J. Griffiths",
          category: "Physics",
          isbn: "9781107189638",
          publisher: "Cambridge University Press",
          copies: 4,
          available: 4,
          location: "Shelf C1",
        },
      
        // Chemistry
        {
          id: "BK016",
          title: "Organic Chemistry",
          author: "Paula Yurkanis Bruice",
          category: "Chemistry",
          isbn: "9780134042282",
          publisher: "Pearson",
          copies: 5,
          available: 4,
          location: "Shelf D1",
        },
        {
          id: "BK017",
          title: "Inorganic Chemistry",
          author: "Gary L. Miessler",
          category: "Chemistry",
          isbn: "9780321811059",
          publisher: "Pearson",
          copies: 3,
          available: 2,
          location: "Shelf D1",
        },
        {
          id: "BK018",
          title: "Physical Chemistry",
          author: "Peter Atkins",
          category: "Chemistry",
          isbn: "9780198769866",
          publisher: "Oxford University Press",
          copies: 4,
          available: 3,
          location: "Shelf D1",
        },
        {
          id: "BK019",
          title: "Chemical Principles",
          author: "Zumdahl",
          category: "Chemistry",
          isbn: "9781305581982",
          publisher: "Cengage Learning",
          copies: 4,
          available: 4,
          location: "Shelf D1",
        },
        {
          id: "BK020",
          title: "Analytical Chemistry",
          author: "Gary D. Christian",
          category: "Chemistry",
          isbn: "9788126550344",
          publisher: "Wiley",
          copies: 4,
          available: 2,
          location: "Shelf D1",
        },
      
        // Biology
        {
          id: "BK021",
          title: "Campbell Biology",
          author: "Jane B. Reece",
          category: "Biology",
          isbn: "9780321775658",
          publisher: "Pearson",
          copies: 6,
          available: 5,
          location: "Shelf E1",
        },
        {
          id: "BK022",
          title: "Molecular Biology of the Cell",
          author: "Bruce Alberts",
          category: "Biology",
          isbn: "9780815344322",
          publisher: "Garland Science",
          copies: 4,
          available: 3,
          location: "Shelf E1",
        },
        {
          id: "BK023",
          title: "Genetics: Analysis and Principles",
          author: "Robert J. Brooker",
          category: "Biology",
          isbn: "9780073525280",
          publisher: "McGraw-Hill",
          copies: 3,
          available: 3,
          location: "Shelf E1",
        },
        {
          id: "BK024",
          title: "Essentials of Human Anatomy & Physiology",
          author: "Elaine N. Marieb",
          category: "Biology",
          isbn: "9780134395326",
          publisher: "Pearson",
          copies: 5,
          available: 4,
          location: "Shelf E1",
        },
        {
          id: "BK025",
          title: "Principles of Genetics",
          author: "D. Peter Snustad",
          category: "Biology",
          isbn: "9781119142287",
          publisher: "Wiley",
          copies: 4,
          available: 3,
          location: "Shelf E1",
        },
      
        // English
        {
          id: "BK026",
          title: "The Elements of Style",
          author: "William Strunk Jr.",
          category: "English",
          isbn: "9780205309023",
          publisher: "Pearson",
          copies: 3,
          available: 3,
          location: "Shelf F1",
        },
        {
          id: "BK027",
          title: "English Grammar in Use",
          author: "Raymond Murphy",
          category: "English",
          isbn: "9780521532891",
          publisher: "Cambridge",
          copies: 5,
          available: 4,
          location: "Shelf F1",
        },
        {
          id: "BK028",
          title: "Word Power Made Easy",
          author: "Norman Lewis",
          category: "English",
          isbn: "9781101873854",
          publisher: "Anchor",
          copies: 4,
          available: 3,
          location: "Shelf F1",
        },
        {
          id: "BK029",
          title: "Reading English News on the Internet",
          author: "David Petersen",
          category: "English",
          isbn: "9780971129417",
          publisher: "Compass Publishing",
          copies: 2,
          available: 2,
          location: "Shelf F1",
        },
        {
          id: "BK030",
          title: "Practical English Usage",
          author: "Michael Swan",
          category: "English",
          isbn: "9780194202435",
          publisher: "Oxford University Press",
          copies: 4,
          available: 4,
          location: "Shelf F1",
        },
      ]);
      
  const [newBook, setNewBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    category: "",
    isbn: "",
    publisher: "",
    copies: 0,
    available: 0,
    location: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "copies" || name === "available" ? parseInt(value) : value;
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: updatedValue });
    } else {
      setNewBook({ ...newBook, [name]: updatedValue });
    }
  };

  const generateBookId = (): string => {
    const lastBook = books.length > 0 ? books[books.length - 1] : null;
    if (lastBook) {
      const lastId = parseInt(lastBook.id.replace("BK", ""));
      return `BK${String(lastId + 1).padStart(3, "0")}`;
    }
    return "BK001";
  };

  const addBook = () => {
    if (!newBook.title || !newBook.author || !newBook.category) {
      alert("Please fill in required fields: Title, Author, and Category");
      return;
    }
    const bookWithId = {
      ...newBook,
      id: generateBookId(),
      available: newBook.copies,
    };
    setBooks([...books, bookWithId]);
    setNewBook({
      id: "",
      title: "",
      author: "",
      category: "",
      isbn: "",
      publisher: "",
      copies: 0,
      available: 0,
      location: "",
    });
    setShowModal(false);
  };

  const startEditing = (book: Book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const saveEdits = () => {
    if (!editingBook) return;
    if (!editingBook.title || !editingBook.author || !editingBook.category) {
      alert("Please fill in required fields: Title, Author, and Category");
      return;
    }
    setBooks(
      books.map((book) => (book.id === editingBook.id ? editingBook : book))
    );
    setEditingBook(null);
    setShowModal(false);
  };

  const deleteBook = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  // 🔍 Filter books based on the search query
  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // 📚 Group filtered books by category
  const groupedBooks = filteredBooks.reduce((acc, book) => {
    acc[book.category] = acc[book.category] || [];
    acc[book.category].push(book);
    return acc;
  }, {} as { [key: string]: Book[] });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <AdminSidebar />
      <div className="ml-16 p-6 w-full text-gray-200">
        <h1 className="text-2xl font-bold mb-6">📚 Book Management</h1>
  
        {/* Add Book Form */}
        <div className="bg-gray-800 p-6 rounded shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {editingBook ? "Edit Book" : "Add Book"}
          </h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <input
              name="title"
              placeholder="Title"
              value={editingBook ? editingBook.title : newBook.title}
              onChange={handleInputChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              name="author"
              placeholder="Author"
              value={editingBook ? editingBook.author : newBook.author}
              onChange={handleInputChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              name="category"
              placeholder="Category"
              value={editingBook ? editingBook.category : newBook.category}
              onChange={handleInputChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              name="copies"
              type="number"
              placeholder="Copies"
              value={editingBook ? editingBook.copies : newBook.copies}
              onChange={handleInputChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              name="available"
              type="number"
              placeholder="Available"
              value={editingBook ? editingBook.available : newBook.available}
              onChange={handleInputChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
          </div>
  
          <div className="mt-4 flex space-x-2">
            {editingBook ? (
              <button
                onClick={saveEdits}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={addBook}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add Book
              </button>
            )}
            <button
              onClick={() => {
                setShowModal(false);
                setEditingBook(null);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
  
        {/* Book List Table */}
        <div className="bg-gray-800 p-6 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4">Book List</h2>
          <input
            type="text"
            placeholder="🔍 Search by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-full p-2 bg-gray-700 text-white rounded"
          />
  
          {Object.entries(groupedBooks).map(([category, booksInCategory]) => (
            <div key={category} className="mb-6">
              <h3 className="text-indigo-400 font-semibold mb-2">📘 {category}</h3>
              <table className="w-full text-left table-auto">
                <thead className="text-indigo-300">
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2">Author</th>
                    <th className="p-2">Available</th>
                    <th className="p-2">Actions</th>
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
                      <td className="p-2">
                        <button
                          onClick={() => startEditing(book)}
                          className="text-blue-400 hover:underline mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookManagement;
