#!/bin/bash

# This script:
# 1. Creates a clean git repository for your new React app
# 2. Create a new remote repository on github.com
# 3. Push the local repo from the current directory to the new remote
# 4. Creates a new Heroku project, opens the deployment page

# Setup New Git from exisiting repo
git init #initialize
git remote rm origin #remove reference to boilerplate github
git checkout --orphan temp-branch #switch to temporary branch
git add -A
git commit -m "clean commit"
git branch -D master #remove master
git branch -m master #rename current branch to master
git gc --aggressive --prune=all #clear old files
printf "\nCOMPLETE: Fresh git repository created\n\n"

# Get current directory name
CURRENTDIR=${PWD##*/}

# Get user input for project name, username, description, and choice for a
# private repository
echo "Enter username for new GitHub repo"
read USERNAME
echo "Enter name for new repo, or just <return> to make it $CURRENTDIR"
read REPONAME
echo "Enter description for your new repo, on one line, then <return>"
read DESCRIPTION
echo "Enter <return> to make the new repo public, 'x' for private"
read PRIVATE_ANSWER

if [ "$PRIVATE_ANSWER" == "x" ]; then
  PRIVACYWORD=private
  PRIVATE_TF=true
else
  PRIVACYWORD=public
  PRIVATE_TF=false
fi

REPONAME=${REPONAME:-${CURRENTDIR}}
USERNAME=${USERNAME}

echo "Will create a new $PRIVACYWORD repo named $REPONAME"
echo "on github.com in user account $USERNAME, with this description:"
echo $DESCRIPTION
echo "Type 'y' to proceed, any other character to cancel."
read OK
if [ "$OK" != "y" ]; then
  echo "User cancelled"
  exit
fi

# Create GitHub repo using the REST API
curl -u $USERNAME https://api.github.com/user/repos -d "{\"name\": \"$REPONAME\", \"description\": \"${DESCRIPTION}\", \"private\": $PRIVATE_TF}"
printf "\nCOMPLETE: New GitHub repository created\n\n"

# Replace README file with project specific README, update values
cp -f "$PWD/internals/README.md" "$PWD/README.md"
rm -rf "$PWD/internals/README.md"
sed -i "" -e "s/USERNAME/$USERNAME/g" "$PWD/README.md"
sed -i "" -e "s/APP_NAME/$REPONAME/g" "$PWD/README.md"
sed -i "" -e "s/APP_DESCRIPTION/$DESCRIPTION/g" "$PWD/README.md"

# Update Package.json with repo username, name and description
sed -i "" -e "s/USERNAME/$USERNAME/g" "$PWD/package.json"
sed -i "" -e "s/APP_NAME/$REPONAME/g" "$PWD/package.json"
sed -i "" -e "s/APP_DESCRIPTION/$DESCRIPTION/g" "$PWD/package.json"

# Update HTML template with repo name and description
sed -i "" -e "s/APP_NAME/$REPONAME/g" "$PWD/src/index.html"
sed -i "" -e "s/APP_DESCRIPTION/$DESCRIPTION/g" "$PWD/src/index.html"

# Update App Root code with username
sed -i "" -e "s/USERNAME/$USERNAME/g" "$PWD/src/js/containers/App.jsx"

printf "\nCOMPLETE: All files have been updated with the Application name, description, and username\n\n"

# Install Javascript modules required for both development and production
npm install
printf "\nCOMPLETE: installed node modules\n\n"

# Build & Bundle the Javascript and other assets into compresses static assets
npm run build
printf "\nCOMPLETE: built and bundled code\n\n"

# Commit all changes
git add .
git commit -m "initial setup"
printf "\nCOMPLETE: committed changes to git\n\n"

# Initialize the Heroku project
heroku login
HEROKU_OUTPUT=$(heroku apps:create --buildpack https://github.com/heroku/heroku-buildpack-nodejs.git --no-remote)
pattern="(https://([a-z0-9\-]+).herokuapp.com/)"
if [[ $HEROKU_OUTPUT =~ $pattern ]]
then
  heroku_url="${BASH_REMATCH[0]}"
  heroku_domain="${BASH_REMATCH[2]}"
  printf "\nCOMPLETE: heroku app created\n\n"
else
  echo "ERROR: there was an issue creating the heroku app"
fi

# Open newley created Heroku app, to the deployment page.
# User action required: Setup GitHub deployment hooks
echo "Opening heroku deployment page:"
echo "https://dashboard.heroku.com/apps/$heroku_domain/deploy/github"
printf "\nACTION ON PAGE:\n"
echo "1. Scroll to bottom, search for and then select $REPONAME"
echo "2. Click 'Enable Automatic Deploys'"
open "https://dashboard.heroku.com/apps/$heroku_domain/deploy/github"

# User Interaction Dialougue
echo "Have you setup the Heroku Github Deployment?"
echo "Type 'y' to proceed, any other character to cancel."
read OK
if [ "$OK" != "y" ]; then
  echo "User cancelled"
  exit
fi

# Set the newly created remote repo to the origin and push
git remote add origin https://github.com/$USERNAME/$REPONAME.git
git push -u origin master
printf "\nCOMPLETE: Pushed to GitHub, master branch, triggering a deployment\n"

# Force the program to sleep while the app deploys
printf "\n$REPONAME is being deployed.\n"
echo "Waiting 20 seconds for the Heroku build to *hopefully* finish..."
sleep 10
echo "10 more seconds..."
sleep 5
echo "5 more seconds..."
sleep 5

# Open Heroku App default domain for newly created app.
# Expected: App should be deployed and running
echo "Opening deployed app:"
echo "$heroku_url"
open $heroku_url

printf "\n'./internals/start.sh' has completed all setup functions.\n"
echo "Please delete this file immediatley."
echo "It will break many things if you attempt to use it again."
