type Field = { field: string };
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
        for (let i = 0, len = columns.length; i < len; i++) {
            this.columns.push({
                field: columns[i]
            });
        }

        this.rows = data.slice(1);
    }

    getColumn(col: number) {
        return this.columns[col];
    }

    getColumnCount() {
        return this.columns.length;
    }

    getRowCount() {
        return this.rows.length;
    }

    getRow(row: number) {
        return this.rows[row];
    }

    getValue(row: number, col: number) {
        if (row < 0 || col < 0) return null;

        let item = this.rows[row];
        if (item) {
            return item[col];
        }
        return null;
    }

    setValue(row: number, col: number, val) {
        if (row < 0 || col < 0) return;

        let item = this.rows[row];
        if (!item) {
            item = this.rows[row] = [];
        }
        item[col] = val;
    }

    /**
    * convert data rows to objects
    * @return {Object[]}
    */
    toJSON(): Object[] {
        let data = [];
        if (this.rows.length > 0) {
            for (let i = 0, len = this.rows.length; i < len; i++) {
                let row = {};
                for (let j = 0, jlen = this.columns.length; j < jlen; j++) {
                    row[this.columns[j].field] = this.rows[i][j];
                }
                data.push(row);
            }
        }
        return data;
    }
}
