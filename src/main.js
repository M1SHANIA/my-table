import './components/MyTable.js';

const table = document.querySelector('my-table');

table.columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }
];

table.data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'Diana', email: 'diana@example.com' },
  { id: 5, name: 'Eve', email: 'eve@example.com' },
  { id: 6, name: 'Frank', email: 'frank@example.com' }
];

table.addEventListener('table-cell-edited', e => {
  console.log('Change:', e.detail);
});
