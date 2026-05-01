import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy, findStoreLazy } from "@webpack";
import { Menu, React } from "@webpack/common";

const MediaEngineActions = findByPropsLazy("toggleSelfMute");
const SelectedChannelStore = findStoreLazy("SelectedChannelStore");

const settings = definePluginSettings({
    fakeDeafen: {
        type: OptionType.BOOLEAN,
        description: "Fake Deafen & Mute (Gli altri ti vedono mutato e sordo, ma tu senti e parli)",
        default: false,
    }
});

function toggleFakeDeafen() {
    settings.store.fakeDeafen = !settings.store.fakeDeafen;
    
    // Inneschiamo un aggiornamento per far sì che Discord invii lo stato aggiornato al server
    try {
        MediaEngineActions.toggleSelfMute();
        setTimeout(() => MediaEngineActions.toggleSelfMute(), 100);
    } catch { }
}

export default definePlugin({
    name: "FakeDeafen",
    description: "Ti fa apparire mutato e sordo agli altri senza disattivare davvero il tuo audio.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,

    patches: [
        {
            // Patch che intercetta l'invio dello stato audio al server di Discord
            find: "selfDeaf:",
            replacement: [
                {
                    match: /selfMute:(.+?),/g,
                    replace: "selfMute:$self.isFakeDeafen() ? true : $1,"
                },
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
                    label="Fake Deafen & Mute"
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
