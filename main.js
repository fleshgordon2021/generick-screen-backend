const {
  Client,
  logger,
  Variables,
} = require("camunda-external-task-client-js");
const { v4: uuidv4 } = require('uuid');

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
