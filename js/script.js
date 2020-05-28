function colorizeCells() {
var divTest=document.createElement('div');
document.body.appendChild(divTest);
var imgs=document.getElementsByTagName('img');
divTest.appendChild(imgs);
for(var i=0;i<imgs.length;i++){
    imgs[i].style('border: 1px solid black;');
}
}
colorizeCells();
