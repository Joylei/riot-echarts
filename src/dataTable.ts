type Field = { name: string };
/**
* Wrap data array for convinient operations.
* the first line of the array is columns,
* and the rest lines are data rows
*/
export default class DataTable {
    columns: Field[];
    rows: any[][];
    /**
    * @param {Object[][]} data the first line of the array is columns,and the rest lines are data rows
    */
    constructor(data: any[][]) {
        data = data || [];

        this.columns = [];
        let columns = data[0] || [];
        columns.forEach(item => this.columns.push({ name: item }))
        this.rows = data.slice(1);
    }

    getColumn(col: number) {
        return this.columns[col];
    }

    get columnCount() {
        return this.columns.length;
    }

    get rowCount() {
        return this.rows.length;
    }

    getRow(row: number) {
        return this.rows[row];
    }

    getValue(row: number, col: number) {
        if (row < 0 || col < 0) return null;

        const item = this.rows[row];
        return item ? item[col] : null;
    }

    setValue(row: number, col: number, val) {
        if (row < 0 || col < 0) return;

        const item = this.rows[row] || (this.rows[row] = []);
        item[col] = val;
    }

    /**
    * convert data rows to objects
    * @return {Object[]}
    */
    toJSON(): Object[] {
        return this.rows.map(row => {
            const item = {};
            this.columns.forEach((col, index) => item[col.name] = row[index])
            return item;
        });
    }
}
