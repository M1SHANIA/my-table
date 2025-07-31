import { css } from 'lit';

export const tableStyles = css`
  :host {
    display: block;
    font-family: system-ui, -apple-system, sans-serif;
    --table-border-color: #e0e0e0;
    --table-header-bg: #f5f5f5;
    --table-header-color: #333;
    --table-row-hover: #f9f9f9;
    --table-row-selected: #e3f2fd;
    --table-primary-color: #1976d2;
    --table-error-color: #d32f2f;
    --table-cell-padding: 12px;
    --table-dense-padding: 8px;
  }

  * {
    box-sizing: border-box;
  }

  .table-container {
    position: relative;
    width: 100%;
    overflow: auto;
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Table styles */
  .table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  .table.bordered {
    border: 1px solid var(--table-border-color);
  }

  .table.striped tbody tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .table.hover tbody tr:hover {
    background-color: var(--table-row-hover);
  }

  .table.dense th,
  .table.dense td {
    padding: var(--table-dense-padding);
  }

  /* Header styles */
  thead {
    background-color: var(--table-header-bg);
    color: var(--table-header-color);
    font-weight: 600;
  }

  th {
    padding: var(--table-cell-padding);
    text-align: left;
    border-bottom: 2px solid var(--table-border-color);
    position: relative;
    user-select: none;
  }

  th.sortable {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  th.sortable:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .sort-indicator {
    font-size: 0.875em;
    opacity: 0.3;
    transition: opacity 0.2s;
  }

  .sort-indicator.active {
    opacity: 1;
    color: var(--table-primary-color);
  }

  /* Filter styles */
  .filter-row {
    margin-top: 8px;
  }

  .filter-row input,
  .filter-row select {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid var(--table-border-color);
    border-radius: 4px;
    font-size: 0.875em;
  }

  .filter-row input:focus,
  .filter-row select:focus {
    outline: none;
    border-color: var(--table-primary-color);
  }

  /* Body styles */
  tbody tr {
    transition: background-color 0.15s;
  }

  tbody tr.selected {
    background-color: var(--table-row-selected) !important;
  }

  td {
    padding: var(--table-cell-padding);
    border-bottom: 1px solid var(--table-border-color);
  }

  /* Cell alignment */
  .align-center {
    text-align: center;
  }

  .align-right {
    text-align: right;
  }

  /* Select column */
  .select-column {
    width: 40px;
    text-align: center;
  }

  .select-column input[type="checkbox"] {
    cursor: pointer;
  }

  /* Cell editing */
  td input:not([type="checkbox"]),
  td select {
    width: 100%;
    padding: 4px;
    border: 2px solid var(--table-primary-color);
    border-radius: 4px;
    background: white;
    font-family: inherit;
    font-size: inherit;
  }

  td input:focus,
  td select:focus {
    outline: none;
  }

  /* Empty state */
  .empty-message {
    text-align: center;
    padding: 40px !important;
    color: #666;
    font-style: italic;
  }

  /* Loading state */
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--table-border-color);
    border-top-color: var(--table-primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error state */
  .error-message {
    padding: 20px;
    background: #ffebee;
    color: var(--table-error-color);
    text-align: center;
    border-radius: 4px;
    margin: 20px;
  }

  .error-message button {
    margin-top: 10px;
    padding: 8px 16px;
    background: var(--table-error-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .error-message button:hover {
    background: #c62828;
  }

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    border-top: 1px solid var(--table-border-color);
    background: var(--table-header-bg);
  }

  .pagination button {
    padding: 6px 12px;
    border: 1px solid var(--table-border-color);
    background: white;
    color: var(--table-header-color);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .pagination button:hover:not(:disabled) {
    background: var(--table-primary-color);
    color: white;
    border-color: var(--table-primary-color);
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination select {
    padding: 6px 8px;
    border: 1px solid var(--table-border-color);
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  .page-info {
    margin: 0 10px;
    color: #666;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .table-wrapper {
      border: 1px solid var(--table-border-color);
      border-radius: 4px;
    }

    th, td {
      padding: 8px;
      font-size: 14px;
    }

    .pagination {
      flex-wrap: wrap;
      justify-content: center;
    }

    .page-info {
      width: 100%;
      text-align: center;
      margin: 10px 0;
    }
  }

  /* Print styles */
  @media print {
    .filter-row,
    .pagination,
    .select-column {
      display: none !important;
    }

    .table {
      border: 1px solid #000 !important;
    }

    th, td {
      border: 1px solid #000 !important;
    }
  }
`;