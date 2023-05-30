import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-lite.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyByN-FR4_GkOhERuj3-k4cSj1Zvv5ar8B0",
  authDomain: "library-f54cf.firebaseapp.com",
  projectId: "library-f54cf",
  storageBucket: "library-f54cf.appspot.com",
  messagingSenderId: "469667089894",
  appId: "1:469667089894:web:50b6d8e8fcce744e8ada27",
  measurementId: "G-GR3ZNK8585",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getBooks(database) {
  const booksCol = collection(database, "books");
  const booksSnapshot = await getDocs(booksCol);
  const booksList = booksSnapshot.docs.map((doc) => doc.data());
  return booksList;
}

async function saveBook(Book) {
  try {
    await setDoc(doc(db, "books", Book.title), {
      title: Book.title,
      author: Book.author,
      pages: Book.pages,
      isRead: Book.isRead,
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}

async function toggleIsRead(targetBookName, newIsRead) {
  try {
    await updateDoc(doc(db, "books", targetBookName), {
      isRead: newIsRead,
    });
  } catch (error) {
    console.error("Error editing isRead", error);
  }
  drawTable();
}

async function deleteBook(targetBookName) {
  try {
    await deleteDoc(doc(db, "books", targetBookName));
  } catch (error) {
    console.error("Error deleting isRead", error);
  }
  drawTable();
}

const form = document.querySelector("form");

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

async function drawTable() {
  clearTable();
  const bookList = await getBooks(db);
  bookList.forEach((book) => {
    const newTableRow = document.createElement("tr");
    Object.entries(book).forEach(([key, value]) => {
      const newTableData = document.createElement("td");
      if (key === "isRead") {
        const toggleStatusButton = document.createElement("input");
        toggleStatusButton.type = "button";
        toggleStatusButton.classList.add("status");
        toggleStatusButton.setAttribute("id", book.title);
        let newContent = "";
        if (value) {
          newContent = "Have read";
          toggleStatusButton.classList.add("read");
        } else {
          newContent = "Not read yet";
        }
        toggleStatusButton.value = newContent;
        toggleStatusButton.addEventListener("click", (e) => {
          toggleIsRead(e.target.id, !value);
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
    newDeleteButton.setAttribute("id", book.title);
    newDeleteButton.addEventListener("click", (e) => {
      deleteBook(e.target.id);
    });
    newTableData.appendChild(newDeleteButton);
    newTableRow.appendChild(newTableData);

    const table = document.querySelector("table");
    table.appendChild(newTableRow);
  });
}

async function addBookToLibrary(title, author, pages, isRead) {
  await saveBook(new Book(title, author, pages, isRead));
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
    isReadField.value === "true",
  ];
}

drawTable();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fieldData = collectData();
  addBookToLibrary(fieldData[0], fieldData[1], fieldData[2], fieldData[3]);
  form.reset();
});
