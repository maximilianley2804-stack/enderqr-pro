"use strict";

const STORAGE_KEY = "enderqr-projects-v2";
const STORAGE_THEME_KEY = "enderqr-theme";
const STORAGE_LANG_KEY = "enderqr-language";
const ENDERQR_FORMAT = "enderqr-project";
const ENDERQR_VERSION = 1;
const MAX_SAFE_LOGO_PERCENT = 30;
const MAX_LOGO_BYTES = 4 * 1024 * 1024;
const MAX_IMPORT_BYTES = 8 * 1024 * 1024;

const FONT_STACKS = {
  jakarta: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
  space: '"Space Grotesk", "Segoe UI", sans-serif',
  outfit: '"Outfit", "Segoe UI", sans-serif',
  merriweather: '"Merriweather", Georgia, serif',
  jetbrains: '"JetBrains Mono", Consolas, monospace'
};

const THEMES = {
  ocean: { fgColor: "#0b1f3a", bgColor: "#ffffff", dotStyle: "rounded", cornerStyle: "extra-rounded", captionColor: "#0b1f3a" },
  forest: { fgColor: "#143d2f", bgColor: "#f8fff9", dotStyle: "classy-rounded", cornerStyle: "dot", captionColor: "#143d2f" },
  mono: { fgColor: "#111827", bgColor: "#ffffff", dotStyle: "square", cornerStyle: "square", captionColor: "#111827" },
  sunset: { fgColor: "#7e2f23", bgColor: "#fff8f5", dotStyle: "dots", cornerStyle: "extra-rounded", captionColor: "#7e2f23" }
};

const DEFAULT_SETTINGS = {
  projectName: "",
  contentType: "url",
  qrContent: "https://example.com",
  fgColor: "#0b1f3a",
  bgColor: "#ffffff",
  themePreset: "ocean",
  qrSize: 300,
  qrPadding: 16,
  dotStyle: "rounded",
  cornerStyle: "extra-rounded",
  logoDataUrl: "",
  logoScale: 22,
  logoBackgroundPlate: true,
  captionText: "Scan to visit our site",
  captionFont: "jakarta",
  captionSize: 22,
  captionColor: "#0b1f3a",
  captionWeight: "600",
  captionSpacing: 18,
  captionAlign: "center"
};

