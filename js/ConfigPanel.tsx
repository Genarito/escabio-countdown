import React, { useState } from 'react'

// Components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ItemsList } from './ItemsList'

/**
 * Component's props
 */
interface ConfigPanelProps {
    /** List of player's names */
    names: string[],
    /** List of drinks */
    drinks: string[],
    /** Boolean to show "Background gradient" option's value */
    withBackgroundGradient: boolean,
    /** Boolean to show "Show drink" option's value */    
    showDrink: boolean
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