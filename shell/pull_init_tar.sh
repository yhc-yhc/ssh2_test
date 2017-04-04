echo pull_init_tar.sh params: $@
git_url=$1
project_box_path=$2
project_path=$3
project_name=$4
tar_path=$5
tar_name=$6

echo_success(){
	echo -e "\033[1;32m $* \033[0m"
}

echo_error(){
    echo -e "\033[1;31m $* \033[0m"
}

cd $project_box_path
if [ -d $project_path ]; then
	echo $project_name exists, update ...
	cd $project_path
	git pull origin master > /dev/null 2>&1
	if [ -s .gitmodules ]; then
		echo git has submodels,init and update submodels ...
		git submodule update --init --recursive > /dev/null 2>&1
	fi
else
	echo $project_name not exists, clone from $git_url ...
	git clone $1 > /dev/null 2>&1
	cd $project_path
	if [ -s .gitmodules ]; then
		echo git has submodels, init and update submodels ...
		git submodule update --init --recursive > /dev/null 2>&1
	fi
fi
echo download or update result $?

if [ $? -eq 0 ]; then
	echo_success $project_name download/update finished ...
	echo tar $project_name
	cd $project_box_path
	if [ -d $project_name ]; then
		tar -jcpf $tar_name $project_name
		if [ $? -eq 0 ]; then
			echo_success tar $project_name success ...
			mv $tar_name $tar_path
		else
			echo_error tar $project_name failed !
		fi
	else
		echo_error download $project_name failed!
	fi
else
	echo_error download or update error.
fi