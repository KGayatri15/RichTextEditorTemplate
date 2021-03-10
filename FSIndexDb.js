import { get, set } from "https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";

const pre1 = document.querySelector("pre.file");
const pre2 = document.querySelector("pre.directory");
const button1 = document.querySelector("button.file");
const button2 = document.querySelector("button.directory");

// File handle
button1.addEventListener("click", async () => {
  try {
    const fileHandleOrUndefined = await get("file");
    if (fileHandleOrUndefined) {
      pre1.textContent = `Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`;
      return;
    }
    const [fileHandle] = await window.showOpenFilePicker();
    await set("file", fileHandle);
    pre1.textContent = `Stored file handle for "${fileHandle.name}" in IndexedDB.`;
  } catch (error) {
    alert(error.name, error.message);
  }
});

// Directory handle
button2.addEventListener("click", async () => {
  try {
    const directoryHandleOrUndefined = await get("directory");
    if (directoryHandleOrUndefined) {
      pre2.textContent = `Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`;
      return;
    }
    const directoryHandle = await window.showDirectoryPicker();
    await set("directory", directoryHandle);
    pre2.textContent = `Stored directory handle for "${directoryHandle.name}" in IndexedDB.`;
  } catch (error) {
    alert(error.name, error.message);
  }
});
async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }
const butDir = document.getElementById('butDirectory');
butDir.addEventListener('click', async () => {
  const dirHandle = await window.showDirectoryPicker();
  for await (const entry of dirHandle.values()) {
    console.log(entry.kind, entry.name);
  }
});
// In an existing directory, create a new directory named "My Documents".
const newDirectoryHandle = await existingDirectoryHandle.getDirectoryHandle('My Documents', {
    create: true,
});
  // In this new directory, create a file named "My Notes.txt".
const newFileHandle = await newDirectoryHandle.getFileHandle('My Notes.txt', { create: true });
// Resolve the path of the previously created file called "My Notes.txt".
const path = await newDirectoryHandle.resolve(newFileHandle);
// `path` is now ["My Documents", "My Notes.txt"]
// Delete a file.
await directoryHandle.removeEntry('Abandoned Masterplan.txt');
// Recursively delete a folder.
await directoryHandle.removeEntry('Old Stuff', { recursive: true });