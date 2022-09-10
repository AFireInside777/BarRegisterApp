//future function to discount price by percentage
//Add function for putting current orders as pending.
//Customer Database
//make Javascript accept integers with 0 as first digit for credit card info.
//Make a function for how to calculate new inventory
var newordernumber = 0

function setordernumber(startcount){
    newordernumber = startcount 
}

$.ajax({
    url: '/firstcount',
    type: 'GET',
    dataType: "json",
    success: function(response){
        setordernumber(response)              
    },
    error: function(error){
        alert("Something went wrong the server: " + error);
    }
})

var newordernumber = 0//This data will come from count in database
var pendingorders = [] //Make sure you show the Order ID in the buttons
var currentorder = null
let subtotal = 0
let drinkinfo
let index
let displaycontainer
let orderview
var dateandorder
var date = 0
var currentordernum = 0
var drinksordered
var paymentinfo = 0
var cashorcard = 0
var expdate = 0 
var total = 0
var qtydivandlistener = []
var priceeventlisteners = []
var drinkprice
var drinkqty
var drinklistarray = []
var deletedrinklisteners = []
let finalizedorderarray
var newinfo = []

const DrinkList = {
    "Pisco Punch": ["Pisco Punch", 5.50, 8.00, 20, "MixedDrink"],
    "Painkiller": ["Painkiller", 4, 7.50, 30, "MixedDrink"],
    "Ti-Punch": ["Ti-Punch", 6, 9.50, 25, "MixedDrink"],
    "Hanky-Panky": ["Hanky-Panky", 6, 9, 20, "MixedDrink"],
    "Cosmopolitan": ["Cosmopolitan", 7.50, 10, 20, "MixedDrink"],
    "Ramos Gin Fizz": ["Ramos Gin Fizz", 6, 9.50, 25, "MixedDrink"],
    "Tecate":["Tecate", 2, 4.50, 50, "Beer"],
    "Pabst Blue Ribbon":["Pabst Blue Ribbon", 1, 3, 50, "Beer"],
    "Blue Moon": ["Blue Moon", 3, 5.50, 50, "Beer"],
    "High Life": ["High Life", 1.50, 3.50, 60, "Beer"]
}

function getdate(){
    currentdate =  new Date();//Wrong Date is currently printing
    currentdate = (currentdate.getMonth() + "-" + currentdate.getDate() + "-" + currentdate.getFullYear())
    newordernumber += 1
    dateandorder = [currentdate, newordernumber]
    return dateandorder
}

 function getajaxinfo(result){
    let oldorder
    let paytext
    console.log(result[0])

    finalorderview.innerHTML = " "
    drawfinalizedheaders()

    for (oldorder in result[0]){
        let finalizedorder = document.createElement ('div')
        finalizedorder.style.width = '99.8%'
        finalizedorder.style.height = '9%'
        finalizedorder.style.margin = "auto" //To center the container
        finalizedorder.style.borderRadius = "15px"
        finalizedorder.style.right = '1.6%'
        finalizedorder.style.bottom = "80%"
        finalizedorder.style.overflow = "hidden"
        finalizedorder.style.border = "thin solid red"
        finalorderview.appendChild(finalizedorder)

        let finalorderdate = document.createElement("div")
        finalorderdate.style.width = '19%'
        finalorderdate.style.height = '99.9%'
        finalorderdate.style.borderTopLeftRadius = "15px"
        finalorderdate.style.borderBottomLeftRadius = "15px"
        finalorderdate.innerHTML = result[0][oldorder][0]
        finalorderdate.style.textAlign = "center"
        finalorderdate.style.cssFloat = "left"
        finalorderdate.style.border = "thin solid red"
        finalizedorder.appendChild(finalorderdate)

        let finalordernum = document.createElement("div")
        finalordernum.style.width = '19%'
        finalordernum.style.height = '99.9%'
        finalordernum.innerHTML = result[0][oldorder][1]
        finalordernum.style.textAlign = "center"
        finalordernum.style.cssFloat = "left"
        finalordernum.style.border = "thin solid red"
        finalizedorder.appendChild(finalordernum)

        let finalorderpayment = document.createElement("div")
        finalorderpayment.style.width = '21.2%'
        finalorderpayment.style.height = '99.9%'
        if (parseInt(result[0][oldorder][2]) == 1111){
            paytext = "Cash:"
        } else {
            paytext = "Card#"
        }
        finalorderpayment.innerHTML = paytext + result[0][oldorder][2]
        finalorderpayment.style.textAlign = "center"
        finalorderpayment.style.cssFloat = "left"
        finalorderpayment.style.border = "thin solid red"
        finalizedorder.appendChild(finalorderpayment)

        let finalorderexpdate = document.createElement("div")
        finalorderexpdate.style.width = '20%'
        finalorderexpdate.style.height = '99.9%'
        finalorderexpdate.innerHTML = result[0][oldorder][3]
        finalorderexpdate.style.textAlign = "center"
        finalorderexpdate.style.cssFloat = "left"
        finalorderexpdate.style.border = "thin solid red"
        finalizedorder.appendChild(finalorderexpdate)

        let finalordertotal = document.createElement("div")
        finalordertotal.style.width = '19%'
        finalordertotal.style.height = '99.9%'
        finalordertotal.style.borderTopRightRadius = "15px"
        finalordertotal.style.borderBottomRightRadius = "15px"
        finalordertotal.innerHTML = result[0][oldorder][4]
        finalordertotal.style.textAlign = "center"
        finalordertotal.style.cssFloat = "left"
        finalordertotal.style.border = "thin solid red"
        finalizedorder.appendChild(finalordertotal)
    }
    dateinfo.innerHTML = 0
    orderinfonum.innerHTML = 0
    totalbox.innerHTML = "Total: $"
    orderactionstatus.innerHTML = " "
    drinkview.innerHTML = " "

    currentorder = null
    newordernumber = result[1]
}

