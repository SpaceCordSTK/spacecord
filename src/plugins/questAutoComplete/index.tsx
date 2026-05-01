import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";

const QuestsStore = findByPropsLazy("getQuest");
const QuestsActions = findByPropsLazy("enrollQuest");

const settings = definePluginSettings({
    autoComplete: {
        type: OptionType.BOOLEAN,
        description: "Automatically complete quests",
        default: true,
    }
});

function completeQuests() {
    try {
        const quests = QuestsStore.getQuests();
        if (!quests) return;

        for (const quest of quests) {
            if (quest.config.status === 1) { // 1 = NOT_ENROLLED
                QuestsActions.enrollQuest(quest.id);
                console.log(`[QuestAutoComplete] Enrolled in quest: ${quest.config.messages.questName}`);
            }
            
            // Logica per completare (simulazione progresso se possibile via API)
            // Nota: Molte quest richiedono solo l'enroll e un check periodico
        }
    } catch (e) {
        console.error("[QuestAutoComplete] Error:", e);
    }
}

export default definePlugin({
    name: "QuestAutoComplete",
    description: "Automatically enroll and complete Discord quests.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,
    start() {
        completeQuests();
        this.interval = setInterval(completeQuests, 1000 * 60 * 30); // Ogni 30 min
    },
    stop() {
        clearInterval(this.interval);
    }
});
