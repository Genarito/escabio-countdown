import React from 'react';
import ReactDOM from "react-dom";

// Components
import Sidebar from "react-sidebar";
import { BackgroundType, ConfigPanel } from './ConfigPanel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Image } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// Styles
import '../css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Fontawesome
import '@fortawesome/fontawesome-free/css/all.css'

// Imgs
import logo from '../gifs/lightning.gif';
import wall from '../imgs/wall.png'
import video from '../videos/party.mp4';


const MILISECONDS_TO_HIDE_ELEMENTS = 15000 // Number of milliseconds to show the number of the loser until it's cleaned
const MAX_ROUND_COUNT_UNTIL_LIGHTNING = 5; // Count common rounds until a lightning round
const COUNT_LOSERS_FOR_LIGHTNING_ROUND = 5; // Count for looser to show on every lightning round
const DEFAULT_BACKGROUND_TYPE: BackgroundType = 'wall'; // Default background to show


/**
 * Component's state
 */
interface EscabioState {
    countdown: number,
    newCountdown: number,
    loserName: string,
    drink: string,
    names: string[],
    drinks: string[],
    logoImgBase64: string | ArrayBuffer,
    background: BackgroundType,
    enableLightningRound: boolean,
    showDrink: boolean,
    sidebarOpen: boolean
}

/**
 * Renders main component
 */
class Escabio extends React.Component<{}, EscabioState> {
    private defaultCountdown: number
    private lightningNames: string[]
    private lightning: number
    private commonRoundCurrentCount: number

    constructor(props) {
        super(props);

        this.defaultCountdown = 600

        this.state = {
            countdown: this.defaultCountdown,
            newCountdown: this.secondsToMinutes(this.defaultCountdown),
            loserName: '',
            drink: '',
            names: [],
            drinks: [],
            logoImgBase64: '',
            background: DEFAULT_BACKGROUND_TYPE,
            enableLightningRound: true,
            showDrink: false,
            sidebarOpen: false
        };

        // Variables and array for the lightning round
        this.lightningNames = [];
        this.lightning = 0;
        this.commonRoundCurrentCount = 0; // For testing of lightningRound change this value to 3 and de countdown decrease to 10
    }

    /**
     * Reduce a second every second
     */
    componentDidMount() {
        // Loads saved info
        this.loadFromLocalStorage()

        setInterval(() => {
            this.decrease();
        }, 1000);
    }

    /**
     * Gets a key from Local Storage and parses it in JSON format
     * @param key Key to retrieve from Local Storage
     * @param defaultValue Default value to return in case error o key doesn't exist
     * @returns Value stored in Local Storage or the default value
     */
    parseOrDefault<T>(key: string, defaultValue: T): T {
        let res: T
        try {
            const dataRetrieved = window.localStorage.getItem(key)
            res = dataRetrieved ? JSON.parse(dataRetrieved) : defaultValue
        } catch {
            res = defaultValue
        }
        
        return res
    }

    /**
     * Handles changes in newCountdown state
     * @param newCountdown New state vale
     */
    handleCountdownTimeChange = (newCountdown: number) => { this.setState({ newCountdown }) }

    /**
     * Handles changes in the logo input
     * @param e Event
     */
    handleLogoChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFile = e.target.files[0]
            
