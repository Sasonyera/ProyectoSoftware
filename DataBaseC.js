const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Asegúrate de que este puerto no esté en uso

// Middleware
app.use(bodyParser.json());

// Habilitar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// Crear conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'elares',
    password: '',
    database: 'tecnoinnovadores'
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos.');
});

// Endpoint para guardar datos
app.post('/guardarDatos', (req, res) => {
    const { nombre, profesion, telefono, correo, linkedIn, habilidades } = req.body;
    const postulanteQuery = 'INSERT INTO postulantes (nombre, profesion, telefono, correo, linkedIn) VALUES (?, ?, ?, ?, ?)';
    const postulanteValues = [nombre, profesion, telefono, correo, linkedIn];

    db.query(postulanteQuery, postulanteValues, (err, result) => {
        if (err) {
            console.error('Error al guardar los datos del postulante:', err);
            res.status(500).send('Error al guardar los datos del postulante');
            return;
        }

        const postulanteId = result.insertId; // Obtener el ID del postulante recién insertado
        console.log('Postulante ID:', postulanteId); // Debug: Verificar el ID del postulante

        if (!habilidades || habilidades.length === 0) {
            console.warn('No se recibieron habilidades técnicas');
            res.status(200).send('Datos guardados exitosamente (sin habilidades técnicas)');
            return;
        }

        // Insertar habilidades técnicas en la tabla asociativa
        const habilidadesQueries = habilidades.map(habilidadId => {
            return new Promise((resolve, reject) => {
                const habilidadQuery = 'INSERT INTO postulantes_habilidades (postulante_id, habilidad_id) VALUES (?, ?)';
                db.query(habilidadQuery, [postulanteId, habilidadId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        // Ejecutar todas las inserciones de habilidades en paralelo
        Promise.all(habilidadesQueries)
            .then(() => {
                res.status(200).send('Datos guardados exitosamente');
            })
            .catch(err => {
                console.error('Error al guardar las habilidades:', err);
                res.status(500).send('Error al guardar las habilidades');
            });
    });
});


// Endpoint para obtener datos
app.get('/obtenerDatos', (req, res) => {
    const postulanteQuery = 'SELECT * FROM postulantes ORDER BY id DESC LIMIT 1';

    db.query(postulanteQuery, (err, postulanteResults) => {
        if (err) {
            console.error('Error al obtener los datos del postulante:', err);
            res.status(500).send('Error al obtener los datos del postulante');
            return;
        }

        const postulante = postulanteResults[0];
        if (!postulante) {
            res.status(404).send('No se encontraron datos del postulante');
            return;
        }

        const habilidadesQuery = `
            SELECT ht.habilidad 
            FROM habilidadestecnicas ht
            JOIN postulantes_habilidades ph ON ht.id = ph.habilidad_id
            WHERE ph.postulante_id = ?
        `;
        
        db.query(habilidadesQuery, [postulante.id], (err, habilidadesResults) => {
            if (err) {
                console.error('Error al obtener las habilidades:', err);
                res.status(500).send('Error al obtener las habilidades');
                return;
            }

            postulante.habilidades = habilidadesResults.map(result => result.habilidad);
            console.log(postulante.habilidades);
            res.status(200).json(postulante);
        });
    });
});


app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
