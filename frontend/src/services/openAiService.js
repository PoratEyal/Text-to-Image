import axios from "axios";

const DALLEUrl = "https://api.openai.com/v1/images/generations";
const openAiheaders = {
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    "Content-Type": "application/json",
};

export async function getImage(scene, imageType, words, comment, characters) {
    const prompt = `Create me ${imageType} image with this scene: ${scene}.The characters of the image will be: ${characters}. Add to the image all of those objects: ${words}. Comments about the picture: ${comment}, Add good lightning.`;
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