class NewOrder {
    constructor() {
        var dateandordernum = getdate()
        this.date = dateandordernum[0];
        this.ordernum = dateandordernum[1];
        this.cashorcardnum = 0
        this.expdate = 0
        this.total = 0
        this.headerarray = [this.date, this.ordernum]
        this.orderitemsarray = []
        this.paymentarray = [this.ordernum, this.cashorcardnum, this.expdate, this.total]
    }

    RunNewTotal(){
        let newtotal = 0
        let index
        for (index in this.orderitemsarray){
            newtotal += this.orderitemsarray[index][3]
        }
        this.total = newtotal
    }

    AddDrinktoNewOrder(drink, qty){
        let drinkcounter = 0
        let drinkitem
        for (drinkitem in currentorder.orderitemsarray){
            if (currentorder.orderitemsarray[drinkitem][0] === drink){
                drinkcounter += 1
            }//Checks and counts to see if the new drink you've ordered is already on the currentorder
        }
        if (drinkcounter > 0){//if it see the drink appear on your order once, it is not added and you are directed to change the quantity instead.
            alert("That drink is already on your order. You may change the quantity of that drink on your current order by clicking the quantity box on the drink you would like to modify.")
        } else {
            drinkinfo = (DrinkList[drink])
            subtotal = drinkinfo[2]*qty
            this.orderitemsarray.push([drinkinfo[0], drinkinfo[2], qty, subtotal])//name, price, qty, subtotal
            this.RunNewTotal()
          
            //subtract qty from DrinkList quantity
        }
    }

    ModifyQtyDrink(drink, qty){
        for (index in this.orderitemsarray){
            if (drink == currentorder.orderitemsarray[index][0]){//name, price, qty, subtotal
                currentorder.orderitemsarray[index][2] = qty
                currentorder.orderitemsarray[index][3] = currentorder.orderitemsarray[index][1]*currentorder.orderitemsarray[index][2]
            }
        }
        currentorder.RunNewTotal()
        total = currentorder.total
    }

    ModifyPriceDrink(drink, price){
        for (index in this.orderitemsarray){
            if (drink == currentorder.orderitemsarray[index][0]){//name, price, qty, subtotal
                currentorder.orderitemsarray[index][1] = price
                currentorder.orderitemsarray[index][3] = currentorder.orderitemsarray[index][1]*currentorder.orderitemsarray[index][2]
            }
        }
        currentorder.RunNewTotal()
        total = currentorder.total
    }

