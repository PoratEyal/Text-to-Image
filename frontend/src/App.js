import React, { useState } from 'react';
import styles from './App.module.css';
import Loading from './components/Loading/Loading';
import { getImage } from './services/openAiService';
import { FaWandMagicSparkles } from "react-icons/fa6";
import ImageAi from './components/ImageAi/ImageAi';
import { MdAddReaction } from "react-icons/md";

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [startLoading, setStartLoading] = useState(false)
  
  const [selectedScene, setSelectedScene] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [words, setWords] = useState('')
  const [comment, setComment] = useState('')
  const [characters, setCharacters] = useState([]);

  // characters functions
  const addCharacter = () => {
    setCharacters([...characters, { character: '', action: '' }]);
  };

  const handleCharacterChange = (index, value) => {
    const newCharacters = [...characters];
    newCharacters[index].character = value;
    setCharacters(newCharacters);
  };

  const handleActionChange = (index, value) => {
    const newCharacters = [...characters];
    newCharacters[index].action = value;
    setCharacters(newCharacters);
  };

  // - - - - - - - - - - - - - - - - - - - -

  // create 4 images
  const getImages = async () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    const charactersString = characters.map(char => `${char.character} ${char.action}`).join(', ');
    console.log(selectedScene, selectedType, words, comment, charactersString);
    setStartLoading(true)

    try {
      const imageRequests = [
        getImage(selectedScene, selectedType, words, comment, charactersString),
        getImage(selectedScene, selectedType, words, comment, charactersString),
        getImage(selectedScene, selectedType, words, comment, charactersString),
        getImage(selectedScene, selectedType, words, comment, charactersString)
      ];
  
      const responses = await Promise.all(imageRequests);
      const images = responses.map(response => response.data);

      setImage1(images[0]);
      setImage2(images[1]);
      setImage3(images[2]);
      setImage4(images[3]);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSceneChange = (event) => {
    setSelectedScene(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleWordsChange = (e) => {
    setWords(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return <div className={styles.container}>
    <div className={styles.data_container}>
      
      <div className={styles.selectDiv}>
        <div className={styles.select1_div}>
          <label>Scene</label>
          <select className={styles.select} value={selectedScene} onChange={handleSceneChange}>
            <option disabled value="">Select a scene</option>
            <option value="Living room">Living room</option>
            <option value="Home">Home</option>
            <option value="Garden">Garden</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Office">Office</option>
            <option value="Street">Street</option>
            <option value="Mall">Mall</option>
            <option value="Forest">Forest</option>
            <option value="Cinema">Cinema</option>
            <option value="Park">Park</option>
            <option value="Library">Library</option>
            <option value="Beach">Beach</option>
            <option value="School">School</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>

        <div className={styles.select2}>
          <label>Image Type</label>
          <select className={styles.select} value={selectedType} onChange={handleTypeChange}>
            <option disabled value="">Select a type</option>
            <option value="realistic">Realistic</option>
            <option value="PIXAR">PIXAR</option>
            <option value="cartoon">Cartoon</option>
            <option value="blackWhite">Black & White</option>
            <option value="retro">Retro</option>
            <option value="comic">Comic</option>
            <option value="watercolor">Watercolor</option>
            <option value="sketch">Sketch</option>
            <option value="abstract">Abstract</option>
            <option value="surreal">Surreal</option>
          </select>
        </div>
      </div>

      <div className={styles.characters_div}>
        <label>Characters in the Scene</label>
        {Array.isArray(characters) && characters.map((item, index) => (
          <div className={styles.selectDiv} key={index}>
            <select className={styles.select} value={item.character} onChange={(e) => handleCharacterChange(index, e.target.value)}>
              <option disabled value="">Select Character</option>
              <option value="Girl">Girl</option>
              <option value="Boy">Boy</option>
              <option value="Grandmother">Grandmother</option>
              <option value="Grandfather">Grandfather</option>
              <option value="Man">Man</option>
              <option value="Woman">Woman</option>
            </select>

            <input
              placeholder='What the character does?'
              className={styles.character_input}
              value={item.action}
              onChange={(e) => handleActionChange(index, e.target.value)}
            />
          </div>
        ))}

        <button className={styles.add_characters_btn} onClick={addCharacter}>
          <span>Character</span>
          <MdAddReaction className={styles.add_icon}></MdAddReaction>
        </button>
      </div>

      <div className={styles.text_div}>
        <div className={styles.words_data_div}>
          <label>Words</label>
          <textarea  className={styles.words_textarea} value={words} onChange={handleWordsChange}></textarea>
        </div>

        <div className={styles.words_data_div}>
          <label>Comments</label>
          <textarea className={styles.comment_textarea} value={comment} onChange={handleCommentChange}></textarea>
        </div>
      </div>
      
      <div className={styles.btn_div}>
        <button className={styles.submit_btn} onClick={getImages}>
          <label>Generate</label>
          <FaWandMagicSparkles></FaWandMagicSparkles>
        </button>
      </div>
    </div>

    {startLoading &&
      <div className={styles.img_container}>
          {image1 && image2 && image3 && image4 ?
            <div className={styles.grid_container}>
              <ImageAi image={image1[0]?.url}></ImageAi>
              <ImageAi image={image2[0]?.url}></ImageAi>
              <ImageAi image={image3[0]?.url}></ImageAi>
              <ImageAi image={image4[0]?.url}></ImageAi>
            </div>
          :
            <Loading></Loading>
          }
      </div>}

  </div>
}

export default App;
