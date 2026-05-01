import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Menu, React } from "@webpack/common";

const MediaEngineStore = findByPropsLazy("isSelfDeaf");
const MediaEngineActions = findByPropsLazy("toggleSelfMute");

const settings = definePluginSettings({
    fakeDeafen: {
        type: OptionType.BOOLEAN,
        description: "Fake Deafen (Altri ti vedono sordo, ma tu senti)",
        default: false,
    }
});

function toggleFakeDeafen() {
    settings.store.fakeDeafen = !settings.store.fakeDeafen;
    
    // Inneschiamo un aggiornamento dello stato audio per sincronizzare
    try {
        MediaEngineActions.toggleSelfMute();
        setTimeout(() => MediaEngineActions.toggleSelfMute(), 50);
    } catch { }
}

export default definePlugin({
    name: "FakeDeafen",
    description: "Simula lo stato di sordo per gli altri, mantenendo l'audio attivo per te.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,

    patches: [
        {
            // Questa è la patch definitiva: intercettiamo la funzione che comunica lo stato al server di Discord
            find: "setSelfDeafen:",
            replacement: [
                {
                    match: /setSelfDeafen:function\((.+?)\){/g,
                    replace: "setSelfDeafen:function($1){if($self.isFakeDeafen()){arguments[0]=true;} "
                }
            ]
        }
    ],

    contextMenus: {
        "audio-device-context"(children) {
            children.push(
                <Menu.MenuSeparator />,
                <Menu.MenuCheckboxItem
                    id="vc-fake-deafen"
                    label="Fake Deafen"
                    checked={settings.store.fakeDeafen}
                    action={toggleFakeDeafen}
                />
            );
        }
    },

    isFakeDeafen() {
        return settings.store.fakeDeafen;
    }
});