const I18N = {
  en: {
    app: {
      eyebrow: "Design Suite",
      title: "EnderQR Pro",
      subtitle: "Create branded QR codes with live styling, logos, captions, editable sharing files, and one-click exports."
    },
    header: { languageLabel: "Language", themeLight: "Switch to Light Mode", themeDark: "Switch to Dark Mode" },
    sections: { editor: "Editor Controls", preview: "Live Preview", saved: "Saved Projects" },
    legend: { project: "Project", qrStyle: "QR Styling", logo: "Center Logo", caption: "Caption Below QR" },
    labels: {
      projectName: "Project Name",
      contentType: "Content Type",
      qrContent: "QR Content",
      foreground: "Foreground",
      background: "Background",
      themePreset: "Theme Preset",
      qrSize: "QR Size",
      qrPadding: "Quiet Zone / Padding",
      dotStyle: "Module Style",
      cornerStyle: "Corner Style",
      logoUpload: "Upload Logo",
      logoSize: "Logo Size",
      logoBackgroundPlate: "Keep a clear background under the logo",
      captionText: "Caption Text",
      captionFont: "Font Family",
      captionColor: "Text Color",
      captionWeight: "Text Weight",
      captionSize: "Font Size",
      captionSpacing: "Space Above Caption",
      captionAlign: "Text Alignment",
      searchSaved: "Search saved projects"
    },
    hints: {
      projectName: "Used for saved projects and exported file names.",
      logoNoneSelected: "No logo selected.",
      logoLoadedFromProject: "Logo loaded from project.",
      previewTip: "Tip: Keep strong contrast and avoid oversized logos for better scanner compatibility.",
      savedStorage: "Stored locally in your browser via localStorage."
    },
    buttons: {
      removeLogo: "Remove Logo",
      saveProject: "Save Project",
      reset: "Reset",
      downloadPng: "Download PNG",
      downloadPdf: "Download PDF",
      exportProject: "Export .enderqr",
      importProject: "Import .enderqr"
    },
    options: {
      contentType: { url: "URL", text: "Plain Text", phone: "Phone Number", email: "Email Address" },
      theme: { ocean: "Ocean Ink", forest: "Forest Slate", mono: "Classic Mono", sunset: "Sunset Coral", custom: "Custom" },
      dotStyle: {
        rounded: "Rounded",
        dots: "Dots",
        classy: "Classy",
        classyRounded: "Classy Rounded",
        square: "Square",
        extraRounded: "Extra Rounded"
      },
      cornerStyle: { extraRounded: "Extra Rounded", square: "Square", dot: "Dot" },
      weight: { regular: "Regular", medium: "Medium", semiBold: "Semi Bold", bold: "Bold" },
      align: { center: "Center", left: "Left", right: "Right" }
    },
    placeholders: {
      projectName: "Summer Campaign Landing Page",
      qrContentUrl: "https://example.com",
      qrContentText: "Write plain text content",
      qrContentPhone: "+1 202 555 0148",
      qrContentEmail: "hello@example.com",
      captionText: "Scan to view our spring collection",
      searchProjects: "Search projects..."
    },
    preview: { placeholder: "Enter content to generate a QR code." },
    validation: { contentRequired: "QR content is required before saving or exporting." },
    scan: { safe: "Scan-ready", review: "Review", lowContrast: "Low contrast", largeLogo: "Large logo" },
    saved: {
      countSingular: "{count} project",
      countPlural: "{count} projects",
      empty: "No projects saved yet. Configure a QR and click Save Project.",
      noMatch: "No saved project matches your search.",
      meta: "Updated {updated} | Created {created}",
      actionLoad: "Load",
      actionPng: "PNG",
      actionPdf: "PDF",
      actionDelete: "Delete"
    },
    confirm: { deleteProject: 'Delete "{name}"? This cannot be undone.' },
    toasts: {
      logoUploaded: "Logo uploaded.",
      logoRemoved: "Logo removed.",
      projectSaved: "Project saved successfully.",
      projectUpdated: "Project updated.",
      editorReset: "Editor reset to defaults.",
      pngDownloaded: "PNG downloaded.",
      pdfDownloaded: "PDF downloaded.",
      projectLoaded: 'Loaded "{name}".',
      projectDeleted: "Project deleted.",
      projectExported: ".enderqr file exported.",
      projectImported: "Project file imported successfully.",
      thumbnailFallback: "Used saved thumbnail because live export failed."
    },
    errors: {
      libraryWarning:
        "Some CDN libraries failed to load. QR rendering or export may be unavailable until you reconnect to the internet.",
      unsupportedLogoFormat: "Unsupported logo format. Please upload an image file.",
      logoTooLarge: "Logo file is too large. Use a file under 4 MB.",
      logoReadFailed: "Could not read the logo image.",
      qrRenderFailed: "QR render failed. Check current settings.",
      cannotSaveEmpty: "Cannot save an empty QR project.",
      addContentBeforeDownload: "Add QR content before downloading.",
      pngExportFailed: "PNG export failed.",
      pdfExportFailed: "PDF export failed.",
      storageFull: "Unable to save projects. Browser storage may be full.",
      savedDataCorrupted: "Saved project data was corrupted and has been reset.",
      importTooLarge: "Import file is too large.",
      importUnsupportedFile: "Unsupported file type. Please import a .enderqr or .json file.",
      importReadFailed: "Could not read the selected file.",
      importInvalidJson: "The selected file is not valid JSON.",
      importInvalidFormat: "Invalid EnderQR project file format.",
      importMissingSettings: "Project file is missing required settings data."
    }
  },
  de: {
    app: {
      eyebrow: "Design Suite",
      title: "EnderQR Pro",
      subtitle: "Erstelle gebrandete QR-Codes mit Live-Styling, Logos, Beschriftungen, editierbaren Sharing-Dateien und One-Click-Export."
    },
    header: { languageLabel: "Sprache", themeLight: "Zum Hellmodus wechseln", themeDark: "Zum Dunkelmodus wechseln" },
    sections: { editor: "Editor-Steuerung", preview: "Live-Vorschau", saved: "Gespeicherte Projekte" },
    legend: { project: "Projekt", qrStyle: "QR-Styling", logo: "Logo in der Mitte", caption: "Text unter dem QR-Code" },
    labels: {
      projectName: "Projektname",
      contentType: "Inhaltstyp",
      qrContent: "QR-Inhalt",
      foreground: "Vordergrund",
      background: "Hintergrund",
      themePreset: "Theme-Vorlage",
      qrSize: "QR-Groesse",
      qrPadding: "Ruhezone / Abstand",
      dotStyle: "Modulstil",
      cornerStyle: "Eckenstil",
      logoUpload: "Logo hochladen",
      logoSize: "Logo-Groesse",
      logoBackgroundPlate: "Klare Flaeche unter dem Logo behalten",
      captionText: "Beschriftungstext",
      captionFont: "Schriftfamilie",
      captionColor: "Textfarbe",
      captionWeight: "Schriftstaerke",
      captionSize: "Schriftgroesse",
      captionSpacing: "Abstand ueber Text",
      captionAlign: "Textausrichtung",
      searchSaved: "Gespeicherte Projekte durchsuchen"
    },
    hints: {
      projectName: "Wird fuer gespeicherte Projekte und Exportdateien verwendet.",
      logoNoneSelected: "Kein Logo ausgewaehlt.",
      logoLoadedFromProject: "Logo aus Projekt geladen.",
      previewTip: "Tipp: Achte auf starken Kontrast und vermeide zu grosse Logos fuer bessere Scanner-Erkennung.",
      savedStorage: "Lokal im Browser via localStorage gespeichert."
    },
    buttons: {
      removeLogo: "Logo entfernen",
      saveProject: "Projekt speichern",
      reset: "Zuruecksetzen",
      downloadPng: "PNG herunterladen",
      downloadPdf: "PDF herunterladen",
      exportProject: ".enderqr exportieren",
      importProject: ".enderqr importieren"
    },
    options: {
      contentType: { text: "Klartext", phone: "Telefonnummer", email: "E-Mail-Adresse" },
      theme: { custom: "Benutzerdefiniert" },
      dotStyle: { rounded: "Rund", dots: "Punkte", square: "Quadratisch", extraRounded: "Extra Rund" },
      cornerStyle: { extraRounded: "Extra Rund", square: "Quadratisch", dot: "Punkt" },
      weight: { regular: "Normal", medium: "Mittel", semiBold: "Halbfett", bold: "Fett" },
      align: { center: "Zentriert", left: "Links", right: "Rechts" }
    },
    placeholders: {
      projectName: "Sommerkampagne Landingpage",
      qrContentUrl: "https://beispiel.de",
      qrContentText: "Schreibe Klartext-Inhalt",
      qrContentPhone: "+49 30 123456",
      qrContentEmail: "hallo@beispiel.de",
      captionText: "Scannen fuer unsere Fruehlingskollektion",
      searchProjects: "Projekte suchen..."
    },
    preview: { placeholder: "Inhalt eingeben, um einen QR-Code zu erzeugen." },
    validation: { contentRequired: "QR-Inhalt ist vor Speichern oder Export erforderlich." },
    scan: { safe: "Scan-bereit", review: "Pruefen", lowContrast: "Niedriger Kontrast", largeLogo: "Grosses Logo" },
    saved: {
      countSingular: "{count} Projekt",
      countPlural: "{count} Projekte",
      empty: "Noch keine Projekte gespeichert. Konfiguriere einen QR-Code und klicke auf Projekt speichern.",
      noMatch: "Kein gespeichertes Projekt passt zur Suche.",
      meta: "Aktualisiert {updated} | Erstellt {created}",
      actionLoad: "Laden",
      actionDelete: "Loeschen"
    },
    confirm: { deleteProject: '"{name}" wirklich loeschen? Dies kann nicht rueckgaengig gemacht werden.' },
    toasts: {
      logoUploaded: "Logo hochgeladen.",
      logoRemoved: "Logo entfernt.",
      projectSaved: "Projekt erfolgreich gespeichert.",
      projectUpdated: "Projekt aktualisiert.",
      editorReset: "Editor auf Standardwerte zurueckgesetzt.",
      pngDownloaded: "PNG heruntergeladen.",
      pdfDownloaded: "PDF heruntergeladen.",
      projectLoaded: '"{name}" geladen.',
      projectDeleted: "Projekt geloescht.",
      projectExported: ".enderqr-Datei exportiert.",
      projectImported: "Projektdatei erfolgreich importiert.",
      thumbnailFallback: "Gespeichertes Vorschaubild wurde als Fallback verwendet."
    },
    errors: {
      libraryWarning:
        "Einige CDN-Bibliotheken konnten nicht geladen werden. QR-Rendering oder Export ist eventuell nicht verfuegbar, bis eine Verbindung besteht.",
      unsupportedLogoFormat: "Nicht unterstuetztes Logoformat. Bitte ein Bild hochladen.",
      logoTooLarge: "Logo-Datei ist zu gross. Bitte unter 4 MB bleiben.",
      logoReadFailed: "Das Logo konnte nicht gelesen werden.",
      qrRenderFailed: "QR-Rendering fehlgeschlagen. Bitte Einstellungen pruefen.",
      cannotSaveEmpty: "Ein leeres QR-Projekt kann nicht gespeichert werden.",
      addContentBeforeDownload: "Bitte zuerst QR-Inhalt eingeben.",
      pngExportFailed: "PNG-Export fehlgeschlagen.",
      pdfExportFailed: "PDF-Export fehlgeschlagen.",
      storageFull: "Projekte konnten nicht gespeichert werden. Browser-Speicher ist moeglicherweise voll.",
      savedDataCorrupted: "Gespeicherte Projektdaten waren beschaedigt und wurden zurueckgesetzt.",
      importTooLarge: "Importdatei ist zu gross.",
      importUnsupportedFile: "Nicht unterstuetzter Dateityp. Bitte .enderqr oder .json importieren.",
      importReadFailed: "Die ausgewaehlte Datei konnte nicht gelesen werden.",
      importInvalidJson: "Die ausgewaehlte Datei ist kein gueltiges JSON.",
      importInvalidFormat: "Ungueltiges EnderQR-Projektformat.",
      importMissingSettings: "In der Projektdatei fehlen notwendige Einstellungsdaten."
    }
  }
};

