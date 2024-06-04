import React, { useState } from 'react';
import styles from './App.module.css';
import Loading from './components/Loading/Loading';
import { getImage, promptToImage } from './services/openAiService';
import { FaWandMagicSparkles } from "react-icons/fa6";
import ImageAi from './components/ImageAi/ImageAi';
import { MdAddReaction } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [startLoading, setStartLoading] = useState(false)
  const [counter, setCounter] = useState(0)
  
  const [selectedScene, setSelectedScene] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [words, setWords] = useState('')
  const [comment, setComment] = useState('')
  const [characters, setCharacters] = useState([]);

  const [freeText, setFreeText] = useState(false);
  const [freePrompt, setFreePrompt] = useState('')

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

  // create 4 images from the open text
  const getImageFreeText = async () => {
    setCounter(prevCounter => prevCounter + 1);
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    console.log(freePrompt);
    setStartLoading(true)

    try {
      const imageRequests = [
        promptToImage(freePrompt),
        promptToImage(freePrompt),
        promptToImage(freePrompt),
        promptToImage(freePrompt)
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

  // create 4 images from the closed text
  const getImages = async () => {
    setCounter(prevCounter => prevCounter + 1);
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

  const handleSceneChange = (value) => {
    setSelectedScene(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleWordsChange = (e) => {
    setWords(e.target.value);
  };

  const handlePromptChange = (e) => {
    setFreePrompt(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const changePromptStyle = (e) => {
    setFreeText(e.target.value === "true");
  };

  return (
    <div className={styles.container}>
      <div className={styles.data_container}>
        <div className={styles.lang_div}>
          <div>
            <input defaultChecked type="radio" id="english" name="language" value="en" onChange={() => changeLanguage('en')}/>
            <label>English</label>
          </div>
          <div>
            <input type="radio" id="hebrew" name="language" value="heb" onChange={() => changeLanguage('heb')}/>
            <label>Hebrew</label>
          </div>
          <div>
            <input type="radio" id="russian" name="language" value="rus" onChange={() => changeLanguage('rus')}/>
            <label>Russian</label>
          </div>
        </div>
        
        <div className={styles.freeText}>
          <div>
            <input type="radio" name="promptStyle" value="false" checked={!freeText} onChange={changePromptStyle}/>
            <label>{t('text.textClosed')}</label>
          </div>
          <div>
            <input type="radio" name="promptStyle" value="true" checked={freeText} onChange={changePromptStyle}/>
            <label>{t('text.textOpen')}</label>
          </div>
        </div>

        {freeText? 
          <div className={styles.free_text_div}>
            <label>{t('labels.scene')}</label>
            <textarea value={freePrompt} onChange={handlePromptChange} placeholder={t('text.writeYourScene')}></textarea>
          </div>
        :
          <div>
            <div className={styles.selectDiv}>
              <div className={styles.select1_div}>
                <label>{t('labels.scene')}</label>
                <select 
                  className={styles.select} 
                  value={selectedScene} 
                  onChange={(e) => handleSceneChange(e.target.value)}
                >
                  <option disabled value="">{t('options.selectScene')}</option>
                  {t('options.scenes', { returnObjects: true }).map(scene => (
                    <option key={scene} value={scene}>{scene}</option>
                  ))}
                </select>
              </div>

              <div className={styles.select2}>
                <label>{t(`labels.imageType`)}</label>
                <select 
                  className={styles.select} 
                  value={selectedType} 
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <option disabled value="">{t('options.selectType')}</option>
                  {t('options.types', { returnObjects: true }).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.characters_div}>
              <label>{t('labels.charactersInScene')}</label>
              {Array.isArray(characters) && characters.map((item, index) => (
                <div className={styles.selectDiv} key={index}>
                <select 
                  className={styles.select} 
                  value={item.character} 
                  onChange={(e) => handleCharacterChange(index, e.target.value)}
                >
                  <option disabled value="">{t('options.selectCharacter')}</option>
                  {t('options.characters', { returnObjects: true }).map(character => (
                    <option key={character} value={character}>{character}</option>
                  ))}
                </select>

                  <input
                    placeholder={t('labels.whatCharacterDoes')}
                    className={styles.character_input}
                    value={item.action}
                    onChange={(e) => handleActionChange(index, e.target.value)}
                  />
                </div>
              ))}

              <button className={styles.add_characters_btn} onClick={addCharacter}>
                <span>{t('buttons.addCharacter')}</span>
                <MdAddReaction className={styles.add_icon}></MdAddReaction>
              </button>
            </div>

            <div className={styles.text_div}>
              <div className={styles.words_data_div}>
                <label>{t('labels.words')}</label>
                <textarea className={styles.words_textarea} value={words} onChange={handleWordsChange}></textarea>
              </div>

              <div className={styles.words_data_div}>
                <label>{t('labels.comments')}</label>
                <textarea className={styles.comment_textarea} value={comment} onChange={handleCommentChange}></textarea>
              </div>
            </div>    
          </div>
        }
        
        <div className={styles.btn_div}>
          <button className={styles.submit_btn} onClick={freeText ? getImageFreeText : getImages}>
            <label>{t('buttons.generateLabel')}</label>
            <FaWandMagicSparkles></FaWandMagicSparkles>
          </button>

          {counter > 0 &&
            <div>
              {t('labels.amountOfClicks')} {counter}
            </div>
          }
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
  );
};


export default App;
