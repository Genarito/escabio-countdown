import React, { useRef, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

/** ImportCSVPanel props. */
interface ImportCSVPanelProps {
    /** Callback to handle the imported names from the CSV file. */
    handleImportedNames: (names: string[], replaceNames: boolean) => void;
}

/**
 * Renders a Button that opens a Modal to select a CSV file and get all the values of the first column.
 */
export const ImportCSVPanel = (props: ImportCSVPanelProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [replaceNames, setReplaceNames] = useState<boolean>(false);
    const [discardFirstValue, setDiscardFirstValue] = useState<boolean>(true);
    const uploadRef = useRef<HTMLInputElement>();

    const importData = () => {
        const file = uploadRef.current.files[0];
        if (!file) {
            alert('No hay archivo seleccionado');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result as string;
            const lines = content.split('\n');
            const names = lines.map((line) => line.split(',')[0]);

            if (discardFirstValue) {
                names.shift();
            }

            props.handleImportedNames(names, replaceNames);

            handleClose();
        }
        reader.readAsText(file);
    }

    const handleClose = () => setShowModal(false);

    return (
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {replaceNames &&
                        <Alert variant='warning'>
                            Ojo! Se van a <strong>reemplazar todos los nombres</strong> de la lista!
                        </Alert>
                    }

                    <p>
                        Selecciona un archivo CSV con los nombres a importar, <strong>solo se considerará la primera columna</strong>.
                    </p>

                    <hr />

                    <Form>
                        <Form.File
                            id="custom-file"
                            label="Archivo CSV"
                            custom
                            ref={uploadRef}
                        />

                        <hr />

                        <Form.Check
                            type="checkbox"
                            label="Ignorar primer linea"
                            checked={discardFirstValue}
                            onChange={(e) => {
                                setDiscardFirstValue(e.target.checked);
                            }}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Reemplazar listado"
                            checked={replaceNames}
                            onChange={(e) => {
                                setReplaceNames(e.target.checked);
                            }}
                        />
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={importData}>Importar</Button>
                </Modal.Footer>
            </Modal>

            <Button block onClick={() => setShowModal(true)}>
                Importar nombres desde CSV
            </Button>
        </>
    )
    
}