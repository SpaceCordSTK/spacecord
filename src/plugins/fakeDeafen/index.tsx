import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy, findStoreLazy } from "@webpack";
import { Menu, React } from "@webpack/common";

const MediaEngineActions = findByPropsLazy("toggleSelfMute");
const SelectedChannelStore = findStoreLazy("SelectedChannelStore");

const settings = definePluginSettings({
    fakeDeafen: {
        type: OptionType.BOOLEAN,
        description: "Fake Deafen (Altri ti vedono sordo, ma tu senti)",
        default: false,
    }
});

function isInVoiceChannel(): boolean {
    return !!SelectedChannelStore.getVoiceChannelId();
}

function toggleFakeDeafen() {
    settings.store.fakeDeafen = !settings.store.fakeDeafen;
    
    // Forza un aggiornamento dello stato audio per far capire a Discord che è cambiato
    try {
        MediaEngineActions.toggleSelfMute();
        setTimeout(() => MediaEngineActions.toggleSelfMute(), 50);
    } catch { }
}

export default definePlugin({
    name: "FakeDeafen",
    description: "Fake your deafen status to others while still hearing them.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,

    patches: [
        {
            // Questa patch intercetta la funzione che invia lo stato al server
            find: ".setSelfMute(this.selfMute",
            replacement: [
                {
                    match: /\.setSelfDeafen\((.+?)\)/g,
                    replace: ".setSelfDeafen($self.isFakeDeafen()?true:$1)"
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
