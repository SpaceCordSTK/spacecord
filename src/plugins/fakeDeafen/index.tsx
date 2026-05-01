import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Menu, React } from "@webpack/common";

const MediaEngineActions = findByPropsLazy("toggleSelfMute");

const settings = definePluginSettings({
    fakeDeafen: {
        type: OptionType.BOOLEAN,
        description: "Fake Deafen & Mute (Visibile a tutti nel server)",
        default: false,
    }
});

function toggleFakeDeafen() {
    settings.store.fakeDeafen = !settings.store.fakeDeafen;
    
    // Forza Discord a ricalcolare lo stato audio e inviarlo al server
    try {
        MediaEngineActions.toggleSelfMute();
        setTimeout(() => MediaEngineActions.toggleSelfMute(), 100);
    } catch { }
}

export default definePlugin({
    name: "FakeDeafen",
    description: "Ti fa apparire mutato e sordo a tutti gli utenti nel server, senza disattivare davvero il tuo audio.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,

    patches: [
        {
            // Patch fondamentale: colpiamo il modulo che gestisce lo stato "Self" (te stesso)
            // Questo assicura che il server riceva 'true' per mute e deafen
            find: "selfMute:",
            replacement: [
                {
                    match: /selfMute:(.+?),/g,
                    replace: "selfMute:$self.isFakeDeafen()?true:$1,"
                },
                {
                    match: /selfDeaf:(.+?),/g,
                    replace: "selfDeaf:$self.isFakeDeafen()?true:$1,"
                }
            ]
        },
        {
            // Seconda patch per intercettare l'invio diretto dei pacchetti (Gateway)
            find: "setSelfMute(",
            replacement: [
                {
                    match: /setSelfDeafen\((.+?)\)/g,
                    replace: "setSelfDeafen($self.isFakeDeafen()?true:$1)"
                },
                {
                    match: /setSelfMute\((.+?)\)/g,
                    replace: "setSelfMute($self.isFakeDeafen()?true:$1)"
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
