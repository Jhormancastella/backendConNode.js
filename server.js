const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5500;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Función helper para leer/escribir archivos JSON
const dataPath = path.join(__dirname, 'data');

async function readJSONFile(filename) {
    try {
        const data = await fs.readFile(path.join(dataPath, filename));
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe, retorna un array vacío
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeJSONFile(filename, data) {
    await fs.writeFile(
        path.join(dataPath, filename),
        JSON.stringify(data, null, 2)
    );
}

// Rutas para Jugadores
app.get('/api/jugadores', async (req, res) => {
    try {
        const jugadores = await readJSONFile('jugadores.json');
        res.json(jugadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});

app.post('/api/jugadores', async (req, res) => {
    try {
        const jugadores = await readJSONFile('jugadores.json');
        const nuevoJugador = {
            id: Date.now().toString(),
            ...req.body
        };
        jugadores.push(nuevoJugador);
        await writeJSONFile('jugadores.json', jugadores);
        res.json(nuevoJugador);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
});

// Rutas para Árbitros
app.get('/api/arbitros', async (req, res) => {
    try {
        const arbitros = await readJSONFile('arbitros.json');
        res.json(arbitros);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});

app.post('/api/arbitros', async (req, res) => {
    try {
        const arbitros = await readJSONFile('arbitros.json');
        const nuevoArbitro = {
            id: Date.now().toString(),
            ...req.body
        };
        arbitros.push(nuevoArbitro);
        await writeJSONFile('arbitros.json', arbitros);
        res.json(nuevoArbitro);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
});

// Rutas para Directivos
app.get('/api/directivos', async (req, res) => {
    try {
        const directivos = await readJSONFile('directivos.json');
        res.json(directivos);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});

app.post('/api/directivos', async (req, res) => {
    try {
        const directivos = await readJSONFile('directivos.json');
        const nuevoDirectivo = {
            id: Date.now().toString(),
            ...req.body
        };
        directivos.push(nuevoDirectivo);
        await writeJSONFile('directivos.json', directivos);
        res.json(nuevoDirectivo);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
});

// Rutas DELETE genéricas
app.delete('/api/:tipo/:id', async (req, res) => {
    try {
        const { tipo, id } = req.params;
        const filename = `${tipo}.json`;
        const items = await readJSONFile(filename);
        const filteredItems = items.filter(item => item.id !== id);
        await writeJSONFile(filename, filteredItems);
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.post('/api/:tipo', async (req, res) => {
    try {
        console.log('Tipo:', req.params.tipo); // Añadir este log
        console.log('Datos recibidos:', req.body); // Añadir este log
        
        const filename = `${req.params.tipo}.json`;
        const items = await readJSONFile(filename);
        const nuevoItem = {
            id: Date.now().toString(),
            ...req.body
        };
        
        console.log('Item a guardar:', nuevoItem); // Añadir este log
        
        items.push(nuevoItem);
        await writeJSONFile(filename, items);
        
        console.log('Guardado exitoso'); // Añadir este log
        res.json(nuevoItem);
    } catch (error) {
        console.error('Error en el servidor:', error); // Mejorar el log de error
        res.status(500).json({ error: 'Error al guardar los datos', details: error.message });
    }
});