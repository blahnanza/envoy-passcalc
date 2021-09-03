
const DEFAULT_REALM='enphaseenergy.com'

document.querySelector('#calculatorform').addEventListener('change', (event) =>
	{
		console.log("Form changed!")

        let serialNumber = document.querySelector('#serialNumber').value;
		let realm = document.querySelector('#realm').value;
		let username = document.querySelector('#username').value;
        console.log("Serial Number = " + serialNumber);
		console.log("Realm = " + realm);
		console.log("username = " + username);

        let generated = document.querySelector('#generated');

        if (serialNumber == '' || serialNumber == 'Serial Number' || username == '') {
            generated.value = 'Please input serial number and check username';
            return
        }
        
		let digest = getDigest(serialNumber, username, realm);

        let counters = countZeroesOnes(digest);        
        let countZero = counters[0];
        let countOne = counters[1];

        // Iterate over the last 8 characters of the digest in reverse to create the password.
        // No fancy slice operators in javascript?
        //
        console.log(digest);
        digestIterator = digestSnippet(digest);

        generated.value = getPassword(countZero, countOne, digestIterator);
        
	});


function getDigest(serialNumber, userName, realm) {
    // emupwGetPasswdForSn
    hashstring = '[e]' + userName + '@' + ((realm == '') ? DEFAULT_REALM : realm) + '#' + serialNumber + ' EnPhAsE eNeRgY ';
    console.log("Hashstring => " + hashstring);
    return CryptoJS.MD5(hashstring).toString(CryptoJS.enc.Hex);
}


function countZeroesOnes(inputString) {
    console.log("Count me! -> " + inputString);
    return inputString
        .split("")
        .reduce((accumulator, currentValue, currentIndex, array) => 
            {
                switch(currentValue){
                    case "0":
                        accumulator[0] += 1;
                        break;
                    case "1":
                        accumulator[1] += 1;
                        break;
                };
                return accumulator; 
            }, 
            [0, 0]);
}
    

function* digestSnippet(inputString) {

    let iterationCount = 0;
    let length = inputString.length;
    for ( i = length - 1; i > length - 9; i--) {
        yield inputString[i];
    }
    return iterationCount;
    
}


function getPassword(countZero, countOne, digestIterator) {
    let password = '';

    for (const cc of digestIterator) {
        if (countZero == 3 || countZero == 6 || countZero == 9) {
            countZero--;
        }
        if (countZero > 20) {
            countZero = 20;
        }
        if (countZero < 0) {
            countZero = 0;
        }

        if (countOne == 9 || countOne == 15) {
            countOne--;
        }
        if (countOne > 26) {
            countOne = 26;
        }
        if (countOne < 0) {
            countOne = 0;
        }

        switch(cc) {
            case "0":
                password += String.fromCharCode('f'.charCodeAt(0) + countZero);
                countZero--;
                break;
            case "1":
                password += String.fromCharCode('@'.charCodeAt(0) + countOne);
                countOne--;
                break;
            default:
                password += cc;
                break;
        }
    }
    return password;
}


