const {
  Client,
  logger,
  Variables,
} = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Workflow Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);
const express = require('express');
const parser = require('body-parser');
const app = express();
const EventEmmiter = require('events');
const Stream = new EventEmmiter();
let listSurveys = [
  {
    id:'243536235325',
    firstName: 'Mladen',
    lastName: 'Milic',
    phoneNumber: '+3810664432632',
    email: 'mlad@gmail.com',
    dateBirth: '1996-09-07',
    gender: 'male',
    addressStreet: 'Jove Ilica 15',
    city: 'Beograd',
    state: 'Srbija',
    postal: '11000',
    dateBuy: '2022-08-22',
    likeOurProducts: 'yes',
    productSccore: 4,
    experienceProducts: 'verySatisfied',
    longUsedProducts: 'sixMonthsOrMore',
    amount: 2000.00,
    reciveEmail: true,
    recomendFriends: true
  }
];
app.use(parser.json());
app.use(
  parser.urlencoded(
    {
      extended: true
    }
  )
);
app.get('/next-task', function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
     Connection: 'keep-alive'
  });
  Stream.on('push', function(event,data) {
    response.write('event:' + String(event) + '\n' + 'data: ' + JSON.stringify(data) + '\n\n' );
  });
  Stream.on('redirection', function(event,data) {
    response.write('event:' + String(event) + '\n' + 'data: ' + JSON.stringify(data) + '\n\n' );
  });
});

app.get('/surveys', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  res.send(
    listSurveys
  );
});

app.listen(3000);


client.subscribe("taskCreate", async ({ task, taskService }) => {
  const businessKey = task.variables.get("businessKey");
  const taskId = task.variables.get("taskId");

  Stream.emit('push', 'message', { messageType: 'create', businessKey: businessKey , taskId: taskId});
  await taskService.complete(task);
});

client.subscribe("redirectionTask", async ({ task, taskService }) => {
  const route = task.variables.get("route");  
  const businessKey = task.variables.get("businessKey");
  console.log('Route', route);
  Stream.emit('redirection', 'message', { messageType: 'redirection' , route: route, businessKey: businessKey });
  await taskService.complete(task);
});

client.subscribe("addSurvey", async ({ task, taskService }) => {
  const id = task.variables.get("businessKey");
  const firstName = task.variables.get("firstName");
  const lastName = task.variables.get("lastName");
  const phoneNumber = task.variables.get("phoneNumber");  
  const email = task.variables.get("email");
  const dateBirth = task.variables.get("dateBirth");
  const gender = task.variables.get("gender");
  const addressStreet = task.variables.get("addressStreet");
  const city = task.variables.get("city");
  const state = task.variables.get("state");
  const postal = task.variables.get("postal");
  const dateBuy = task.variables.get("dateBuy");
  const likeOurProducts = task.variables.get("likeOurProducts");
  const productSccore = task.variables.get("productSccore");
  const experienceProducts = task.variables.get("experienceProducts");
  const longUsedProducts = task.variables.get("longUsedProducts");
  const amount = task.variables.get("amount");
  const reciveEmail = task.variables.get("reciveEmail");
  const recomendFriends= task.variables.get("recomendFriends");
  const importantFeatures = task.variables.get("importantFeatures");
  const problemsWithOurProduct = task.variables.get("problemsWithOurProduct");
  const changeProducts = task.variables.get("changeProducts");

  const newSurvey = {
    'id':id,
    'firstName':firstName,
    'lastName':lastName,
    'phoneNumber':phoneNumber,
    'email': email,
    'dateBirth': dateBirth,
    'gender': gender,
    'addressStreet':addressStreet,
    'city':city,
    'state': state,
    'postal':postal,
    'dateBuy': dateBuy,
    'likeOurProducts': likeOurProducts,
    'productSccore': productSccore,
    'experienceProducts': experienceProducts,
    'longUsedProducts': longUsedProducts,
    'amount': amount,
    'reciveEmail': reciveEmail,
    'recomendFriends': recomendFriends,
    'importantFeatures': importantFeatures,
    'problemsWithOurProduct': problemsWithOurProduct,
    'changeProducts': changeProducts
  }
  console.log(newSurvey);
  listSurveys.push(newSurvey);

  await taskService.complete(task);
});

client.subscribe("deleteSurvey", async ({ task, taskService }) => {
  console.log('Start deleting');
  const id = task.variables.get("businessKey");
  console.log(id);
  console.log(listSurveys);
  listSurveys = listSurveys.filter(el => el.id !== id);
  console.log('AFTER FILTER',listSurveys);
  await taskService.complete(task);
});

client.subscribe("getSurvey", async ({ task, taskService }) => {
  const id = task.variables.get("businessKey");
  const current = listSurveys.find(el => el.id === id);
  const variables = new Variables().setAll({ result: JSON.stringify(current) });
  console.log('survey', variables);
  await taskService.complete(task, variables);
});

client.subscribe("updateSurvey", async ({ task, taskService }) => {
  const id = task.variables.get("businessKey");
  const firstName = task.variables.get("firstName");
  const lastName = task.variables.get("lastName");
  const phoneNumber = task.variables.get("phoneNumber");  
  const email = task.variables.get("email");
  const dateBirth = task.variables.get("dateBirth");
  const gender = task.variables.get("gender");
  const addressStreet = task.variables.get("addressStreet");
  const city = task.variables.get("city");
  const state = task.variables.get("state");
  const postal = task.variables.get("postal");
  const dateBuy = task.variables.get("dateBuy");
  const likeOurProducts = task.variables.get("likeOurProducts");
  const productSccore = task.variables.get("productSccore");
  const experienceProducts = task.variables.get("experienceProducts");
  const longUsedProducts = task.variables.get("longUsedProducts");
  const amount = task.variables.get("amount");
  const reciveEmail = task.variables.get("reciveEmail");
  const recomendFriends= task.variables.get("recomendFriends");
  const importantFeatures = task.variables.get("importantFeatures");
  const problemsWithOurProduct = task.variables.get("problemsWithOurProduct");
  const changeProducts = task.variables.get("changeProducts");
  
  const updatedSurvey = {
    'id':id,
    'firstName':firstName,
    'lastName':lastName,
    'phoneNumber':phoneNumber,
    'email': email,
    'dateBirth': dateBirth,
    'gender': gender,
    'addressStreet':addressStreet,
    'city':city,
    'state': state,
    'postal':postal,
    'dateBuy': dateBuy,
    'likeOurProducts': likeOurProducts,
    'productSccore': productSccore,
    'experienceProducts': experienceProducts,
    'longUsedProducts': longUsedProducts,
    'amount': amount,
    'reciveEmail': reciveEmail,
    'recomendFriends': recomendFriends,
    'importantFeatures': importantFeatures,
    'problemsWithOurProduct': problemsWithOurProduct,
    'changeProducts': changeProducts
  }
  const index = listSurveys.findIndex(el => el.id === id);
  listSurveys[index] = updatedSurvey;

  const variables = new Variables().setAll({ result: JSON.stringify(updatedSurvey) });

  await taskService.complete(task, variables);
});