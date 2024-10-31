// Allow storage of multiple items and keep track of their text styles (striked or not)
let items_array = [];
let text_style = [];
let priorities = [];
// Create a division to display elements
const division = document.createElement("div");

// Check local storage to recover any previous items
if(localStorage.getItem("items") != null && localStorage.getItem("styles") != null && localStorage.getItem("priorities") != null){
    // Store remembered data in arrays, rememberinjg to split by , 
    items_array = localStorage.getItem("items").split(",");
    text_style = localStorage.getItem("styles").split(",");
    priorities = localStorage.getItem("priorities").split(","); 
}
// Show remebered values
updatelabel();

function additem(){
    // Get input from frm1 object
    let input = document.getElementById("frm1");
    // Push the input into items_array
    items_array.push(input.elements[0].value);
    text_style.push("none");
	priorities.push(document.getElementById("Priority_Combobox").value);
    updatelabel();
}

function updatelabel(){
    // Clear any active elements within the division
    division.replaceChildren();
    for(item in items_array){
        // Create a checkbox to display next to item
        const checkbox = document.createElement("input");
        checkbox.type="checkbox";
        checkbox.id= "Test_checkbox";
        checkbox.name = "Item checkbox";
        checkbox.onclick = checkoff;

        // When adding a new item keep old checked items as checked
        if(text_style[item] == "line-through"){checkbox.checked = true;}

        // Store input value as the text for the checkbox
        const checkbox_item = document.createElement('span');
        checkbox_item.textContent = items_array[item];
        checkbox_item.id= "Checkbox_item";
        checkbox_item.style.textDecoration = text_style[item];
		// Use the priority of the item to colour it 
		switch(priorities[item]){
			case "High":
			  checkbox_item.style.color = "Red";
			  break;
			case "Medium": 
			  checkbox_item.style.color = "rgb(255, 204, 0)";
			  break;
			case "Low": 
			  checkbox_item.style.color = "Blue";
			  break;
			default:
			  checkbox_item.style.color = "none";
		}

        // Add a button to delete items if needed
        const delete_button = document.createElement('button');
        delete_button.id = "Delete button - " + item;
        delete_button.innerText = "x";
        delete_button.onclick = delete_item;
            
        // Create a line break to seperate different items
        const line_break = document.createElement('br');
        // Append check box, text and line break to Div 
        division.appendChild(checkbox);
        division.appendChild(checkbox_item);
        division.appendChild(delete_button);
        division.appendChild(line_break);
        // Append Div to document to display it 
        document.body.appendChild(division);
    }
    // Update local storage
    localStorage.setItem("items", items_array);
    localStorage.setItem("styles", text_style);
    localStorage.setItem("priorities", priorities);
}

function delete_memory(){
    // Reset button on memory mostly used for testig purposes
    localStorage.removeItem("items");
    localStorage.removeItem("styles");
    localStorage.removeItem("priorities");
}
function checkoff(){
    /*
    When the checkbox it checked this will add a strike through the associated item
    */
    // Get child elements from the Div
    let children = division.childNodes;
    
    let no_children = children.length;
    
    //Check if checkbox is checked
    for(let i=0; i<no_children-1; i++){
        if (children[i*4].checked){
            // Update the text style to have a line through it 
            children[(i*4)+1].style.textDecoration = "line-through";
            text_style[i] = "line-through";
        }
        if(!children[i*4].checked && children[(i*4)+1].style.textDecoration == "line-through"){
            // Unstrike text when box is unchecked
            children[(i*4)+1].style.textDecoration = "";
            text_style[i] = "";
        }
    }
}

function delete_item(){
    // Find the index of the button pressed
    button_position = parseInt(this.id.slice(-1));
    // Delete info on the selected item
    text_style.splice(button_position, 1);
    items_array.splice(button_position, 1);
    priorities.splice(button_position,1);
    // Update the page
    updatelabel();
}

function download_csv(){
    document.getElementById("Demo").innerHTML += "using require functions ";
	const fs = require('fs');
    const path = require('path');
    document.getElementById("Demo").innerHTML += "declared fs and path ";

    // Define the hardcoded file path
    const filePath = path.join(__dirname, 'To-Do_Items.csv'); // Adjust the filename as needed

    // Read the CSV file
    fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        
        document.getElementById("Demo").innerHTML += "Error reading file: "+ err;
        return;
    }
    
    // Split the file contents into lines
    let lines = data.split('\n');
    for (let line of lines) {
        let values = line.split(',');
        // Do something with each value
        document.getElementById("Demo").innerHTML += values;
    }
    });
}