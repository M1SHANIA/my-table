// Импортируем компонент таблицы
import "./components/my-table.js";

// Sample data
const sampleData = [
  { id: 1, name: "Jan Novák", age: 28, email: "jan.novak@example.com", department: "IT", status: "Aktivní" },
  { id: 2, name: "Marie Svobodová", age: 32, email: "marie.svobodova@example.com", department: "HR", status: "Aktivní" },
  { id: 3, name: "Petr Dvořák", age: 45, email: "petr.dvorak@example.com", department: "Finance", status: "Neaktivní" },
  { id: 4, name: "Eva Procházková", age: 29, email: "eva.prochazkova@example.com", department: "Marketing", status: "Aktivní" },
  { id: 5, name: "Tomáš Černý", age: 36, email: "tomas.cerny@example.com", department: "IT", status: "Aktivní" },
  { id: 6, name: "Lucie Nová", age: 27, email: "lucie.nova@example.com", department: "HR", status: "Aktivní" },
  { id: 7, name: "Martin Krejčí", age: 41, email: "martin.krejci@example.com", department: "IT", status: "Aktivní" },
  { id: 8, name: "Hana Pokorná", age: 35, email: "hana.pokorna@example.com", department: "Finance", status: "Neaktivní" },
  { id: 9, name: "Jiří Veselý", age: 30, email: "jiri.vesely@example.com", department: "Marketing", status: "Aktivní" },
  { id: 10, name: "Alena Marková", age: 38, email: "alena.markova@example.com", department: "IT", status: "Aktivní" },
  { id: 11, name: "Pavel Hájek", age: 33, email: "pavel.hajek@example.com", department: "HR", status: "Aktivní" },
  { id: 12, name: "Lenka Růžičková", age: 26, email: "lenka.ruzickova@example.com", department: "Finance", status: "Aktivní" },
  { id: 13, name: "David Němec", age: 42, email: "david.nemec@example.com", department: "IT", status: "Neaktivní" },
  { id: 14, name: "Tereza Šimková", age: 31, email: "tereza.simkova@example.com", department: "Marketing", status: "Aktivní" },
  { id: 15, name: "Michal Novotný", age: 37, email: "michal.novotny@example.com", department: "IT", status: "Aktivní" }
];

const columns = [
  { key: "id", label: "ID", type: "number", width: "60px", sortable: true, editable: false },
  { key: "name", label: "Jméno", type: "text", sortable: true, filterable: true },
  { key: "age", label: "Věk", type: "number", sortable: true, filterable: true },
  { key: "email", label: "Email", type: "text", sortable: true, filterable: true },
  {
    key: "department", label: "Oddělení", type: "select", sortable: true, filterable: true, options: [
      { value: "IT", label: "IT" },
      { value: "HR", label: "HR" },
      { value: "Finance", label: "Finance" },
      { value: "Marketing", label: "Marketing" }
    ]
  },
  {
    key: "status", label: "Status", type: "select", sortable: true, filterable: true, formatter: (value) => {
      const color = value === "Aktivní" ? "green" : "red";
      return `<span style="color: ${color}; font-weight: bold;">${value}</span>`;
    }, options: [
      { value: "Aktivní", label: "Aktivní" },
      { value: "Neaktivní", label: "Neaktivní" }
    ]
  }
];

const table = document.getElementById("mainTable");
const eventLog = document.getElementById("eventLog");

// Nastavení tabulky
table.columns = columns;
table.data = sampleData;
table.selectable = true; // Povolíme výběr řádků pro smazání
table.editable = true; // Povolíme editaci

// Funkce pro logování událostí
function logEvent(type, detail) {
  const event = document.createElement("pre");
  event.textContent = `${new Date().toLocaleTimeString()} - ${type}: ${JSON.stringify(detail, null, 2)}`;
  eventLog.insertBefore(event, eventLog.firstChild);
  while (eventLog.children.length > 10) {
    eventLog.removeChild(eventLog.lastChild);
  }
}

// Event listeners pro tabulku
table.addEventListener("table-sort-changed", (e) => logEvent("Sort Changed", e.detail));
table.addEventListener("table-filter-changed", (e) => logEvent("Filter Changed", e.detail));
table.addEventListener("table-selection-changed", (e) => logEvent("Selection Changed", { selected: e.detail.selected }));
table.addEventListener("table-cell-edited", (e) => logEvent("Cell Edited", e.detail));
table.addEventListener("table-page-changed", (e) => logEvent("Page Changed", e.detail));
table.addEventListener("table-row-added", (e) => logEvent("Row Added", e.detail));
table.addEventListener("table-data-loaded", (e) => logEvent("Data Loaded", e.detail));
table.addEventListener("table-load-more", (e) => logEvent("Load More", e.detail));
table.addEventListener("table-row-click", (e) => logEvent("Row Clicked", { row: e.detail.row }));