const VALID = {
  contentType: new Set(["url", "text", "phone", "email"]),
  themePreset: new Set(["ocean", "forest", "mono", "sunset", "custom"]),
  dotStyle: new Set(["rounded", "dots", "classy", "classy-rounded", "square", "extra-rounded"]),
  cornerStyle: new Set(["extra-rounded", "square", "dot"]),
  captionFont: new Set(["jakarta", "space", "outfit", "merriweather", "jetbrains"]),
  captionWeight: new Set(["400", "500", "600", "700"]),
  captionAlign: new Set(["center", "left", "right"])
};

const state = {
  qrCode: null,
  projects: [],
  logoDataUrl: "",
  currentProjectId: null,
  language: "en",
  theme: "light",
  logoInfo: { mode: "none", fileName: "" },
  libs: { qr: false, html2canvas: false, jspdf: false }
};

const els = {};
let scheduleRender = () => {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  detectLibraries();

  state.language = loadStoredLanguage();
  state.theme = loadStoredTheme();
  els.languageSwitcher.value = state.language;
  applyTheme(state.theme, false);
  applyTranslations();

  bindEvents();
  applySettingsToForm(DEFAULT_SETTINGS);
  initQrCodeInstance();

  state.projects = loadProjectsFromStorage();
  renderSavedProjects();
  renderPreview();
  updateLibraryWarning();
}

