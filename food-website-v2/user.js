// Your Ajax code here (in user.js)
let http = new XMLHttpRequest();
http.onload = function() {
    console.log('hello')
        const userData = http.responseText;
        console.log(userData);
        // Update DOM with received data
        const userDataContainer = document.getElementById('details');
        userDataContainer.innerHTML = userData;
    
};
http.open('GET', 'http://localhost:5000/getdeets', true);
http.send();
