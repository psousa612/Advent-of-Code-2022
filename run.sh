BASEDIR=$(dirname "$0")
DAY=$(date +'%d')
FOLDER=$BASEDIR/Day$DAY/

if test -e "$FOLDER"; then
  DAY=$(date -d '+1 day' +'%d')
  FOLDER=$BASEDIR/Day$DAY/
fi

if test -e "$FOLDER"; then
  echo 'nope bye'
  exit 1
fi

mkdir $FOLDER
touch $FOLDER/input.txt
cp $BASEDIR/template/js_template.js $FOLDER/solution.js