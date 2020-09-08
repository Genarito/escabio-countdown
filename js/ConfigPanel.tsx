import React from 'react'

// Components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ItemsList } from './ItemsList'

/**
 * Component's props
 */
interface ConfigPanelProps {
    /** Countdown in seconds to allow modify */
    newCountdown: number,
    /** List of player's names */
    names: string[],
    /** List of drinks */
    drinks: string[],
    /** Boolean to show "Background gradient" option's value */
    withBackgroundGradient: boolean,
    /** Boolean to show "Show drink" option's value */    
    showDrink: boolean
    /** Callback to handle countdown time changes */
    handleCountdownTimeChange: (newCountdown: number) => void,
    /** Callback to save countdown time changes */
    setCountdownTime: () => void,
    /** Callback to handle checkboxes changes */
    handleCheckboxChange: (e: any) => void,
    /** Callback to add a new name to the player's list */
    addName: (newName: string) => void,
    /** Callback to remove a specific player's name from the list */
    removeName: (idx: number) => void
    /** Callback to add a new drink to the drinks list */
    addDrink: (newName: string) => void,
    /** Callback to remove a specific drink from the list */
    removeDrink: (idx: number) => void
}

export const ConfigPanel = (props: ConfigPanelProps) => {
    return (
        <Row id="config-panel-div">
            {/* Checkbox options */}
            <Col md={12}>
                <h4>Opciones</h4>

                {/* Countdown */}
                <Form.Group>
                    <Form.Label>Tiempo en minutos</Form.Label>
                    <Form.Control
                        type="number"
                        min={1}
                        value={props.newCountdown}
                        onChange={(e) => {
                            if (e.target.validity.valid) {
                                const valueInteger: number = parseInt(e.target.value)
                                if (!isNaN(valueInteger)) {
                                    props.handleCountdownTimeChange(valueInteger)
                                }
                            }
                        }}
                    />
                    <Form.Text muted>
                        El contador se reiniciará al guardar
                    </Form.Text>

                    <Button block className="margin-top-2" onClick={props.setCountdownTime}>
                        Guardar
                    </Button>
                </Form.Group>

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
            </Col>

            {/* Players */}
            <ItemsList
                headerDescription="Jugadores"
                items={props.names}
                addItem={props.addName}
                removeItem={props.removeName}
            />

            {/* Drinks */}
            {props.showDrink &&
                <ItemsList
                    headerDescription="Tragos"
                    items={props.drinks}
                    addItem={props.addDrink}
                    removeItem={props.removeDrink}
                />
            }
        </Row>
    )
}