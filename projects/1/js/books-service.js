"use strict";

const BOOKS_KEY = "theBooks";

var gBooks = _createBooks();
var gSortBy = "name";

function sortChange(sortBy) {
    gSortBy = sortBy;
}

function addBook(name, price) {
    const book = _createBook(name, price);
    gBooks.unshift(book);
    saveToStorage(BOOKS_KEY, gBooks);
}

function removeBook(bookId) {
    const filteredBooks = gBooks.filter((book) => book.id !== bookId);
    gBooks = filteredBooks;
    saveToStorage(BOOKS_KEY, gBooks);
}

function updateBook(bookId, book) {
    const foundIdx = gBooks.findIndex((book) => book.id === bookId);
    gBooks[foundIdx] = book;
    saveToStorage(BOOKS_KEY, gBooks);
}

function getBookById(bookId) {
    const foundBook = gBooks.find((book) => book.id === bookId);
    return foundBook;
}

function getBooksForDisplay() {
    getBooksBySort();
    return gBooks;
}

function getBooksBySort() {
    gBooks.sort(compare);
}

function changeRate(diff, bookId) {
    const foundBook = getBookById(bookId);
    if (diff === 1 && foundBook.rate >= 0 && foundBook.rate < 10) {
        foundBook.rate = foundBook.rate + 1;
    } else if (diff === -1 && foundBook.rate > 0 && foundBook.rate <= 10) {
        foundBook.rate = foundBook.rate - 1;
    }
    updateBook(bookId, foundBook);
    return foundBook.rate;
}

function compare(a, b) {
    if (gSortBy === 'price') {
        if (a.price < b.price) return 1;
        if (b.price < a.price) return -1;

        return 0;
    } else if (gSortBy === 'name') {
        var aChar = a.name.toLowerCase().charAt(0);
        var bChar = b.name.toLowerCase().charAt(0);
        if (aChar > bChar) return 1;
        if (aChar < bChar) return -1;

        return 0;
    }
}

function _createBooks() {
    var books = loadFromStorage(BOOKS_KEY);
    if (books && books.length) return books;
    books = [];
    saveToStorage(BOOKS_KEY, books);
    return books;
}

function _createBook(name, price) {
    return {
        id: makeId(),
        name,
        price,
        imageUrl: 'images/book.png',
        rate: 0,
    };
}