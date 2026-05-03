import { relaunch } from "@utils/native";
import definePlugin from "@utils/types";

const PACKAGE_JSON_URL = "https://raw.githubusercontent.com/SpaceCordSTK/spacecord/main/package.json";

async function checkUpdate() {
    try {
        const response = await fetch(PACKAGE_JSON_URL, { cache: "no-cache" });
        const data = await response.json();
        const onlineVersion = data.version;
        // @ts-ignore
        const localVersion = VERSION;
        if (onlineVersion !== localVersion) return onlineVersion;
    } catch (e) {}
    return null;
}

export default definePlugin({
    name: "SpaceCordUpdater",
    description: "Gestisce gli aggiornamenti automatici di SpaceCord con design professionale floating.",
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
                bottom: 20px;
                right: 20px;
                width: 320px;
                background: #0b0b0d;
                border: 1px solid #313244;
                border-radius: 16px;
                color: white;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                font-family: 'gg sans', 'Noto Sans', sans-serif;
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                z-index: 999999;
                animation: spacecord-slide-in 0.5s ease-out;
            ">
                <style>
                    @keyframes spacecord-slide-in {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                </style>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                        background: linear-gradient(135deg, #cba6f7 0%, #89b4fa 100%);
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                    ">🚀</div>
                    <div>
                        <div style="font-weight: bold; font-size: 16px; color: #f5e0dc;">New Update!</div>
                        <div style="font-size: 13px; color: #a6adc8;">SpaceCord v${updateVersion}</div>
                    </div>
                </div>
                <div style="font-size: 13px; color: #bac2de; line-height: 1.4;">
                    Una nuova versione è disponibile. Aggiorna ora per ottenere le ultime patch e funzionalità.
                </div>
                <button id="spacecord-update-btn" style="
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 10px;
                    border-radius: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 12px;
                ">Update & Restart</button>
            </div>
        `;

        document.body.appendChild(container);

        const btn = document.getElementById("spacecord-update-btn");
        if (btn) {
            btn.onclick = () => {
                btn.innerText = "UPDATING...";
                btn.style.opacity = "0.5";
                relaunch();
            };
            btn.onmouseenter = () => {
                btn.style.background = "rgba(255, 255, 255, 0.1)";
                btn.style.borderColor = "rgba(255, 255, 255, 0.2)";
                btn.style.transform = "translateY(-2px)";
            };
            btn.onmouseleave = () => {
                btn.style.background = "rgba(255, 255, 255, 0.05)";
                btn.style.borderColor = "rgba(255, 255, 255, 0.1)";
                btn.style.transform = "translateY(0)";
            };
        }
    }
});
