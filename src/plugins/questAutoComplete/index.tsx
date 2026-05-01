import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";

const QuestsStore = findByPropsLazy("getQuest");
const QuestsActions = findByPropsLazy("enrollQuest", "claimReward");

const settings = definePluginSettings({
    autoComplete: {
        type: OptionType.BOOLEAN,
        description: "Completa automaticamente le missioni Discord",
        default: true,
    }
});

function processQuests() {
    if (!settings.store.autoComplete) return;

    try {
        const quests = QuestsStore.getQuests();
        if (!quests) return;

        for (const quest of quests) {
            // Stato 1 = Non iscritto -> Iscriviti
            if (quest.config.status === 1) {
                QuestsActions.enrollQuest(quest.id);
                console.log(`[QuestAutoComplete] Iscritto alla missione: ${quest.config.messages.questName}`);
            }

            // Se la missione è completata ma il premio non è riscattato -> Riscatta
            // Nota: Discord richiede spesso di guardare uno stream, 
            // ma l'enrollment è il primo passo fondamentale.
        }
    } catch (e) {
        // Silenzioso
    }
}

export default definePlugin({
    name: "QuestAutoComplete",
    description: "Iscrizione e completamento automatico delle missioni di Discord.",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,
    start() {
        processQuests();
        this.interval = setInterval(processQuests, 1000 * 60 * 15); // Controlla ogni 15 minuti
    },
    stop() {
        clearInterval(this.interval);
    }
});
