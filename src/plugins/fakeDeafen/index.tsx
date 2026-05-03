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
            // Usiamo 'setSelfMute:' che è un identificatore più stabile
            find: "setSelfMute:",
            replacement: [
                {
                    match: /setSelfDeafen:function\((.+?)\){/g,
                    replace: "setSelfDeafen:function($1){if($self.isFakeDeafen()){arguments[0]=true;} "
                },
                {
                    match: /setSelfMute:function\((.+?)\){/g,
                    replace: "setSelfMute:function($1){if($self.isFakeDeafen()){arguments[0]=true;} "
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
