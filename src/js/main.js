import names from './availableNames.js'
import quotes from './traitsQuotes.js'
import Character from './characterEntity.js'
import traits from './traits.js'

const API_KEY = "";

// classes and html entities variables
const homeContainer = document.querySelector('.container')
const cardContainer = document.querySelector('.card-modal')
const storyField = document.querySelector('.story-field')
const form = document.querySelector('form')
const sideBar = document.querySelector('aside')
const nameCardField = document.querySelector("#character-name")
const raceCardField = document.querySelector("#character-race")
const classCardField = document.querySelector("#character-class")
const traitCardField = document.querySelector("#character-trait")
const quoteCardField = document.querySelector("#character-quote")
const storyCardField = document.querySelector("#character-story")
const characterImg = document.querySelector("#character-img");
// fields varibles
const nameInput = document.querySelector('#name-input')
const raceTypes = document.querySelectorAll('input[name="race"]')
const classTypes = document.querySelectorAll('input[name="class"]')
// buttons variables
const randomNameBtn = document.querySelector('#random-name-btn')
const randomBtn = document.querySelector('#random-btn')
const favoritesBtn = document.querySelector('#favorites-btn')
const historyBtn = document.querySelector('#history-btn')
const saveBtn = document.querySelector('#save-btn')
const closeBtn = document.querySelector('#close-btn')
const menuBtn = document.querySelector('#menu-btn')
const clearBtn = document.querySelector('#clear-btn')
const homeBtn = document.querySelector('#home-btn')
const searchInput = document.querySelector('#search-input')
const searchResult = document.querySelector('#search-result')

let charactersHistory = JSON.parse(localStorage.getItem('characters') || '[]')
let favoritesCharacters = JSON.parse(localStorage.getItem('favorites') || '[]')
let newCharacter, characterClass, characterRace, characterName, characterQuote, characterTrait, characterStory

form.addEventListener('submit', event => {
    event.preventDefault()
    newCharacter = new Character()

    storyField.style.overflowY = 'scroll'

    raceTypes.forEach(element => {
        if(element.checked)
            characterRace = element.value
    })
    
    classTypes.forEach(element => {
        if(element.checked)
            characterClass = element.value
    })

    characterQuote = quotes[Math.floor(Math.random() * quotes.length)].quote
    characterTrait = traits[Math.floor(Math.random() * traits.length)].trait
    
    if(nameInput.value == '')
        characterName = names[Math.floor(Math.random() * names.length)].name
    else
        characterName = nameInput.value 
    
    newCharacter.setName(characterName)
    newCharacter.setRace(characterRace)
    newCharacter.setClass(characterClass)
    newCharacter.setQuote(characterQuote)
    newCharacter.setTrait(characterTrait)
    newCharacter.setImage(`./img/${characterRace.toLowerCase()}/${characterClass.toLowerCase()}/${characterRace.toLowerCase()}-${characterClass.toLowerCase()}-1.jpg`)
    storyCardField.textContent = "Loading..."

    characterStory = sendMessageToChatGPT(`Create a story for a rpg character named "${characterName}", of the race "${characterRace}", with the class "${characterClass}". The trais of this character is "${characterTrait}". Try not to exceed 400 caracters.`)

    const storyParse = async () => {
        storyCardField.textContent = await characterStory
        newCharacter.setStory(await characterStory)
    }
    storyParse()
    
    newCharacter.setStory(Promise.resolve(characterStory))

    nameCardField.textContent = characterName
    raceCardField.textContent = characterRace
    classCardField.textContent = characterClass
    traitCardField.textContent = characterTrait
    quoteCardField.textContent = characterQuote

    characterImg.setAttribute('src', newCharacter.img)

    charactersHistory.push(newCharacter)
    localStorage.setItem ('characters', JSON.stringify(charactersHistory))

    //reset values
    nameInput.value = ''

    homeContainer.classList.add('hide')
    cardContainer.classList.remove('hide')
})

randomNameBtn.addEventListener('click', () => {
    randomNameBtn.classList.toggle('rotation')
    nameInput.value = names[Math.floor(Math.random() * names.length)].name
})

menuBtn.addEventListener('click', () => {
    sideBar.classList.remove('hide')
    menuBtn.classList.add('hide')
})

closeBtn.addEventListener('click', () => {
    sideBar.classList.add('hide')
    menuBtn.classList.remove('hide')
})

homeBtn.addEventListener('click', () => {
    homeContainer.classList.remove('hide')
    cardContainer.classList.add('hide')
})

