// Prevents additional console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

// ---------------------------------------------------------------------------
// Tauri commands
// ---------------------------------------------------------------------------

/// Write text content to a file chosen by the user via a save dialog.
#[tauri::command]
async fn export_notes(app: tauri::AppHandle, content: String) -> Result<String, String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    use std::fs;

    let path = FileDialogBuilder::new()
        .set_title("Export Notes")
        .set_file_name("quicknotes-export.json")
        .add_filter("JSON", &["json"])
        .save_file();

    match path {
        Some(p) => {
            fs::write(&p, content).map_err(|e| e.to_string())?;
            Ok(p.display().to_string())
        }
        None => Err("Export cancelled".to_string()),
    }
}

/// Read a notes JSON file chosen by the user via an open dialog.
#[tauri::command]
async fn import_notes(_app: tauri::AppHandle) -> Result<String, String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    use std::fs;

    let path = FileDialogBuilder::new()
        .set_title("Import Notes")
        .add_filter("JSON", &["json"])
        .pick_file();

    match path {
        Some(p) => fs::read_to_string(&p).map_err(|e| e.to_string()),
        None => Err("Import cancelled".to_string()),
    }
}

/// Show a native OS notification.
#[tauri::command]
fn show_notification(title: String, body: String) -> Result<(), String> {
    tauri::api::notification::Notification::new("com.quicknotes.app")
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

fn main() {
    // System tray menu items
    let show = CustomMenuItem::new("show".to_string(), "Show QuickNotes");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show" => {
                    if let Some(window) = app.get_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                "hide" => {
                    if let Some(window) = app.get_window("main") {
                        let _ = window.hide();
                    }
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            SystemTrayEvent::LeftClick { .. } => {
                if let Some(window) = app.get_window("main") {
                    if window.is_visible().unwrap_or(false) {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            export_notes,
            import_notes,
            show_notification,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
