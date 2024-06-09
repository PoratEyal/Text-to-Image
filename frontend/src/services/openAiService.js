import axios from "axios";

const DALLEUrl = "https://api.openai.com/v1/images/generations";
const openAiheaders = {
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    "Content-Type": "application/json",
};

export async function getImage(scene, imageType, words, comment, characters) {
    const prompt = 
    `Create a highly detailed ${imageType} image with the following scene: ${scene}. 
    Do not include any flags or text in the image, either on objects or in the background.
    Characters: ${characters}. The characters should be of regular American origin and appear as regular, everyday people, not models.
    Add the following objects naturally into the scene: ${words}. 
    Additional details: ${comment}. 
    Ensure the image has good lighting and adheres to the ${imageType} style. 
    Make sure to avoid including any flags or text in any part of the image.`;    
    
    const data = {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    };

    try {
        const response = await axios.post(DALLEUrl, data, { headers: openAiheaders });
        return response.data;
    } catch (error) {
        console.error("Error fetching image:", error);
        throw error;
    }
}


export async function promptToImage(scene) {
    const prompt = `${scene}`;
    const data = {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    };    

    try {
        const response = await axios.post(DALLEUrl, data, { headers: openAiheaders });
        return response.data;
    } catch (error) {
        console.error("Error fetching image:", error);
        throw error;
    }
}