function cacheElements() {
  [
    "libraryWarning",
    "languageSwitcher",
    "themeToggle",
    "projectName",
    "contentType",
    "qrContent",
    "contentValidationHint",
    "fgColor",
    "bgColor",
    "themePreset",
    "qrSize",
    "qrSizeValue",
    "qrPadding",
    "qrPaddingValue",
    "dotStyle",
    "cornerStyle",
    "logoUpload",
    "logoFileName",
    "logoScale",
    "logoScaleValue",
    "logoBackgroundPlate",
    "clearLogoBtn",
    "captionText",
    "captionFont",
    "captionColor",
    "captionWeight",
    "captionSize",
    "captionSizeValue",
    "captionSpacing",
    "captionSpacingValue",
    "captionAlign",
    "saveProjectBtn",
    "resetBtn",
    "downloadPngBtn",
    "downloadPdfBtn",
    "exportProjectBtn",
    "importProjectBtn",
    "importProjectInput",
    "scanabilityBadge",
    "previewComposition",
    "qrContainer",
    "qrPlaceholder",
    "captionPreview",
    "savedSearch",
    "savedCount",
    "savedProjectsGrid",
    "savedCardTemplate",
    "toastContainer"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function detectLibraries() {
  state.libs.qr = typeof window.QRCodeStyling === "function";
  state.libs.html2canvas = typeof window.html2canvas === "function";
  state.libs.jspdf = Boolean(window.jspdf && typeof window.jspdf.jsPDF === "function");
}

function bindEvents() {
  scheduleRender = debounce(renderPreview, 90);

  [
    "projectName",
    "contentType",
    "qrContent",
    "fgColor",
    "bgColor",
    "qrSize",
    "qrPadding",
    "dotStyle",
    "cornerStyle",
    "logoScale",
    "logoBackgroundPlate",
    "captionText",
    "captionFont",
    "captionColor",
    "captionWeight",
    "captionSize",
    "captionSpacing",
    "captionAlign"
  ].forEach((id) => {
    els[id].addEventListener("input", onEditorInput);
    els[id].addEventListener("change", onEditorInput);
  });

  els.languageSwitcher.addEventListener("change", onLanguageChange);
  els.themeToggle.addEventListener("click", onThemeToggle);
  els.themePreset.addEventListener("change", onThemePresetChange);
  els.logoUpload.addEventListener("change", onLogoUploadChange);
  els.clearLogoBtn.addEventListener("click", clearLogo);

  els.saveProjectBtn.addEventListener("click", handleSaveProject);
  els.resetBtn.addEventListener("click", handleResetProject);
  els.downloadPngBtn.addEventListener("click", handleDownloadCurrentPng);
  els.downloadPdfBtn.addEventListener("click", handleDownloadCurrentPdf);
  els.exportProjectBtn.addEventListener("click", handleExportProjectFile);
  els.importProjectBtn.addEventListener("click", () => els.importProjectInput.click());
  els.importProjectInput.addEventListener("change", handleImportProjectFile);

  els.savedSearch.addEventListener("input", renderSavedProjects);
  els.savedProjectsGrid.addEventListener("click", onSavedProjectsAction);
}

function onLanguageChange() {
  state.language = els.languageSwitcher.value === "de" ? "de" : "en";
  safeStorageSet(STORAGE_LANG_KEY, state.language);
  applyTranslations();
}

function onThemeToggle() {
  applyTheme(state.theme === "dark" ? "light" : "dark", true);
}

function applyTheme(theme, persist) {
  state.theme = theme === "dark" ? "dark" : "light";
  document.body.setAttribute("data-theme", state.theme);
  if (persist) safeStorageSet(STORAGE_THEME_KEY, state.theme);
  updateThemeToggleLabel();
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = t("app.title");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.getAttribute("data-i18n-placeholder"));
  });
  updateThemeToggleLabel();
  updateContentPlaceholder();
  refreshLogoFileHint();
  renderSavedProjects();
  renderPreview();
}

function updateThemeToggleLabel() {
  const key = state.theme === "dark" ? "header.themeLight" : "header.themeDark";
  els.themeToggle.textContent = t(key);
  els.themeToggle.setAttribute("aria-pressed", String(state.theme === "dark"));
}

function updateLibraryWarning() {
  const allReady = state.libs.qr && state.libs.html2canvas && state.libs.jspdf;
  els.libraryWarning.classList.toggle("hidden", allReady);
}

function t(key, vars = {}) {
  const value = getPath(I18N[state.language], key) ?? getPath(I18N.en, key) ?? key;
  if (typeof value !== "string") return key;
  return value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

function getPath(obj, path) {
  return path.split(".").reduce((acc, part) => (acc && part in acc ? acc[part] : undefined), obj);
}

function onEditorInput(event) {
  if (event.target.id === "contentType") updateContentPlaceholder();
  if (["fgColor", "bgColor", "dotStyle", "cornerStyle"].includes(event.target.id) && els.themePreset.value !== "custom") {
    els.themePreset.value = "custom";
  }
  syncRangeOutputs();
  scheduleRender();
}

function onThemePresetChange() {
  if (els.themePreset.value !== "custom") {
    const preset = THEMES[els.themePreset.value];
    if (preset) {
      els.fgColor.value = preset.fgColor;
      els.bgColor.value = preset.bgColor;
      els.dotStyle.value = preset.dotStyle;
      els.cornerStyle.value = preset.cornerStyle;
      els.captionColor.value = preset.captionColor;
    }
  }
  syncRangeOutputs();
  renderPreview();
}

function updateContentPlaceholder() {
  const keyByType = {
    url: "placeholders.qrContentUrl",
    text: "placeholders.qrContentText",
    phone: "placeholders.qrContentPhone",
    email: "placeholders.qrContentEmail"
  };
  els.qrContent.placeholder = t(keyByType[els.contentType.value] || "placeholders.qrContentUrl");
}

function initQrCodeInstance() {
  if (!state.libs.qr) return;
  state.qrCode = new window.QRCodeStyling(buildQrOptions(DEFAULT_SETTINGS, formatQrPayload(DEFAULT_SETTINGS.qrContent, "url")));
  els.qrContainer.innerHTML = "";
  state.qrCode.append(els.qrContainer);
}

function buildQrOptions(settings, payload) {
  const options = {
    width: settings.qrSize,
    height: settings.qrSize,
    type: "canvas",
    data: payload || " ",
    margin: settings.qrPadding,
    qrOptions: { errorCorrectionLevel: "H" },
    dotsOptions: { color: settings.fgColor, type: settings.dotStyle },
    backgroundOptions: { color: settings.bgColor },
    cornersSquareOptions: { color: settings.fgColor, type: settings.cornerStyle },
    cornersDotOptions: { color: settings.fgColor, type: settings.cornerStyle === "square" ? "square" : "dot" }
  };
  if (settings.logoDataUrl) {
    options.image = settings.logoDataUrl;
    options.imageOptions = {
      imageSize: clamp(settings.logoScale / 100, 0.1, 0.36),
      margin: settings.logoBackgroundPlate ? 6 : 0,
      hideBackgroundDots: settings.logoBackgroundPlate,
      crossOrigin: "anonymous"
    };
  }
  return options;
}

function formatQrPayload(content, type) {
  const value = (content || "").trim();
  if (!value) return "";
  if (type === "url") return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value) ? value : `https://${value}`;
  if (type === "phone") return `tel:${value.replace(/[^\d+]/g, "")}`;
  if (type === "email") return value.startsWith("mailto:") ? value : `mailto:${value}`;
  return value;
}

