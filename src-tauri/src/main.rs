#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_dialog::DialogExt;

// Save UTF-8 text to a user-chosen path via the native save dialog.
// Returns true if saved, false if the user cancelled.
#[tauri::command]
async fn save_text_file(
    app: tauri::AppHandle,
    content: String,
    default_name: String,
) -> Result<bool, String> {
    let picked = app
        .dialog()
        .file()
        .set_file_name(&default_name)
        .blocking_save_file();
    match picked {
        Some(fp) => {
            let path = fp.into_path().map_err(|e| e.to_string())?;
            std::fs::write(&path, content).map_err(|e| e.to_string())?;
            Ok(true)
        }
        None => Ok(false),
    }
}

// Save raw bytes (e.g. generated audio) to a user-chosen path.
#[tauri::command]
async fn save_bytes_file(
    app: tauri::AppHandle,
    content: Vec<u8>,
    default_name: String,
) -> Result<bool, String> {
    let picked = app
        .dialog()
        .file()
        .set_file_name(&default_name)
        .blocking_save_file();
    match picked {
        Some(fp) => {
            let path = fp.into_path().map_err(|e| e.to_string())?;
            std::fs::write(&path, content).map_err(|e| e.to_string())?;
            Ok(true)
        }
        None => Ok(false),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![save_text_file, save_bytes_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
