import { Request, Response, Application } from 'express';
import { v4 as uuidv4 } from 'uuid';
import express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
import { IPuppy } from './types';
import { puppies } from './db';
require('dotenv').config();

const app: Application = express();
const options = { origin: 'http://localhost:3000' };

app.use(cors(options));
app.use(express.json());

app.get('/api/test', (_req: Request, res: Response) => {
  return res.status(200).json({ test: 'is working as it should' });
});

app.get('/api/puppies', (_req: Request, res: Response) => {
  return res.status(200).json(puppies);
});

app.get('/api/puppies/:id', (req: Request, res: Response) => {
  const puppy: IPuppy | undefined = puppies.find(puppy => puppy.id === req.params.id);
  if (!puppy) {
    return res.status(404).send({message: 'Puppy not found'});
  }
  return res.status(200).json(puppy);
});

app.post('/api/puppies', async (req: Request, res: Response) => {
  let url = ''
  if (!req.body.breed) {
    req.body.breed = 'cat';
  }
  try {
    url = await fetch(`https://api.unsplash.com/photos/random?query=${req.body.breed}&client_id=${process.env.API_KEY}`)
      .then( (response: any) => response.json() )
      .then( (data:any) => data.urls.regular );
   } catch (error) {
      url = 'https://media.licdn.com/dms/image/C5612AQEPYce5KpNLyg/article-cover_image-shrink_720_1280/0/1551659700811?e=1678924800&v=beta&t=SwwpRDk2nez4mC4oBDGXdf8AtJhmu7ljFDj4i7dKtTs'
   }

  const newPuppy: IPuppy = {
    id: uuidv4(),
    ...req.body,
    url: url,
  }
  puppies.unshift(newPuppy);
  return res.status(201).json(newPuppy);
});

app.put('/api/puppies/:id', (req: Request, res: Response) => {
  const puppy: IPuppy | undefined = puppies.find(puppy => puppy.id === req.params.id);
  if (!puppy) {
    return res.status(404).send({message: 'Puppy not found'});
  }
  puppy.name = req.body.name;
  puppy.breed = req.body.breed;
  puppy.birthDate = req.body.birthDate;

  return res.status(204).setHeader('location', `/api/puppies/${puppy.id}`).send();
});

app.delete('/api/puppies/:id', (req: Request, res: Response) => {
  const puppy: IPuppy | undefined = puppies.find(puppy => puppy.id === req.params.id);
  if (!puppy) {
    return res.status(404).send({message: 'Puppy not found'});
  }
  if (puppy) {
    const index = puppies.findIndex(puppy => puppy.id === req.params.id);
    puppies.splice(index, 1);
  }
  return res.status(204).end();
});

export default app;
