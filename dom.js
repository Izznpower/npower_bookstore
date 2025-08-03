const api='https://bookstore-api-six.vercel.app/api/books';
const dataContainer = document.querySelector('#bookList');

const hArray = ["title", "author", "publisher", "description", "language"]

async function loadIntoTable(url, table){
     try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        function getTH () {
            console.log(Object.keys(data[0]));
            const column = Object.keys(data[0]);
            const head = document.querySelector('thead');
            let tags = "<tr>";
                for (i = 0 ; i <column.length; i++) {
                    if (hArray.includes (column[i])) {
                        tags += `<th>${column[i]}</th>`;
                    }
                }
            tags += "</tr>"
            head.innerHTML = tags;
            } 
            
        function getTD() {
            const body = document.querySelector('tbody');
            let tags = "";
            data.map(d => {
                tags += `<tr id="book-${d.id}">
                    <td>${d.title}</td>
                    <td>${d.author}</td>                    
                    <td>${d.publisher}</td>
                    <td>${d.description}</td>  
                    <td>${d.language}</td>
                    <td>
                        <button class="deleteButton" data-id="${d.id}">delete</button>
                    </td>
                </tr>`
            })
            body.innerHTML = tags;
        }
        getTH();
        getTD();
    } catch (error) {
         console.log('Error' , error);
    }  
}
loadIntoTable(api, dataContainer);


//To add data to DB.
const formEl = document.querySelector('#add-book-form');
 
async function sendData() {
    try {
        const formData = new FormData(formEl);
        const payload = Object.fromEntries(formData);
        console.log(payload);

        const response = await fetch (api, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
            'content-type': 'application/json; charset=UTF-8'
            }
        })

        const d = await response.json();
        console.log('Response:', d);

        // Add new row to table
        const newRow = document.querySelector('#tbody'); 
        newRow.innerHTML +=
                 `<tr id="book-${d.id}">
                    <td>${d.title}</td>
                    <td>${d.author}</td>                    
                    <td>${d.publisher}</td>
                    <td>${d.description}</td>  
                    <td>${d.language}</td>
                    <td>
                        <button class="deleteButton" data-id="${d.id}">delete</button>
                    </td>
                </tr>`
        formEl.reset();
        console.log('Form is submitted');
        alert('Book submitted');
    } catch {
        console.log('unable to send Data.');
    }
}

formEl.addEventListener('submit', function(event) {
    event.preventDefault();
    sendData();
})

//To delete books from DB.
//const deleteEl = document.querySelector('.deleteButton'); ONLY need this if u want to add even to a SINGLE BUTTON.!!!!

async function deleteData(id) {
    try {
        const response = await fetch(`${api}/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json' 
            }
        });
        console.log(`Item ${id} deleted`);
        document.getElementById(`book-${id}`)?.remove();
        console.log(`Book ${id} deleted and row removed`); 
        alert('Book deleted!');
        

    } catch (error) {
        console.error('Delete failed:', error);
    }
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('deleteButton')) {
        const id = event.target.dataset.id;
        if (id) {
            deleteData(id);
        } else {
            console.error('Delete button missing data-id attribute');
        }
    }
});






