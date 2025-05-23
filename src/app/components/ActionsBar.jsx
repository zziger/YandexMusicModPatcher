import * as React from 'react';

function ActionsBar() {

    const [isPatched, setIsPatched] = React.useState(false);
    const [isPatching, setIsPatching] = React.useState(false);
    const [isDepatching, setIsDepatching] = React.useState(false);
    const [canInstall, setCanInstall] = React.useState(false);

    const onSettingsClick = React.useCallback(() => {

    }, [])
    const onDepatchClick = React.useCallback(() => {
        window.desktopEvents.send('DEPATCH');
        setIsDepatching(true);
    }, [])
    const onPatchClick = React.useCallback(() => {
        window.desktopEvents.send('PATCH');
        setIsPatching(true);
    }, [])

    React.useEffect(() => {
        window.desktopEvents.on('PATCH_PROGRESS', (event, args) => {
            if (args.progress === 1) {
                setIsPatching(false);
                setIsPatched(true);
            }
        })
        window.desktopEvents.on('IS_INSTALL_POSSIBLE_RESPONSE', (event, args) => {
            setCanInstall(args.isPossible);
        })
        window.desktopEvents.send('IS_INSTALL_POSSIBLE');
    }, [])

    return (
        <div className="ActionsBar_root">
            <button className="ActionsBar_SettingsButton"
                    onClick={onSettingsClick}
                    disabled={isDepatching || isPatching}>
                <span>Settings</span>
            </button>
            <button className="ActionsBar_DepatchButton"
                    onClick={onDepatchClick}
                    disabled={isDepatching || isPatching || !isPatched || !canInstall}>
                <span>{isDepatching ? "Depatching" : (!isPatched ? "Depatched" : "Depatch")}</span>
            </button>
            <button className="ActionsBar_PatchButton"
                    onClick={onPatchClick}
                    disabled={isDepatching || isPatching || isPatched || !canInstall}>
                <span>{isPatching ? "Patching" : (isPatched ? "Patched" : "Patch")}</span>
            </button>
        </div>
    )
}

export default ActionsBar;
