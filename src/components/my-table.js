import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { tableStyles } from './my-table-styles.js';

// Главный компонент таблицы
export class MyTable extends LitElement {
  static styles = [tableStyles];

  // Описываем публичные и внутренние свойства компонента
  static properties = {
    // Data
    columns: { type: Array },
    data: { type: Array },
    dataUrl: { type: String },

    // Pagination
    pageSize: { type: Number },
    currentPage: { type: Number },
    pageSizes: { type: Array },

    // Features
    sortable: { type: Boolean },
    filterable: { type: Boolean },
    editable: { type: Boolean },
    selectable: { type: Boolean },
    groupable: { type: Boolean },

    // Lazy loading
    lazyLoad: { type: Boolean },
    loadThreshold: { type: Number },
    totalItems: { type: Number },

    // Appearance
    height: { type: String },
    maxHeight: { type: String },  // Новое свойство
    width: { type: String },       // Новое свойство
    maxWidth: { type: String },    // Новое свойство
    striped: { type: Boolean },
    bordered: { type: Boolean },
    hover: { type: Boolean },
    dense: { type: Boolean },
    stickyHeader: { type: Boolean },

    // Internal state
    _filteredData: { state: true },
    _sortConfig: { state: true },
    _filters: { state: true },
    _selectedRows: { state: true },
    _editingCell: { state: true },
    _loading: { state: true },
    _error: { state: true }
  };

  constructor() {
    super();

    // Инициализация публичных свойств
    this.columns = [];
    this.data = [];
    this.dataUrl = '';

    // Параметры пагинации
    this.pageSize = 20;
    this.currentPage = 1;
    this.pageSizes = [10, 20, 50, 100];

    // Флаги функционала
    this.sortable = true;      // Сортировка
    this.filterable = true;    // Фильтрация
    this.editable = false;     // Редактирование
    this.selectable = false;   // Выбор строк
    this.groupable = false;    // Группировка

    // Ленивая загрузка
    this.lazyLoad = false;
    this.loadThreshold = 100;
    this.totalItems = 0;

    // Внешний вид
    this.height = 'auto';
    this.maxHeight = '600px';    // Значение по умолчанию
    this.width = '100%';         // Значение по умолчанию
    this.maxWidth = '100%';      // Значение по умолчанию
    this.striped = true;
    this.bordered = true;
    this.hover = true;
    this.dense = false;
    this.stickyHeader = true;

    // Внутреннее состояние
    this._filteredData = [];
    this._sortConfig = { column: null, direction: null };
    this._filters = {};
    this._selectedRows = new Set();
    this._editingCell = null;
    this._loading = false;
    this._error = null;
  }

  // Хук жизненного цикла: компонент добавлен в DOM
  connectedCallback() {
    super.connectedCallback();

    if (this.dataUrl) {
      this._loadData();
    }

    if (this.lazyLoad) {
      this._attachScrollHandler();
    }
  }

  // Хук жизненного цикла: компонент удалён из DOM
  disconnectedCallback() {
    super.disconnectedCallback();
    this._detachScrollHandler();
  }

  // Хук: обновление компонента при изменении свойств
  updated(changedProperties) {
    if (changedProperties.has('data') || changedProperties.has('_filters')) {
      this._applyFilters();
    }

    if (changedProperties.has('_filteredData') || changedProperties.has('_sortConfig')) {
      this._applySort();
    }
  }

  // Главный метод рендера
  render() {
    const containerStyles = {
      height: this.height,
      maxHeight: this.maxHeight,
      width: this.width,
      maxWidth: this.maxWidth
    };

    return html`
      <div class="table-container ${this.stickyHeader ? 'sticky-header' : ''}" 
           style="${Object.entries(containerStyles)
        .filter(([_, value]) => value && value !== 'auto')
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ')}">
        ${this._loading ? this._renderLoading() : ''}
        ${this._error ? this._renderError() : ''}
        
        ${!this._loading && !this._error ? html`
          <div class="table-scroll-wrapper">
            <div class="table-wrapper">
              <table class="${this._getTableClasses()}">
                ${this._renderHeader()}
                ${this._renderBody()}
              </table>
            </div>
          </div>
          
          ${this._renderPagination()}
        ` : ''}
      </div>
    `;
  }

