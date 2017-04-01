
comand='node test.js'

echo test1.sh params: $@
comand="$@ $comand"
echo $comand
eval "$comand"
echo $?