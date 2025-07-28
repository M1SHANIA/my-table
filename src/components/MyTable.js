import { LitElement, html } from 'lit';
import { tableStyles } from './MyTableStyles.js';
import { sortData, filterData } from './MyTableUtils.js';

export class MyTable extends LitElement {
  static properties = {
    data: { type: Array },
    columns: { type: Array },
    pageSize: { type: Number },
    currentPage: { type: Number },
    sortKey: { type: String },
    sortDirection: { type: String },
    filters: { type: Object },
    editingCell: { type: Object }
  };

  static styles = tableStyles;

  constructor() {
    super();
    this.data = [];
    this.columns = [];
    this.pageSize = 10;
    this.currentPage = 1;
    this.sortKey = null;
    this.sortDirection = 'asc';
    this.filters = {};
    this.editingCell = null;
  }

  get filteredData() {
    return filterData(this.data, this.filters);
  }

  get sortedData() {
    if (!this.sortKey) return this.filteredData;
    return sortData(this.filteredData, this.sortKey, this.sortDirection);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedData.slice(start, start + this.pageSize);
  }

  handleSort(colKey) {
    if (this.sortKey === colKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = colKey;
      this.sortDirection = 'asc';
    }
  }

  onFilterChange(key, value) {
    this.filters = { ...this.filters, [key]: value };
    this.currentPage = 1;
  }

  startEdit(rowIndex, columnKey) {
    this.editingCell = { rowIndex, columnKey };
  }

  handleEditKeydown(e, rowIndex, columnKey) {
    const newValue = e.target.value;
    if (e.key === 'Enter') {
      this.commitEdit(rowIndex, columnKey, newValue);
    } else if (e.key === 'Escape') {
      this.cancelEdit();
    }
  }

  commitEdit(rowIndex, columnKey, newValue) {
    const row = this.paginatedData[rowIndex];
    const oldValue = row[columnKey];

    // Use a unique identifier (e.g., 'id') to find the row index
    const dataIndex = this.data.findIndex(r => r.id === row.id);

    if (dataIndex === -1) {
      console.warn('Row not found in original data');
      return;
    }

    const updatedRow = { ...row, [columnKey]: newValue };

    this.data = [
      ...this.data.slice(0, dataIndex),
      updatedRow,
      ...this.data.slice(dataIndex + 1)
    ];

    this.dispatchEvent(new CustomEvent('table-cell-edited', {
      detail: { row: dataIndex, column: columnKey, oldValue, newValue },
      bubbles: true,
      composed: true
    }));

    this.editingCell = null;
  }


  cancelEdit() {
    this.editingCell = null;
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            ${this.columns.map(col => html`
              <th @click=${() => this.handleSort(col.key)}>
                ${col.label}
                ${this.sortKey === col.key ? (this.sortDirection === 'asc' ? '▲' : '▼') : ''}
                <input
                  class="filter-input"
                  placeholder="Search..."
                  @click=${e => e.stopPropagation()}
                  @input=${e => this.onFilterChange(col.key, e.target.value)}
                  .value=${this.filters[col.key] || ''}
                />
              </th>
            `)}
          </tr>
        </thead>
        <tbody>
          ${this.paginatedData.map((row, rowIndex) => html`
            <tr>
              ${this.columns.map(col => {
      const isEditing = this.editingCell &&
        this.editingCell.rowIndex === rowIndex &&
        this.editingCell.columnKey === col.key;
      return html`
                  <td @dblclick=${() => this.startEdit(rowIndex, col.key)}>
                    ${isEditing
          ? html`
                          <input
                            class="edit-input"
                            .value=${row[col.key]}
                            @keydown=${e => this.handleEditKeydown(e, rowIndex, col.key)}
                            @blur=${() => this.cancelEdit()}
                            autofocus
                          />
                        `
          : row[col.key]}
                  </td>
                `;
    })}
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}

customElements.define('my-table', MyTable);
