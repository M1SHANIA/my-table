import { css } from 'lit';

export const tableStyles = css`
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th, td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: left;
    vertical-align: middle;
  }

  th {
    cursor: pointer;
    position: relative;
    background: #f0f0f0;
  }

  .filter-input {
    width: 100%;
    box-sizing: border-box;
    padding: 4px;
    margin-top: 4px;
    font-size: 0.9em;
  }

  .edit-input {
    width: 100%;
    box-sizing: border-box;
    padding: 4px;
    font-size: 0.9em;
    border: 1px solid #007acc;
    outline: none;
  }
`;