    FinalizeOrder(cardinfo, expdate){
    
        this.cashorcardnum = cardinfo
        this.expdate = expdate
        this.paymentarray = [this.ordernum, this.cashorcardnum, this.expdate, this.total]
        var FinalizedOrder = ([this.headerarray, this.orderitemsarray, this.paymentarray])
        
    
        $.ajax({
            url: '/processorder',
            datatype: "text",
            data: JSON.stringify(FinalizedOrder),
            type: 'POST',
            success: function(response){
                
            },
            error: function(error){
                alert(error);
            }
        });

        $.ajax({
            url: '/orderlistandcount',
            type: 'GET',
            dataType: "json",
            success: function(response){
                let finalorders = JSON.stringify(response)
                finalorders = JSON.parse(finalorders)
                getajaxinfo(finalorders)                
            },
            error: function(error){
                alert("Something went wrong the server: " + error);
            }
        })
    } 
}

function AddNewOrder(){
    currentorder = new NewOrder()
}

function SaveToPending(ordertopending){///////////Will add later
    pendingorders.push(ordertopending)
    currentorder = null
    //Also put returning message that there's no current order.
}

function PendingtoCurrent(OrderIDNum){
    //search for ID num in for loop
    //send order array to currentorder
    for (order in pendingorders){
        if (pendingorders[order].ordernum == OrderIDNum){
            currentorder = pendingorders[order]
        }
    }
}

function DeleteDrink(drink){
    var CheckLoop
    CheckLoop:
    for (drinkitem in currentorder.orderitemsarray){
        if (currentorder.orderitemsarray[drinkitem][0] == drink){
            delete currentorder.orderitemsarray[drinkitem]
            break CheckLoop
        }
    }
    currentorder.RunNewTotal()
}
//==================================FRONT END=================================================


//==================================DRINK LIST=================================================

displaycontainer = document.createElement ('div');
displaycontainer.style.margin = "auto" //To center the container
displaycontainer.style.height = '93vh'
displaycontainer.style.width = '99%'
displaycontainer.style.padding = '5px'
displaycontainer.style.border = "thin solid red"
displaycontainer.style.borderRadius = "15px"
document.body.append(displaycontainer)

let infoview2 = document.createElement ('div');
infoview2.style.height = '45%'
infoview2.style.width = '47%'
infoview2.style.position = 'fixed'
infoview2.style.border = "thin solid red"
infoview2.style.borderTopLeftRadius = "15px"
infoview2.style.borderTopRightRadius = "15px"
infoview2.style.left = "51.7%"
infoview2.style.top = "2.3%"
infoview2.style.overflow = "hidden"
displaycontainer.appendChild(infoview2)

let drinklistheader = document.createElement ('div')
drinklistheader.style.width = '46%'
drinklistheader.style.height = '3.8%'
drinklistheader.style.position = 'fixed'
drinklistheader.style.border = "thin solid red"
drinklistheader.style.margin = "auto" //To center the container
drinklistheader.style.borderTopLeftRadius = "15px"
drinklistheader.style.borderTopRightRadius = "15px"
drinklistheader.style.right = '1.6%'
drinklistheader.style.bottom = "92.5%"
drinklistheader.innerHTML = "DRINK LIST"
drinklistheader.style.textAlign = "center"
drinklistheader.style.fontSize = "large"
drinklistheader.style.overflow = "hidden"
infoview2.appendChild(drinklistheader)

let drinklistcontainer = document.createElement ('div')
drinklistcontainer.style.position = 'fixed'
drinklistcontainer.style.margin = "auto"
drinklistcontainer.style.width = '46%'
drinklistcontainer.style.height = '39%'
drinklistcontainer.style.right = '1.6%'
drinklistcontainer.style.border = "thin solid red"
drinklistcontainer.style.bottom = "53%"
drinklistcontainer.style.display = "list-item"
drinklistcontainer.style.overflowY = "scroll"
infoview2.appendChild(drinklistcontainer)

