
comand='node test.js'

echo fly.sh params: $@
comand="$@ $comand"
echo $comand
eval "$comand"
echo $?