export class Operator {
    symbol!: string;
    name!: string;

    static readonly operators=[
        {symbol: '==', name: 'equal'},
        {symbol: '>', name: 'less'},
        {symbol: '<', name: 'grater'},
    ];
}
