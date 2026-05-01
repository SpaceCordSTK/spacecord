import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy, findStoreLazy } from "@webpack";
import { Menu, React } from "@webpack/common";

const MediaEngineActions = findByPropsLazy("toggleSelfMute");
const SelectedChannelStore = findStoreLazy("SelectedChannelStore");

const settings = definePluginSettings({
    fakeDeafen: {
        type: OptionType.BOOLEAN,
        description: "Fake Deafen (Gli altri ti vedono sordo, ma tu senti tutto)",
        default: false,
    }
});

function isInVoiceChannel(): boolean {
    return !!SelectedChannelStore.getVoiceChannelId();
}

function toggleFakeDeafen() {
    settings.store.fakeDeafen = !settings.store.fakeDeafen;
    
    // Aggiorniamo lo stato audio per notificare il cambiamento senza smuttare il microfono
    try {
        MediaEngineActions.toggleSelfMute();
        setTimeout(() => MediaEngineActions.toggleSelfMute(), 100);
    } catch (e) {
        console.error("[FakeDeafen] Errore nel toggle:", e);
    }
}

export default definePlugin({
    name: "FakeDeafen",
    description: "Ti permette di sembrare sordo agli altri utenti mentre continui ad ascoltare.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,

    patches: [
        {
            // Patch mirata alla funzione di sincronizzazione dello stato audio
            find: "selfDeaf:",
            replacement: [
                {
                    match: /selfDeaf:(.+?),/g,
                    replace: "selfDeaf:$self.isFakeDeafen() ? true : $1,"
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
                    disabled={!isInVoiceChannel()}
                    action={toggleFakeDeafen}
                />
            );
        }
    },

    isFakeDeafen() {
        return settings.store.fakeDeafen;
    }
});