  // Рендер заголовка таблицы
  _renderHeader() {
    return html`
      <thead>
        <tr>
          ${this.selectable ? html`
            <th class="select-column">
              <input type="checkbox" 
                     @change=${this._handleSelectAll}
                     .checked=${this._isAllSelected()}>
            </th>
          ` : ''}
          
          ${this.columns.map(column => html`
            <th class="${this._getHeaderClass(column)}"
                @click=${() => this._handleSort(column.key)}>
              <div class="header-content">
                <span>${column.label}</span>
                ${this.sortable && column.sortable !== false ?
        this._renderSortIndicator(column.key) : ''}
              </div>
              ${this.filterable && column.filterable !== false ?
        this._renderFilter(column) : ''}
            </th>
          `)}
        </tr>
      </thead>
    `;
  }

  // Рендер тела таблицы
  _renderBody() {
    const pageData = this._getPageData();

    if (pageData.length === 0) {
      return html`
        <tbody>
          <tr>
            <td colspan="${this.columns.length + (this.selectable ? 1 : 0)}" 
                class="empty-message">
              Žádná data k zobrazení
            </td>
          </tr>
        </tbody>
      `;
    }

    return html`
      <tbody>
        ${pageData.map((row, index) => html`
          <tr class="${this._getRowClass(row, index)}"
              @click=${() => this._handleRowClick(row, index)}>
            ${this.selectable ? html`
              <td class="select-column">
                <input type="checkbox"
                       .checked=${this._selectedRows.has(index)}
                       @click=${(e) => e.stopPropagation()}
                       @change=${() => this._handleRowSelect(index)}>
              </td>
            ` : ''}
            
            ${this.columns.map(column => html`
              <td class="${this._getCellClass(column)}"
                  @dblclick=${() => this._handleCellEdit(row, column, index)}>
                ${this._renderCell(row, column, index)}
              </td>
            `)}
          </tr>
        `)}
      </tbody>
    `;
  }

  // Рендер отдельной ячейки
  _renderCell(row, column, rowIndex) {
    const value = row[column.key];
    const isEditing = this._editingCell?.rowIndex === rowIndex &&
      this._editingCell?.column === column.key;

    if (isEditing) {
      return this._renderCellEditor(value, column);
    }

    if (column.formatter) {
      return unsafeHTML(column.formatter(value, row));
    }

    return value ?? '';
  }

  // Рендер поля для редактирования ячейки
  _renderCellEditor(value, column) {
    const type = column.type || 'text';

    switch (type) {
      case 'number':
        return html`
          <input type="number" 
                 .value=${value}
                 @blur=${this._handleEditComplete}
                 @keydown=${this._handleEditKeydown}>
        `;
      case 'date':
        return html`
          <input type="date" 
                 .value=${value}
                 @blur=${this._handleEditComplete}
                 @keydown=${this._handleEditKeydown}>
        `;
      case 'select':
        return html`
          <select @blur=${this._handleEditComplete}
                  @keydown=${this._handleEditKeydown}>
            ${column.options?.map(option => html`
              <option value=${option.value} 
                      ?selected=${value === option.value}>
                ${option.label}
              </option>
            `)}
          </select>
        `;
      default:
        return html`
          <input type="text" 
                 .value=${value || ''}
                 @blur=${this._handleEditComplete}
                 @keydown=${this._handleEditKeydown}>
        `;
    }
  }

  // Рендер фильтра для столбца
  _renderFilter(column) {
    const type = column.type || 'text';

    return html`
      <div class="filter-row">
        ${type === 'select' ? html`
          <select @change=${(e) => this._handleFilter(column.key, e.target.value)}>
            <option value="">Vše</option>
            ${this._getUniqueValues(column.key).map(value => html`
              <option value=${value}>${value}</option>
            `)}
          </select>
        ` : html`
          <input type="text" 
                 placeholder="Filtr..."
                 @input=${(e) => this._handleFilter(column.key, e.target.value)}>
        `}
      </div>
    `;
  }

  // Рендер индикатора сортировки
  _renderSortIndicator(columnKey) {
    if (this._sortConfig.column !== columnKey) {
      return html`<span class="sort-indicator">↕</span>`;
    }

    return html`
      <span class="sort-indicator active">
        ${this._sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    `;
  }

