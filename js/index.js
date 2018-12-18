import React from 'react';
import ReactDOM from "react-dom";

import '../css/index.css';
import '../bootstrap-3.3.7-dist/css/bootstrap.min.css';

class Escabio extends React.Component {
    constructor(props) {
        super(props);

        this.drinks = ['Fernet', 'Vodka'];

        this.state = {
            countdown: 600,
            loserName: '',
            drink: '',
            names: [
                'Gena',
                'Marquitox',
                'Chiqui (puto)',
                'Libu <3',
                'Manu lobo',
                'Nati Nat',
                'Rocio Informatica',
                'Julia',
                'El ema',
                'Ruso',
                ]
        };

        // Bind 'this' variable to methods which are called from view
        this.handleInput = this.handleInput.bind(this);
        this.add = this.add.bind(this);
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
     * Handle changes on input
     * @param {Event} e Change event
     */
    handleInput(e) {
        // console.log(e);
        this.setState({ newName: e.target.value })
    }

    /**
     * Add a name to the list
     */
    add() {
        let names = this.state.names;
        names.push(this.state.newName);
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
     * Gets countdown content to show
     */
    generateCountdown() {
        let countdownDescripcion;

        let divisor_for_minutes = this.state.countdown % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        if (minutes) {
            countdownDescripcion = minutes + ':' + seconds + ' minutos';
        } else {
            countdownDescripcion = seconds + ' segundos';
        }

        if (!minutes && seconds == '00') {
            this.getLoser();
        }

        return countdownDescripcion;
    }

    /**
     * Select randomly a loser
     */
    getLoser() {
        let randomNameIndex = Math.floor(Math.random() * (this.state.names.length));
        let randomDrinkIndex = Math.floor(Math.random() * (this.drinks.length));
        
        this.setState({
            countdown: 600,
            loserName: this.state.names[randomNameIndex],
            drink: this.drinks[randomDrinkIndex]
        });
        
        setTimeout(() => {
            this.setState({
                loserName: '',
                drink: ''
            });
        }, 20000);
    }

    render() {
        const namesList = this.state.names.map((name, idx) => idx < this.state.names.length - 1 ? name + ', ' : name);

        return (
            <div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h1>Fondo en</h1>
                        <h1 id="timer">{this.generateCountdown()}</h1>
                        {this.state.loserName &&
                            <h1 id="loser"><strong className="danger">{this.state.loserName}</strong> en la pera con <strong className="danger">{this.state.drink}</strong></h1>
                        }
                    </div>
                </div>
                <div id="input-name" className="row">
                    <div className="col-md-12 text-center">
                        <input type="text" value={this.state.newName} onChange={this.handleInput}/>
                        <button className="btn btn success" onClick={this.add}>Agregar</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        Nombres: 
                        { namesList }
                    </div>
                </div>
            </div>
        );
    }
}

// Renders the component
ReactDOM.render(
    <Escabio />,
    document.getElementById('countdown')
);