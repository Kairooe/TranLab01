/*
  Disclosure: ChatGPT assisted with this file.
*/

import { MSG } from "../lang/messages/en/user.js";

/**
 * Represents a single note on the Writer page.
 * Each Note object encapsulates:
 * - its textarea
 * - its remove button
 * - and the logic needed to manage itself
 *
 */
export class Note {
  /**
   * @param {string} id Unique identifier for this note
   * @param {string} content Initial text content
   * @param {(id: string) => void} onRemove Callback provided by writer.js
   *        Used to notify the writer when this note is removed
   */
  constructor(id, content, onRemove) {
    this.id = id;
    this.content = content;
    this.onRemove = onRemove;

    // References to DOM elements created in render()
    this.rowEl = null;
    this.textareaEl = null;
    this.removeBtnEl = null;
  }

  /**
   * Creates the DOM elements for this note and
   * attaches them to the given parent container.
   *
   * This method is responsible only for rendering
   * and wiring event listeners, not storage logic.
   */
  render(parentEl) {
    // Wrapper row for layout
    const row = document.createElement("div");
    row.className = "note-row";

    // Textarea for note content
    const textarea = document.createElement("textarea");
    textarea.className = "form-control note-textarea";
    textarea.value = this.content;

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = MSG.BTN_REMOVE;

    // When remove is clicked, this note removes itself
    removeBtn.addEventListener("click", () => {
      this.remove();
    });

    // Keep this.content in sync with what the user types
    textarea.addEventListener("input", () => {
      this.content = textarea.value;
    });

    // Attach elements to the DOM
    row.appendChild(textarea);
    row.appendChild(removeBtn);
    parentEl.appendChild(row);

    // Save references for later use
    this.rowEl = row;
    this.textareaEl = textarea;
    this.removeBtnEl = removeBtn;
  }

  /**
   * Removes this note's DOM elements immediately.
   * Then notifies the writer (via callback) so it can
   * update the notes array and localStorage.
   *
   * ChatGPT helped suggest using a callback here
   * to keep the Note class independent from storage logic.
   */
  remove() {
    if (this.rowEl) {
      this.rowEl.remove();
    }

    if (typeof this.onRemove === "function") {
      this.onRemove(this.id);
    }
  }

  /**
   * Returns a plain JavaScript object representing this note.
   * Used by writer.js when serializing notes into JSON.
   *
   * @returns {{id: string, content: string}}
   */
  getData() {
    const currentContent = this.textareaEl
      ? this.textareaEl.value
      : this.content;

    return {
      id: this.id,
      content: currentContent
    };
  }
}
