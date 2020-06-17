const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes
  }

  repositories.push(repository);

  return response.status(201).send(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repoId = repositories.findIndex(repo => repo.id == id);

  if (repoId == -1) return response.status(400).send({ message: 'Repository not found! '});

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoId].likes
  };
  
  repositories[repoId] = repository;

  return response.status(200).send(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repoId = repositories.findIndex(repo => repo.id == id);

  if (repoId == -1) return response.status(400).send({ message: 'Repository not found! '});

  repositories.splice(repoId, 1);

  return response.status(204).send({ id: id });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repoId = repositories.findIndex(repo => repo.id == id);

  if (repoId == -1) return response.status(400).send({ message: 'Repository not found! '});

  repositories[repoId].likes += 1;

  return response.status(200).send(repositories[repoId]);
});

module.exports = app;
