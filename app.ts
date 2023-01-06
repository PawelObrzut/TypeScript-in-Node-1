import express = require('express');
import { Request, Response, Application } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { IPuppy } from './types';
import { puppies } from './db';
const cors = require('cors');

const app: Application = express();
const options = { origin: 'http://localhost:3000' }
app.use(cors(options))

app.use(express.json());

app.get('/api/test', (_req: Request, res: Response) => {
  return res.status(200).json({ test: 'is working as it should' });
});

app.get('/api/puppies', (_req: Request, res: Response) => {
  return res.status(200).json(puppies);
});

app.get('/api/puppies/:id', (req: Request, res: Response) => {
  const puppy: IPuppy | undefined = puppies.find(puppy => puppy.id === Number(req.params.id));
  if (!puppy) {
    return res.status(404).send({message: 'Puppy not found'});
  }
  return res.status(200).json(puppy);
});

app.post('/api/puppies', (req: Request, res: Response) => {
  const newPuppy: IPuppy = {
    id: uuidv4(),
    ...req.body
  }
  puppies.push(newPuppy);
  return res.status(201).json(newPuppy);
});

app.put('/api/puppies/:id', (req: Request, res: Response) => {
  const puppy: IPuppy | undefined = puppies.find(puppy => puppy.id === Number(req.params.id));
  if (!puppy) {
    return res.status(404).send({message: 'Puppy not found'});
  }
  puppy.name = req.body.name;
  puppy.breed = req.body.breed;
  puppy.birthDate = req.body.birthDate;

  return res.status(204).setHeader('location', `/api/puppies/${puppy.id}`).send();
});

app.delete('/api/puppies/:id', (req: Request, res: Response) => {
  const puppy: IPuppy | undefined = puppies.find(puppy => puppy.id === Number(req.params.id));
  if (!puppy) {
    return res.status(404).send({message: 'Puppy not found'});
  }
  if (puppy) {
    const index = puppies.findIndex(puppy => puppy.id === Number(req.params.id));
    puppies.splice(index, 1);
  }
  return res.status(204).end();
});

export default app;
