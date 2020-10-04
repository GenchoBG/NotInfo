export const isIncluded = (arr, elName, elValue) => {
    const length = arr.length;
    for (let i = 0; i < length; i++) {
        if (arr[i][elName] == elValue) {
            return true;
        }
    }
    return false;
}
