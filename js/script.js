const myLibrary = [];
const form = document.querySelector("form");

// New branch

class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

function clearTable() {
  const table = document.querySelector("table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

function drawTable() {
  clearTable();
  myLibrary.forEach((book, index) => {
    const newTableRow = document.createElement("tr");
    Object.entries(book).forEach(([key, value]) => {
      const newTableData = document.createElement("td");
      if (key === "isRead") {
        const toggleStatusButton = document.createElement("input");
        toggleStatusButton.type = "button";
        toggleStatusButton.classList.add("status");
        let newContent = "";
        if (value) {
          newContent = "Have read";
          toggleStatusButton.classList.add("read");
        } else {
          newContent = "Not read yet";
        }
        toggleStatusButton.value = newContent;
        toggleStatusButton.addEventListener("click", () => {
          myLibrary[index].isRead = !myLibrary[index].isRead;
          drawTable();
        });
        newTableData.appendChild(toggleStatusButton);
      } else {
        const newContent = document.createTextNode(`${value}`);
        newTableData.appendChild(newContent);
      }
      newTableRow.appendChild(newTableData);
    });
    const newTableData = document.createElement("td");
    const newDeleteButton = document.createElement("input");
    newDeleteButton.type = "button";
    newDeleteButton.value = "Delete";
    newDeleteButton.classList.add("delete");
    newDeleteButton.addEventListener("click", () => {
      myLibrary.splice(index, 1);
      drawTable();
    });
    newTableData.appendChild(newDeleteButton);
    newTableRow.appendChild(newTableData);

    const table = document.querySelector("table");
    table.appendChild(newTableRow);
  });
}

function addBookToLibrary(title, author, pages, isRead) {
  myLibrary.push(new Book(title, author, pages, isRead));
  drawTable();
}

function collectData() {
  const titleField = document.querySelector("#title");
  const authorField = document.querySelector("#author");
  const pagesField = document.querySelector("#pages");
  const isReadField = document.querySelector("#status");

  return [
    titleField.value,
    authorField.value,
    pagesField.value,
    isReadField.value,
  ];
}

addBookToLibrary("Hobbit", "Tolkien J.R.R.", 293, true);
addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, false);
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 224, true);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 279, false);
addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 218, true);
addBookToLibrary("Animal Farm", "George Orwell", 112, true);
addBookToLibrary("The Lord of the Rings", "J.R.R. Tolkien", 1178, false);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fieldData = collectData();
  addBookToLibrary(fieldData[0], fieldData[1], fieldData[2], fieldData[3]);
  form.reset();
});
