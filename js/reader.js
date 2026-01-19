/*
  Disclosure: ChatGPT assisted with this file.
*/

import { MSG } from "../lang/messages/en/user.js";

// How often the reader checks localStorage for updates (in milliseconds)
const POLL_INTERVAL_MS = 2000;

// Grab required DOM elements once so we don't keep querying the DOM
const readerTitle = document.getElementById("readerTitle");
const backBtn = document.getElementById("backBtn");
const readerNotes = document.getElementById("readerNotes");
const readerStatus = document.getElementById("readerStatus");

// Set static, localized UI text (no hard-coded strings in HTML)
document.title = MSG.READER_PAGE_TITLE;
readerTitle.textContent = MSG.READER_PAGE_TITLE;
backBtn.textContent = MSG.BTN_BACK;

/**
 * Formats a Date object into a readable time string.
 * Used for the "Updated at" status message.
 * Written by AI because I forgot how to format to display the local time
 */
function formatTime(dateObj) {
  return dateObj.toLocaleTimeString();
}

/**
 * Updates the top-right status text with the current time.
 * Called every time notes are retrieved.
 * This was written and suggested by AI because I forgot how to set up and format the text properly 
 */
function setStatusRetrievedNow() {
  readerStatus.textContent = `${MSG.STATUS_RETRIEVED_PREFIX}${formatTime(
    new Date()
  )}`;
}

/**
 * Loads notes from localStorage.
 * - Reads raw string data
 * - Parses JSON
 * - Ensures the result is an array
 * Returns an empty array if anything is invalid.
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
    // If JSON is malformed, fail safely
    return [];
  }
}

/**
 * Removes all existing note elements from the reader container.
 * This prevents duplicate rendering when polling.
 */
function clearContainer() {
  while (readerNotes.firstChild) {
    readerNotes.removeChild(readerNotes.firstChild);
  }
}

/**
 * Renders notes in read-only form.
 * - Clears old notes first
 * - Shows a placeholder message if no notes exist
 * - Otherwise displays each note's content
 */
function renderNotes(items) {
  clearContainer();

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "note-display";
    empty.textContent = MSG.EMPTY_NOTES;
    readerNotes.appendChild(empty);
    return;
  }

  items.forEach((obj) => {
    const content = typeof obj.content === "string" ? obj.content : "";

    const box = document.createElement("div");
    box.className = "note-display";
    box.textContent = content;

    readerNotes.appendChild(box);
  });
}

/**
 * Main polling function.
 * - Retrieves notes from localStorage
 * - Renders them to the page
 * - Updates the "Updated at" timestamp
 *
 * This function runs repeatedly without requiring a page refresh.
 * 
 */
function poll() {
  const notes = loadFromStorage();
  renderNotes(notes);
  setStatusRetrievedNow();
}

// Initial placeholder status before first poll
readerStatus.textContent = `${MSG.STATUS_RETRIEVED_PREFIX}--`;

// Initial load so the page isn't empty for 2 seconds
poll();

// Re-run poll every 2 seconds to reflect writer updates
setInterval(poll, POLL_INTERVAL_MS);
