import { MSG } from "../lang/messages/en/user.js";

/**
 * Represents a single note (textarea + remove button) on the Writer page.
 * Encapsulates DOM + behaviors for OOP compliance.
 */
export class Note {
  /**
   * @param {string} id Unique id for the note
   * @param {string} content Initial content
   * @param {(id: string) => void} onRemove Callback when note removes itself
   */
  constructor(id, content, onRemove) {
    this.id = id;
    this.content = content;
    this.onRemove = onRemove;

    this.rowEl = null;
    this.textareaEl = null;
    this.removeBtnEl = null;
  }

  /**
   * Create DOM elements and attach to parent container.
   * @param {HTMLElement} parentEl
   */
  render(parentEl) {
    const row = document.createElement("div");
    row.className = "note-row";

    const textarea = document.createElement("textarea");
    textarea.className = "form-control note-textarea";
    textarea.value = this.content;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = MSG.BTN_REMOVE;

    removeBtn.addEventListener("click", () => {
      this.remove();
    });

    textarea.addEventListener("input", () => {
      this.content = textarea.value;
    });

    row.appendChild(textarea);
    row.appendChild(removeBtn);
    parentEl.appendChild(row);

    this.rowEl = row;
    this.textareaEl = textarea;
    this.removeBtnEl = removeBtn;
  }

  /**
   * Removes this note's DOM immediately and notifies owner to update storage.
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
