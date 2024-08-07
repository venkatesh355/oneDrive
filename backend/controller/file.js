const path = require('path');
const fs = require('fs');


exports.fileUploads = async(req,res)=>{
    try {
         if(!req.files){
          return  res.status(400).send({
                status:false,
                message:"No file uploaded"
                });
         }
        console.log('Uploaded file:', req.files.file);

        let uploadedFile = req.files.file; // Adjust this based on how the file is structured in req
        console.log("Uploaded file:", uploadedFile);

        // Example: Save file to disk
        
        const DirectoryPath = path.join("c:/Users/Ainan/Downloads/Uploads", 'uploads');
       await fs.promises.mkdir(DirectoryPath,{recursive:true})
        await fs.promises.writeFile(DirectoryPath+"/sample.pdf", uploadedFile.data);
        if(!fs.existsSync(DirectoryPath)){
            fs.mkdirSync(DirectoryPath, {recursive: true})
        }
        res.status(200).json({ message: 'File uploaded successfully' });

    } catch (error) {
        console.log("error in uploading",error)
    }
}