function getSettingsFromForm() {
  return {
    projectName: els.projectName.value.trim(),
    contentType: els.contentType.value,
    qrContent: els.qrContent.value,
    fgColor: els.fgColor.value,
    bgColor: els.bgColor.value,
    themePreset: els.themePreset.value,
    qrSize: toInt(els.qrSize.value, DEFAULT_SETTINGS.qrSize),
    qrPadding: toInt(els.qrPadding.value, DEFAULT_SETTINGS.qrPadding),
    dotStyle: els.dotStyle.value,
    cornerStyle: els.cornerStyle.value,
    logoDataUrl: state.logoDataUrl,
    logoScale: toInt(els.logoScale.value, DEFAULT_SETTINGS.logoScale),
    logoBackgroundPlate: els.logoBackgroundPlate.checked,
    captionText: els.captionText.value,
    captionFont: els.captionFont.value,
    captionSize: toInt(els.captionSize.value, DEFAULT_SETTINGS.captionSize),
    captionColor: els.captionColor.value,
    captionWeight: els.captionWeight.value,
    captionSpacing: toInt(els.captionSpacing.value, DEFAULT_SETTINGS.captionSpacing),
    captionAlign: els.captionAlign.value
  };
}

function applySettingsToForm(settings) {
  const s = { ...DEFAULT_SETTINGS, ...settings };
  els.projectName.value = s.projectName;
  els.contentType.value = s.contentType;
  els.qrContent.value = s.qrContent;
  els.fgColor.value = s.fgColor;
  els.bgColor.value = s.bgColor;
  els.themePreset.value = s.themePreset;
  els.qrSize.value = String(s.qrSize);
  els.qrPadding.value = String(s.qrPadding);
  els.dotStyle.value = s.dotStyle;
  els.cornerStyle.value = s.cornerStyle;
  els.logoScale.value = String(s.logoScale);
  els.logoBackgroundPlate.checked = Boolean(s.logoBackgroundPlate);
  els.captionText.value = s.captionText;
  els.captionFont.value = s.captionFont;
  els.captionColor.value = s.captionColor;
  els.captionWeight.value = s.captionWeight;
  els.captionSize.value = String(s.captionSize);
  els.captionSpacing.value = String(s.captionSpacing);
  els.captionAlign.value = s.captionAlign;
  state.logoDataUrl = s.logoDataUrl || "";
  els.logoUpload.value = "";
  state.logoInfo = state.logoDataUrl ? { mode: "project", fileName: "" } : { mode: "none", fileName: "" };
  updateContentPlaceholder();
  syncRangeOutputs();
  refreshLogoFileHint();
}

function refreshLogoFileHint() {
  if (state.logoInfo.mode === "file" && state.logoInfo.fileName) {
    els.logoFileName.textContent = state.logoInfo.fileName;
  } else if (state.logoInfo.mode === "project") {
    els.logoFileName.textContent = t("hints.logoLoadedFromProject");
  } else {
    els.logoFileName.textContent = t("hints.logoNoneSelected");
  }
}

function syncRangeOutputs() {
  els.qrSizeValue.textContent = `${els.qrSize.value} px`;
  els.qrPaddingValue.textContent = `${els.qrPadding.value} px`;
  els.logoScaleValue.textContent = `${els.logoScale.value}%`;
  els.captionSizeValue.textContent = `${els.captionSize.value} px`;
  els.captionSpacingValue.textContent = `${els.captionSpacing.value} px`;
}

async function onLogoUploadChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast(t("errors.unsupportedLogoFormat"), "error");
    els.logoUpload.value = "";
    return;
  }
  if (file.size > MAX_LOGO_BYTES) {
    showToast(t("errors.logoTooLarge"), "error");
    els.logoUpload.value = "";
    return;
  }
  try {
    const dataUrl = await fileToDataUrl(file);
    await validateImageDataUrl(dataUrl);
    state.logoDataUrl = dataUrl;
    state.logoInfo = { mode: "file", fileName: file.name };
    refreshLogoFileHint();
    renderPreview();
    showToast(t("toasts.logoUploaded"), "success");
  } catch {
    showToast(t("errors.logoReadFailed"), "error");
  }
}

function clearLogo() {
  state.logoDataUrl = "";
  state.logoInfo = { mode: "none", fileName: "" };
  els.logoUpload.value = "";
  refreshLogoFileHint();
  renderPreview();
  showToast(t("toasts.logoRemoved"), "info");
}

function renderPreview() {
  const settings = getSettingsFromForm();
  const hasContent = Boolean(settings.qrContent.trim());
  const payload = formatQrPayload(settings.qrContent, settings.contentType);

  els.contentValidationHint.textContent = hasContent ? "" : t("validation.contentRequired");
  els.saveProjectBtn.disabled = !hasContent;
  els.downloadPngBtn.disabled = !hasContent || !(state.libs.qr && state.libs.html2canvas);
  els.downloadPdfBtn.disabled = !hasContent || !(state.libs.qr && state.libs.html2canvas && state.libs.jspdf);

  const warnings = [];
  if (getContrastRatio(settings.fgColor, settings.bgColor) < 3) warnings.push(t("scan.lowContrast"));
  if (settings.logoDataUrl && settings.logoScale > MAX_SAFE_LOGO_PERCENT) warnings.push(t("scan.largeLogo"));
  if (warnings.length) {
    els.scanabilityBadge.textContent = `${t("scan.review")}: ${warnings.join(" + ")}`;
    els.scanabilityBadge.classList.add("warn");
    els.scanabilityBadge.classList.remove("safe");
  } else {
    els.scanabilityBadge.textContent = t("scan.safe");
    els.scanabilityBadge.classList.add("safe");
    els.scanabilityBadge.classList.remove("warn");
  }

  els.qrContainer.style.width = `${settings.qrSize}px`;
  els.qrContainer.style.height = `${settings.qrSize}px`;
  if (state.qrCode) {
    try {
      state.qrCode.update(buildQrOptions(settings, payload));
    } catch {
      showToast(t("errors.qrRenderFailed"), "error");
    }
  }

  const caption = settings.captionText.trim();
  els.captionPreview.textContent = caption;
  els.captionPreview.style.display = caption ? "block" : "none";
  els.captionPreview.style.fontFamily = FONT_STACKS[settings.captionFont] || FONT_STACKS.jakarta;
  els.captionPreview.style.fontSize = `${settings.captionSize}px`;
  els.captionPreview.style.color = settings.captionColor;
  els.captionPreview.style.fontWeight = settings.captionWeight;
  els.captionPreview.style.marginTop = `${settings.captionSpacing}px`;
  els.captionPreview.style.textAlign = settings.captionAlign;
  els.qrPlaceholder.classList.toggle("visible", !hasContent);
}

