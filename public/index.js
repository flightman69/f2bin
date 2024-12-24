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

async function download() {
    const file = (document.getElementById("fileInput")).files[0];
    const fileName = file.name;
    const downloadUrl = `${baseUrl}/uploads`;
    fetch(downloadUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }
            return response.blob(); 
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName; 
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            alert(error.message);
        });
}

function downloadHandler(event){
    event.preventDefault();
    download();
}

function submit(event){
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if(file){
        upload(file)
        .then(() => {
            alert("File uploaded ;)");
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

const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener('click', downloadHandler);