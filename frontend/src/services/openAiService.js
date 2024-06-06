import axios from "axios";

const DALLEUrl = "https://api.openai.com/v1/images/generations";
const openAiheaders = {
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    "Content-Type": "application/json",
};

export async function getImage(scene, imageType, words, comment, characters) {
    const prompt = `
    Create a highly detailed and photorealistic image with the following scene: ${scene}. 
    Characters: ${characters}. 
    Objects to include naturally in the scene: ${words}. 
    Additional details: ${comment}. 
    Ensure the image has good lighting, sharp details, and looks like a photograph, avoiding any cartoonish or unrealistic styles.
    `;
    
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
