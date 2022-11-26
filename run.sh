BASEDIR=$(dirname "$0")
DAY=$(date +'%d')
FOLDER=$BASEDIR/Day$DAY/

mkdir $FOLDER
touch $FOLDER/input.txt
cp $BASEDIR/template/js_template.js $FOLDER/solution.js