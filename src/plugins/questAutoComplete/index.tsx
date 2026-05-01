import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";

const QuestsStore = findByPropsLazy("getQuests");
const QuestsActions = findByPropsLazy("enrollQuest");
const Dispatcher = findByPropsLazy("dispatch", "subscribe");

const settings = definePluginSettings({
    autoComplete: {
        type: OptionType.BOOLEAN,
        description: "Completa automaticamente le missioni",
        default: true,
    }
});

function processQuests() {
    if (!settings.store.autoComplete) return;

    try {
        const quests = QuestsStore.getQuests();
        if (!quests) return;

        // Discord ora usa spesso un formato diverso per le quest, le iteriamo correttamente
        const questList = typeof quests.values === "function" ? Array.from(quests.values()) : Object.values(quests);

        for (const quest: any of questList) {
            // Se non siamo iscritti (status 1)
            if (quest.config?.status === 1 || !quest.enrolled) {
                QuestsActions.enrollQuest(quest.id);
                console.log(`[QuestAutoComplete] Iscritto alla missione: ${quest.id}`);
            }

            // Inviamo un segnale di "heartbeat" per la quest per simulare che stiamo giocando/guardando
            Dispatcher.dispatch({
                type: "QUEST_VIDEO_PROGRESS_UPDATE",
                questId: quest.id,
                progress: 100 // Proviamo a forzare il progresso
            });
        }
    } catch (e) {
        // Silenzioso
    }
}

export default definePlugin({
    name: "QuestAutoComplete",
    description: "Iscrizione e completamento automatico delle missioni Discord.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,
    start() {
        // Aspettiamo che il dispatcher sia pronto
        setTimeout(() => processQuests(), 5000);
        this.interval = setInterval(processQuests, 1000 * 60 * 20); // Ogni 20 minuti
    },
    stop() {
        clearInterval(this.interval);
    }
});
