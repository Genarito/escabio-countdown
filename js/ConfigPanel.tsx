import React from 'react'

// Components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ItemsList } from './ItemsList'

/** All possible types of background */
type BackgroundType = 'blank' | 'wall' | 'video'

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
    /** Background option's value */
    background: BackgroundType,
    /** Boolean to enable "Lightning round" option's value */
    enableLightningRound: boolean,
    /** Boolean to show "Show drink" option's value */    
    showDrink: boolean,
    /** Logo img. */
    logoImgBase64: string | ArrayBuffer,
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
    removeDrink: (idx: number) => void,
    /** Callback to select a new logo. */
    handleLogoChange: (e) => void
    /** Callback to clean the Logo img. */
    cleanLogoImg: () => void
}

const ConfigPanel = (props: ConfigPanelProps) => {
    return (
        <React.Fragment>
            <div id="config-panel-div">
                <Row>
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
                            {/* Background styles */}
                            <Form.Check
                                type="radio"
                                label="Fondo blanco"
                                name="background"
                                value='blank'
                                checked={props.background === 'blank'}
                                onChange={props.handleCheckboxChange}
                            />
                            
                            <Form.Check
                                type="radio"
                                label="Fondo con imagen"
                                name="background"
                                value='wall'
                                checked={props.background === 'wall'}
                                onChange={props.handleCheckboxChange}
                            />

                            <Form.Check
                                type="radio"
                                label="Fondo con video"
                                name="background"
                                value='video'
                                checked={props.background === 'video'}
                                onChange={props.handleCheckboxChange}
                            />

                            {/* Lightning Round */}
                            <Form.Check
                                type="checkbox"
                                label="Ronda relámpago (toman varios)"
                                name="enableLightningRound"
                                checked={props.enableLightningRound}
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

                            <hr />

                            {/* Logo */}
                            <h4>Logo</h4>
                            <Form.File
                                id="custom-file"
                                label="Seleccionar logo"
                                custom
                                onChange={props.handleLogoChange}
                            />

                            {props.logoImgBase64 &&
                                <Button
                                    variant="outline-danger"
                                    className='margin-top-2'
                                    size="sm"
                                    block
                                    onClick={props.cleanLogoImg}
                                >
                                    Limpiar imagen
                                </Button>
                            }
                        </Form.Group>
                    </Col>
                </Row>

                <hr />

                {/* Players */}
                <Row>
                    <ItemsList
                        headerDescription="Jugadores"
                        items={props.names}
                        addItem={props.addName}
                        removeItem={props.removeName}
                    />
                </Row>
                
                {/* Drinks */}
                {props.showDrink &&
                    <Row>
                        <ItemsList
                            headerDescription="Tragos"
                            items={props.drinks}
                            addItem={props.addDrink}
                            removeItem={props.removeDrink}
                        />
                    </Row>
                }
            </div>

            <div id="made-with-love">
                <Col md={12} className="text-center">
                    Made with <span className="heart">❤</span> by <a href="https://github.com/Genarito" target="_blank">
                        Genarito
                    </a>
                </Col>
            </div>
        </React.Fragment>
    )
}

export { ConfigPanel, BackgroundType }