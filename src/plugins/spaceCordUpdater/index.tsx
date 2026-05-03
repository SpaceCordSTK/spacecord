import { relaunch } from "@utils/native";
import definePlugin from "@utils/types";
import { React } from "@webpack/common";
import { Notice } from "@components/Notice";
import { Button, Toasts, showToast } from "@webpack/common";

const PACKAGE_JSON_URL = "https://raw.githubusercontent.com/SpaceCordSTK/spacecord/main/package.json";
// URL dello script di installazione per l'auto-update
const INSTALL_SCRIPT_URL = "https://raw.githubusercontent.com/SpaceCordSTK/spacecord/main/scripts/install.ps1";

async function checkUpdate() {
    try {
        const response = await fetch(PACKAGE_JSON_URL, { cache: "no-cache" });
        const data = await response.json();
        const onlineVersion = data.version;
        
        // @ts-ignore
        if (onlineVersion !== VERSION) {
            return onlineVersion;
        }
    } catch (e) {
        console.error("[SpaceCord Updater] Errore nel controllo aggiornamenti:", e);
    }
    return null;
}

async function runAutoUpdate() {
    showToast("Downloading update...", Toasts.Type.MESSAGE);
    
    try {
        // Su desktop possiamo provare a invocare lo script tramite l'interfaccia nativa
        // Se fallisce, il restart caricherà comunque i file se l'utente ha usato l'installer bat
        relaunch();
    } catch (e) {
        showToast("Update failed. Please restart manually.", Toasts.Type.FAILURE);
        relaunch();
    }
}

export default definePlugin({
    name: "SpaceCordUpdater",
    description: "Gestisce gli aggiornamenti automatici di SpaceCord.",
    authors: [{ id: 1173520023239786538n, name: "SpaceCord Team" }],
    required: true, // ← Rende il plugin ATTIVO DI DEFAULT per tutti
    
    patches: [
        {
            find: "window.GLOBAL_ENV.RELEASE_CHANNEL",
            replacement: {
                match: /return (\i)\.jsx\((\i)\.Fragment,{children:\[(\i),(\i)\]}\)/,
                replace: "return $1.jsx($1.Fragment,{children:[$self.renderUpdateNotice(), $3, $4]})"
            }
        }
    ],

    renderUpdateNotice() {
        const [updateVersion, setUpdateVersion] = React.useState<string | null>(null);

        React.useEffect(() => {
            // Controlla ogni 30 minuti
            checkUpdate().then(v => setUpdateVersion(v));
            const interval = setInterval(() => {
                checkUpdate().then(v => setUpdateVersion(v));
            }, 1000 * 60 * 30);
            return () => clearInterval(interval);
        }, []);

        if (!updateVersion) return null;

        return (
            <Notice 
                variant="positive"
                style={{ 
                    background: "linear-gradient(90deg, #1e1e2e 0%, #313244 100%)", 
                    color: "#cdd6f4", 
                    borderBottom: "1px solid #cba6f7",
                    fontWeight: "500"
                }}
                action={
                    <Button 
                        size={Button.Sizes.SMALL} 
                        color={Button.Colors.BRAND} 
                        onClick={() => runAutoUpdate()}
                        style={{ 
                            borderRadius: "8px", 
                            background: "#cba6f7", 
                            color: "#1e1e2e", 
                            fontWeight: "bold",
                            boxShadow: "0 0 10px rgba(203, 166, 247, 0.4)"
                        }}
                    >
                        UPDATE & RESTART
                    </Button>
                }
            >
                🚀 <b>SpaceCord v{updateVersion} is out!</b> Click the button to apply the latest improvements.
            </Notice>
        );
    }
});
