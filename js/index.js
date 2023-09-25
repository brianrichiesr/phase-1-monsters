/* Global Variables */
const createMonsterFormContainer = document.querySelector("#create-monster");
const monsterContainer = document.querySelector("#monster-container");
const monsUrl = "http://localhost:3000/monsters/?_limit=25&_page=";
const backBtn = document.querySelector("#back");
const forwardBtn = document.querySelector("#forward");
let monsterForm, monsterName, monsterAge, monsterDescription;
let pageCount = 1;
let monsterCount = 1001;
let lastMonsterId = 0;

/* Function to iterate back and forth through the pages of monsters in database */
const turnPage = (pageAdjustNum) => {
    /* Adds the value of 'pageAdjustNum' to 'pageCount' */
    pageCount += pageAdjustNum;
    /* Calls 'getMonsters' per earlier set variables in 'monsUrl' and 'pageCount' */
    getMonsters(`${monsUrl}${pageCount}`);
}

/* Function to create 'monsterForm' */
const createMonsForm = () => {
    /* Create elements and set necessary attribute values */
    const monsForm = document.createElement("form");
    monsForm.id = "monsForm";
    const monsName = document.createElement("input");
    monsName.id = "monsName";
    monsName.setAttribute("placeholder", "name...")
    const monsAge = document.createElement("input");
    monsAge.id = "monsAge";
    monsAge.setAttribute("placeholder", "age...")
    const monsDesc = document.createElement("input");
    monsDesc.id = "monsDesc";
    monsDesc.setAttribute("placeholder", "description...")
    const monsBtn = document.createElement("input");
    monsBtn.setAttribute("type", "submit");
    monsBtn.value = "Create";
    /* Append the elements to 'monsForm' then append 'monsForm' to 'createMonsterFormContainer' */
    monsForm.append(monsName, monsAge, monsDesc, monsBtn);
    createMonsterFormContainer.append(monsForm);
    /* Assign the values of the form variables */
    monsterForm = monsForm;
    monsterName = monsName;
    monsterAge = monsAge;
    monsterDescription = monsDesc;
}

/* Calls 'createMonsForm' */
createMonsForm();

/* Function that takes an object as an argument and displays the objects info on page */
const displayMonsters = (monster) => {
    /* Create elements and set necessary attribute values */
    const div = document.createElement("div");
    div.setAttribute("data-mons-id", monster.id)
    const h2 = document.createElement("h2");
    h2.textContent =  monster.name;
    const h4 = document.createElement("h4");
    h4.textContent =  monster.age;
    const p = document.createElement("p");
    p.textContent =  monster.description;
    /* Append the elements to 'div' then append 'div' to 'monsterContainer' */
    div.append(h2, h4, p);
    monsterContainer.append(div);
    /* Assigns the current object's id to 'lastMonsterId' */
    lastMonsterId = monster.id;
    /* If 'lastMonsterId' equals monsterCount (last page of monster info) */
    if (lastMonsterId === monsterCount) {
        /* Disable the button that paginates the data one page forward */
        forwardBtn.setAttribute("disabled", true);
    } else {
        /* Else remove the 'disabled' attribute */
        forwardBtn.removeAttribute("disabled");
    }
}

/* Function that takes the event as an argument and creates a new monster in the database */
const createNewMonster = (e) => {
    /* Prevent the default behavior of form submission */
    e.preventDefault();
    /* Form validation to ensure the user does not submit empty input values and assign the input values to variables */
    const newMonsterName = monsterName.value;
    if (newMonsterName.trim() === "") {
        return alert("Please give a name for the new monster")
    }
    const newMonsterAge = monsterAge.value;
    if (newMonsterAge.trim() === "") {
        return alert("Please give an age for the new monster")
    }
    const newMonsterDesc = monsterDescription.value;
    if (newMonsterDesc.trim() === "") {
        return alert("Please give a description for the new monster")
    }

    /* Create an object to send with the POST request */
    const newMonsterObj = {
        name: newMonsterName,
        age: newMonsterAge,
        description: newMonsterDesc
    }

    /* POST request */
    fetch(monsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newMonsterObj)
    })
    .then(response => {
        /* Conditional to find any undesired responses not caught by 'catch' checking the 'response.ok' response */
        if (response.ok) {
            return response.json();
        } else {
            throw (response.statusText);
        }
    })
    .then(() => {
        /* Send an alert to the user for a successful POST, clear the form, increase 'monsterCount' */
        alert("New monster successfully created!")
        monsterForm.reset();
        monsterCount += 1;
    })
    .catch(err => alert(err))
}

/* Function that takes a string as an argument and submits a GET request to get all monsters */
const getMonsters = (url) => {
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw (response.statusText);
        }
    })
    .then(data => {
        /* Clear the page of previous divs/monster info */
        monsterContainer.innerHTML = "";
        /* Calls 'displayMonsters' on each item in the 'data' array returned by a successful GET request */
        data.forEach(monster => displayMonsters(monster));
        /* If 'pageCount' (first page of monster info) */
        if (pageCount === 1) {
            /* Disable the button that paginates the data one page backward */
            backBtn.setAttribute("disabled", true);
        } else {
            /* Else remove the 'disabled' attribute */
            backBtn.removeAttribute("disabled");
        }
        /* Scroll the page to the 'h1' element */
        document.querySelector("h1").scrollIntoView();
    })
    .catch(err => alert(err))
}

/* Calls 'getMonsters' per earlier set variables in 'monsUrl' and 'pageCount' */
getMonsters(`${monsUrl}${pageCount}`);



/* Add event listeners */
monsterForm.addEventListener("submit", createNewMonster);
backBtn.addEventListener("click", () => turnPage(-1));
forwardBtn.addEventListener("click", () => turnPage(1));