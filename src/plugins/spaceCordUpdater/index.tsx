import { relaunch } from "@utils/native";
import definePlugin from "@utils/types";
import { React } from "@webpack/common";
import { Notice } from "@components/Notice";
import { Button } from "@webpack/common";

// URL del tuo package.json su GitHub per controllare la versione
const PACKAGE_JSON_URL = "https://raw.githubusercontent.com/SpaceCordSTK/spacecord/main/package.json";

async function checkUpdate() {
    try {
        const response = await fetch(PACKAGE_JSON_URL);
        const data = await response.json();
        const onlineVersion = data.version;
        
        // Confronta con la versione locale (VERSION è una costante globale iniettata da esbuild)
        // @ts-ignore
        if (onlineVersion !== VERSION) {
            return onlineVersion;
        }
    } catch (e) {
        console.error("[SpaceCord Updater] Errore nel controllo aggiornamenti:", e);
    }
    return null;
}

export default definePlugin({
    name: "SpaceCordUpdater",
    description: "Mostra un banner quando è disponibile un aggiornamento di SpaceCord.",
    authors: [{ id: 1173520023239786538n, name: "SpaceCord Team" }],
    
    // Inseriamo il banner nel sistema di "Notices" di Discord
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
            checkUpdate().then(v => setUpdateVersion(v));
        }, []);

        if (!updateVersion) return null;

        return (
            <Notice 
                variant="positive"
                style={{ background: "linear-gradient(90deg, #1e1e2e 0%, #313244 100%)", color: "#cdd6f4", borderBottom: "1px solid #cba6f7" }}
                action={
                    <Button 
                        size={Button.Sizes.SMALL} 
                        color={Button.Colors.BRAND} 
                        onClick={() => relaunch()}
                        style={{ borderRadius: "8px", background: "#cba6f7", color: "#1e1e2e", fontWeight: "bold" }}
                    >
                        RESTART NOW
                    </Button>
                }
            >
                ✨ <b>SpaceCord Update Available!</b> (v{updateVersion}) New features and fixes are ready.
            </Notice>
        );
    }
});
