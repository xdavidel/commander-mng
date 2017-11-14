
function similarFileNames(file1, file2) {
    let length = file1.legnth - file2.length > 0 ? file2.length : file1.length;


    let errors = 0;

    for (let i = 0; i < length; i++) {
        if (file1[i] != file2[i]) {
            errors += 1;
        }
    }

    return errors;
}

function prefixOf(prefix, str) {
    return str.indexOf(prefix) >= 0;
}

module.exports = {
    similarFileNames,
    prefixOf
}