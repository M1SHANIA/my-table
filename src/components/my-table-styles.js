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
    --table-success-color: #4caf50;
    --table-cell-padding: 12px;
    --table-dense-padding: 8px;
  }

  * {
    box-sizing: border-box;
  }

  .table-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--table-border-color);
    border-radius: 4px;
    background: white;
    overflow: hidden;
  }

  /* Форма добавления новой записи */
  .add-form-container {
    padding: 20px;
    background: #f8f9fa;
    border-bottom: 2px solid var(--table-primary-color);
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .add-form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .add-form-header h3 {
    margin: 0;
    color: var(--table-header-color);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .close-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .add-form-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
  }

  .form-field label {
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }

  .form-field input,
  .form-field select {
    padding: 8px 12px;
    border: 1px solid var(--table-border-color);
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .form-field input:focus,
  .form-field select:focus {
    outline: none;
    border-color: var(--table-primary-color);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  }

  .add-form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .btn-primary,
  .btn-secondary {
    padding: 8px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn-primary {
    background: var(--table-primary-color);
    color: white;
  }

  .btn-primary:hover {
    background: #1565c0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: white;
    color: #666;
    border: 1px solid var(--table-border-color);
  }

  .btn-secondary:hover {
    background: #f5f5f5;
  }

  /* Индикатор загрузки для lazy loading */
  .loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 10px;
    color: #666;
    background: #f9f9f9;
    border-top: 1px solid var(--table-border-color);
  }

  .spinner-small {
    width: 20px;
    height: 20px;
    border: 2px solid var(--table-border-color);
    border-top-color: var(--table-primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .no-more-data {
    text-align: center;
    padding: 15px;
    color: #999;
    font-style: italic;
    background: #f9f9f9;
    border-top: 1px solid var(--table-border-color);
  }

  .table-scroll-wrapper {
    flex: 1;
    overflow: auto;
    position: relative;
  }

  .table-wrapper {
    min-width: 100%;
    overflow: visible;
  }

  /* Sticky header при скролле */
  .table-container.sticky-header .table-scroll-wrapper {
    overflow-y: auto;
    overflow-x: auto;
  }

  .table-container.sticky-header thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--table-header-bg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Стили для скроллбаров */
  .table-scroll-wrapper::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .table-scroll-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  .table-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  .table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .table-scroll-wrapper::-webkit-scrollbar-corner {
    background: #f1f1f1;
  }

  /* Firefox scrollbar */
  @supports (scrollbar-width: thin) {
    .table-scroll-wrapper {
      scrollbar-width: thin;
      scrollbar-color: #888 #f1f1f1;
    }
  }

  /* Table styles */
  .table {
    width: 100%;
    min-width: max-content;
    border-collapse: collapse;
    background: white;
  }

  .table.bordered {
    border: none;
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
    white-space: nowrap;
    min-width: 50px;
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
    white-space: nowrap;
    min-width: 50px;
  }

  /* Для колонок, где перенос допустим */
  .allow-wrap {
    white-space: normal;
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
    min-width: 40px;
    max-width: 40px;
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
    background: rgba(255, 255, 255, 0.95);
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
    position: static;
    padding: 40px;
    background: #ffebee;
    color: var(--table-error-color);
    text-align: center;
    border-radius: 4px;
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
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
    z-index: 5;
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

  .items-info {
    font-size: 0.9em;
    color: #999;
    margin-left: 5px;
  }

  /* Responsive */
  @media (max-width: 768px) {
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

    .add-form-fields {
      grid-template-columns: 1fr;
    }
  }

  /* Print styles */
  @media print {
    .filter-row,
    .pagination,
    .select-column,
    .add-form-container {
      display: none !important;
    }

    .table {
      border: 1px solid #000 !important;
    }

    th, td {
      border: 1px solid #000 !important;
    }
  }

  /* Mobile responsive table */
  @media (max-width: 768px) {
    table {
      border: 0;
    }
    thead {
      display: none;
    }
    tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 0.5rem;
      background: #fff;
      text-align: center;
    }
    td {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    td:last-child {
      border-bottom: 0;
    }
    td::before {
      content: attr(data-label);
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
  }
`;