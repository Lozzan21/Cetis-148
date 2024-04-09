const express = require('express');
const PDFDocument = require('pdfkit-table');
const fs = require('fs'); // Importar el módulo fs
const router = express.Router();

// Ruta para generar el PDF
router.get('/generar-pdf', async (req, res) => {
    const fecha = new Date(req.query.fecha);
    const doc = new PDFDocument();
    fecha.setDate(fecha.getDate() + 1);

    // Formatear la fecha
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-MX', options);

    // Establecer el tipo de contenido en la respuesta HTTP
    res.setHeader('Content-Type', 'application/pdf');

    // Adjuntar el documento PDF a la respuesta HTTP para descargarlo
    doc.pipe(res);

// Agregar imagen de encabezado si existe
const imgPath = 'img/Membrete.jpg';
if (fs.existsSync(imgPath)) {
    doc.image(imgPath, {
        fit: [250, 250],
        align: 'center',
        // Ajustar las coordenadas y para posicionar el encabezado más arriba
        y: 50  // Puedes ajustar este valor según tus necesidades
    });
        doc.moveDown(2); 
    }     

    // Agregar contenido al documento PDF
    doc.font('Helvetica-Bold').fontSize(12).text('ÁREA: SERVICIOS DOCENTES \n OFICIO No. 220 (CE-148)946/2024', {
        align: 'right'
    });
    doc.fontSize(12).text(`ASUNTO: ${req.query.asunto}`,{
        align: 'right'
    });

    doc.fontSize(12).text(`Durango, Dgo., ${fechaFormateada}`,{
        align: 'right'});

    doc.moveDown(2);
    doc.fontSize(12).text(`${req.query.maestro} \nDOCENTE DEL PLANTEL`);
    doc.moveDown(4);
    doc.fontSize(12).text(`${req.query.texto}`);
    doc.moveDown(2);

    // Verificar si se proporcionan datos para la tabla
    if (req.query.numRows && req.query.numCols) {
        // Obtener el número de filas y columnas de la tabla desde la solicitud
        const numRows = parseInt(req.query.numRows) || 3; // Valor predeterminado de 3 filas si no se proporciona
        const numCols = parseInt(req.query.numCols) || 3; // Valor predeterminado de 3 columnas si no se proporciona

        // Obtener los títulos de las columnas desde la solicitud
        const columnTitles = [];
        for (let j = 0; j < numCols; j++) {
            const tituloColumna = req.query[`titulo_columna_${j}`] || `Columna ${j + 1}`; // Usar un título predeterminado si no se proporciona
            columnTitles.push(tituloColumna);
        }
        // Construir la estructura de la tabla dinámicamente
        const tableContent = [];
        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < numCols; j++) {
                const cellContent = req.query[`contenido_${i}_${j}`] || ''; // Obtener el contenido de la celda desde la solicitud
                row.push(cellContent);
            }
            tableContent.push(row);
        }

        const table = {
            headers: columnTitles, // Usar los títulos de las columnas proporcionados por el usuario
            rows: tableContent,
        };

        // Agregar la tabla al documento
        try {
            await doc.table(table, {
                // Opciones de estilo de la tabla
                prepareHeader: () => doc.font('Helvetica-Bold').fill('black'), // Texto en negrita y negro
                prepareRow: () => doc.font('Helvetica').fill('black'), // Texto normal y negro
                drawHorizontalLine: (row, y) => row > 0, // Dibujar líneas horizontales en todas las filas excepto la primera
                drawVerticalLine: (column, x) => column > 0, // Dibujar líneas verticales en todas las columnas excepto la primera
            });
        } catch (error) {
            console.error('Error al crear la tabla:', error);
        }
    }

    doc.moveDown(15);
    doc.font('Helvetica-Bold').fontSize(12)
    .text('ATENTAMENTE.', 70, 480)
    .text('M.T.I. JOEL VÀZQUEZ RÌOS', 70, 580)
    .text('JEFE DEL DEPARTAMENTO', 70, 595)    
    .text('DE SERVICIOS DOCENTES', 70, 610);   

const alturaPagina = doc.page.height;

// Agregar el pie de página
const posicionPieDePaginaY = alturaPagina - 100; 
doc.image('img/Membrete-bj.jpg', { x: 0, y: posicionPieDePaginaY, width: 550, height: 70 });


    // Finalizar y enviar el documento PDF
    doc.end();
});

module.exports = router;
