import { relaunch } from "@utils/native";
import definePlugin from "@utils/types";

const PACKAGE_JSON_URL = "https://raw.githubusercontent.com/SpaceCordSTK/spacecord/main/package.json";

async function checkUpdate() {
    try {
        // Aggiungiamo un timestamp per bypassare la cache di GitHub
        const response = await fetch(`${PACKAGE_JSON_URL}?t=${Date.now()}`, { cache: "no-cache" });
        const data = await response.json();
        const onlineVersion = data.version;
        // @ts-ignore
        const localVersion = VERSION;

        console.log(`[SpaceCord Updater] Sync: Local=${localVersion}, Online=${onlineVersion}`);

        if (onlineVersion !== localVersion) {
            return onlineVersion;
        }
    } catch (e) {}
    return null;
}

export default definePlugin({
    name: "SpaceCordUpdater",
    description: "Gestisce gli aggiornamenti automatici di SpaceCord con bypass cache.",
    authors: [{ id: 1173520023239786538n, name: "SpaceCord Team" }],
    required: true,

    patches: [],

    async start() {
        this.checkAndNotify();
        this.interval = setInterval(() => this.checkAndNotify(), 1000 * 60 * 15);
    },

    stop() {
        clearInterval(this.interval);
        const el = document.getElementById("spacecord-update-notice-root");
        if (el) el.remove();
    },

    async checkAndNotify() {
        const updateVersion = await checkUpdate();
        if (!updateVersion || document.getElementById("spacecord-update-notice-root")) return;

        const container = document.createElement("div");
        container.id = "spacecord-update-notice-root";
        container.innerHTML = `
            <div style="
                position: fixed;
                bottom: 25px;
                right: 25px;
                width: 340px;
                background: #0f0f12;
                border: 1px solid #313244;
                border-radius: 20px;
                color: white;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                font-family: 'gg sans', 'Noto Sans', sans-serif;
                box-shadow: 0 15px 40px rgba(0,0,0,0.8);
                z-index: 999999;
                animation: spacecord-pop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            ">
                <style>
                    @keyframes spacecord-pop-in {
                        from { transform: translateY(50px) scale(0.9); opacity: 0; }
                        to { transform: translateY(0) scale(1); opacity: 1; }
                    }
                </style>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="
                        background: linear-gradient(135deg, #cba6f7 0%, #89b4fa 100%);
                        width: 44px;
                        height: 44px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22px;
                        box-shadow: 0 4px 10px rgba(203, 166, 247, 0.3);
                    ">🚀</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 800; font-size: 17px; color: #ffffff; letter-spacing: -0.5px;">System Update</div>
                        <div style="font-size: 13px; color: #9399b2; font-weight: 500;">v${updateVersion} Available</div>
                    </div>
                </div>
                <div style="font-size: 13px; color: #a6adc8; line-height: 1.5;">
                    È disponibile un nuovo aggiornamento di sistema. Installalo ora per mantenere SpaceCord veloce e sicuro.
                </div>
                <button id="spacecord-update-btn" style="
                    background: rgba(255, 255, 255, 0.04);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 12px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    font-size: 11px;
                    margin-top: 5px;
                ">Update SpaceCord</button>
            </div>
        `;

        document.body.appendChild(container);

        const btn = document.getElementById("spacecord-update-btn");
        if (btn) {
            btn.onclick = () => {
                btn.style.opacity = "0.5";
                btn.innerText = "Processing...";
                relaunch();
            };
            btn.onmouseenter = () => {
                btn.style.background = "rgba(255, 255, 255, 0.08)";
                btn.style.borderColor = "rgba(255, 255, 255, 0.2)";
                btn.style.boxShadow = "0 0 20px rgba(255,255,255,0.05)";
            };
            btn.onmouseleave = () => {
                btn.style.background = "rgba(255, 255, 255, 0.04)";
                btn.style.borderColor = "rgba(255, 255, 255, 0.1)";
                btn.style.boxShadow = "none";
            };
        }
    }
});
