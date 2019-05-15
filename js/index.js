import React from 'react';
import ReactDOM from "react-dom";

import logo from '../lightning.gif'
import '../css/index.css';
import '../bootstrap-3.3.7-dist/css/bootstrap.min.css';

class Escabio extends React.Component {
    constructor(props) {
        super(props);

        this.drinks = ['Fernet', 'Vodka'];
        this.state = {
            countdown: 10,
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
                'Nuno'
            ]
        };

        // variables and array for the lightning round
        this.lightningNames = this.state.names.slice();
        this.positionOut = new Array();
        this.shotRound= false;
        this.lightning = 0; 
        this.common = 3; //for testing of lightningRound change this value to 3 and de countdown decrease to 10
        
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
        if(this.common >=2){
            this.shotRound = true;
        }
        if(!minutes && seconds == '00') {
            if (this.common < 3 ) {
                this.getLoser();
                this.common= this.common + 1;
                this.shotRound=false;
            }
            else{
                if(this.lightning < 4){
                    this.lightningRound();
                    this.lightning = this.lightning + 1;
                }
            }
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

    lightningRound(){
        let randomNameIndex = Math.floor(Math.random() * (this.lightningNames.length));
        let randomDrinkIndex = Math.floor(Math.random() * (this.drinks.length));
        //check repeat names
        if ()

        let getLoser = this.lightningNames[randomNameIndex];
        let countd = 3
        let aux = this.lightningNames.splice(randomNameIndex,1);
        if(this.lightning == 3 ){
            countd = 600;
            this.common = 0;
            this.lightning = 0;
            this.shotRound=false;
            this.lightningNames = this.state.names.slice()
        }
        this.setState({
            countdown: countd,
            loserName: getLoser,
            drink: this.drinks[randomDrinkIndex]
        });
        getLoser='';
        setTimeout(() => {
            this.setState({
                loserName: '',
                drink: ''
            });
        }, 20000);

    }

    render() {
        const namesList = this.state.names.map((name, idx) => idx < this.state.names.length - 1 ? name + ', ' : name);
        let image;
        let id_h1;
        let id_timer;
        let pera;
        if(this.shotRound){
            image = <img src={logo} alt="...loading" className="image"/>
            id_h1='lightning';
            id_timer='lightning';
            pera= <span>en la pera con</span>;
        }
        else{
            image='';
            id_h1='none';
            id_timer='timer';
            pera= 'en la pera con'
        }

        return (
            <div>
                {image}
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h1 className={id_h1}>Fondo en</h1>
                        <h1 id={id_timer}>{this.generateCountdown()}</h1>
                        {this.state.loserName &&
                            <h1 id="loser"><strong className="danger">{this.state.loserName}</strong> {pera} <strong className="danger">{this.state.drink}</strong></h1>
                        }
                    </div>
                </div>
                <div id="input-name" className="row">
                    <div className="col-md-12 text-center">
                        <input type="text" value={this.state.newName} onChange={this.handleInput}/>
                        <button className="btn btn-success" onClick={this.add}>Agregar</button>
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
