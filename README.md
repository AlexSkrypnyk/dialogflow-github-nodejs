# Dialogflow Fulfillment for GitHub integration
Proof of concept. 

## Features
1. Reads-out titles of open pull requests for specified user and project
    ```
    Talk to my test app about check pull requests for user consolidation and project robo
    ```
2. Adds `(dependencies update)` if the PR was opened by dependencies.io bot OR has `dependenies` label. 

## Setup: Dialogflow Agent
 1. Create an account on Dialogflow
 1. Create a new Dialogflow agent
 1. Restore the `dialogflow-agent.zip` ZIP file in the root of this repo
   1. Go to your agent's settings and then the *Export and Import* tab
   1. Click the *Restore from ZIP* button
   1. Select the `dialogflow-agent.zip` ZIP file in the root of this repo
   1. Type *RESTORE* and and click the *Restore* button

## Setup: Fulfillment
1. Replace `GITHUB_USER_NAME` and `GITHUB_USER_TOKEN`. 
    - `GITHUB_USER_NAME` - the name of the GitHub user who will be querying GitHub API.
    - `GITHUB_USER_TOKEN` - the token of the user to overcome GitHub API limit.
2. Paste contents of `index.js` into Dialogflow Inline Editor.
3. Click `Deploy`
   
### Caveats
1. You may need to select Blaze Plan (pay as you go) to allow Firebase to query GitHub as it is considered to be an external resource.   
