echo server.sh params: $@
tar_name=$1;
project_name=$2
run_params=$3

echo_success(){
	echo -e "\033[1;32m $* \033[0m"
}

echo_error(){
    echo -e "\033[1;31m $* \033[0m"
}

if [ -s $tar_name ]; then
	echo_success $tar_name exists

	if [ -d work ]; then
		cd work
	else
		mkdir work
		cd work
	fi

	rm -rf $project_name
	tar -jxpf ../$tar_name

	if [ $? -eq 0 ]; then
		echo_success open $project_name success
		rm ../${project_name}_*.tar.bz2

		cd $project_name

		# echo init run params: $run_params
		OLD_IFS="$IFS"
		IFS="," 
		fly_params=($run_params)
		IFS="$OLD_IFS"
		# echo ./fly.sh will run with params: ${fly_params[@]}
		./fly.sh ${fly_params[@]}
		# >/dev/null 2>&1
		if [ $? -eq 0 ]; then
			echo_success server run $project_name success !
		else
			echo_error run ./fly.sh errror, please check!
		fi
	else
		echo_error open $project_name error!
	fi

else
	echo_error $tar_name not exists, server cannot run/update $project_name !
fi
