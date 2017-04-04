echo pull_init_tar.sh params: $@
git_url=$1
project_box_path=$2
project_path=$3
project_name=$4
tar_path=$5
branch_name=""
tar_name=""

echo_success(){
	echo -e "\033[1;32m $* \033[0m"
}

echo_error(){
    echo -e "\033[1;31m $* \033[0m"
}

cd $project_box_path
if [ -d $project_path ]; then
	rm -rf $project_name
fi

echo downloading the $project_name ...
git clone $git_url > /dev/null 2>&1

if [ $? -eq 0 ]; then
	echo_success $project_name download success .
	
	cd $project_path
	branch_name=`git rev-parse --short HEAD`
	tar_name="${project_name}_${branch_name}.tar.bz2"
	if [ -s .gitmodules ]; then

		echo git has submodels, init and update submodels ...
		git submodule update --init --recursive > /dev/null 2>&1
		if [ $? -eq 0 ]; then
			echo_success init submodels success .
		else
			echo_error init submodels error .
		fi
	fi

	cd $project_box_path
	if [ -d $project_name ]; then
		tar -jcpf $tar_name $project_name
		if [ $? -eq 0 ]; then
			echo_success tar $project_name success ...
			rm $tar_path/$project_name*
			mv $tar_name $tar_path
			echo $tar_name
		else
			echo_error tar $project_name failed !
			exit 1
		fi
	else
		echo_error $project_name not exists!
		exit 1
	fi
else
	echo_error download $project_name error !
	exit 1
fi