import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";

const QuestsStore = findByPropsLazy("getQuests");
const QuestsActions = findByPropsLazy("enrollQuest", "claimReward");

const settings = definePluginSettings({
    autoComplete: {
        type: OptionType.BOOLEAN,
        description: "Iscriviti e completa automaticamente le missioni",
        default: true,
    }
});

async function processQuests() {
    if (!settings.store.autoComplete) return;

    try {
        // Se Discord non ha ancora caricato le quest, usciamo e riproviamo dopo
        if (!QuestsStore || !QuestsStore.getQuests) return;

        const quests = QuestsStore.getQuests();
        if (!quests) return;

        // Iteriamo su tutte le quest attive (che sono una mappa, non un array)
        const questEntries = Object.values(quests);
        
        for (const quest: any of questEntries) {
            // Stato 1 significa "Non ancora iscritto"
            if (quest.config?.status === 1 || quest.enrolled === false) {
                QuestsActions.enrollQuest(quest.id);
                console.log(`[SpaceCord Quests] Iscritto con successo a: ${quest.config?.messages?.questName || quest.id}`);
            }

            // Se la missione è completata ma non riscattata, prova a riscattarla
            if (quest.completedAt && !quest.claimedAt) {
                QuestsActions.claimReward(quest.id);
            }
        }
    } catch (e) {
        // Silenzioso per non intasare la console
    }
}

export default definePlugin({
    name: "QuestAutoComplete",
    description: "Gestisce automaticamente le missioni Discord (iscrizione e riscatto premi).",
    authors: [{ id: 1449096170646536233n, name: "Block" }],
    settings,
    start() {
        // Aspettiamo un po' all'avvio per dare tempo a Discord di caricare i moduli
        setTimeout(() => processQuests(), 10000);
        this.interval = setInterval(processQuests, 1000 * 60 * 30); // Ogni 30 min
    },
    stop() {
        clearInterval(this.interval);
    }
});
