import ajax from 'jquery';

let personnelData = [];

const readAllPersonnel = () => {

    ajax({
        url: "../project2/libs/php/readAllPersonnel.php",
        type: "POST",
        dataType: 'json',
        success: function(result) {
			for (let i = 0; i < result.length; i++) {
				personnelData[i] = result[i];
			}
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
};

readAllPersonnel();

var fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-MediumItalic.ttf'
	}
};

import PdfPrinter from 'pdfmake';
var printer = new PdfPrinter(fonts);
import { createWriteStream } from 'fs';

var docDefinition = {
	content: [
		{ text: 'Company Directory', style: 'header' },
		{
			style: 'tableExample',
			table: {
				body: personnelData
			}
		}
	],
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15]
		},
		tableOpacityExample: {
			margin: [0, 5, 0, 15],
			fillColor: 'blue',
			fillOpacity: 0.3
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		}
	},
	defaultStyle: {
		// alignment: 'justify'
	}
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(createWriteStream('pdfs/tables.pdf'));
pdfDoc.end();