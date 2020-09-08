import React from 'react';
import ReactDOM from "react-dom";

// Components
import Sidebar from "react-sidebar";
import { ConfigPanel } from './ConfigPanel';
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

// Losers' names
import {losers} from './losers';

const COUNTDOWN_TIME = 600; // Countdown time in seconds (10 minutes)
const MAX_COMMON_COUNT_UNTIL_LIGHTNING = 5; // Count common rounds until a lightning round
const COUNT_LOOSERS_FOR_LIGTHNING_ROUND = 5; // Count for looser to show on every ligthning round


/**
 * Component's props
 */
interface EscabioState {
    countdown: number,
    loserName: string,
    newName: string,
    drink: string,
    names: string[],
    withBackgroundGradient: boolean,
    showDrink: boolean,
    sidebarOpen: boolean
}


class Escabio extends React.Component<{}, EscabioState> {
    private drinks: string[]
    private lightningNames: string[]
    private lightning: number
    private commonRoundCurrentCount: number
    constructor(props) {
        super(props);

        this.drinks = ['Fernet', 'Vodka'];
        this.state = {
            countdown: COUNTDOWN_TIME,
            loserName: '',
            newName: '',
            drink: '',
            names: losers,
            withBackgroundGradient: true,
            showDrink: false,
            sidebarOpen: false
        };

        // Variables and array for the lightning round
        this.lightningNames = this.state.names.slice();
        this.lightning = 0;
        this.commonRoundCurrentCount = 0; // For testing of lightningRound change this value to 3 and de countdown decrease to 10

        // Bind 'this' variable to methods which are called from view
        this.addName = this.addName.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    /**
     * Reduce a second every second
     */
    componentDidMount() {
        setInterval(() => {
            this.decrease();
        }, 1000);
    }
    
    /**
     * Add a name to the list
     * @param {string} newName New name to add
     */
    addName(newName) {
        let names = this.state.names;
        names.push(newName);
        this.setState({
            names,
            newName: ''
        });
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
     * @param {Event} e Checkbox change event
     */
    handleCheckboxChange(e) {
        this.setState<never>({[e.target.name]: e.target.checked});
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
        let randomDrinkIndex = Math.floor(Math.random() * (this.drinks.length));
        
        this.setState({
            countdown: COUNTDOWN_TIME,
            loserName: this.state.names[randomNameIndex],
            drink: this.drinks[randomDrinkIndex]
        });
        
        // Hides name in seconds
        setTimeout(() => {
            this.setState({
                loserName: '',
                drink: ''
            });
        }, 20000);
    }
    
    /**
     * Executes a ligthning round logic
     */
    lightningRound(){
        let randomNameIndex = Math.floor(Math.random() * (this.lightningNames.length));;
        let randomDrinkIndex =  Math.floor(Math.random() * (this.drinks.length));
        // In case of having passed all reload all the names
        if (this.lightningNames.length == 1){
            this.lightningNames = this.state.names.slice();
        }

        let getLoser = this.lightningNames[randomNameIndex];
        let countd; // Time between rounds
        this.lightningNames.splice(randomNameIndex, 1); // Deletes the name to not repeat

        // Last lightning round
        if (this.lightning == (COUNT_LOOSERS_FOR_LIGTHNING_ROUND - 1)) {
            // Resets variables
            countd = COUNTDOWN_TIME;
            this.commonRoundCurrentCount = 0;
            this.lightning = 0;
            this.lightningNames = this.state.names.slice();

            // Reset loser's name
            setTimeout(() => {
                this.setState({
                    loserName: '',
                    drink: ''
                });
            }, 20000);
        } else {
            countd = 3;
        }

        // Shows loser
        this.setState({
            countdown: countd,
            loserName: getLoser,
            drink: this.drinks[randomDrinkIndex]
        });
    }

    /**
     * Toggle sidebar's status
     * @param {boolean} open New state for sidebar
     */
    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    /**
     * Returns a random git for background
     * TODO: implement
     */
    getRandomGif() {
        return {};
        // return {
        //     backgroundImage: `url(${amanecer})`,
        //     backgroundSize: 'cover'
        // };
    }

    /**
     * Checks if correspond to show a lightning round GIF as background
     * NOTE: only shows the GIF in last 30 seconds
     */
    shouldShowLightningRoundBackground() {
        return this.commonRoundCurrentCount >= MAX_COMMON_COUNT_UNTIL_LIGHTNING
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
        const backgroundImage = this.shouldShowLightningRoundBackground() ? this.getLigthningRoundImg() : this.getRandomGif();
        const classWithGradients = this.state.withBackgroundGradient ? 'with-backgroud-gradient' : '';

        // If it's a special round, show description
        const specialRoundDescription = this.getSpecialRoundDescription();

        return (
            <div id="app-div" className={classWithGradients} style={backgroundImage}>
                <Row>
                    <Col md={12} id="div-main-content" className={`text-center ${classWithGradients}`}>
                        <h1>Fondo en</h1>
                        <h1 id="timer">{this.generateCountdown()}</h1>

                        {/* Special round description */}
                        {specialRoundDescription &&
                            <h1 id="special-round-description">{specialRoundDescription}</h1>
                        }

                        {/* Loser name */}
                        {this.state.loserName &&
                            <h1 id="loser">
                                {/* Victim */}
                                <strong className="danger">{this.state.loserName}</strong>&nbsp;
                                
                                en la pera&nbsp;
                                
                                {/* Drink */}
                                {this.state.showDrink &&
                                    <span>
                                        con&nbsp;
                                        <strong className="danger">{this.state.drink}</strong>
                                    </span>
                                }
                            </h1>
                        }
                    </Col>
                </Row>

                {/* Sidebar with config panel */}
                <Sidebar
                    sidebar={
                        <ConfigPanel
                            names={this.state.names}
                            addName={this.addName}
                            withBackgroundGradient={this.state.withBackgroundGradient}
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
    