favoritesBtn.addEventListener('click', () => {
    
    if( favoritesBtn.textContent === "► Favorites") {
        favoritesBtn.textContent = "▼ Favorites"
        
        favoritesCharacters.forEach(character => {
            document.querySelector('#favorite-characters').insertAdjacentHTML("beforeend", `<a id="favorite-element" href="#">${character.name}</a><br>`)
        })
        document.querySelectorAll('#favorite-element').forEach(element => {
            element.addEventListener('click', () => {

                homeContainer.classList.add('hide')
                cardContainer.classList.remove('hide')

                let selectedCharacter = charactersHistory.filter(character => character.name == element.textContent)
                nameCardField.textContent = selectedCharacter[0].name
                raceCardField.textContent = selectedCharacter[0].race
                classCardField.textContent = selectedCharacter[0].class
                traitCardField.textContent = selectedCharacter[0].trait
                quoteCardField.textContent = selectedCharacter[0].quote
                storyCardField.textContent = selectedCharacter[0].story
                characterImg.setAttribute('src', selectedCharacter[0].img)
            })
        })
    }
    else {
        favoritesBtn.textContent = "► Favorites"
        document.querySelector('#favorite-characters').innerHTML = ''
    }
})

historyBtn.addEventListener('click', () => {
    
    if(historyBtn.textContent === "► History") {
        historyBtn.textContent = "▼ History"
        
        charactersHistory.forEach(character => {
            document.querySelector('#character-history').insertAdjacentHTML("beforeend", `<a id="history-element" href="#">${character.name}</a><br>`)
        })
        document.querySelectorAll('#history-element').forEach(element => {
            element.addEventListener('click', () => {

                homeContainer.classList.add('hide')
                cardContainer.classList.remove('hide')

                let selectedCharacter = charactersHistory.filter(character => character.name == element.textContent)
                nameCardField.textContent = selectedCharacter[0].name
                raceCardField.textContent = selectedCharacter[0].race
                classCardField.textContent = selectedCharacter[0].class
                traitCardField.textContent = selectedCharacter[0].trait
                quoteCardField.textContent = selectedCharacter[0].quote
                storyCardField.textContent = selectedCharacter[0].story
                characterImg.setAttribute('src', selectedCharacter[0].img)

            })
        })
    }
    else {
        historyBtn.textContent = "► History"
        document.querySelector('#character-history').innerHTML = ''
    }
})

saveBtn.addEventListener('click', () => {
    if(favoritesCharacters.map(character => character.name).includes(newCharacter.name)) {
        alert("Character already added!")
    } else {
        favoritesCharacters.push(newCharacter)
        localStorage.setItem ('favorites', JSON.stringify(favoritesCharacters))
        homeContainer.classList.remove('hide')
        cardContainer.classList.add('hide')
        alert("Save sucessfully!")
    }

})

clearBtn.addEventListener('click', () => {
    localStorage.clear()
    charactersHistory = new Array()
    favoritesCharacters = new Array()
    historyBtn.textContent = "► History"
    document.querySelector('#character-history').innerHTML = ''
    favoritesBtn.textContent = "► Favorites"
    document.querySelector('#favorite-characters').innerHTML = ''
    console.clear()
})

searchInput.addEventListener('keyup', () => {
    searchResult.innerHTML = "";
    const cleanInput = searchInput.value.trim().toLowerCase()
    const filtered = charactersHistory.map(character => character.name).filter(name => name.toLowerCase().includes(cleanInput))

    filtered.forEach(name => {
        searchResult.insertAdjacentHTML("beforeend", `<a id="search-element" href="#">${name}</a><br>`)
    });
    
    document.querySelectorAll('#search-element').forEach(element => {
        element.addEventListener('click', () => {

            homeContainer.classList.add('hide')
            cardContainer.classList.remove('hide')

            let selectedCharacter = charactersHistory.filter(character => character.name == element.textContent)
            nameCardField.textContent = selectedCharacter[0].name
            raceCardField.textContent = selectedCharacter[0].race
            classCardField.textContent = selectedCharacter[0].class
            traitCardField.textContent = selectedCharacter[0].trait
            quoteCardField.textContent = selectedCharacter[0].quote
            storyCardField.textContent = selectedCharacter[0].story
            characterImg.setAttribute('src', selectedCharacter[0].img)

        })
    })

    if (searchInput.value === '') {
        searchResult.innerHTML = "";
        document.querySelector('.sidebar-btn-box').style.display = 'flex'
    } else {
        document.querySelector('.sidebar-btn-box').style.display = 'none'

    }
})

async function sendMessageToChatGPT(prompt) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',
                prompt: prompt,
                temperature: 1,
                max_tokens: 500
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
  
        const completion = response.data.choices[0].text.trim();
        const modifiedCompletion = completion.replace(/^[^A-Za-z]*/, '').replace(/^[ \t]*|\s*$/g, '');
        console.log('ChatGPT:', modifiedCompletion);
        return modifiedCompletion;
  
    } catch (error) {
        console.error('Error:', error.message);
    }
}

randomBtn.addEventListener('click', () => {
    nameInput.value = names[Math.floor(Math.random() * names.length)].name


    let element = raceTypes[Math.floor(Math.random() * raceTypes.length)]
    element.checked = true
    characterRace = element.value
    
    element = classTypes[Math.floor(Math.random() * classTypes.length)]
    element.checked = true
    characterClass = element.value
})


// localStorage. clear() Use this for clear all stored key. If you want
// to clear/remove only specific key/value then you can use removeItem(key).