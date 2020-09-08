import React from 'react'

// Components
import ListGroup from 'react-bootstrap/ListGroup';

/**
 * Component's props
 */
interface PlayerListProps {
    /** New name to filter the player's names list */
    newName: string,
    /** List of players name to render in list */
    names: string[],
    /** Callback to remove a specific player's name from the list */
    removeName: (idx: number) => void
}

/**
 * Renders a list of players
 * @param props Component's props
 */
export const PlayersList = (props: PlayerListProps) => {
    // Filter for searching when adding
    const nameFilter = props.newName.trim().toLowerCase()
    const filteredNames = props.names
        .filter((name) => name.trim().toLowerCase().includes(nameFilter))

    return (
        <ListGroup>
            {filteredNames.map((name, idx) => (
                <ListGroup.Item key={name}>
                    {name}

                    <i className="fas fa-trash clickable float-right delete-name-icon"
                        title="Borrar"
                        onClick={() => props.removeName(idx)}
                    ></i>
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}