let http = new XMLHttpRequest();
let flag=1;
        function addToCart(event,i){
            event.preventDefault();
        if (flag==1){
            let a=document.getElementsByClassName("add")[i];
            a.innerHTML="Added to Cart &#10004;";
            a.style.backgroundColor="green";
            flag=0;
            // let input1 = document.getElementById('input1');
            // let input2 = document.getElementById('input2');
            // http.open('POST', 'http://localhost:3000/data', true);
            // http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // let requestBody = 'input1=' + encodeURIComponent(input1.value) + '&input2=' + encodeURIComponent(input2.value);
            // http.send(requestBody);
            const forms = document.getElementsByTagName('form');
            console.log(forms)
            const form = forms[i]; // Get the form based on index
            const formData = new FormData(form);
            const itemName = formData.get('itemName');
            const price = parseFloat(formData.get('price'));
            // console.log('Form Data:', formData);

            console.log(`Item Name: ${itemName}, Price: ${price}`);
            // Perform AJAX request or any other actions here
            // For example:
            fetch('/additem', {
                method: 'POST',
                body: new URLSearchParams(formData)

            }).then(response => {
                // Handle response
            }).catch(error => {
                // Handle error
            });





        }
        else{
            let a=document.getElementsByClassName("add")[i];
            a.innerHTML="Add To Cart";
            flag=1;
        }

    }

    // document.addEventListener('submit', function(event) {
    //     if (event.target.classList.contains('myForm')) {
    //         event.preventDefault(); // Prevent the default form submission
    //         let formData = new FormData(event.target);
    //         // You can process formData here based on the form that was submitted
    //         console.log(formData.get('field1')); // Example: Access form field value
    //     }
    // });
