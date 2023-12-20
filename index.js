//export ca format SVG
function saveToSVG() {
    const svgData = new XMLSerializer().serializeToString(svgContainer);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "desen.svg";
    link.click();
  }

//export ca format PNG
function saveToPNG(){
    const svgData = new XMLSerializer().serializeToString(svgContainer);
    const svgContainer = document.createElement("svgContainer");
    canvg(svgContainer, svgData);
    const image = svgContainer.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = image;
    link.download = "desen.png";
    link.click();
}






let shape="line" //the default shape for drawing

//in case the user want to draw anything other than a line
let shapes=document.getElementsByClassName("shape")
for(let i=0;i<shapes.length;i++){
    shapes[i].addEventListener('click',function(){
        shape=shapes[i].id
    })
    
}

const svg=document.querySelector("#svgContainer") 

let color=document.getElementById("color"), newColor='black', fillColor='black' //initial color of the shape

//adding eventListener when the user changes the color 
color.addEventListener('input',function(){
    newColor=color.value
    fillColor=color.value
})


//getting the values from dropdown
let dropdown=document.getElementById("size"), newsize=3
dropdown.addEventListener('input',function(){
    newsize=dropdown.value
})



//export ca format SVG
function saveToSVG() {
    const svgData = new XMLSerializer().serializeToString(svgContainer);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "desen.svg";
    link.click();
  }





    
let drawnS=[]

let btnUndo=document.getElementById('undo');
let btnRedo=document.getElementById('redo');
btnUndo.addEventListener('click',function(){ 
        drawnS.push(svg.lastElementChild)      
        svg.removeChild(svg.lastElementChild)
        if(svg.childElementCount===0){
            btnUndo.setAttribute('hidden','hidden')
            btnRedo.removeAttribute('hidden')
        }
    })


// redo button, i ve put the last child of svg to the beginning of drawnS
// so the last one deleted should be the first one pushed out
// the button should disappear when the last item was restored 
btnRedo.addEventListener('click',function(){
    if(drawnS.length>1){    
        svg.appendChild(drawnS[drawnS.length-1])
        console.log(drawnS.length)
    }else{
        //when the user redoes the last element
        svg.appendChild(drawnS[drawnS.length-1])
        btnRedo.setAttribute('hidden','hidden')
    }        
    drawnS.length--

})







//download the drawing as png
let btnSave=document.getElementById('save')
btnSave.addEventListener('click',function(){
    const svg2=document.querySelector('svg')
    svg2.insertBefore(style,svg.firstChild)
    const data=(new XMLSerializer()).serializeToString(svg2)
    const svgBlob=new Blob([data],{
        type:"image/svg+xml;charset=utf-8"
    })
    style.remove()

    const url=URL.createObjectURL(svgBlob)
    const img=new Image()
    img.addEventListener('load',function(){
        //getting the coordinates of the svg for drawing (x,y, height, width)
        const bbox=svg2.getBBox()
        const canvas=document.createElement('canvas')
        canvas.width=1000
        canvas.height=400

       
        const context=canvas.getContext('2d')
        context.drawImage(img,0,0,bbox.width,bbox.height)

        URL.revokeObjectURL(url)

        const a =document.createElement('a')
        a.download='image.png'
        document.body.appendChild(a)
        a.href=canvas.toDataURL()
        a.click()
        a.remove()
    })
    img.src=url
})


//editing tools for when the user clicks on a drawn shape
function editing(shape){
    shape.addEventListener('click',(e)=>{
        if(!(document.getElementById('edit'))){

            let divEdit=document.createElement("div")
            divEdit.id="edit"
            document.getElementById("tools").appendChild(divEdit)

            let btnDelete=document.createElement("button")
            btnDelete.innerHTML= '<img id="deleteImg" src="./media/trashcan.gif"/>'
            btnDelete.id="delete"

            let btnEdit=document.createElement("button")
            btnEdit.innerHTML= '<img id="fillImg" src="./media/bucket.png"/>'
            btnEdit.id="fill"

            document.getElementById("edit").appendChild(btnEdit)
            document.getElementById("edit").appendChild(btnDelete)

            //delete
            btnDelete.addEventListener('click',function(){
                svg.removeChild(e.target)
                //if the shape is deleted, all the buttons should be removed
                document.getElementById("tools").removeChild(divEdit)
            })

            //fill in: does not work the second time you press on the shape
            btnEdit.addEventListener('click',function(){
                    //only the selected shape can be edited
                    e.target.addEventListener('click',function(){
                        if(e.target.tagName==='line'){
                            e.target.style.stroke=fillColor
                        }else{
                            e.target.style.fill=fillColor
                        }
                        newColor="black" //'reset' de color
                        document.getElementById("tools").removeChild(divEdit)


                    })
                
            })
            
        }
    })
}

const svgPoint=(svg,x,y)=>{
    const p=new DOMPoint(x,y)
    p.x=x
    p.y=y
    return p.matrixTransform(svg.getScreenCTM().inverse())
}

let drawnLines=[]
svg.addEventListener('mousedown',(e)=>{
    let shapeS=document.createElementNS("http://www.w3.org/2000/svg", shape)
    let start= svgPoint(svg,e.clientX,e.clientY)
    switch (shape) {
        case "line":
            const drawLine=(event)=>{
                let p=svgPoint(svg,event.clientX,event.clientY)
                

                shapeS.setAttribute('class','drawing')
                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newsize)
                shapeS.setAttribute('x1',start.x)
                shapeS.setAttribute('y1',start.y)
                shapeS.setAttribute('x2',p.x)
                shapeS.setAttribute('y2',p.y)

                svg.appendChild(shapeS)
                
            }
            
            const endDrawLine=(e)=>{
                svg.removeEventListener('mousemove',drawLine)
                svg.removeEventListener('mouseup',endDrawLine)
    
            }
    
            svg.addEventListener('mousemove',drawLine)
            svg.addEventListener('mouseup',endDrawLine)

            editing(shapeS)

            
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

                shapeS.setAttribute('class','drawing')
                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newsize)
                shapeS.setAttribute('x',p.x)
                shapeS.setAttribute('y',p.y)
                shapeS.setAttribute('width',w)
                shapeS.setAttribute('height',h)
                svg.appendChild(shapeS)

                
            
            }

            const endDrawRect=(e)=>{
                svg.removeEventListener('mousemove',drawRect)
                svg.removeEventListener('mouseup',endDrawRect)

            }

            svg.addEventListener('mousemove',drawRect)
            svg.addEventListener('mouseup',endDrawRect)
                
                editing(shapeS)
   
            break;

        case "ellipse":
            const drawEllipse=(event)=>{
                const p=svgPoint(svg, event.clientX,event.clientY),
                    rx=Math.abs(p.x-start.x)/2,
                    ry=Math.abs(p.y-start.y)/2,
                    cx=(p.x+start.x)/2,
                    cy=(p.y+start.y)/2



                shapeS.setAttribute('style','stroke:'+newColor+";stroke-width:"+newsize)
                shapeS.setAttribute('cx',cx)
                shapeS.setAttribute('cy',cy)
                shapeS.setAttribute('rx',rx)
                shapeS.setAttribute('ry',ry)
                svg.appendChild(shapeS)


            }

            const endDrawEllipse=(e)=>{
                svg.removeEventListener('mousemove',drawEllipse)
                svg.removeEventListener('mouseup',endDrawEllipse)

            }

            svg.addEventListener('mousemove',drawEllipse)
            svg.addEventListener('mouseup',endDrawEllipse)                
           
            editing(shapeS)

            break;
    }
})