  // Рендер пагинации
  _renderPagination() {
    const totalPages = Math.ceil(this._filteredData.length / this.pageSize) || 1; // Минимум 1 страница
    const totalItems = this._filteredData.length;
    const startItem = totalItems > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
    const endItem = Math.min(this.currentPage * this.pageSize, totalItems);

    // Убираем условие "if (totalPages <= 1) return '';" - теперь пагинатор всегда показывается

    return html`
      <div class="pagination">
        <button @click=${() => this._changePage(1)} 
                ?disabled=${this.currentPage === 1}>
          První
        </button>
        <button @click=${() => this._changePage(this.currentPage - 1)} 
                ?disabled=${this.currentPage === 1}>
          Předchozí
        </button>
        
        <span class="page-info">
          Stránka ${this.currentPage} z ${totalPages}
          ${totalItems > 0 ? html`
            <span class="items-info">
              (${startItem}-${endItem} z ${totalItems})
            </span>
          ` : ''}
        </span>
        
        <button @click=${() => this._changePage(this.currentPage + 1)} 
                ?disabled=${this.currentPage === totalPages}>
          Další
        </button>
        <button @click=${() => this._changePage(totalPages)} 
                ?disabled=${this.currentPage === totalPages}>
          Poslední
        </button>
        
        <select @change=${(e) => this._changePageSize(Number(e.target.value))}>
          ${this.pageSizes.map(size => html`
            <option value=${size} ?selected=${size === this.pageSize}>
              ${size} řádků
            </option>
          `)}
        </select>
      </div>
    `;
  }

  // Рендер состояния загрузки
  _renderLoading() {
    return html`
      <div class="loading-overlay">
        <div class="spinner"></div>
        <p>Načítání dat...</p>
      </div>
    `;
  }

  // Рендер ошибки
  _renderError() {
    return html`
      <div class="error-message">
        <p>Chyba: ${this._error}</p>
        <button @click=${this._retry}>Zkusit znovu</button>
      </div>
    `;
  }

