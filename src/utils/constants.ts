/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export const REACT_GLOBAL = "Vencord.Webpack.Common.React";

// ===== SpaceCord - Impostazioni Server =====
// MODIFICA QUESTI con i tuoi ID! (clic destro su canale/ruolo in Discord → "Copia ID")

export const SUPPORT_CHANNEL_ID = "1297590739911573585"; // Canale di supporto del TUO server - il bot risponderà qui ai problemi
export const GUILD_ID = "1495487890996858952";           // ID del TUO server Discord principale di SpaceCord
export const DONOR_ROLE_ID = "1498342421489123449";      // Ruolo "Donatore" nel tuo server - chi lo ha vede il banner "Thank you for donating"
export const CONTRIB_ROLE_ID = "1498342421489123449";    // Ruolo "Donatore/Contributor" → chi lo ha riceve il badge Donatore nel profilo
export const ADMINISTRATOR_ROLE_ID = "1498343399143768135"; // ← Ruolo Admin del tuo server - ricevono il badge Administrator
export const STAFF_ROLE_ID = "1498352220549415023";         // ← Ruolo Staff del tuo server - ricevono il badge Staff
export const DEVELOPER_ROLE_ID = "1499578838886383656"; // ← Ruolo Developer del tuo server - ricevono il badge Developer
export const EVENT_ROLE_ID = "1499596987505447103"; // ← Ruolo Event del tuo server
export const PARTNER_ROLE_ID = "1499601274121748521"; // ← Ruolo Partner del tuo server
export const EQUICORD_TEAM = "1173520023239786538";      // Ruolo del team Equicord (NON cambiare, usato internamente)
export const EQUICORD_HELPERS = "1326406112144265257";   // Ruolo helper Equicord (NON cambiare, usato internamente)
export const VENCORD_CONTRIB_ROLE_ID = "1173343399470964856"; // Ruolo contributore Vencord (NON cambiare)
export const EQUIBOT_USER_ID = "1243063117852835941";    // ID del bot Equicord (NON cambiare)

// ===== Vencord - NON modificare questi =====
// Servono per la compatibilità con i badge e le API di Vencord

export const VC_SUPPORT_CHANNEL_ID = "1026515880080842772";  // Canale supporto server Vencord (non toccare)
export const VC_GUILD_ID = "1015060230222131221";             // ID server Discord di Vencord (non toccare)
export const VENBOT_USER_ID = "1017176847865352332";          // ID bot di Vencord (non toccare)
export const VC_DONOR_ROLE_ID = "1042507929485586532";        // Ruolo donatore Vencord - controlla badge Vencord
export const VC_CONTRIB_ROLE_ID = "1026534353167208489";      // Ruolo contributore Vencord - controlla badge contributore
export const VC_REGULAR_ROLE_ID = "1026504932959977532";      // Ruolo "regular" nel server Vencord
export const VC_SUPPORT_CATEGORY_ID = "1108135649699180705";  // Categoria supporto nel server Vencord
export const VC_KNOWN_ISSUES_CHANNEL_ID = "1222936386626129920"; // Canale bug noti Vencord
export const VESKTOP_SUPPORT_CHANNEL_ID = "1345457031426871417"; // Canale supporto Vesktop (client standalone Vencord)
export const VC_SUPPORT_CHANNEL_IDS = [VC_SUPPORT_CHANNEL_ID, VESKTOP_SUPPORT_CHANNEL_ID];

export const GUILD_IDS = [GUILD_ID, VC_GUILD_ID];
export const SUPPORT_CHANNEL_IDS = [SUPPORT_CHANNEL_ID, VC_SUPPORT_CHANNEL_ID];
export const DONOR_ROLE_IDS = [DONOR_ROLE_ID, VC_DONOR_ROLE_ID];
export const CONTRIB_ROLE_IDS = [CONTRIB_ROLE_ID, VENCORD_CONTRIB_ROLE_ID, VC_CONTRIB_ROLE_ID];

const platform = navigator.platform.toLowerCase();
export const IS_WINDOWS = platform.startsWith("win");
export const IS_MAC = platform.startsWith("mac");
export const IS_LINUX = platform.startsWith("linux");
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#mobile_tablet_or_desktop
// "In summary, we recommend looking for the string Mobi anywhere in the User Agent to detect a mobile device."
export const IS_MOBILE = navigator.userAgent.includes("Mobi");

export interface Dev {
    name: string;
    id: bigint;
    badge?: boolean;
}

/**
 * If you made a plugin or substantial contribution, add yourself here.
 * This object is used for the plugin author list, as well as to add a contributor badge to your profile.
 * If you wish to stay fully anonymous, feel free to set ID to 0n.
 * If you are fine with attribution but don't want the badge, add badge: false
 */
export const Devs = /* #__PURE__*/ Object.freeze({
} satisfies Record<string, Dev>);

export const EquicordDevs = Object.freeze({
} satisfies Record<string, Dev>);

// iife so #__PURE__ works correctly
export const VencordDevsById = /* #__PURE__*/ (() =>
    Object.freeze(Object.fromEntries(
        Object.entries(Devs)
            .filter(d => d[1].id !== 0n)
            .map(([_, v]) => [v.id, v] as const)
    ))
)() as Record<string, Dev>;

export const EquicordDevsById = /* #__PURE__*/ (() =>
    Object.freeze(Object.fromEntries(
        Object.entries(EquicordDevs)
            .filter(d => d[1].id !== 0n)
            .map(([_, v]) => [v.id, v] as const)
    ))
)() as Record<string, Dev>;
