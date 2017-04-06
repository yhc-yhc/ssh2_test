process.argv.forEach(function (val, index) {
    console.log(index + ': ' + val);
});

console.log(process.argv[2]);