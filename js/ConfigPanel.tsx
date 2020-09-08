import React, { useState } from 'react'

// Components
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { PlayersList } from './PlayersList'

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
    handleCheckboxChange: (e: any) => void,
    /** Callback to remove a specific player's name from the list */
    removeName: (idx: number) => void
}

export const ConfigPanel = (props: ConfigPanelProps) => {
    const [newName, setNewName] = useState<string>('')

    /**
     * Check if can add a new name
     * @return True if can, false otherwise
     */
    function canAdd (): boolean { return newName.trim().length > 0 }

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

    return (
        <Row id="config-panel-div">
            {/* Checkbox options */}
            <Col md={12}>
                <Form>
                    <Form.Group>
                        {/* Background gradient */}
                        <Form.Check
                            type="checkbox"
                            label="Fondo con gradientes"
                            name="withBackgroundGradient"
                            checked={props.withBackgroundGradient}
                            onChange={props.handleCheckboxChange}
                        />

                        {/* Show drink when loses */}
                        <Form.Check
                            type="checkbox"
                            label="Mostrar trago"
                            name="showDrink"
                            checked={props.showDrink}
                            onChange={props.handleCheckboxChange}
                        />
                    </Form.Group>
                </Form>
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
                <PlayersList newName={newName} names={props.names} removeName={props.removeName}/>
            </Col>
        </Row>
    )
}