// API-> https://world.openfoodfacts.org/api/v0/product/[barcode].json
// https://world.openfoodfacts.org/data
// 040000524311 073390000165 041196910759 737628064502 011110038364

let input = document.getElementById("barcode");
input.addEventListener("keyup", (e)=> {
    if (e.key === "Enter") {
        getFetch();
    }
});

function getFetch(){
    let inputVal=document.getElementById('barcode').value;
    
    if(inputVal.length !== 12){
        alert(`Please!!! ensure that Barcode length is 12 Digits.`);
        return;
    }

    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`
    
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log(data)
            //check product exist or not so we use status property

        if (data.status === 1) {
            const item = new ProductInfo(data.product);
            item.showInfo();
            item.listIngredients();
            item.clearAll();
        } else if (data.status === 0) {
            alert(`Product ${inputVal} not found. Please try another.`)
        }

        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

class ProductInfo{

    constructor(productData){
        this.brand=productData.brands;
        this.name=productData.product_name;
        this.ingredients=productData.ingredients;
        this.image=productData.image_url;
    }

    showInfo(){
        console.log(this.ingredients);
        document.getElementById('product-img').src=this.image;
        document.getElementById('product-name').innerHTML=this.name;
    }

    listIngredients(){
        let tableRef=document.getElementById('indgredient-table');
        
        //for deleting the rows 
        for(var i=1;i<tableRef.rows.length;){
            tableRef.deleteRow(i);
        }

        if(!(this.ingredients==null)){
            for(var key in this.ingredients){
                //add row to end
                let newRow=tableRef.insertRow(-1);
                //create ingrident cell
                let newICell = newRow.insertCell(0);
                //create vegeterian cell
                let newVCell = newRow.insertCell(1);

                //create text node whatever the text of current ingredient
                let newIText=document.createTextNode(this.ingredients[key].text);
                //we create veg status as seperate variable because to check vegStatus undefined or not
                let vegStatus = this.ingredients[key].vegetarian == null ? 'unknown' : this.ingredients[key].vegetarian
                let newVText = document.createTextNode(vegStatus);
                //put the ingridient text into ingrident cell
                newICell.appendChild(newIText);
                //put the vegeterian text into ingrident cell
                newVCell.appendChild(newVText);
                if (vegStatus === 'no') {
                    newVCell.classList.add('non-veg-item')
                } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
                    newVCell.classList.add('unknown-color')
                }
            }
        }
    }
}