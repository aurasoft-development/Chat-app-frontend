import commonApiRequest from "../api/commonApi";

// Function to upload captured images
export const uploadImages = async (captureImage) => {
    try {
        const apiUrl = `/api/user/upload_image`;
        const formData = new FormData();
        formData.append('files', captureImage);

        const response = await commonApiRequest('post', apiUrl, formData)
        return response;
    } catch (error) {
        // Throwing the error for further handling
        throw error;
    }
}

