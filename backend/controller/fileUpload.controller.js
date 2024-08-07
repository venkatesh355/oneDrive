const opn = require("opn");
const fs = require("fs");
const axios = require("axios");
const { URLSearchParams } = require("url");
require("dotenv").config();
const Client_ID = process.env.Client_ID;
const Tenant_ID = process.env.Tenant_ID;
const Secret_ID = process.env.Secret_ID;
const path = require("path");

let filePaths=[]
let folderName=''

exports.getUrlCode = async (req, res) => {
  try {
    console.log("Hit....");
    if (!req.files) {
      return res.status(400).send({
        status: false,
        message: "No file uploaded",
      });
    }
    // code for selecting multiple file
    let uploadedFiles  = req.files.files;
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }
    folderName = req.body.folderName
    const dir = path.join(__dirname);
    await fs.promises.mkdir(dir, { recursive: true }); 

    filePaths = []; 

    for (let file of uploadedFiles) {
      const filePath = path.join(dir, file.name); 
      await fs.promises.writeFile(filePath, file.data); 
      filePaths.push(filePath); 
    }
// url for opening or giving access to onedrive
    const url = `https://login.microsoftonline.com/${Tenant_ID}/oauth2/v2.0/authorize?client_id=${Client_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost:5000%2Fmyapp%2F&response_mode=query&scope=0f767b47-df60-4af2-8095-aa1ccd0d7d9e%2f.default&state=12345&sso_reload=true`;
    console.log("URl", url);

    await opn(url);
    res.send({ status: true, message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error occurred", error);
  }
};

// code for getting the redirected-url and from tat getting the "code"
exports.myapp = async (req, res) => {
  try {
    const queryParams = new URL("https://test.com" + req.originalUrl);
    const code = queryParams.searchParams.get("code");
    if (!code) {
      throw new Error("No code found in URL parameters");
    }
   
    const tokenResponse = await getToken(code);
   
    res.send(tokenResponse)
  } catch (error) {
    console.log("Error in getting code-->", error);
    res.status(500).send(error);
  }
};
// code for generating access and refersh token 
async function getToken(code) {
    try {
        const url = `https://login.microsoftonline.com/${Tenant_ID}/oauth2/v2.0/token`;
        const data = {
            client_id: `${Client_ID}`,
            scope: '0f767b47-df60-4af2-8095-aa1ccd0d7d9e/.default openid profile offline_access',
            code: code,
            redirect_uri: 'http://localhost:5000/myapp/',
            grant_type: 'authorization_code',
            client_secret: `${Secret_ID}`
        };
        const response = await axios.post(url, new URLSearchParams(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const refreshToken = response.data.refresh_token;
        const accessToken = await getAccessToken(refreshToken);
        return accessToken;

    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get access token');
    }
}
//  code for taking the above referesh token and generating new access token
async function getAccessToken(refreshToken){
    try{
        const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
        const data ={
        client_id: `${Client_ID}`,
        client_secret: `${Secret_ID}`,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'https://graph.microsoft.com/.default'
    }
    const response = await axios.post(url, new URLSearchParams(data), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
   
    for (let filePath of filePaths) {
      await uploadFileToOneDrive(filePath, response.data.access_token,folderName);
    }
    return ("File Uploaded Successfully To One-Drive!!!")
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get access token');
    }
}

// code for uploading files to onedrive using the above access token
async function uploadFileToOneDrive(filePath, accessToken,folderName) {

  try {
    console.log("uploadFileToOneDrive hit");

  const fileName = path.basename(filePath);
  console.log("folder created Name is:",folderName)
  
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${folderName}/${fileName}:/content`;
    const fileContent = await fs.promises.readFile(filePath);

    const response = await axios.put(url, fileContent, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/pdf'
      }
    });
    await fs.promises.unlink(filePath)
    console.log('File uploaded successfully:', response.data.createdBy.user);
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : error.message);
    throw new Error('Failed to upload file to OneDrive');
  }
}