for (drink in DrinkList){
    let listeddrink = document.createElement ("button");
    listeddrink.dataset.id = DrinkList[drink][0]
    listeddrink.style.margin = "auto"
    listeddrink.style.width = '50%'
    listeddrink.style.height = '20%' //when position is fixed, height is 5%
    listeddrink.style.float = "left"
    let text = (DrinkList[drink][0] + " - Price:" + DrinkList[drink][2] + " - Qty:" + DrinkList[drink][3])
    listeddrink.innerHTML = text
    listeddrink.style.textAlign = "center"
    drinklistcontainer.appendChild(listeddrink)
    
    listeddrink.addEventListener("click", function(event){
        drinkname = event.srcElement.dataset.id
        if (currentorder == null){
            alert("There's no current order to send this drink to. Please click 'Add New Order'.")
        } else {
            currentorder.AddDrinktoNewOrder(drinkname, 1)
            drinkview.innerHTML = " "
            displaydrinks()    
            DrinkList[drinkname][3] = DrinkList[drinkname][3] - 1
            for (listeddrink in drinklistarray){
                if(drinklistarray[listeddrink].dataset.id == DrinkList[drinkname][0]){
                    let text = (DrinkList[drinkname][0] + " - Price:" + DrinkList[drinkname][2] + " - Qty:" + DrinkList[drinkname][3])
                    drinklistarray[listeddrink].innerHTML = text
                }
            } 
        }
    })
    drinklistarray.push(listeddrink)
}
//==================================Order Screen=======================================================================
orderview = document.createElement ('div');
orderview.style.height = '92.7%'
orderview.style.width = '47%'
orderview.style.position = 'fixed'
orderview.style.border = "thin solid red"
orderview.style.borderRadius = "15px"
orderview.style.right = "51.7%"
orderview.style.display = "list-item"
displaycontainer.appendChild(orderview)

let orderlistheader = document.createElement ('div')
orderlistheader.style.width = '99.9%'
orderlistheader.style.height = '3.8%'
orderlistheader.style.margin = "auto" //To center the container
orderlistheader.style.borderTopLeftRadius = "15px"
orderlistheader.style.borderTopRightRadius = "15px"
orderlistheader.style.right = '1.6%'
orderlistheader.style.bottom = "90%"
orderlistheader.innerHTML = "CURRENT ORDER"
orderlistheader.style.textAlign = "center"
orderlistheader.style.fontSize = "large"
orderlistheader.style.overflow = "hidden"
orderview.appendChild(orderlistheader)

let addneworder = document.createElement ("button");
addneworder.style.margin = "auto"
addneworder.style.width = '100%'
addneworder.style.height = '5%' //when position is fixed, height is 5%
addneworder.style.fontSize = "large"
let text = "ADD NEW ORDER"
addneworder.innerHTML = text
addneworder.style.textAlign = "center"
orderview.appendChild(addneworder)

let dateandorderview = document.createElement("div")
dateandorderview.style.margin = "auto"
dateandorderview.style.width = '99.9%'
dateandorderview.style.height = '5%' 
dateandorderview.style.border = "thin solid blue"
dateandorderview.style.display = "inline-block"
//dateandorderview.style.overflowY = "hidden"
orderview.appendChild(dateandorderview)

let dateinfo = document.createElement("div")
dateinfo.style.height = '98%'
dateinfo.style.border = "thin solid blue"
dateinfo.style.width = '49.2%'
dateinfo.style.cssFloat = "left"
dateinfo.style.display = "inline"
dateinfo.innerHTML = date
dateinfo.style.textAlign = "center"
dateandorderview.appendChild(dateinfo)

let orderinfonum = document.createElement("div")
orderinfonum.style.height = '98%'
orderinfonum.style.border = "thin solid blue"
orderinfonum.style.width = '50%'
orderinfonum.style.cssFloat = "left"
orderinfonum.style.display = "inline"
orderinfonum.innerHTML = currentordernum
orderinfonum.style.textAlign = "center"
dateandorderview.appendChild(orderinfonum)

