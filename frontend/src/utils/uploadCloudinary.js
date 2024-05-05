const upload_preser =import.meta.env.VITE_UPLOAD_PRESET
const cloud_name =import.meta.env.VITE_CLOUD_NAME
const uploadImageToCloudinary = async file => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", upload_preser);
    uploadData.append("cloud_name",cloud_name);
    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, 
        {
        method: "POST",
        body: uploadData,
    });
    const data = await res.json();
    return data;

}
export default uploadImageToCloudinary;