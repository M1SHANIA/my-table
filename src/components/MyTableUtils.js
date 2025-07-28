export function sortData(data, key, direction) {
    return [...data].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

export function filterData(data, filters) {
    return data.filter(row => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const cell = row[key]?.toString().toLowerCase() || '';
            return cell.includes(value.toLowerCase());
        });
    });
}