async function handleSaveProject() {
  const settings = getSettingsFromForm();
  if (!settings.qrContent.trim()) {
    showToast(t("errors.cannotSaveEmpty"), "error");
    return;
  }
  const now = new Date().toISOString();
  const name = settings.projectName || buildDefaultProjectName();
  settings.projectName = name;
  els.projectName.value = name;
  let thumbnail = "";
  try {
    thumbnail = await capturePreviewThumbnail();
  } catch {
    // non-critical
  }

  const index = state.projects.findIndex((p) => p.id === state.currentProjectId);
  if (index >= 0) {
    const existing = state.projects[index];
    state.projects[index] = { ...existing, name, settings: deepClone(settings), thumbnail: thumbnail || existing.thumbnail || "", updatedAt: now };
    showToast(t("toasts.projectUpdated"), "success");
  } else {
    const project = { id: makeId(), name, settings: deepClone(settings), thumbnail, createdAt: now, updatedAt: now };
    state.projects.unshift(project);
    state.currentProjectId = project.id;
    showToast(t("toasts.projectSaved"), "success");
  }
  if (persistProjects()) renderSavedProjects();
}

function handleResetProject() {
  state.currentProjectId = null;
  applySettingsToForm(DEFAULT_SETTINGS);
  renderPreview();
  showToast(t("toasts.editorReset"), "info");
}

async function handleDownloadCurrentPng() {
  const settings = getSettingsFromForm();
  if (!settings.qrContent.trim()) return showToast(t("errors.addContentBeforeDownload"), "error");
  try {
    const dataUrl = await renderCompositionToDataUrl(settings, 3);
    triggerDataUrlDownload(dataUrl, `${buildFileBaseName(settings.projectName)}.png`);
    showToast(t("toasts.pngDownloaded"), "success");
  } catch {
    showToast(t("errors.pngExportFailed"), "error");
  }
}

async function handleDownloadCurrentPdf() {
  const settings = getSettingsFromForm();
  if (!settings.qrContent.trim()) return showToast(t("errors.addContentBeforeDownload"), "error");
  try {
    const dataUrl = await renderCompositionToDataUrl(settings, 3);
    await exportDataUrlToPdf(dataUrl, buildFileBaseName(settings.projectName));
    showToast(t("toasts.pdfDownloaded"), "success");
  } catch {
    showToast(t("errors.pdfExportFailed"), "error");
  }
}

function handleExportProjectFile() {
  const settings = getSettingsFromForm();
  const name = settings.projectName || buildDefaultProjectName();
  const payload = {
    format: ENDERQR_FORMAT,
    version: ENDERQR_VERSION,
    app: "EnderQR Pro",
    exportedAt: new Date().toISOString(),
    language: state.language,
    theme: state.theme,
    project: { name, settings: deepClone(settings) }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  triggerBlobDownload(blob, `${buildFileBaseName(name)}.enderqr`);
  showToast(t("toasts.projectExported"), "success");
}

async function handleImportProjectFile(event) {
  const file = event.target.files?.[0];
  els.importProjectInput.value = "";
  if (!file) return;
  if (file.size > MAX_IMPORT_BYTES) return showToast(t("errors.importTooLarge"), "error");
  if (!/\.(enderqr|json)$/i.test(file.name)) return showToast(t("errors.importUnsupportedFile"), "error");

  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return showToast(t("errors.importInvalidJson"), "error");
  }

  try {
    const imported = validateImportPayload(parsed);
    applySettingsToForm(imported.settings);
    if (imported.name) els.projectName.value = imported.name;
    state.currentProjectId = null;
    renderPreview();
    showToast(t("toasts.projectImported"), "success");
  } catch (error) {
    showToast(error.message || t("errors.importInvalidFormat"), "error");
  }
}

function validateImportPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error(t("errors.importInvalidFormat"));

  let settings;
  let name = "";
  if (payload.format === ENDERQR_FORMAT) {
    if (payload.project?.settings) {
      settings = payload.project.settings;
      name = String(payload.project.name || "");
    } else if (payload.settings) {
      settings = payload.settings;
      name = String(payload.name || "");
    } else throw new Error(t("errors.importMissingSettings"));
  } else if (payload.project?.settings) {
    settings = payload.project.settings;
    name = String(payload.project.name || "");
  } else if (payload.settings) {
    settings = payload.settings;
    name = String(payload.name || "");
  } else throw new Error(t("errors.importInvalidFormat"));

  return { name, settings: normalizeImportedSettings(settings) };
}

