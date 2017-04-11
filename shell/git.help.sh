# cmd=`git log --pretty=format:"%H" -n 1`
# echo $cmd

cmd1=`git log --pretty=format:"%h" -n 1`
echo $cmd1

git rev-parse --short HEAD
