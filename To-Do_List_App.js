if(__name__ = "__main__"){
    // Assign add item function to enter button on the form ton allow for better UX
    const form = document.getElementById("frm1");
    form.addEventListener("keypress", (event) => {
        if(event.key === "Enter"){
            event.preventDefault();
            additem();
        }
    })
    // Set initial date as todays date
    document.getElementById("frm1").elements[1].valueAsDate = new Date();
    
    // Allow storage of multiple items
    let item_data = [];
    // Create a division to display elements
    const division = document.createElement("div");
    // Check local storage to recover any previous items
    if(localStorage.getItem("item_data") != null){
        // Store remembered data in item_data, rememberinjg to split by , 
        const test_data_store = localStorage.getItem("item_data").split(",");
        for(let i=0; i<(test_data_store.length/4); i++){
            item_data.push([test_data_store[i*4], test_data_store[(i*4) + 1], test_data_store[(i*4) + 2], test_data_store[(i*4) + 3]]);
        }
    }
    // Show remebered values
    updatelabel();
}

function additem(){
    // Get input from frm1 object
    let input = document.getElementById("frm1");
    if(!input.elements[1].value){
        alert("Please enter a date");
    }
    else{
        // Push the input into items_array
        const item = input.elements[0].value;
        const style = "none";
        const priority = document.getElementById("Priority_Combobox").value;
        const date = input.elements[1].value;
        item_data.push([item, style, priority, date]);
        updatelabel();
        input.elements[0].value = "";
        document.getElementById("Priority_Combobox").value = "None";

    }
}

function updatelabel(){
    // Sort items by relevent filter
    const sort_type = document.getElementById("Sort_Combobox").value;
    if(sort_type == "Priority"){item_data.sort(priority_sort)}
    if(sort_type == "Date"){item_data.sort(date_sort)}

    // Clear any active elements within the division
    division.replaceChildren();
    for(item in item_data){
        // Create a checkbox to display next to item
        const checkbox = document.createElement("input");
        checkbox.type="checkbox";
        checkbox.id= "Test_checkbox";
        checkbox.name = "Item checkbox";
        checkbox.onclick = checkoff;

        // When adding a new item keep old checked items as checked
        if(item_data[item][1] == "line-through"){checkbox.checked = true;}

        // Store input value as the text for the checkbox
        const checkbox_item = document.createElement('label');
        checkbox_item.textContent = item_data[item][0];
        checkbox_item.id= "Checkbox_item";
        checkbox_item.style.textDecoration = item_data[item][1];
		// Use the priority of the item to colour it 
		switch(item_data[item][2]){
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
        // Initialize days_left to avoid error when appending to div 
        const days_left_element = document.createElement("label");
        // Create date element with value for the current day
        let today = new Date();
        let finish_date = Date.parse(item_data[item][3]);
        // Calculate the difference in days between dates
        let days_left = Math.ceil((finish_date - today.getTime()) / (1000*3600*24));
        // Show number of days left
        days_left_element.textContent = " Due in " + days_left + " Day(s)";
        // Today looks nicer than 0 day(s)
        if(days_left == 0){days_left_element.textContent = " Due Today"}
        // Make it clear when task is over due
        if(days_left < 0){
            days_left_element.style.color = "red";
            days_left_element.textContent = " OVERDUE " + days_left_element.textContent; 
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
        division.appendChild(days_left_element);
        division.appendChild(delete_button);
        division.appendChild(line_break);
        // Append Div to document to display it 
        document.body.appendChild(division);
    }
    if(item_data.length>0){
        update_memory();
    }
}

function update_memory(){
    // Update local storage
    localStorage.setItem("item_data", item_data);
}
function delete_memory(){
    // Reset button on memory mostly used for testig purposes
    localStorage.removeItem("item_data");
    updatelabel();
}

function checkoff(){
    /*
    When the checkbox it checked this will add a strike through the associated item
    */
    // Get child elements from the Div
    let children = division.childNodes;
    
    let no_children = children.length;

    //Check if checkbox is checked
    for(let i=0; i<(no_children/5); i++){
        if (children[i*5].checked){
            // Update the text style to have a line through it 
            children[(i*5)+1].style.textDecoration = "line-through";
            item_data[i][1] = "line-through";
        }
        if(!children[i*5].checked && children[(i*5)+1].style.textDecoration == "line-through"){
            // Unstrike text when box is unchecked
            children[(i*5)+1].style.textDecoration = "none";
            item_data[i][1] = "none";
        }
    }
    update_memory();
}

function delete_item(){
    // Find the index of the button pressed
    button_position = parseInt(this.id.slice(-1));
    // Delete info on the selected item
    item_data.splice(button_position,1);
    // Update the page
    updatelabel();
}

function priority_sort(item_1, item_2){
    /*
    Function used in for .sort(), returns postive value if prioirty of item 2 is higher or -1 if it is lower.
    If priorities are the same then returns difference between date values to sort by date and priority
    */ 
    switch (item_1[2]){
        case "Low":
            return item_2[2] == "Low"? (Date.parse(item_1[3]) - Date.parse(item_2[3])) : 1
        case "Medium":
            switch (item_2[2]){
                case "Low":
                    return -1
                case "High":
                    return 1 
                default: 
                    return (Date.parse(item_1[3]) - Date.parse(item_2[3]))
            }
        case "High":
            return item_2[2] == "High"? (Date.parse(item_1[3]) - Date.parse(item_2[3])) :-1
    }
}
function date_sort(item_1, item_2){
    /*
    Function used in for .sort(), returns differnce between due dates of items.
    If due dates are the same then returns difference between prioirties.
    */ 

    if(Date.parse(item_1[3]) - Date.parse(item_2[3]) == 0 ){
        switch (item_1[2]){
            case "Low":
                return item_2[2] == "Low"? 0 : 1
            case "Medium":
                switch (item_2[2]){
                    case "Low":
                        return -1
                    case "High":
                        return 1 
                    default: 
                        return 0
                }
            case "High":
                return item_2[2] == "High"? 0 :-1
        }
    }
    
    return (Date.parse(item_1[3]) - Date.parse(item_2[3]))
}