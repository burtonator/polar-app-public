# Doing a release

npm run-script clean
npx webpack
export POLAR_EXTENSION_TYPE=BETA
./dist.sh
