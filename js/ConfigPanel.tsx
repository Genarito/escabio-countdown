import React, { useState } from 'react'

// Components
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * Component's props
 */
interface ConfigPanelProps {
    /** List of player's names */
    names: string[],
    /** Boolean to show "Background gradient" option's value */
    withBackgroundGradient: boolean,
    /** Boolean to show "Show drink" option's value */    
    showDrink: boolean
    /** Callback to add a new name to the player's list */
    addName: (newName: string) => void,
    /** Callback to handle checkboxes changes */
    handleCheckboxChange: (e: any) => void
}

export const ConfigPanel = (props: ConfigPanelProps) => {
    const [newName, setNewName] = useState<string>('')

    /**
     * Check if can add a new name
     * @return {boolean} True if can, false otherwise
     */
    function canAdd () { return newName.trim().length > 0 }

    /**
     * Adds a new name to the list and cleans the input
     */
    function addNewName() {
        // First checks if that person exists
        const exists = props.names.some((name) => name === newName)
        if (exists) {
            alert('Esa persona ya existe')
            return;
        }

        props.addName(newName.trim())
        setNewName('')
    }

    /**
     * Handle changes on key down on input
     * @param {Event} e KeyDown event
     */
    function handleKeyDown(e) {
        if (e.which == 13 && canAdd()) {
            addNewName()
        }
    }

    // Filter for searching when adding
    const nameFilter = newName.trim().toLowerCase()
    const names = props.names
        .filter((name) => name.trim().toLowerCase().includes(nameFilter))
        .map((name) => {
            return (
                <li key={name} className="list-group-item">{name}</li>
            )
        })

    return (
        <Row id="config-panel-div">
            {/* Checkbox options */}
            <Col md={12}>
                <div className="checkbox">
                    {/* Background gradient */}
                    <label>
                        <input type="checkbox"
                            name="withBackgroundGradient"
                            checked={props.withBackgroundGradient}
                            onChange={props.handleCheckboxChange} />Fondo con gradientes
                    </label>


                    {/* Show drink when loses */}
                    <label>
                        <input type="checkbox"
                            name="showDrink"
                            checked={props.showDrink}
                            onChange={props.handleCheckboxChange} />Mostrar trago
                    </label>
                </div>
            </Col>

            {/* Input to add a new loser */}
            <Col md={12}>
                <h4>Nombres</h4>
                <input
                    type="text"
                    className="form-control"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <Button id="add-button"
                    variant="success"
                    onClick={addNewName}
                    disabled={!canAdd()}>
                    Agregar
                </Button>
            </Col>

            {/* Losers' names list */}
            <Col md={12}>
                <ul className="list-group">
                    {names}
                </ul>
            </Col>
        </Row>
    )
}