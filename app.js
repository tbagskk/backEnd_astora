import express from 'express';
import cors from 'cors'; 

const app = express();
const port = 8000;

app.use(express.json());

let notes = []; 

console.log('Initial notes:', notes);

app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type'], 
  }));

app.get('/', (req, res) => {
  res.send('Hello World!');
}
);

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.post('/notes', (req, res) => {
    const { title, content, date } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Titre et contenu requis' });
    }

    const newNote = {
        id: Date.now(),
        title,
        content,
        date: date || new Date().toISOString(),
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

app.put('/notes/:id', (req, res) => {
    const { title, content, date } = req.body;
    const id = parseInt(req.params.id);
  
    if (!title || !content) {
      return res.status(400).json({ error: 'Titre et contenu requis' });
    }
  
    const note = notes.find(n => n.id === id);
    if (!note) {
      return res.status(404).json({ error: 'Note introuvable' });
    }
  
    note.title = title;
    note.content = content;
    note.date = date || note.date;
  
    res.json(note);
  });

app.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    notes = notes.filter(n => n.id !== id);
    res.status(204).send();
});

app.get('/notes/search', (req, res) => {
    const keyword = req.query.keyword; 
    
    if (!keyword) {
        return res.status(400).json({ error: 'Le mot-clé est requis' });
    }
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(keyword.toLowerCase()) || 
        note.content.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json(filteredNotes);
});


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });