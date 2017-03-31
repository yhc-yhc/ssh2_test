echo server.sh params: $@
tar_name=$1;
project_name=$2

if [ -d work ]; then
	cd work
else
	mkdir work
	cd work
fi

tar -jxpf ../$tar_name

if [ $? -eq 0 ]; then
	echo 'translate success'
	rm ../$tar_name
else
	echo 'tar -jxpf error'
fi

cd $project_name
echo `ls`
./run.sh test >/dev/null 2>&1

echo server run finished!
