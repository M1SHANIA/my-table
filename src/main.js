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
      return `<span style=\"color: ${color}; font-weight: bold;\">${value}</span>`;
    }, options: [
      { value: "Aktivní", label: "Aktivní" },
      { value: "Neaktivní", label: "Neaktivní" }
    ]
  }
];

const table = document.getElementById("mainTable");
const eventLog = document.getElementById("eventLog");

table.columns = columns;
table.data = sampleData;

function logEvent(type, detail) {
  const event = document.createElement("pre");
  event.textContent = `${new Date().toLocaleTimeString()} - ${type}: ${JSON.stringify(detail, null, 2)}`;
  eventLog.insertBefore(event, eventLog.firstChild);
  while (eventLog.children.length > 10) {
    eventLog.removeChild(eventLog.lastChild);
  }
}

table.addEventListener("table-sort-changed", (e) => logEvent("Sort Changed", e.detail));
table.addEventListener("table-filter-changed", (e) => logEvent("Filter Changed", e.detail));
table.addEventListener("table-selection-changed", (e) => logEvent("Selection Changed", e.detail));
table.addEventListener("table-cell-edited", (e) => logEvent("Cell Edited", e.detail));
table.addEventListener("table-page-changed", (e) => logEvent("Page Changed", e.detail));

document.getElementById("loadData").addEventListener("click", () => {
  const newData = Array.from({ length: 20 }, (_, i) => ({
    id: sampleData.length + i + 1,
    name: `Nový uživatel ${i + 1}`,
    age: Math.floor(Math.random() * 40) + 20,
    email: `user${i + 1}@example.com`,
    department: ["IT", "HR", "Finance", "Marketing"][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.3 ? "Aktivní" : "Neaktivní"
  }));
  table.appendData(newData);
  logEvent("Data Loaded", { count: newData.length });
});

document.getElementById("addRow").addEventListener("click", () => {
  const newRow = {
    id: table.data.length + 1,
    name: "Nový zaměstnanec",
    age: 25,
    email: "new@example.com",
    department: "IT",
    status: "Aktivní"
  };
  table.appendData([newRow]);
  logEvent("Row Added", newRow);
});

document.getElementById("deleteSelected").addEventListener("click", () => {
  const selected = table.getSelectedRows();
  if (selected.length === 0) {
    alert("Nejsou vybrány žádné řádky");
    return;
  }
  if (confirm(`Opravdu chcete smazat ${selected.length} řádků?`)) {
    selected.forEach((row) => {
      const index = table.data.findIndex((r) => r.id === row.id);
      if (index !== -1) {
        table.deleteRow(index);
      }
    });
    logEvent("Rows Deleted", { count: selected.length });
  }
});

document.getElementById("clearFilters").addEventListener("click", () => {
  table.clearFilters();
  logEvent("Filters Cleared", {});
});

document.getElementById("exportData").addEventListener("click", () => {
  const selected = table.getSelectedRows();
  console.log("Selected rows:", selected);
  console.log("All data:", table.data);
  logEvent("Data Exported", { selectedCount: selected.length, totalCount: table.data.length });
});

document.getElementById("toggleEdit").addEventListener("click", (e) => {
  table.editable = !table.editable;
  e.target.textContent = table.editable ? "Vypnout editaci" : "Zapnout editaci";
  logEvent("Edit Mode", { enabled: table.editable });
});
