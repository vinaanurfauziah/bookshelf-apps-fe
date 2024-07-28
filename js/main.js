const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf.books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// Fungsi untuk menangani submit form untuk menambahkan buku baru ke dalam rak buku
document.getElementById('inputBook').addEventListener('submit', (event) => {
  event.preventDefault();

  // Mengambil nilai input judul, pengarang, tahun, dan status lengkap/tidak lengkap dari form
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  // Membuat objek buku baru dengan nilai yang diambil dari form
  const book = {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };

  // Menambahkan buku baru ke dalam rak buku (bookshelf)
  bookshelf.addBook(book);
  saveData();

  // Mengosongkan nilai input form setelah submit
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
  document.getElementById('inputBookIsComplete').checked = false;
});

// Fungsi untuk menangani submit form pencarian buku berdasarkan judul
document.getElementById('searchBook').addEventListener('submit', (event) => {
  event.preventDefault();
  // Mengambil nilai query pencarian dari input form
  const query = document.getElementById('searchBookTitle').value;
  // Memanggil fungsi searchBook dari objek bookshelf untuk mencari buku berdasarkan judul
  bookshelf.searchBook(query);
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []); 
});

function renderSavedBooks() {
  const savedBooks = localStorage.getItem(STORAGE_KEY);
  if (savedBooks) {
    const parsedBooks = JSON.parse(savedBooks);
    parsedBooks.forEach((book) => {
      bookshelf.addBook(book);
    });
  }
}
renderSavedBooks();