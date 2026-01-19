/*
  Disclosure: ChatGPT assisted with this file.
*/

import { MSG } from "../lang/messages/en/user.js";

const indexTitle = document.getElementById("indexTitle");
const studentName = document.getElementById("studentName");
const writerLink = document.getElementById("writerLink");
const readerLink = document.getElementById("readerLink");

document.title = MSG.INDEX_PAGE_TITLE;

indexTitle.textContent = MSG.INDEX_TITLE;
studentName.textContent = MSG.INDEX_STUDENT_NAME;

writerLink.textContent = MSG.WRITER_PAGE_TITLE;
readerLink.textContent = MSG.READER_PAGE_TITLE;
