echo $@
git_url=$1
project_box_path=$2
project_path=$3
project_name=$4
tar_path=$5
tar_name=$6

cd $project_box_path
if [ -d $project_path ]; then
	echo update ...
	cd $project_path
	git pull origin master > /dev/null 2>&1
	if [ -s .gitmodules ]; then
		echo git has submodels,init and update submodels ...
		git submodule update --init --recursive > /dev/null 2>&1
	fi
else
	echo clone ...
	git clone $1 > /dev/null 2>&1
	cd $project_path
	if [ -s .gitmodules ]; then
		echo git has submodels, init and update submodels ...
		git submodule update --init --recursive > /dev/null 2>&1
	fi
fi
echo clone finished

echo tar project
cd $project_box_path
echo `ls`
tar -jcpf $tar_name $project_name
mv $tar_name $tar_path
echo tar project finished !