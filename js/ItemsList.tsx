import React, { useState } from 'react'

// Components
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

/**
 * Component's props
 */
interface PlayerListProps {
    /** Text (should be in plural) to show in the list's header */
    headerDescription: string,
    /** List of item's name to render in list */
    items: string[],
    /** Callback to add a specific item from the list */
    addItem: (newItem: string) => void
    /** Callback to remove a specific item from the list */
    removeItem: (idx: number) => void
}

/**
 * Renders a list of players
 * @param props Component's props
 */
export const ItemsList = (props: PlayerListProps) => {
    const [newItem, setNewItem] = useState<string>('')

    /**
     * Check if can add a new item
     * @return True if can, false otherwise
     */
    function canAdd(): boolean { return newItem.trim().length > 0 }

    function addNewItem() {
        const newItemToAdd = newItem.trim()
        // First checks if that person exists
        const exists = props.items.some((item) => item === newItemToAdd)
        if (exists) {
            alert('Ya existe!')
            return;
        }

        // Adds and reset
        props.addItem(newItemToAdd)
        setNewItem('')
    }
    
    /**
     * Handle changes on key down on input
     * @param {Event} e KeyDown event
     */
    function handleKeyDown(e) {
        if (e.which == 13 && canAdd()) {
            addNewItem()
        }
    }

    // Filter for searching when adding
    const textFilter = newItem.trim().toLowerCase()
    const filteredItems = props.items
        .filter((item) => item.trim().toLowerCase().includes(textFilter))

    return (
        <Container fluid className="items-list-component">
            <Row>
                {/* Input to add a new loser */}
                <Col md={12}>
                    <h4>{props.headerDescription}</h4>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={`Busca o agrega ${props.headerDescription.toLowerCase()}`}
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <Button id="add-button"
                        variant="success"
                        onClick={addNewItem}
                        disabled={!canAdd()}>
                        Agregar
                    </Button>
                </Col>

                <Col md={12}>
                    <ListGroup className="items-list-group">
                        <ListGroup.Item variant="dark">
                            <h6 id="items-list-header">
                                {props.headerDescription} <Badge variant="secondary" className="float-right">{props.items.length}</Badge>
                            </h6>
                        </ListGroup.Item>
                        {filteredItems.map((name, idx) => (
                            <ListGroup.Item key={name}>
                                {name}

                                <i className="fas fa-trash clickable float-right delete-name-icon"
                                    title="Borrar"
                                    onClick={() => props.removeItem(idx)}
                                ></i>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}