let drinkview = document.createElement ('div');
drinkview.style.height = '65.7%'
drinkview.style.border = "thin solid blue"
drinkview.style.width = '99.9%'
drinkview.style.cssFloat = "left"
orderview.appendChild(drinkview)//Add Overflow and Y-Scroll

let paymentinfobox = document.createElement("div")
paymentinfobox.style.margin = "auto"
paymentinfobox.style.width = '99.9%'
paymentinfobox.style.height = '5%' 
paymentinfobox.style.border = "thin solid blue"
paymentinfobox.style.display = "inline-block"
paymentinfobox.style.textAlign = "center"
orderview.appendChild(paymentinfobox)

let creditorcashbox = document.createElement("div")
creditorcashbox.style.width = '38%'
creditorcashbox.style.height = '99.9%' 
creditorcashbox.style.border = "thin solid blue"
creditorcashbox.style.cssFloat = "left"
creditorcashbox.style.display = "inline"
creditorcashbox.innerHTML = "Card# or Cash(1111): " + cashorcard
creditorcashbox.style.textAlign = "center"
paymentinfobox.appendChild(creditorcashbox)

let expdatebox = document.createElement("div")
expdatebox.style.width = '37%'
expdatebox.style.height = '99.9%' 
expdatebox.style.border = "thin solid blue"
expdatebox.style.cssFloat = "left"
expdatebox.style.display = "inline"
expdatebox.innerHTML = "Exp Date (or '1111'): " + expdate
expdatebox.style.textAlign = "center"
expdatebox.style.textSize = "xx-small"
paymentinfobox.appendChild(expdatebox)

let totalbox = document.createElement("div")
totalbox.style.width = '24%'
totalbox.style.height = '99.9%' 
totalbox.style.border = "thin solid blue"
totalbox.style.cssFloat = "left"
totalbox.style.display = "inline"
totalbox.innerHTML = "Total: $" + total
paymentinfobox.appendChild(totalbox)

let orderactionstatus = document.createElement ('div');
orderactionstatus.style.height = '7%'
orderactionstatus.style.border = "thin solid blue"
orderactionstatus.style.width = '99.9%'
orderactionstatus.style.cssFloat = "left"
orderactionstatus.style.textAlign = "center"
orderview.appendChild(orderactionstatus)

let finalize = document.createElement ("button");
finalize.style.margin = "auto"
finalize.style.width = '100%'
finalize.style.height = '5.5%' 
finalize.style.fontSize = "large"
finalize.innerHTML = "FINALIZE ORDER"
finalize.style.textAlign = "center"
finalize.style.borderBottomLeftRadius = "15px"
finalize.style.borderBottomRightRadius = "15px"
orderview.appendChild(finalize)

