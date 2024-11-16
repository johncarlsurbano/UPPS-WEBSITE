import React from 'react'
import { useState } from 'react'
import axios from 'axios'



export const Sample = () => {
    
    const [file, setFile]= useState(null)
    const [progress, setProgress] = useState ({started:false, pc: 0})
    const [msg , setMsg ] = useState(null)

    const uploadFile = () => {
       try{
        if (!file) {
            setMsg("File not Found!")
            return;
        }
        const fd = new FormData();
        fd.append('pdf', file);

        setMsg('Uploading...')
        setProgress((prevState) => {
            return {...prevState, started: true}
        })
        axios.post('http://127.0.0.1:8000/api/uploadfile/', fd, {
            onUploadProgress: (progressEvent) => { setProgress(prevState => {
                return { ...prevState, pc: progressEvent.progress*100}
            }) }
        })
        .then(res => {
            setMsg('File Uploaded Successfully!')
            console.log(res.data)
        })
        .catch(err => {
            setMsg('Error Uploading File!')
            console.log(err)
        });

       }
       catch 
       {
        console.log("Error Uploading File!")
        return;
       }
    }   

  return (
    <div>
        <h1>Upload Files</h1>
        <input type="file" onChange={(e) => {
            setFile(e.target.files[0])
        }} />
        <button onClick={uploadFile}>Upload</button>

        {progress.started && <progress max='100' value={progress.pc}></progress>}
        {msg && <span>{msg}</span>}
    </div>
  )
}