            // Only images
            if (['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(newFile.type)) {
                const reader = new FileReader();
                const self = this
                reader.onloadend = function () {
                    self.setState({ logoImgBase64: reader.result }, self.saveStateInLocalStorage)
                }
                reader.readAsDataURL(newFile);
            }
        }
    }

    /** Cleans the logo img */
    cleanLogoImg = () => { this.setState({ logoImgBase64: '' }, this.saveStateInLocalStorage) }

    /**
     * Transforms seconds to minutes
     * @param seconds Seconds to transform as minutes
     * @return Minutes
     */
    secondsToMinutes = (seconds: number): number => Math.ceil(seconds / 60)
    
    /**
     * Transforms minutes to seconds
     * @param minutes Minutes to transform as seconds
     * @return Seconds
     */
    minutesToSeconds = (minutes: number): number => Math.ceil(minutes * 60)

    /**
     * Sets the new countdown time and restarts some states
     */
    setCountdownTime = () => {
        const newCountdownInSeconds = this.minutesToSeconds(this.state.newCountdown)
        this.setState({ countdown: newCountdownInSeconds }, this.saveStateInLocalStorage)
        this.defaultCountdown = newCountdownInSeconds
        this.lightning = 0
    }

    /**
     * Loads saved data from Local Storage
     */
    loadFromLocalStorage() {
        const savedCountdownInSeconds = this.parseOrDefault('countdown', this.defaultCountdown)
        this.defaultCountdown = savedCountdownInSeconds
        this.setState({
            countdown: savedCountdownInSeconds,
            newCountdown: this.secondsToMinutes(savedCountdownInSeconds),
            names: this.parseOrDefault<string[]>('names', []),
            drinks: this.parseOrDefault<string[]>('drinks', []),
            background: this.parseOrDefault('background', DEFAULT_BACKGROUND_TYPE),
            logoImgBase64: this.parseOrDefault('logoImgBase64', ''),
            enableLightningRound: this.parseOrDefault('enableLightningRound', true),
            showDrink: this.parseOrDefault('showDrink', false),
        }, this.updateLightningNames) // Updates names to prevent empty output on first lightning round
    }

    /** Updates lightningNames variable */
    updateLightningNames = () => {
        this.lightningNames = this.state.names.slice()
    }

    /** Saves all variables in localStorage and updates lightning names */
    saveStorageAndUpdateLightningNames = () => {
        this.updateLightningNames()
        this.saveStateInLocalStorage()
    }
    
    /**
     * Add a name to the list
     * @param newName New name to add
     */
    addName = (newName: string) => {
        let names = this.state.names;
        names.push(newName);
        this.setState({ names }, this.saveStorageAndUpdateLightningNames);
    }

    /**
     * Removes a specific name by index from the list name
     * @param idx Index to remove from names array
     */
    removeName = (idx: number) => {
        const names = this.state.names
        if (idx < names.length) {
            names.splice(idx, 1);
        }
        this.setState({ names }, this.saveStorageAndUpdateLightningNames)
    }

    /**
     * Add a drink to the list
     * @param newDrink New drink to add
     */
    addDrink = (newDrink: string) => {
        let drinks = this.state.drinks;
        drinks.push(newDrink)
        this.setState({ drinks }, this.saveStateInLocalStorage);
    }

    /**
     * Removes a specific name by index from the list name
     * @param idx Index to remove from drinks array
     */
    removeDrink = (idx: number) => {
        const drinks = this.state.drinks
        if (idx < drinks.length) {
            drinks.splice(idx, 1);
        }
        this.setState({ drinks }, this.saveStateInLocalStorage)
    }

    /**
     * Save key and value in Local Storage
     * @param key Key to store
     * @param value Value to store
     */
    saveKeyAndValueInJSON(key: string, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    }

    /**
     * Saves all the use info state
     */
    saveStateInLocalStorage() {
        this.saveKeyAndValueInJSON('countdown', this.state.countdown)
        this.saveKeyAndValueInJSON('names', this.state.names)
        this.saveKeyAndValueInJSON('drinks', this.state.drinks)
        this.saveKeyAndValueInJSON('background', this.state.background)
        this.saveKeyAndValueInJSON('logoImgBase64', this.state.logoImgBase64)
        this.saveKeyAndValueInJSON('enableLightningRound', this.state.enableLightningRound)
        this.saveKeyAndValueInJSON('showDrink', this.state.showDrink)
    }
    
    /**
     * Reduce countdown value by 1
     */
    decrease() {
        this.setState((previousState) => ({
            countdown: previousState.countdown - 1
        }));
    }

    /**
     * Toogle checkbox inputs' values
     * @param e Checkbox change event
     */
    handleCheckboxChange = (e) => {
        const newValue = e.target.type !== 'checkbox' ? e.target.value : e.target.checked
        this.setState<never>({[e.target.name]: newValue}, this.saveStateInLocalStorage);
    }
    
    /**
     * Gets countdown content to show
     */
    generateCountdown() {
        let countdownDescripcion;
        
        let divisor_for_minutes = this.state.countdown % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        const secondsString = (seconds < 10) ? '0' + seconds : seconds;
        
        if (minutes) {
            countdownDescripcion = minutes + ':' + secondsString + ' minutos';
        } else {
            countdownDescripcion = secondsString + ' segundos';
        }

        // It's time to drink!
        if (!minutes && secondsString == '00') {
            // Normal round
            if (!this.state.enableLightningRound || this.commonRoundCurrentCount < MAX_ROUND_COUNT_UNTIL_LIGHTNING) {
                this.getLoser();
                this.commonRoundCurrentCount++;
            } else {
                // Lightning round
                if (this.lightning < COUNT_LOSERS_FOR_LIGHTNING_ROUND) {
                    this.lightningRound();
                }
            }
        }    
        
        return countdownDescripcion;
    }
    
    /**
     * Select randomly a loser in a common (normal) round
     */
    getLoser() {
        let randomNameIndex = Math.floor(Math.random() * (this.state.names.length));
        let randomDrinkIndex = Math.floor(Math.random() * (this.state.drinks.length));
        
        this.setState({
            countdown: this.defaultCountdown,
            loserName: this.state.names[randomNameIndex],
            drink: this.state.drinks[randomDrinkIndex]
        });
        
        // Hides name in some seconds
        setTimeout(() => {
            this.setState({
                loserName: '',
                drink: ''
            });
        }, MILISECONDS_TO_HIDE_ELEMENTS);
    }
    
    /**
     * Executes a ligthning round logic
     */
    lightningRound(){
        let randomNameIndex = Math.floor(Math.random() * (this.lightningNames.length));;
        let randomDrinkIndex =  Math.floor(Math.random() * (this.state.drinks.length));

        // In case of having passed all reload all the names
        if (this.lightningNames.length == 1){
            this.lightningNames = this.state.names.slice();
        }

        let loserName = this.lightningNames[randomNameIndex];
        let countdownBetweenRounds; // Time between rounds
        this.lightningNames.splice(randomNameIndex, 1); // Deletes the name to not repeat

        // Last lightning round
        if (this.lightning === (COUNT_LOSERS_FOR_LIGHTNING_ROUND - 1)) {
            // Resets variables
            countdownBetweenRounds = this.defaultCountdown
            this.commonRoundCurrentCount = 0;
            this.lightning = 0;
            this.updateLightningNames()

            // Reset loser's name
            setTimeout(() => {
                this.setState({
                    loserName: '',
                    drink: ''
                });
            }, MILISECONDS_TO_HIDE_ELEMENTS);
        } else {
            this.lightning++;

            // During lightning rounds, there're 3 seconds between each loser
            countdownBetweenRounds = 3;
        }

        // Shows loser
        this.setState({
            countdown: countdownBetweenRounds,
            loserName: loserName,
            drink: this.state.drinks[randomDrinkIndex]
        });
    }

    /**
     * Toggle sidebar's status
     * @param sidebarOpen New state for sidebar
     */
    onSetSidebarOpen = (sidebarOpen: boolean) => { this.setState({ sidebarOpen }); }

    /**
     * Checks if correspond to show a lightning round GIF as background
     * NOTE: only shows the GIF in last 30 seconds
     */
    shouldShowLightningRoundBackground() {
        return this.state.enableLightningRound
            && this.commonRoundCurrentCount >= MAX_ROUND_COUNT_UNTIL_LIGHTNING
            && this.state.countdown <= 30;
    }

    /**
     * Returns lightning round background img
     */
    getLightningRoundImg() {
        return {
            backgroundImage: `url(${logo})`,
            backgroundSize: 'cover'
        };
    }

    getSpecialRoundDescription() {
        if (!this.state.loserName && this.shouldShowLightningRoundBackground()) {
            return 'Relámpago: fondean 5 personas!';
        }

        return null;
    }
    
    render() {        
        // Gets background img
        const isLightningRound = this.shouldShowLightningRoundBackground()
        let backgroundImage 
        if (isLightningRound) {
            backgroundImage = this.getLightningRoundImg()
        } else {
            if (this.state.background === 'wall') {
                backgroundImage = {
                    backgroundImage: `url(${wall})`,
                    backgroundSize: 'cover'
                }
            } else {
                backgroundImage = {}
            }
        }
        
        let divClass: string
        switch (this.state.background) {
            case 'wall':
                divClass = 'with-background-wall'
                break
            case 'video':
                divClass = 'with-background-video'
                break
            default:
                divClass = ''
                break
        }

        if (isLightningRound) {
            divClass += ' lightning-round'
        }

        // If it's a special round, show description
        const specialRoundDescription = this.getSpecialRoundDescription();

        return (
            <div id="app-div" className={divClass} style={backgroundImage}>
                {this.state.background === 'video' &&
                    <video id="background-video" autoPlay loop muted disablePictureInPicture hidden={isLightningRound}>
                        <source src={video} type="video/mp4" />
                    </video>
                }

                <Row>
                    <Col md={12} id="div-main-content" className={`text-center ${divClass}`}>
                        <h1 id="drink-label">Fondo en</h1>
                        <h1 id="timer">{this.generateCountdown()}</h1>

                        {/* Special round description */}
                        {specialRoundDescription &&
                            <h1 id="special-round-description">{specialRoundDescription}</h1>
                        }

                        {/* Loser name */}
                        {this.state.loserName &&
                            <h1 id="loser">
                                {/* Victim */}
                                <strong className="danger">{this.state.loserName}</strong> en la pera&nbsp;
                                
                                {/* Drink */}
                                {this.state.showDrink &&
                                    <>
                                        con&nbsp;
                                        <strong className="danger">{this.state.drink}</strong>
                                    </>
                                }
                            </h1>
                        }
                    </Col>
                </Row>

                {/* Sidebar with config panel */}
                <Sidebar
                    sidebar={
                        <ConfigPanel
                            newCountdown={this.state.newCountdown}
                            names={this.state.names}
                            drinks={this.state.drinks}
                            logoImgBase64={this.state.logoImgBase64}
                            handleCountdownTimeChange={this.handleCountdownTimeChange}
                            setCountdownTime={this.setCountdownTime}
                            addName={this.addName}
                            removeName={this.removeName}
                            addDrink={this.addDrink}
                            removeDrink={this.removeDrink}
                            background={this.state.background}
                            enableLightningRound={this.state.enableLightningRound}
                            showDrink={this.state.showDrink}
                            handleCheckboxChange={this.handleCheckboxChange}
                            handleLogoChange={this.handleLogoChange}
                            cleanLogoImg={this.cleanLogoImg}
                        />
                    }
                    touchHandleWidth={20}
                    dragToggleDistance={30}
                    open={this.state.sidebarOpen}
                    onSetOpen={this.onSetSidebarOpen}
                    styles={{ sidebar: { background: "white" } }}>
                    <Button variant="light" onClick={() => this.onSetSidebarOpen(true)}>
                        <i id="config-button" className="fas fa-cog"></i>
                    </Button>
                </Sidebar>

                {this.state.logoImgBase64 &&
                    <Image id='logo-img' rounded src={this.state.logoImgBase64 as string} />
                }
            </div>
        );
    }
}

// Renders the component
ReactDOM.render(
    <Escabio />,
    document.getElementById('countdown')
);
    