function displaydrinks(){ //method for drinkview

    drinkview.innerHTML = " "

    if(qtydivandlistener.length > 0){
        for(listener in qtydivandlistener){
            qtydivandlistener[listener].removeEventListener("click", modifydrinkqty)
        }
        qtydivandlistener = []
    }

    if (priceeventlisteners.length > 0){
        for(listener in priceeventlisteners){
            priceeventlisteners[listener].removeEventListener("click", modifydrinkprice)
        }
        priceeventlisteners = []
    }

    if (deletedrinklisteners.length > 0){
        for(listener in deletedrinklisteners){
            deletedrinklisteners[listener].removeEventListener("click", deletedrink)
        }
        deletedrinklisteners = []
    }

    function modifydrinkqty(nameofdrink){
        newqty = prompt("What is the new quantity for " + nameofdrink + "?")
        if (newqty != null){
            currentorder.ModifyQtyDrink(nameofdrink, newqty) //modifies currentorder, gives new currentorder.total
            displaydrinks()
        }
    }

    function modifydrinkprice(nameofdrink){
        newprice = prompt("What is the new price for " + nameofdrink + "?")
        if (prompt != null){
            currentorder.ModifyPriceDrink(nameofdrink, newprice) //modifies currentorder, gives new currentorder.total
            displaydrinks()
        }
    }

    function deletedrink(){
        let decision = prompt("You would like to delete " + selectdrinkarray[0] + "?", "Click OK to delete, Click Cancel to cancel request.")
        if (decision == "Click OK to delete, Click Cancel to cancel request."){
            DeleteDrink(selectdrinkarray[0])
            displaydrinks()
        }
    }

    for (drinkindex in currentorder.orderitemsarray){
        
        let selectdrinkarray = currentorder.orderitemsarray[drinkindex]

        let orderitem = document.createElement ('div')
        orderitem.style.height = '7%'
        orderitem.style.width = '99.9%'
        orderitem.style.border = "thin solid green"
        orderitem.style.display = "inline-block"
        orderitem.dataset.id = selectdrinkarray[0]
        drinkview.appendChild(orderitem)

        let drinkname = document.createElement ('div')
        drinkname.style.height = '99%'
        drinkname.style.width = '33.5%'
        drinkname.style.border = "thin solid green"
        drinkname.style.cssFloat = "left"
        drinkname.style.display = "inline"
        drinkname.innerHTML = selectdrinkarray[0]
        drinkname.style.textAlign = "center"
        orderitem.appendChild(drinkname)

        drinkname.addEventListener("click", deletedrink)
        deletedrinklisteners.push(drinkname)
        
        drinkprice = document.createElement ('div')
        drinkprice.style.height = '99%'
        drinkprice.style.width = '20%'
        drinkprice.style.border = "thin solid green"
        drinkprice.style.cssFloat = "left"
        drinkprice.style.display = "inline"
        drinkprice.innerHTML = "$" + selectdrinkarray[1]
        drinkprice.style.textAlign = "center"
        orderitem.appendChild(drinkprice)

        drinkprice.addEventListener("click", function(){
            modifydrinkprice(selectdrinkarray[0])
        })
        
        priceeventlisteners.push(drinkprice)

        drinkqty = document.createElement ('div')
        drinkqty.style.height = '99%'
        drinkqty.style.width = '15%'
        drinkqty.style.border = "thin solid blue"
        drinkqty.style.cssFloat = "left"
        drinkqty.style.display = "inline"
        drinkqty.innerHTML = "Qty# " + selectdrinkarray[2]
        drinkqty.style.textAlign = "center"
        orderitem.appendChild(drinkqty)

        drinkqty.addEventListener("click", function(){
            modifydrinkqty(selectdrinkarray[0])
        })
        
        qtydivandlistener.push(drinkqty)

        let drinksubtotal = document.createElement ('div')
        drinksubtotal.style.height = '99%'
        drinksubtotal.style.width = '30%'
        drinksubtotal.style.border = "thin solid blue"
        drinksubtotal.style.cssFloat = "left"
        drinksubtotal.style.display = "inline"
        drinksubtotal.innerHTML = "Subtotal: " + selectdrinkarray[1]*selectdrinkarray[2]
        drinksubtotal.style.textAlign = "center"
        orderitem.appendChild(drinksubtotal)

        currentorder.RunNewTotal()
        total = currentorder.total
        totalbox.innerHTML = "Total: $" + total //reprints the total
    }
}

addneworder.addEventListener("click", function(){
    AddNewOrder()
    headerarray = currentorder.headerarray
    orderitemsarray = currentorder.orderitemsarray
    paymentarray = currentorder.paymentarray
    
    date = headerarray[0]
    currentordernum = headerarray[1]

    cashorcard = paymentarray[1]
    expdate = paymentarray[2]
    total = paymentarray[3]

    dateinfo.innerHTML = date
    orderinfonum.innerHTML = "Order# " + currentordernum
    orderactionstatus.innerHTML = "CLICK PRICE TO CHANGE PRICE - CLICK QTY TO CHANGE QTY - CLICK DRINK NAME TO DELETE DRINK FROM ORDER"
})

//==========================================FINALIZED ORDER==================================================

let finalorderview = document.createElement ('div');
finalorderview.style.height = '45%'
finalorderview.style.width = '47%'
finalorderview.style.position = 'fixed'
finalorderview.style.border = "thin solid red"
finalorderview.style.borderRadius = "15px"
finalorderview.style.left = "51.7%"
finalorderview.style.bottom = "4.5%"
finalorderview.style.display = "inline"
finalorderview.style.overflow = "hidden"
finalorderview.style.overflowY = "scroll"
displaycontainer.appendChild(finalorderview)

