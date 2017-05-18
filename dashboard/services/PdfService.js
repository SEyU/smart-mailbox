app.service('PdfService', ['$http', function ($http) {

    function buildTableBody(data, columns, columnas) {

        var body = [];
        body.push(columnas);

        data.forEach(function (row) {

            var dataRow = [];

            columns.forEach(function (column) {

                dataRow.push(row[column].toString());
            });

            body.push(dataRow);
        });

        return body;
    }

    this.table = function (data, columns, columnas) {

        return {

            table: {
                headerRows: 1,
                body: buildTableBody(data, columns, columnas)
            }
        };
    };

    this.imprimirTicket = function (articulos, pagos, numeroTicket) {

        var fecha = new Date();
        var precioTotal = 0;
        var filas = [];
        var columnas = [];
        columnas.push("Nombre del Articulo");
        columnas.push("Cantidad");
        columnas.push("PVP");
        columnas.push("Descuento");
        columnas.push("SubTotal");
        filas.push(columnas);

        for (var i = 0; i < articulos.length; i++) {

            columnas = [];
            columnas.push({text: articulos[i].nombre, bold: true});
            columnas.push(articulos[i].cantidad.toString());
            columnas.push(articulos[i].pvp + '€');
            columnas.push(articulos[i].descuento * 100 + '%');
            columnas.push(articulos[i].subtotal + '€');
            filas.push(columnas);
            precioTotal += parseFloat(articulos[i].subtotal);
        }

        var docDefinition = {

            content: [

                {text: 'Ticket de Compra', style: 'header'},
                {text: 'Serie/Número: '  + numeroTicket, style: 'mediano'},
                {text: 'Fecha Ticket: ' + fecha.toLocaleDateString(), style: 'mediano'},
                {text: ' '},
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body: filas
                    },
                    layout: 'headerLineOnly'
                },

                {text: 'Total Ticket:........ ' + (precioTotal) + '€', style: 'mediano'},
                {text: 'Todos los precios son con el 21% IVA', style: 'peque'}
            ],

            styles: {
                header: {
                    fontSize: 22,
                    bold: true
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                peque: {
                    fontSize: 6,
                    bold: true
                },
                mediano: {
                    fontSize: 12,
                    bold: true
                }
            }
        };

        pdfMake.createPdf(docDefinition).download('Ticket_'+ numeroTicket +'.pdf');
    };

    this.imprimirFactura = function (articulos, pagos, numeroFactura, clienteFactura) {

        var fecha = new Date();
        var precioTotal = 0;
        var filas = [];
        var columnas = [];
        columnas.push("Nombre del Articulo");
        columnas.push("Cantidad");
        columnas.push("Pvp");
        columnas.push("Descuento");
        columnas.push("SubTotal");
        filas.push(columnas);

        for (var i = 0; i < articulos.length; i++) {

            columnas = [];
            columnas.push({text: articulos[i].nombre, bold: true});
            columnas.push(articulos[i].cantidad.toString());
            columnas.push(articulos[i].pvp + '€');
            columnas.push(articulos[i].descuento * 100 +'%');
            columnas.push(articulos[i].subtotal + '€');
            filas.push(columnas);
            precioTotal += parseFloat(articulos[i].subtotal);
        }

        var docDefinition = {

            content: [
                {text: 'Factura de Compra', style: 'header'},
                {text: 'Serie/Número: '  + numeroFactura, style: 'mediano'},
                {text: 'Fecha Factura: ' + fecha.toLocaleDateString(), style: 'mediano'},
                {text: ' '},
                {
                    text: 'Cliente: ' + clienteFactura.nombreCliente + ', ' + clienteFactura.direccionCliente + ', ' +
                    clienteFactura.nif_cifCliente, style: 'peque'
                },
                {text: ' '},
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body: filas
                    },
                    layout: 'headerLineOnly'
                },
                {text: 'Base Imponible:..... ' + (precioTotal - (precioTotal * 0.21)) + '€', style: 'mediano'},
                {text: 'Cuota de Iva:......... ' + (precioTotal * 0.21) + '€', style: 'mediano'},
                {text: 'Total Factura:........ ' + (precioTotal) + '€', style: 'mediano'}
            ],

            styles: {
                header: {
                    fontSize: 22,
                    bold: true
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                peque: {
                    fontSize: 9,
                    bold: true
                },
                mediano: {
                    fontSize: 12,
                    bold: true
                }
            }
        };

        pdfMake.createPdf(docDefinition).download('Factura_' + numeroFactura + '.pdf');
    };
}]);