function decreaseQuantity(x){
    let cur=document.getElementsByClassName("addeditem")[x].innerHTML
    if(cur==1){
        alert("item deleted");
    }
    else{
    let cur=document.getElementsByClassName("addeditem")[x].innerHTML;
    let cur2=parseInt(cur);
    document.getElementsByClassName("addeditem")[x].innerHTML=cur2-1;
    let val=document.getElementsByClassName("itemdetails")[x].innerHTML;
    let val1=parseInt(val);
    document.getElementsByClassName("itemdetails")[x+1].innerHTML=(val1*(cur2-1)).toFixed(2);
    }
}
function increaseQuantity(x){
    let cur=document.getElementsByClassName("addeditem")[x].innerHTML;
    let cur2=parseInt(cur);
    document.getElementsByClassName("addeditem")[x].innerHTML=cur2+1;
    let val=document.getElementsByClassName("itemdetails")[x].innerHTML;
    let val1=parseInt(val);
    document.getElementsByClassName("itemdetails")[x+1].innerHTML=(val1*(cur2+1)).toFixed(2);
}
function addtocart(name,quantity,price){
    let mytable=document.getElementById("mytable");
    var rows = mytable.rows.length;  
    let r=mytable.insertRow(rows);
    let c1 = r.insertCell(0);  
    let c2 = r.insertCell(1);  
    let c3 = r.insertCell(2);  
    let itemname = name;  
    let itemquant = quantity;  
    let itemprice = price;  
    c1.innerHTML=itemname;  
    c2.innerHTML=itemquant
    c3.innerHTML=itemprice; 
}

