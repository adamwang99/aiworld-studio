// Download helpers that work inside the Tauri desktop webview.
//
// WebKitGTK (the Linux webview Tauri uses) silently ignores the classic
// `<a download>` + blob-URL trick, so on desktop we call a Rust command that
// opens a native "Save as" dialog and writes the file. In a plain browser
// (dev / preview) we fall back to the anchor approach.

function isTauri(): boolean {
  return typeof (window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ !== 'undefined';
}

function browserDownloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function browserDownloadBytes(bytes: Uint8Array, filename: string, mime: string): void {
  const blob = new Blob([bytes as unknown as BlobPart], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// Returns true if a file was saved, false if the user cancelled the dialog.
export async function saveTextFile(content: string, defaultName: string): Promise<boolean> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<boolean>('save_text_file', { content, defaultName });
  }
  browserDownloadText(content, defaultName);
  return true;
}

export async function saveBytesFile(bytes: Uint8Array, defaultName: string, mime = 'application/octet-stream'): Promise<boolean> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<boolean>('save_bytes_file', { content: Array.from(bytes), defaultName });
  }
  browserDownloadBytes(bytes, defaultName, mime);
  return true;
}