function drawfinalizedheaders(){
    let finalorderheader = document.createElement ('div')//ADD ELEMENT TO LIST THE FINALIZED ORDERS IN TO SCROLL, SEPARATE FROM HEADERS
    finalorderheader.style.width = '99.8%'
    finalorderheader.style.height = '8%'
    finalorderheader.style.margin = "auto" //To center the container
    finalorderheader.style.borderRadius = "15px"
    finalorderheader.style.right = '1.6%'
    finalorderheader.style.bottom = "80%"
    finalorderheader.innerHTML = "FINALIZED ORDERS"
    finalorderheader.style.textAlign = "center"
    finalorderheader.style.fontSize = "large"
    finalorderheader.style.overflow = "hidden"
    finalorderheader.style.border = "thin solid red"
    finalorderview.appendChild(finalorderheader)

    let orderinfokey = document.createElement ('div')
    orderinfokey.style.width = '99.8%'
    orderinfokey.style.height = '8%'
    orderinfokey.style.margin = "auto" //To center the container
    orderinfokey.style.borderRadius = "15px"
    orderinfokey.style.right = '1.6%'
    orderinfokey.style.bottom = "80%"
    orderinfokey.style.textAlign = "center"
    orderinfokey.style.fontSize = "large"
    orderinfokey.style.overflow = "hidden"
    orderinfokey.style.border = "thin solid red"
    finalorderview.appendChild(orderinfokey)

    let datebox = document.createElement("div")
    datebox.style.width = '19%'
    datebox.style.height = '99.9%'
    datebox.style.borderTopLeftRadius = "15px"
    datebox.style.borderBottomLeftRadius = "15px"
    datebox.innerHTML = "DATE"
    datebox.style.textAlign = "center"
    datebox.style.cssFloat = "left"
    datebox.style.border = "thin solid red"
    orderinfokey.appendChild(datebox)

    let ordernumbox = document.createElement("div")
    ordernumbox.style.width = '19%'
    ordernumbox.style.height = '99.9%'
    ordernumbox.innerHTML = "ORDER#"
    ordernumbox.style.textAlign = "center"
    ordernumbox.style.cssFloat = "left"
    ordernumbox.style.border = "thin solid red"
    orderinfokey.appendChild(ordernumbox)

    let paymentbox = document.createElement("div")
    paymentbox.style.width = '21.2%'
    paymentbox.style.height = '99.9%'
    paymentbox.innerHTML = "PAYMENT"
    paymentbox.style.textAlign = "center"
    paymentbox.style.cssFloat = "left"
    paymentbox.style.border = "thin solid red"
    orderinfokey.appendChild(paymentbox)

    let expdatebox2 = document.createElement("div")
    expdatebox2.style.width = '20%'
    expdatebox2.style.height = '99.9%'
    expdatebox2.innerHTML = "EXP. DATE"
    expdatebox2.style.textAlign = "center"
    expdatebox2.style.cssFloat = "left"
    expdatebox2.style.border = "thin solid red"
    orderinfokey.appendChild(expdatebox2)

    let totalbox2 = document.createElement("div")
    totalbox2.style.width = '19%'
    totalbox2.style.height = '99.9%'
    totalbox2.style.borderTopRightRadius = "15px"
    totalbox2.style.borderBottomRightRadius = "15px"
    totalbox2.innerHTML = "TOTAL"
    totalbox2.style.textAlign = "center"
    totalbox2.style.cssFloat = "left"
    totalbox2.style.border = "thin solid red"
    orderinfokey.appendChild(totalbox2)
}

drawfinalizedheaders()

finalize.addEventListener("click", function(){
    let cardcash = prompt("Please enter the Credit Card or Cash Info below (last four digits or '1111' for Cash.")
    let expiredate = prompt("Please enter the expdate of the card or Cash Info (last four digits or '1111' for Cash.")
    currentorder.FinalizeOrder(cardcash, expiredate)



})