// Tlačítko pro načtení dat ze serveru (simulace)
document.getElementById("loadData").addEventListener("click", async () => {
  // Můžete zde zadat skutečnou URL vašeho API
  // table.dataUrl = "https://jsonplaceholder.typicode.com/users";

  // Nebo použít simulaci s lokálními daty
  const newData = Array.from({ length: 20 }, (_, i) => ({
    id: table.data.length + i + 1,
    name: `Nový uživatel ${i + 1}`,
    age: Math.floor(Math.random() * 40) + 20,
    email: `user${i + 1}@example.com`,
    department: ["IT", "HR", "Finance", "Marketing"][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.3 ? "Aktivní" : "Neaktivní"
  }));
  table.appendData(newData);
  logEvent("Data Loaded", { count: newData.length });
});

// Tlačítko pro přidání nového řádku - otevře formulář nahoře
document.getElementById("addRow").addEventListener("click", () => {
  table.showAddForm();
  logEvent("Add Form Opened", {});
});

// Tlačítko pro smazání vybraných řádků - OPRAVENO
document.getElementById("deleteSelected").addEventListener("click", () => {
  const selected = table.getSelectedRows();
  if (selected.length === 0) {
    alert("Nejsou vybrány žádné řádky");
    return;
  }

  if (confirm(`Opravdu chcete smazat ${selected.length} řádků?`)) {
    // Smažeme řádky podle jejich ID
    selected.forEach((row) => {
      if (row && row.id) {
        table.deleteRow(row.id);
      }
    });
    logEvent("Rows Deleted", { count: selected.length });
  }
});

// Tlačítko pro vyčištění filtrů
document.getElementById("clearFilters").addEventListener("click", () => {
  table.clearFilters();
  logEvent("Filters Cleared", {});
});

// Tlačítko pro export dat
document.getElementById("exportData").addEventListener("click", () => {
  const selected = table.getSelectedRows();
  const allData = table.data;

  console.log("Selected rows:", selected);
  console.log("All data:", allData);

  // Můžete zde přidat skutečný export do CSV nebo JSON
  const exportData = selected.length > 0 ? selected : allData;

  // Příklad exportu do JSON
  const jsonData = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `table-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  logEvent("Data Exported", {
    selectedCount: selected.length,
    totalCount: allData.length,
    format: "JSON"
  });
});

// Tlačítko pro přepnutí režimu editace
document.getElementById("toggleEdit").addEventListener("click", (e) => {
  table.editable = !table.editable;
  e.target.textContent = table.editable ? "Vypnout editaci" : "Zapnout editaci";
  logEvent("Edit Mode", { enabled: table.editable });
});

// Demonstrace lazy loading
document.getElementById("toggleLazyLoad")?.addEventListener("click", (e) => {
  table.lazyLoad = !table.lazyLoad;
  if (table.lazyLoad) {
    table.loadThreshold = 50; // Načte 50 záznamů najednou
    e.target.textContent = "Vypnout Lazy Loading";

    // Simulace URL pro lazy loading
    // table.dataUrl = "https://your-api.com/data";
    // table.refresh();
  } else {
    e.target.textContent = "Zapnout Lazy Loading";
  }
  logEvent("Lazy Loading", { enabled: table.lazyLoad });
});

// Demonstrace načítání dat ze serveru
document.getElementById("loadFromServer")?.addEventListener("click", () => {
  // Příklad s JSONPlaceholder API
  table.dataUrl = "https://jsonplaceholder.typicode.com/users";

  // Mapování dat z API na náš formát
  table.addEventListener("table-data-loaded", (e) => {
    if (e.detail.data && e.detail.data[0] && e.detail.data[0].username) {
      // Transformace dat z JSONPlaceholder
      const transformedData = e.detail.data.map((user, index) => ({
        id: user.id,
        name: user.name,
        age: 20 + (index * 2), // Simulovaný věk
        email: user.email,
        department: ["IT", "HR", "Finance", "Marketing"][index % 4],
        status: index % 3 === 0 ? "Neaktivní" : "Aktivní"
      }));
      table.data = transformedData;
    }
  }, { once: true });

  table.refresh();
  logEvent("Loading from Server", { url: table.dataUrl });
});