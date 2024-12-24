const baseUrl = "http://localhost:4322"

async function upload(file) {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    fetch(`${baseUrl}/uploads`, {
        method: "POST",  
        body: formData
    })
    .then(async (response) => {
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

function submit(event){
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if(file){
        upload(file)
        .then(() => {
            alert("File uploaded");
        })
        .catch((error) => {
            alert(error.message);
        });
    } else {
        alert("please choose a file");
        
    }      
}

const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener('submit', submit);