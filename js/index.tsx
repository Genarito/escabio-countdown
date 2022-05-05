import React from 'react';
import ReactDOM from "react-dom";

// Components
import Sidebar from "react-sidebar";
import { BackgroundType, ConfigPanel } from './ConfigPanel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Styles
import '../css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Fontawesome
import '@fortawesome/fontawesome-free/css/all.css'

// Imgs
import logo from '../gifs/lightning.gif';
import video from '../videos/party_bitrate_medium.mp4';


const MILISECONDS_TO_HIDE_ELEMENTS = 15000 // Number of milliseconds to show the number of the loser until it's cleaned
const MAX_COMMON_COUNT_UNTIL_LIGHTNING = 5; // Count common rounds until a lightning round
const COUNT_LOOSERS_FOR_LIGTHNING_ROUND = 5; // Count for looser to show on every lightning round


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
    background: BackgroundType,
    enableLightningRound: boolean,
    showDrink: boolean,
    sidebarOpen: boolean
}

/**
 * Renders main component
 */
class Escabio extends React.Component<{}, EscabioState> {
    private defaultCoundown: number
    private lightningNames: string[]
    private lightning: number
    private commonRoundCurrentCount: number

    constructor(props) {
        super(props);

        this.defaultCoundown = 600

        this.state = {
            countdown: this.defaultCoundown,
            newCountdown: this.secondsToMinutes(this.defaultCoundown),
            loserName: '',
            drink: '',
            names: [],
            drinks: [],
            background: 'video',
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
        this.defaultCoundown = newCountdownInSeconds
        this.lightning = 0
    }

    /**
     * Loads saved data from Local Storage
     */
    loadFromLocalStorage() {
        const savedCountdownInSeconds = this.parseOrDefault('countdown', this.defaultCoundown)
        this.defaultCoundown = savedCountdownInSeconds
        this.setState({
            countdown: savedCountdownInSeconds,
            newCountdown: this.secondsToMinutes(savedCountdownInSeconds),
            names: this.parseOrDefault<string[]>('names', []),
            drinks: this.parseOrDefault<string[]>('drinks', []),
            background: this.parseOrDefault('background', 'video'),
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
        const newValue = e.target.type ? e.target.value : e.target.checked
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
            if (this.commonRoundCurrentCount < MAX_COMMON_COUNT_UNTIL_LIGHTNING) {
                this.getLoser();
                this.commonRoundCurrentCount++;
            } else {
                // Lightning round
                if (this.lightning < COUNT_LOOSERS_FOR_LIGTHNING_ROUND) {
                    this.lightningRound();
                    this.lightning++;
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
            countdown: this.defaultCoundown,
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
        let countd; // Time between rounds
        this.lightningNames.splice(randomNameIndex, 1); // Deletes the name to not repeat

        // Last lightning round
        if (this.lightning === (COUNT_LOOSERS_FOR_LIGTHNING_ROUND - 1)) {
            // Resets variables
            countd = this.defaultCoundown
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
            countd = 3;
        }

        // Shows loser
        this.setState({
            countdown: countd,
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
            && this.commonRoundCurrentCount >= MAX_COMMON_COUNT_UNTIL_LIGHTNING
            && this.state.countdown <= 30;
    }

    /**
     * Returns lightning round background img
     */
    getLigthningRoundImg() {
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
        const backgroundImage = isLightningRound ? this.getLigthningRoundImg() : {};
        let divClass: string
        switch (this.state.background) {
            case 'gradient':
                divClass = 'with-background-gradient'
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
            </div>
        );
    }
}

// Renders the component
ReactDOM.render(
    <Escabio />,
    document.getElementById('countdown')
);
    