import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Menu, React } from "@webpack/common";

const MediaEngineActions = findByPropsLazy("toggleSelfMute");

const settings = definePluginSettings({
    fakeDeafen: {
        type: OptionType.BOOLEAN,
        description: "Fake Deafen (Visibile agli altri, audio attivo per te)",
        default: false,
    }
});

function toggleFakeDeafen() {
    settings.store.fakeDeafen = !settings.store.fakeDeafen;
    
    // Notifichiamo a Discord di aggiornare lo stato
    try {
        MediaEngineActions.toggleSelfMute();
        setTimeout(() => MediaEngineActions.toggleSelfMute(), 100);
    } catch { }
}

export default definePlugin({
    name: "FakeDeafen",
    description: "Ti fa apparire mutato e sordo agli altri senza bloccare il tuo audio reale.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,

    patches: [
        {
            // Patch 1: Forza lo stato inviato al server (Gateway)
            find: "setSelfMute(",
            replacement: [
                {
                    match: /setSelfDeafen\((.+?)\)/g,
                    replace: "setSelfDeafen($self.isFakeDeafen() ? true : $1)"
                },
                {
                    match: /setSelfMute\((.+?)\)/g,
                    replace: "setSelfMute($self.isFakeDeafen() ? true : $1)"
                }
            ]
        },
        {
            // Patch 2: IMPEDISCE a Discord di mutare l'audio locale 
            // quando il Fake Deafen è attivo. Questo risolve il problema che non senti più nulla.
            find: ".setSelfMute(this.selfMute",
            replacement: [
                {
                    match: /\.setSelfMute\((.+?)\)/g,
                    replace: ".setSelfMute($self.isFakeDeafen() ? false : $1)"
                },
                {
                    match: /\.setSelfDeafen\((.+?)\)/g,
                    replace: ".setSelfDeafen($self.isFakeDeafen() ? false : $1)"
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
                    label="Fake Deafen (Server-side)"
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
