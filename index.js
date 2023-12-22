
const svg=document.querySelector("#svgContainer") 


// export ca format SVG
function saveToSVG() {
    const svgData = new XMLSerializer().serializeToString(svgContainer);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "desen.svg";
    link.click();
  }




let shape="line" 
let shapes=document.getElementsByClassName("shape")

//aceasta functie permite alegerea diferitelor forme din tools
for(let i=0;i<shapes.length;i++){
    shapes[i].addEventListener('click',function(){
        shape=shapes[i].id
    })
    
}


let color=document.getElementById("color"), newColor='black', fillColor='black' //initial color of the shape

//event listener pentru schibarea culorii
color.addEventListener('input',function(){
    newColor=color.value
    fillColor=color.value
})


//accesare valoare grosime linie
let thickness=document.getElementById("size"), newsize=3
thickness.addEventListener('input',function(){
    newsize=thickness.value
})




    
let drawn=[]

let btnUndo=document.getElementById('undo');
let btnRedo=document.getElementById('redo');



//button de undo
btnUndo.addEventListener('click',function(){ 
        drawn.push(svg.lastElementChild)      
        svg.removeChild(svg.lastElementChild)
    })


//buton de redo
btnRedo.addEventListener('click',function(){
    if(drawn.length>1){    
        svg.appendChild(drawn[drawn.length-1]) //ultimul copil din SVG va fi la inceput si astfel ultimul va fi sters va fi primul eliminat
        // console.log(drawn.length)
    }else{
        svg.appendChild(drawn[drawn.length-1])//cazul in care se da comanda de redo la ultimul dintre elementele svg-ului
    }        
    drawn.length--

})



//tools pentru umplere sau stergere la apasarea figurilor din SVG
function editing(shape){
    shape.addEventListener('click',(e)=>{
        if(!(document.getElementById('edit'))){

            //crerea div-ului unde vor fi adaugate butoanele de stergere si umplere
            let divEdit=document.createElement("div")
            divEdit.id="edit"
            document.getElementById("tools").appendChild(divEdit)

            //crearea butonului de delete in DOM
            let btnDelete=document.createElement("button")
            btnDelete.innerHTML= '<img id="deleteImg" src="./media/trashcan.gif"/>'
            btnDelete.id="delete"

            //crearea butonului de umplere in DOM
            let btnEdit=document.createElement("button")
            btnEdit.innerHTML= '<img id="fillImg" src="./media/bucket.png"/>'
            btnEdit.id="fill"

            document.getElementById("edit").appendChild(btnEdit)
            document.getElementById("edit").appendChild(btnDelete)

            //optiune de stergere a figurilor
            btnDelete.addEventListener('click',function(){
                svg.removeChild(e.target)
                document.getElementById("tools").removeChild(divEdit) //butonul de delete va disparea dupa stergerea figurii din svg
            })

            //optiune de umplere a figurilor
            btnEdit.addEventListener('click',function(){
                    //doar ce este selectat va fi umplut
                    e.target.addEventListener('click',function(){
                        if(e.target.tagName==='line'){
                            e.target.style.stroke=fillColor
                        }else{
                            e.target.style.fill=fillColor
                        }
                        document.getElementById("tools").removeChild(divEdit) //butonul de umplere va disparea dupa umplere


                    })
                
            })
            
        }
    })
}

const svgPoint=(svg,x,y)=>{
    const svgPoint=new DOMPoint(x,y)
    svgPoint.x=x
    svgPoint.y=y
    return svgPoint.matrixTransform(svg.getScreenCTM().inverse())
}

let drawnLines=[]

//event listener pentru alegerea figuri de catre user pentru a desena
svg.addEventListener('mousedown',(e)=>{
    let shapes=document.createElementNS("http://www.w3.org/2000/svg", shape)
    let start= svgPoint(svg,e.clientX,e.clientY)



    switch (shape) {
        case "line":
            const drawLine=(event)=>{
                let p=svgPoint(svg,event.clientX,event.clientY)
                

                shapes.setAttribute('class','drawing')
                shapes.setAttribute('style','stroke:'+newColor+";stroke-width:"+newsize)
                shapes.setAttribute('x1',start.x)
                shapes.setAttribute('y1',start.y)
                shapes.setAttribute('x2',p.x)
                shapes.setAttribute('y2',p.y)

                svg.appendChild(shapes)
                
            }
            
            const endDrawLine=(e)=>{
                svg.removeEventListener('mousemove',drawLine)
                svg.removeEventListener('mouseup',endDrawLine)
    
            }
    
            svg.addEventListener('mousemove',drawLine)
            svg.addEventListener('mouseup',endDrawLine)

            editing(shapes)
            break;

        case "rect":
            const drawRect=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY)
                const w=Math.abs(p.x-start.x)
                const h=Math.abs(p.y-start.y)

                if(p.x>start.x){
                    p.x=start.x
                }

                if(p.y>start.y){
                    p.y=start.y
                }

                shapes.setAttribute('class','drawing')
                shapes.setAttribute('style','stroke:'+newColor+";stroke-width:"+newsize)
                shapes.setAttribute('x',p.x)
                shapes.setAttribute('y',p.y)
                shapes.setAttribute('width',w)
                shapes.setAttribute('height',h)
                svg.appendChild(shapes)

                
            
            }

            const endDrawRect=(e)=>{
                svg.removeEventListener('mousemove',drawRect)
                svg.removeEventListener('mouseup',endDrawRect)

            }

            svg.addEventListener('mousemove',drawRect)
            svg.addEventListener('mouseup',endDrawRect)
                
                editing(shapes)
   
            break;

        case "ellipse":
            const drawEllipse=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY),
                    rx=Math.abs(p.x-start.x)/2,
                    ry=Math.abs(p.y-start.y)/2,
                    cx=(p.x+start.x)/2,
                    cy=(p.y+start.y)/2



                shapes.setAttribute('style','stroke:'+newColor+";stroke-width:"+newsize)
                shapes.setAttribute('cx',cx)
                shapes.setAttribute('cy',cy)
                shapes.setAttribute('rx',rx)
                shapes.setAttribute('ry',ry)
                svg.appendChild(shapes)


            }

            const endDrawEllipse=(e)=>{
                svg.removeEventListener('mousemove',drawEllipse)
                svg.removeEventListener('mouseup',endDrawEllipse)

            }

            svg.addEventListener('mousemove',drawEllipse)
            svg.addEventListener('mouseup',endDrawEllipse)                
           
            editing(shapes)



            break;
    }



})


// //export ca format PNG
function saveToPNG() {

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image()
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height





        // Desenează SVG pe canvas
        ctx.drawImage(img, 0, 0);

        // Converteste canvas la data URL
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        // Crează un element <a> pentru descărcare
        const link = document.createElement("a");
        link.href = image;
        link.download = "desen.png";
        link.click();
    }




    // Setează sursa imaginii cu datele SVG
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
}


const exportPNGButton = document.getElementById("exportPNG");
exportPNGButton.addEventListener("click", saveToPNG);


