class Bookshelf {
  constructor() {
    // Inisialisasi rak buku dan daftar buku yang belum lengkap dan sudah lengkap
    this.books = [];
    this.incompleteBookshelfList = document.getElementById(
      'incompleteBookshelfList'
    );
    this.completeBookshelfList = document.getElementById(
      'completeBookshelfList'
    );
  }

  // Fungsi untuk menambahkan buku baru ke dalam rak buku
  addBook(book) {
    this.books.push(book);
    this.render();
  }

  // Fungsi untuk memindahkan buku dari satu rak ke rak lainnya
  moveBook(bookId, targetShelfId) {
    const bookIndex = this.books.findIndex((book) => book.id === bookId);
    const book = this.books[bookIndex];
    book.isComplete = targetShelfId === 'completeBookshelfList';
    this.books.splice(bookIndex, 1);
    this.books.splice(
      targetShelfId === 'incompleteBookshelfList' ? 0 : this.books.length,
      0,
      book
    );
    this.render();
  }

  // Fungsi untuk menghapus buku dari rak buku
  removeBook(bookId) {
    this.removeBookWithPopup(bookId);
  }

  removeBookWithPopup(bookId) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.innerHTML = `
      <p>Apakah anda yakin ingin menghapus buku ini?</p>
      <button id="confirm">Ya</button>
      <button id="cancel">Tidak</button>
    `;
    document.body.appendChild(popup);

    const confirmButton = popup.querySelector('#confirm');
    const cancelButton = popup.querySelector('#cancel');

    confirmButton.addEventListener('click', () => {
      const bookIndex = this.books.findIndex((book) => book.id === bookId);
      this.books.splice(bookIndex, 1);
      this.render();
      popup.remove();
    });

    cancelButton.addEventListener('click', () => {
      popup.remove();
    });
  }

  // Fungsi untuk mencari buku berdasarkan judul
  searchBook(query) {
    if (!query) {
      this.render();
      return;
    }

    const filteredBooks = this.books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    this.render(filteredBooks);
  }

  // Fungsi untuk merender tampilan rak buku
  render(books = this.books) {
    this.incompleteBookshelfList.innerHTML = '';
    this.completeBookshelfList.innerHTML = '';

    books.forEach((book) => {
      const article = document.createElement('article');
      article.classList.add('book_item');

      const h3 = document.createElement('h3');
      h3.textContent = book.title;
      article.appendChild(h3);

      const p1 = document.createElement('p');
      p1.textContent = `Penulis: ${book.author}`;
      article.appendChild(p1);

      const p2 = document.createElement('p');
      p2.textContent = `Tahun: ${book.year}`;
      article.appendChild(p2);

      const action = document.createElement('div');
      action.classList.add('action');

      if (!book.isComplete) {
        const greenButton = document.createElement('button');
        greenButton.classList.add('green');
        greenButton.textContent = 'Selesai dibaca';
        greenButton.addEventListener('click', () => {
          this.moveBook(book.id, 'completeBookshelfList');
          book.isComplete = true;
          saveData();
        });
        action.appendChild(greenButton);
      } else {
        const greenButton = document.createElement('button');
        greenButton.classList.add('green');
        greenButton.textContent = 'Belum selesai dibaca';
        greenButton.addEventListener('click', () => {
          this.moveBook(book.id, 'incompleteBookshelfList');
          book.isComplete = false;
          saveData();
        });
        action.appendChild(greenButton);
      }

      const redButton = document.createElement('button');
      redButton.classList.add('red');
      redButton.textContent = 'Hapus buku';
      redButton.addEventListener('click', () => this.removeBook(book.id));
      action.appendChild(redButton);

      article.appendChild(action);

      if (!book.isComplete) {
        this.incompleteBookshelfList.appendChild(article);
      } else {
        this.completeBookshelfList.appendChild(article);
      }
    });
  }
}

// Membuat instance dari kelas Bookshelf
const bookshelf = new Bookshelf();

// liveSearch
function liveSearch(event) {
  const query = event.target.value.toLowerCase();
  bookshelf.searchBook(query);
}