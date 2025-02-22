const express = require('express');
const app = express();
const port = 3000;

const assignments = [
  { id: 1, title: 'Unit 3 Social Media', deadline: '12.09 08:00' },
  { id: 2, title: 'Unit 2 My unforgettable trip', deadline: '11.15 10:08' },
  { id: 3, title: 'Unit 1 an unforgettable moment', deadline: '10.13 19:55' }
];

app.get('/assignments', (req, res) => {
  res.json(assignments);
});

app.get('/assignments/:id', (req, res) => {
  const assignment = assignments.find(a => a.id === parseInt(req.params.id));
  if (assignment) {
    res.json(assignment);
  } else {
    res.status(404).send('Assignment not found');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 