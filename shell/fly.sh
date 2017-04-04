
comand='node test.js'

echo fly.sh params: $@

OLD_IFS="$IFS"
IFS=" " 
fly_params=($@)
IFS="$OLD_IFS"
for set_s in ${fly_params[@]}
do
	echo 12 $set_s
	eval "$set_s"
done

echo 16 $env
echo 17 $action


comand="$@ $comand"
echo $comand
eval "$comand"
echo $?