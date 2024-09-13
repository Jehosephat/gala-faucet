     #!/usr/bin/env sh

     # abort on errors
     set -e

     # build
     npm run build

     # navigate into the build output directory
     cd dist

     # if you are deploying to a custom domain
     # echo 'www.example.com' > CNAME

     git init
     git add -A
     git commit -m 'deploy'

     # Use PAT for authentication
     git push -f https://${DEPLOY_PAT}@github.com/Jehosephat/gala-faucet.git master:gh-pages

     cd -