  // Data handling methods
  // Загрузка данных с сервера
  async _loadData() {
    this._loading = true;
    this._error = null;

    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.data = Array.isArray(data) ? data : data.content || data.data || [];

      this.dispatchEvent(new CustomEvent('table-data-loaded', {
        detail: { data: this.data }
      }));
    } catch (error) {
      this._error = error.message;
      this.dispatchEvent(new CustomEvent('table-data-error', {
        detail: { error }
      }));
    } finally {
      this._loading = false;
    }
  }

  // Применение фильтров к данным
  _applyFilters() {
    if (Object.keys(this._filters).length === 0) {
      this._filteredData = [...this.data];
      return;
    }

    this._filteredData = this.data.filter(row => {
      return Object.entries(this._filters).every(([column, filterValue]) => {
        if (!filterValue) return true;

        const cellValue = String(row[column] || '').toLowerCase();
        const filter = String(filterValue).toLowerCase();

        return cellValue.includes(filter);
      });
    });
  }

  // Применение сортировки к данным
  _applySort() {
    if (!this._sortConfig.column) return;

    const { column, direction } = this._sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    this._filteredData.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      return aVal > bVal ? modifier : -modifier;
    });
  }

  // Получить данные для текущей страницы
  _getPageData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this._filteredData.slice(start, end);
  }

  // Event handlers
  // Обработчик сортировки по столбцу
  _handleSort(column) {
    if (!this.sortable) return;

    if (this._sortConfig.column === column) {
      if (this._sortConfig.direction === 'asc') {
        this._sortConfig = { column, direction: 'desc' };
      } else {
        this._sortConfig = { column: null, direction: null };
      }
    } else {
      this._sortConfig = { column, direction: 'asc' };
    }

    this.dispatchEvent(new CustomEvent('table-sort-changed', {
      detail: this._sortConfig
    }));
  }

  // Обработчик изменения фильтра
  _handleFilter(column, value) {
    if (value) {
      this._filters[column] = value;
    } else {
      delete this._filters[column];
    }

    this._filters = { ...this._filters };

    this.dispatchEvent(new CustomEvent('table-filter-changed', {
      detail: { filters: this._filters }
    }));
  }

  // Обработчик выбора строки
  _handleRowSelect(index) {
    if (this._selectedRows.has(index)) {
      this._selectedRows.delete(index);
    } else {
      this._selectedRows.add(index);
    }

    this._selectedRows = new Set(this._selectedRows);

    this.dispatchEvent(new CustomEvent('table-selection-changed', {
      detail: { selected: Array.from(this._selectedRows) }
    }));
  }

  // Обработчик выбора всех строк на странице
  _handleSelectAll(e) {
    if (e.target.checked) {
      const pageData = this._getPageData();
      pageData.forEach((_, index) => this._selectedRows.add(index));
    } else {
      this._selectedRows.clear();
    }

    this._selectedRows = new Set(this._selectedRows);
  }

  // Обработчик начала редактирования ячейки
  _handleCellEdit(row, column, rowIndex) {
    if (!this.editable || column.editable === false) return;

    this._editingCell = { rowIndex, column: column.key, originalValue: row[column.key] };

    this.updateComplete.then(() => {
      const input = this.shadowRoot.querySelector('input, select');
      if (input) {
        input.focus();
        if (input.select) input.select();
      }
    });
  }

  // Обработчик завершения редактирования ячейки
  _handleEditComplete(e) {
    const newValue = e.target.value;
    const { rowIndex, column, originalValue } = this._editingCell;

    if (newValue !== originalValue) {
      const row = this._getPageData()[rowIndex];
      row[column] = newValue;

      this.dispatchEvent(new CustomEvent('table-cell-edited', {
        detail: { rowIndex, column, oldValue: originalValue, newValue }
      }));
    }

    this._editingCell = null;
  }

  // Обработчик нажатия клавиш при редактировании
  _handleEditKeydown(e) {
    if (e.key === 'Escape') {
      this._editingCell = null;
    } else if (e.key === 'Enter') {
      e.target.blur();
    }
  }

  // Переключение страницы
  _changePage(page) {
    this.currentPage = page;
    this.dispatchEvent(new CustomEvent('table-page-changed', {
      detail: { page, pageSize: this.pageSize }
    }));
  }

  // Изменение размера страницы
  _changePageSize(size) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // Utility methods
  // Получить CSS-классы для таблицы
  _getTableClasses() {
    return [
      'table',
      this.striped && 'striped',
      this.bordered && 'bordered',
      this.hover && 'hover',
      this.dense && 'dense'
    ].filter(Boolean).join(' ');
  }

  // Получить CSS-классы для заголовка столбца
  _getHeaderClass(column) {
    return [
      'header-cell',
      this.sortable && column.sortable !== false && 'sortable',
      column.align && `align-${column.align}`
    ].filter(Boolean).join(' ');
  }

  // Получить CSS-классы для строки
  _getRowClass(row, index) {
    return [
      'table-row',
      this._selectedRows.has(index) && 'selected'
    ].filter(Boolean).join(' ');
  }

  // Получить CSS-классы для ячейки
  _getCellClass(column) {
    return [
      'table-cell',
      column.align && `align-${column.align}`,
      column.type && `type-${column.type}`
    ].filter(Boolean).join(' ');
  }

  // Проверка: все строки на странице выбраны?
  _isAllSelected() {
    const pageData = this._getPageData();
    return pageData.length > 0 &&
      pageData.every((_, index) => this._selectedRows.has(index));
  }

  // Получить уникальные значения для фильтрации
  _getUniqueValues(column) {
    const values = new Set();
    this.data.forEach(row => {
      if (row[column] != null) {
        values.add(row[column]);
      }
    });
    return Array.from(values);
  }

  // Повторная попытка загрузки данных
  _retry() {
    if (this.dataUrl) {
      this._loadData();
    }
  }

  // Подключить обработчик скролла для ленивой загрузки
  _attachScrollHandler() {
    // Implementation for lazy loading scroll handler
  }

  // Отключить обработчик скролла
  _detachScrollHandler() {
    // Clean up scroll handler
  }

  // Public API methods
  // Публичный метод: задать данные
  setData(data) {
    this.data = data;
  }

  // Публичный метод: добавить данные
  appendData(data) {
    this.data = [...this.data, ...data];
  }

  // Публичный метод: обновить строку
  updateRow(index, row) {
    this.data[index] = { ...this.data[index], ...row };
    this.requestUpdate();
  }

  // Публичный метод: удалить строку
  deleteRow(index) {
    this.data.splice(index, 1);
    this.requestUpdate();
  }

  // Публичный метод: установить фильтр
  setFilter(column, value) {
    this._handleFilter(column, value);
  }

  // Публичный метод: сбросить фильтры
  clearFilters() {
    this._filters = {};
  }

  // Публичный метод: сортировать
  sort(column, direction) {
    this._sortConfig = { column, direction };
  }

  // Публичный метод: выбрать строку
  selectRow(index) {
    this._selectedRows.add(index);
    this._selectedRows = new Set(this._selectedRows);
  }

  // Публичный метод: снять выбор строки
  deselectRow(index) {
    this._selectedRows.delete(index);
    this._selectedRows = new Set(this._selectedRows);
  }

  // Публичный метод: получить выбранные строки
  getSelectedRows() {
    return Array.from(this._selectedRows).map(index => this.data[index]);
  }

  // Публичный метод: обновить таблицу
  refresh() {
    if (this.dataUrl) {
      this._loadData();
    } else {
      this.requestUpdate();
    }
  }
}

customElements.define('my-table', MyTable);