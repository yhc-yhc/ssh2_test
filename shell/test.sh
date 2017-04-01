echo test.sh params: $@

run_params=$@

OLD_IFS="$IFS"
IFS=','
fly_params=($run_params)
IFS="$OLD_IFS"
echo ./fly.sh will run with params: ${fly_params[@]}

./test1.sh ${fly_params[@]}