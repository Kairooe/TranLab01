import { MSG } from "../lang/messages/en/user.js";

const POLL_INTERVAL_MS = 2000;

const readerNotes = document.getElementById("readerNotes");
const readerStatus = document.getElementById("readerStatus");

function formatTime(dateObj) {
  return dateObj.toLocaleTimeString();
}

function setStatusRetrievedNow() {
  readerStatus.textContent = `${MSG.STATUS_RETRIEVED_PREFIX}${formatTime(
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

function clearContainer() {
  while (readerNotes.firstChild) {
    readerNotes.removeChild(readerNotes.firstChild);
  }
}

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

function poll() {
  const notes = loadFromStorage();
  renderNotes(notes);
  setStatusRetrievedNow();
}

readerStatus.textContent = `${MSG.STATUS_RETRIEVED_PREFIX}--`;

poll();
setInterval(poll, POLL_INTERVAL_MS);
