/*
  Disclosure: ChatGPT assisted with this file.
*/

import { MSG } from "../lang/messages/en/user.js";
import { Note } from "./note.js";

// Auto-save interval (ms). Requirement says every 2 seconds.
const SAVE_INTERVAL_MS = 2000;

// Cache DOM elements (avoid repeated DOM queries)
const writerTitle = document.getElementById("writerTitle");
const backBtn = document.getElementById("backBtn");
const notesContainer = document.getElementById("notesContainer");
const addBtn = document.getElementById("addBtn");
const writerStatus = document.getElementById("writerStatus");

// Holds Note objects (each Note manages its own textarea + remove button)
let notes = [];

// Localized static UI text (no hard-coded strings in HTML)
document.title = MSG.WRITER_PAGE_TITLE;
writerTitle.textContent = MSG.WRITER_PAGE_TITLE;
backBtn.textContent = MSG.BTN_BACK;

addBtn.textContent = MSG.BTN_ADD;
writerStatus.textContent = `${MSG.STATUS_SAVED_PREFIX}--`;

/**
 * Formats a Date into a user-friendly local time string.
 * Used for the "Saved at" status display.
 */
function formatTime(dateObj) {
  return dateObj.toLocaleTimeString();
}

/**
 * Updates the top-right status text with the current save time.
 */
function setStatusSavedNow() {
  writerStatus.textContent = `${MSG.STATUS_SAVED_PREFIX}${formatTime(
    new Date()
  )}`;
}

/**
 * Reads notes from localStorage and returns them as an array.
 * If storage is empty or invalid, returns an empty array.
 */
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
    // Fail safely if JSON is corrupted
    return [];
  }
}

/**
 * Saves the current notes array to localStorage in JSON format.
 * Converts Note objects into plain { id, content } objects first.
 * Also updates the "Saved at" timestamp after writing.
 *
 * Note: ChatGPT helped suggest this approach for converting objects
 * before JSON.stringify, and I reviewed/understand why it's needed.
 */
function saveToStorage() {
  const data = notes.map((n) => n.getData());
  localStorage.setItem(MSG.STORAGE_KEY, JSON.stringify(data));
  setStatusSavedNow();
}

/**
 * Called by a Note when its remove button is clicked.
 * Removes the Note from the notes array, then saves immediately
 * (required: remove must update storage instantly).
 */
function removeNoteById(id) {
  notes = notes.filter((n) => n.id !== id);
  saveToStorage();
}

/**
 * Creates a Note object, renders it into the DOM, and returns it.
 * The Note class encapsulates its own textarea + remove button.
 */
function createNote(id, content) {
  const note = new Note(id, content, removeNoteById);
  note.render(notesContainer);
  return note;
}

/**
 * Generates a unique id for each note.
 * Uses timestamp + random hex to reduce collision chance.
 */
function generateId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * On page load: retrieve existing notes from localStorage and
 * prepopulate the writer page by dynamically creating textareas.
 */
function initFromStorage() {
  const storedNotes = loadFromStorage();

  storedNotes.forEach((obj) => {
    const safeId = typeof obj.id === "string" ? obj.id : generateId();
    const safeContent = typeof obj.content === "string" ? obj.content : "";
    const note = createNote(safeId, safeContent);
    notes.push(note);
  });
}

/**
 * Add button handler:
 * Creates a new empty note (textarea + remove button),
 * pushes it into the notes array, and saves immediately.
 */
function handleAdd() {
  const id = generateId();
  const note = createNote(id, "");
  notes.push(note);
  saveToStorage();
}

// Wire up Add button
addBtn.addEventListener("click", handleAdd);

// Load any existing notes when writer opens
initFromStorage();

// Auto-save every 2 seconds (requirement)
setInterval(() => {
  saveToStorage();
}, SAVE_INTERVAL_MS);