function normalizeImportedSettings(input) {
  if (!input || typeof input !== "object") throw new Error(t("errors.importMissingSettings"));
  const merged = { ...DEFAULT_SETTINGS, ...input };
  return {
    projectName: sanitizeString(merged.projectName, 80),
    contentType: VALID.contentType.has(merged.contentType) ? merged.contentType : DEFAULT_SETTINGS.contentType,
    qrContent: sanitizeString(merged.qrContent, 8000),
    fgColor: sanitizeColor(merged.fgColor, DEFAULT_SETTINGS.fgColor),
    bgColor: sanitizeColor(merged.bgColor, DEFAULT_SETTINGS.bgColor),
    themePreset: VALID.themePreset.has(merged.themePreset) ? merged.themePreset : "custom",
    qrSize: clamp(toInt(merged.qrSize, DEFAULT_SETTINGS.qrSize), 180, 620),
    qrPadding: clamp(toInt(merged.qrPadding, DEFAULT_SETTINGS.qrPadding), 0, 44),
    dotStyle: VALID.dotStyle.has(merged.dotStyle) ? merged.dotStyle : DEFAULT_SETTINGS.dotStyle,
    cornerStyle: VALID.cornerStyle.has(merged.cornerStyle) ? merged.cornerStyle : DEFAULT_SETTINGS.cornerStyle,
    logoDataUrl: typeof merged.logoDataUrl === "string" && merged.logoDataUrl.startsWith("data:image/")
      ? merged.logoDataUrl.slice(0, 8 * 1024 * 1024)
      : "",
    logoScale: clamp(toInt(merged.logoScale, DEFAULT_SETTINGS.logoScale), 12, 36),
    logoBackgroundPlate: Boolean(merged.logoBackgroundPlate),
    captionText: sanitizeString(merged.captionText, 1500),
    captionFont: VALID.captionFont.has(merged.captionFont) ? merged.captionFont : DEFAULT_SETTINGS.captionFont,
    captionSize: clamp(toInt(merged.captionSize, DEFAULT_SETTINGS.captionSize), 12, 56),
    captionColor: sanitizeColor(merged.captionColor, DEFAULT_SETTINGS.captionColor),
    captionWeight: VALID.captionWeight.has(String(merged.captionWeight)) ? String(merged.captionWeight) : DEFAULT_SETTINGS.captionWeight,
    captionSpacing: clamp(toInt(merged.captionSpacing, DEFAULT_SETTINGS.captionSpacing), 4, 48),
    captionAlign: VALID.captionAlign.has(merged.captionAlign) ? merged.captionAlign : DEFAULT_SETTINGS.captionAlign
  };
}

function onSavedProjectsAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const project = state.projects.find((p) => p.id === button.dataset.projectId);
  if (!project) return;
  if (button.dataset.action === "load") return loadProject(project);
  if (button.dataset.action === "delete") return deleteProject(project);
  if (button.dataset.action === "png") return downloadSavedProjectPng(project);
  if (button.dataset.action === "pdf") return downloadSavedProjectPdf(project);
}

function loadProject(project) {
  state.currentProjectId = project.id;
  applySettingsToForm(project.settings);
  els.projectName.value = project.name;
  renderPreview();
  showToast(t("toasts.projectLoaded", { name: project.name }), "info");
}

function deleteProject(project) {
  if (!window.confirm(t("confirm.deleteProject", { name: project.name }))) return;
  state.projects = state.projects.filter((p) => p.id !== project.id);
  if (state.currentProjectId === project.id) state.currentProjectId = null;
  if (persistProjects()) {
    renderSavedProjects();
    showToast(t("toasts.projectDeleted"), "success");
  }
}

async function downloadSavedProjectPng(project) {
  try {
    const dataUrl = await renderCompositionToDataUrl(project.settings, 3);
    triggerDataUrlDownload(dataUrl, `${buildFileBaseName(project.name)}.png`);
    showToast(t("toasts.pngDownloaded"), "success");
  } catch {
    if (project.thumbnail) {
      triggerDataUrlDownload(project.thumbnail, `${buildFileBaseName(project.name)}.png`);
      showToast(t("toasts.thumbnailFallback"), "info");
    } else {
      showToast(t("errors.pngExportFailed"), "error");
    }
  }
}

async function downloadSavedProjectPdf(project) {
  try {
    const dataUrl = await renderCompositionToDataUrl(project.settings, 3);
    await exportDataUrlToPdf(dataUrl, buildFileBaseName(project.name));
    showToast(t("toasts.pdfDownloaded"), "success");
  } catch {
    if (project.thumbnail) {
      await exportDataUrlToPdf(project.thumbnail, buildFileBaseName(project.name));
      showToast(t("toasts.thumbnailFallback"), "info");
    } else {
      showToast(t("errors.pdfExportFailed"), "error");
    }
  }
}

function renderSavedProjects() {
  const query = (els.savedSearch.value || "").trim().toLowerCase();
  const items = [...state.projects]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .filter((p) => p.name.toLowerCase().includes(query));

  els.savedCount.textContent = items.length === 1 ? t("saved.countSingular", { count: 1 }) : t("saved.countPlural", { count: items.length });
  els.savedProjectsGrid.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "saved-empty";
    empty.textContent = state.projects.length ? t("saved.noMatch") : t("saved.empty");
    els.savedProjectsGrid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((project) => {
    const card = els.savedCardTemplate.content.cloneNode(true);
    card.querySelector(".saved-thumb").src = project.thumbnail || buildPlaceholderThumbnail(project.name);
    card.querySelector(".saved-name").textContent = project.name;
    card.querySelector(".saved-meta").textContent = t("saved.meta", { updated: formatDate(project.updatedAt), created: formatDate(project.createdAt) });
    card.querySelector('[data-action="load"]').textContent = t("saved.actionLoad");
    card.querySelector('[data-action="png"]').textContent = t("saved.actionPng");
    card.querySelector('[data-action="pdf"]').textContent = t("saved.actionPdf");
    card.querySelector('[data-action="delete"]').textContent = t("saved.actionDelete");
    card.querySelectorAll("[data-action]").forEach((btn) => {
      btn.dataset.projectId = project.id;
    });
    fragment.appendChild(card);
  });
  els.savedProjectsGrid.appendChild(fragment);
}

