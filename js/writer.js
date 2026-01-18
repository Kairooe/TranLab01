import { MSG } from "../lang/messages/en/user.js";
import { Note } from "./note.js";

const SAVE_INTERVAL_MS = 2000;

const notesContainer = document.getElementById("notesContainer");
const addBtn = document.getElementById("addBtn");
const writerStatus = document.getElementById("writerStatus");

let notes = [];

function formatTime(dateObj) {
  return dateObj.toLocaleTimeString();
}

function setStatusSavedNow() {
  writerStatus.textContent = `${MSG.STATUS_SAVED_PREFIX}${formatTime(
    new Date()
  )}`;
}

function loadFromStorage() {
  const raw = localStorage.getItem(MSG.STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (err) {
    return [];
  }
}

function saveToStorage() {
  const data = notes.map((n) => n.getData());
  localStorage.setItem(MSG.STORAGE_KEY, JSON.stringify(data));
  setStatusSavedNow();
}

function removeNoteById(id) {
  notes = notes.filter((n) => n.id !== id);
  saveToStorage();
}

function createNote(id, content) {
  const note = new Note(id, content, removeNoteById);
  note.render(notesContainer);
  return note;
}

function generateId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function initFromStorage() {
  const storedNotes = loadFromStorage();

  if (storedNotes.length === 0) {
    writerStatus.textContent = `${MSG.STATUS_SAVED_PREFIX}--`;
    return;
  }

  storedNotes.forEach((obj) => {
    const safeId = typeof obj.id === "string" ? obj.id : generateId();
    const safeContent = typeof obj.content === "string" ? obj.content : "";
    const note = createNote(safeId, safeContent);
    notes.push(note);
  });

  writerStatus.textContent = `${MSG.STATUS_SAVED_PREFIX}--`;
}

function handleAdd() {
  const id = generateId();
  const note = createNote(id, "");
  notes.push(note);
  saveToStorage();
}

addBtn.textContent = MSG.BTN_ADD;
writerStatus.textContent = `${MSG.STATUS_SAVED_PREFIX}--`;

addBtn.addEventListener("click", handleAdd);

initFromStorage();

setInterval(() => {
  saveToStorage();
}, SAVE_INTERVAL_MS);
