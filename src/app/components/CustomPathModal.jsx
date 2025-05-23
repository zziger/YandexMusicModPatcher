import Modal from "./Modal.jsx";
import React, { useEffect, useState, useCallback } from "react";
import TextBox from "./TextBox.jsx";
import TextInput from "./TextInput.jsx";
import InlineButton from "./InlineButton.jsx";

function CustomPathModal() {

    const [isModalOpen, setModalOpen] = useState(false);
    const [customPath, setCustomPath] = useState('');
    const isModalOpenRef = React.useRef(isModalOpen);


    const sendCustomPath = useCallback((path) => {
        if (!path) return;
        window.desktopEvents.send('SET_CUSTOM_YM_PATH', { path });
    }, [])

    const sendOpenExploreDialog = useCallback(() => {
        window.desktopEvents.send('OPEN_EXPLORER_DIALOG');
    }, [])

    const handleRequestYmPath = useCallback(() => {
        console.log('Received REQUEST_YM_PATH');
        if (!isModalOpenRef.current) {
            setModalOpen(true);
        }
        console.log(isModalOpenRef.current);
    }, [isModalOpen]);


    const handleExplorerDialogResponse = useCallback((event, args) => {
        console.log('Received EXPLORER_DIALOG_RESPONSE', args);
        if (isModalOpenRef.current && args.path) {
            setCustomPath(args.path);
        }
    }, [isModalOpen]);

    useEffect(() => {
        window.desktopEvents.on('REQUEST_YM_PATH', handleRequestYmPath);
        window.desktopEvents.on('EXPLORER_DIALOG_RESPONSE', handleExplorerDialogResponse);
    }, []);

    useEffect(() => {
        isModalOpenRef.current = isModalOpen;
    }, [isModalOpen]);

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={() => {
                sendCustomPath(customPath);
                setModalOpen(false);
            }}
            title="Укажите путь к папке с Яндекс Музыкой">
            <TextBox>
                Не удалось найти яндекс музыку автоматически. Укажите путь вручную.
            </TextBox>
            <div style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <TextInput value={customPath} disabled={true}/>
                <InlineButton onClick={sendOpenExploreDialog}>Обзор</InlineButton>
            </div>
        </Modal>
    )
}

export default CustomPathModal;