function loadProjectsFromStorage() {
  const raw = safeStorageGet(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("invalid");
    return parsed.map(normalizeProject).filter(Boolean);
  } catch {
    safeStorageRemove(STORAGE_KEY);
    showToast(t("errors.savedDataCorrupted"), "error");
    return [];
  }
}

function normalizeProject(project) {
  if (!project || typeof project !== "object") return null;
  return {
    id: String(project.id || makeId()),
    name: sanitizeString(project.name || "Untitled Project", 80) || "Untitled Project",
    settings: normalizeImportedSettings(project.settings || {}),
    thumbnail: typeof project.thumbnail === "string" ? project.thumbnail : "",
    createdAt: String(project.createdAt || new Date().toISOString()),
    updatedAt: String(project.updatedAt || project.createdAt || new Date().toISOString())
  };
}

function persistProjects() {
  if (!safeStorageSet(STORAGE_KEY, JSON.stringify(state.projects))) {
    showToast(t("errors.storageFull"), "error");
    return false;
  }
  return true;
}

async function capturePreviewThumbnail() {
  if (!state.libs.html2canvas) return "";
  const canvas = await window.html2canvas(els.previewComposition, { backgroundColor: "#ffffff", useCORS: true, logging: false, scale: 1 });
  return canvas.toDataURL("image/jpeg", 0.86);
}

async function renderCompositionToDataUrl(settings, scale = 3) {
  if (!state.libs.qr || !state.libs.html2canvas) throw new Error("missing libraries");
  const payload = formatQrPayload(settings.qrContent, settings.contentType);
  if (!payload) throw new Error("empty qr");

  const mount = document.createElement("div");
  mount.style.cssText = "position:fixed;left:-10000px;top:0;pointer-events:none;opacity:0;z-index:-1;";
  const composition = document.createElement("div");
  composition.style.cssText = "background:#fff;border-radius:28px;padding:28px;width:max-content;box-shadow:none;";
  const qrHolder = document.createElement("div");
  qrHolder.style.cssText = `width:${settings.qrSize}px;height:${settings.qrSize}px;display:grid;place-items:center;`;
  composition.appendChild(qrHolder);
  const caption = (settings.captionText || "").trim();
  if (caption) {
    const p = document.createElement("p");
    p.textContent = caption;
    p.style.margin = `${settings.captionSpacing}px 0 0`;
    p.style.fontFamily = FONT_STACKS[settings.captionFont] || FONT_STACKS.jakarta;
    p.style.fontSize = `${settings.captionSize}px`;
    p.style.color = settings.captionColor;
    p.style.fontWeight = settings.captionWeight;
    p.style.textAlign = settings.captionAlign;
    p.style.whiteSpace = "pre-wrap";
    p.style.wordBreak = "break-word";
    p.style.maxWidth = `${Math.max(settings.qrSize + 40, 220)}px`;
    composition.appendChild(p);
  }
  mount.appendChild(composition);
  document.body.appendChild(mount);

  try {
    const tempQr = new window.QRCodeStyling(buildQrOptions(settings, payload));
    tempQr.append(qrHolder);
    await wait(120);
    const canvas = await window.html2canvas(composition, { backgroundColor: "#ffffff", useCORS: true, logging: false, scale });
    return canvas.toDataURL("image/png");
  } finally {
    mount.remove();
  }
}

async function exportDataUrlToPdf(dataUrl, fileBaseName) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  const props = pdf.getImageProperties(dataUrl);
  let w = maxW;
  let h = (props.height * w) / props.width;
  if (h > maxH) {
    h = maxH;
    w = (props.width * h) / props.height;
  }
  pdf.addImage(dataUrl, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h, undefined, "FAST");
  pdf.save(`${fileBaseName}.pdf`);
}

function triggerDataUrlDownload(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildDefaultProjectName() {
  const now = new Date();
  return `enderqr-project-${now.toISOString().slice(0, 10)}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

function buildFileBaseName(name) {
  const raw = sanitizeString(name || buildDefaultProjectName(), 80).trim() || buildDefaultProjectName();
  return (
    raw
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "enderqr-project"
  );
}

function buildPlaceholderThumbnail(name) {
  const safe = escapeHtml(name || "QR Project");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='280'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#f6fbff'/><stop offset='100%' stop-color='#e8f2fa'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><rect x='126' y='50' width='168' height='168' rx='14' fill='white' stroke='#d3e3f1'/><text x='210' y='252' text-anchor='middle' fill='#47637a' font-family='Segoe UI, sans-serif' font-size='18'>${safe}</text></svg>`
  )}`;
}

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(state.language === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  els.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 220);
  }, 3300);
}

function getContrastRatio(a, b) {
  const la = getHexLuminance(a);
  const lb = getHexLuminance(b);
  const max = Math.max(la, lb);
  const min = Math.min(la, lb);
  return (max + 0.05) / (min + 0.05);
}

function getHexLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const map = [rgb.r, rgb.g, rgb.b].map((v) => {
    const n = v / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return map[0] * 0.2126 + map[1] * 0.7152 + map[2] * 0.0722;
}

function hexToRgb(hex) {
  const clean = String(hex).replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
}

function sanitizeColor(value, fallback) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function sanitizeString(value, max = 8000) {
  return value === undefined || value === null ? "" : String(value).slice(0, max);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function validateImageDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function makeId() {
  return window.crypto?.randomUUID ? window.crypto.randomUUID() : `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function toInt(v, fallback) {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deepClone(v) {
  return JSON.parse(JSON.stringify(v));
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function loadStoredLanguage() {
  const lang = safeStorageGet(STORAGE_LANG_KEY);
  if (lang === "de" || lang === "en") return lang;
  return (navigator.language || "").toLowerCase().startsWith("de") ? "de" : "en";
}

function loadStoredTheme() {
  const theme = safeStorageGet(STORAGE_THEME_KEY);
  if (theme === "dark" || theme === "light") return theme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }
}
