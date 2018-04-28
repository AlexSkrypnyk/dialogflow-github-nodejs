'use strict';

const host = 'api.github.com';
const port = '443';
const ghUser = 'GITHUB_USER_NAME';
const ghToken = 'GITHUB_USER_TOKEN';
const ghDepLabel = 'dependencies';
const ghDepUser = 'dependencies[bot]';

const https = require('https');
process.env.DEBUG = 'dialogflow:debug';
exports.dialogflowFirebaseFulfillment = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let user = req.body.queryResult.parameters['user'];
  user = typeof user === 'object' ? user[0] : user;
  user = user.trim().replace(' ', '');

  let project = req.body.queryResult.parameters['project'];
  project = typeof project === 'object' ? project[0] : project;
  project = project.trim();

  if (!user || !project) {
    res.send(JSON.stringify({'fulfillmentText': 'both user and project are required'}));
    return;
  }

  callGitHubApi(user, project).then((output) => {
    res.send(JSON.stringify({'fulfillmentText': output}));
  }).catch((error) => {
    res.send(JSON.stringify({'fulfillmentText': error}));
  });
};

function callGitHubApi(user, project) {
  return new Promise((resolve, reject) => {
    let path = '/repos/' + user + '/' + project + '/pulls';
    console.log('API endpoint: ', host, path);

    let options = {
      host: host,
      path: path,
      port: port,
      headers: {
        'User-Agent': ghUser,
        'Authorization': 'token ' + ghToken
      }
    };

    https.get(options, (res) => {
      let body = '';
      res.on('data', (d) => {
        body += d;
      });
      res.on('end', () => {
        resolve(processResponse(JSON.parse(body)));
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}

function processResponse(response) {
  console.log('Response: ', response);
  let count = response.length;

  let titles = [];
  for (let i in response) {
    let t = response[i].title;
    if (isDependencyPr(response[i])) {
      t = t.trim();
      if (t.charAt(t.length - 1) === '.') {
        t = t.substring(0, t.length - 1) + ' (dependencies update).';
      } else {
        t += ' (dependencies update)';
      }
    }

    titles.push(t);
  }
  let prTitles = titles.join('... ');

  let output = '';
  if (count > 1) {
    output = `There are ${count} pull requests open and these are their titles: ${prTitles}`;
  }
  else {
    output = `There is 1 pull request titled ${prTitles}`;
  }

  return output;
}

function isDependencyPr(pr) {
  if (pr.user.login === ghDepUser) {
    return true;
  }

  for (let i in pr.labels) {
    if (pr.labels[i].name === ghDepLabel) {
      return true;
    }
  }
  return false;
}
