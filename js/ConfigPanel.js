import React from 'react';

export default class ConfigPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newName: ''
        };

        // Bind 'this' variable to methods which are called from view
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.addNewName = this.addNewName.bind(this);
    }

    /**
     * Handle changes on input
     * @param {Event} e Change event
     */
    handleInput(e) {
        this.setState({ newName: e.target.value })
    }

    /**
     * Check if can add a new name
     * @return {boolean} True if can, false otherwise
     */
    canAdd() {
        return this.state.newName.trim().length > 0;
    }

    /**
     * Handle changes on key down on input
     * @param {Event} e KeyDown event
     */
    handleKeyDown(e) {
        if (e.which == 13 && this.canAdd()) {
            this.addNewName();
        }
    }

    /**
     * Adds a new name to the list and cleans the input
     */
    addNewName() {
        // First checks if that person exists
        const exists = this.props.names.some((name) => name === this.state.newName);
        if (exists) {
            alert('Esa persona ya existe');
            return;
        }

        this.props.addName(this.state.newName.trim());
        this.setState({newName: ''});
    }

    render() {
        // Filter for searching when adding
        const nameFilter = this.state.newName.trim().toLowerCase();
        const names = this.props.names
            .filter((name) => name.trim().toLowerCase().includes(nameFilter))
            .map((name) => {
                return (
                    <li key={name} className="list-group-item">{name}</li>
                );
            });

        return (
            <div id="config-panel-div" className="row">
                {/* Checkbox options */}
                <div className="col-md-12">
                    <div className="checkbox">
                        {/* Background gradient */}
                        <label>
                            <input type="checkbox"
                                name="withBackgroundGradient"
                                checked={this.props.withBackgroundGradient}
                                onChange={this.props.handleCheckboxChange}/>Fondo con gradientes
                        </label>


                        {/* Show drink when loses */}
                        <label>
                            <input type="checkbox"
                                name="showDrink"
                                checked={this.props.showDrink}
                                onChange={this.props.handleCheckboxChange}/>Mostrar trago
                        </label>
                    </div>
                </div>

                {/* Input to add a new loser */}
                <div className="col-md-12">
                    <h4>Nombres</h4>
                    <input type="text" className="form-control" value={this.state.newName} onChange={this.handleInput} onKeyDown={this.handleKeyDown}/>
                    <button id="add-button"
                        className="btn btn-success"
                        onClick={this.addNewName}
                        disabled={!this.canAdd()}>
                        Agregar
                    </button>
                </div>

                {/* Losers' names list */}
                <div className="col-md-12">
                    <ul className="list-group">
                        {names}
                    </ul>
                </div>
            </div>
        );
    }
}