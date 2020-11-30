'use strict';

function onInit() {
    renderBooks();
}

function renderBooks() {
    var books = getBooksForDisplay();
    if (!books || !books.length) {
        document.querySelector('.no-books').innerText = 'No Books!';
    } else {
        document.querySelector('.no-books').innerText = '';
    }
    var strHTML = `<table class="books-table">`
    strHTML += getTableHeader();
    var strHTMLs = books.map(getBookHTML);
    strHTML += strHTMLs.join('');
    strHTML += `</table>`
    var elBooksContainer = document.querySelector('.books-container');
    elBooksContainer.innerHTML = strHTML;
}

function getTableHeader() {
    return `
    <thead>
        <tr>
            <td class="cell">Book ID</td>
            <td class="cell-sort" onclick="onSortChange('name')">Title</td>
            <td class="cell-sort" onclick="onSortChange('price')">Price</td>
            <td class="cell">Actions</td>
        </tr>
    </thead>
    `
}

function getBookHTML(book) {
    return `
    <tr>
        <td class="cell">${book.id}</td>
        <td class="cell">${book.name}</td>
        <td class="cell">${book.price}₪</td>
        <td class="cell">
        <button type="button" class="btn read-btn" onclick="onReadBook('${book.id}')">Read</button>
        <button type="button" class="btn update-btn" onclick="onUpdateBook('${book.id}')">Update</button>
        <button type="button" class="btn remove-btn" onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
    </tr>
    `
}

function onReadBook(id) {
    document.querySelector('.screen').classList.add('block');
    document.querySelector('.read-container').classList.add('block');
    const book = getBookById(id);
    document.querySelector('.book-image').src = book.imageUrl;
    document.querySelector('.book-name').innerText = book.name;
    document.querySelector('.book-price').innerText += book.price;
    document.querySelector('.book-rate').innerText = book.rate;
    document.querySelector('.rate-btn-plus').onclick = function() { onChangeRate(1, id) };
    document.querySelector('.rate-btn-minus').onclick = function() { onChangeRate(-1, id) };
}

function onToggleForm() {
    const elAddBookForm = document.querySelector('.add-book-form');
    const elAddBtn = document.querySelector('.add-book-btn');
    elAddBookForm.classList.toggle('block');
    if (elAddBookForm.classList.contains('block')) {
        elAddBtn.innerText = '❌'
    } else {
        elAddBtn.innerText = 'Add Book'
    }
}

function onAddBook(ev) {
    ev.preventDefault();
    const elNameInput = document.querySelector('.name-input');
    const elPriceInput = document.querySelector('.price-input');
    addBook(elNameInput.value, elPriceInput.value);
    elNameInput.value = '';
    elPriceInput.value = '';
    renderBooks();
    onToggleForm();
}

function onChangeRate(diff, bookId) {
    const updatedRate = changeRate(diff, bookId);
    var elBookRate = document.querySelector('.book-rate');
    elBookRate.innerText = updatedRate;
}

function onCloseModal() {
    var elScreen = document.querySelector('.screen');
    elScreen.classList.remove('block');
    var elReadContainer = document.querySelector('.read-container');
    elReadContainer.classList.remove('block');
    removeCurrBook();
}

function onRemoveBook(bookId) {
    var isSure = confirm('Are you sure?');
    if (!isSure) return;
    removeBook(bookId);
    renderBooks();
}

function onUpdateBook(bookId) {
    var newPrice = prompt('What is the new book price?');
    var book = getBookById(bookId);
    book.price = newPrice;
    updateBook(bookId, book);
    renderBooks();
}


function onSortChange(sortBy) {
    sortChange(sortBy);
    renderBooks();
}