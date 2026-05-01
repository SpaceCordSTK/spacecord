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

import "./fixDiscordBadgePadding.css";

import { _getBadges, BadgePosition, BadgeUserArgs, ProfileBadge } from "@api/Badges";
import ErrorBoundary from "@components/ErrorBoundary";
import { openContributorModal } from "@components/settings/tabs";
import { Devs, GUILD_ID, CONTRIB_ROLE_ID, ADMINISTRATOR_ROLE_ID, STAFF_ROLE_ID, DEVELOPER_ROLE_ID, EVENT_ROLE_ID, PARTNER_ROLE_ID } from "@utils/constants";
import { copyWithToast } from "@utils/discord";
import { Logger } from "@utils/Logger";
import { shouldShowContributorBadge, shouldShowEquicordContributorBadge } from "@utils/misc";
import definePlugin from "@utils/types";
import { ContextMenuApi, GuildMemberStore, Menu, Toasts, UserStore } from "@webpack/common";

import Plugins, { PluginMeta } from "~plugins";

import { EquicordDonorModal, EquicordTranslatorModal, VencordDonorModal } from "./modals";

const CONTRIBUTOR_BADGE = "https://cdn.discordapp.com/emojis/1092089799109775453.png?size=64";
const EQUICORD_CONTRIBUTOR_BADGE = "https://equicord.org/assets/favicon.png";
const USERPLUGIN_CONTRIBUTOR_BADGE = "https://equicord.org/assets/icons/misc/userplugin.png";

const ContributorBadge: ProfileBadge = {
    id: "vencord_contributor_badge",
    description: "Vencord Contributor",
    iconSrc: CONTRIBUTOR_BADGE,
    position: BadgePosition.START,
    shouldShow: ({ userId }) => shouldShowContributorBadge(userId),
    onClick: (_, { userId }) => openContributorModal(UserStore.getUser(userId))
};

const EquicordContributorBadge: ProfileBadge = {
    id: "equicord_contributor_badge",
    description: "Equicord Contributor",
    iconSrc: EQUICORD_CONTRIBUTOR_BADGE,
    position: BadgePosition.START,
    shouldShow: ({ userId }) => shouldShowEquicordContributorBadge(userId),
    onClick: (_, { userId }) => openContributorModal(UserStore.getUser(userId)),
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(1.2)"
        }
    },
};


// ──────────────────────────────────────────────
// Badge DONATORE — chi ha CONTRIB_ROLE_ID nel server SpaceCord
// Per cambiare icona: sostituisci iconSrc con il link della tua immagine
// Per cambiare testo tooltip: cambia "description"
// ──────────────────────────────────────────────
const SpaceCordDonorBadge: ProfileBadge = {
    id: "spacecord_donor_badge",
    description: "Early Supporter",        // ← testo che appare al passaggio del mouse
    iconSrc: "https://imgur.com/GzxJteL.png", // ← link immagine badge (32x32 o 64x64 consigliato)
    position: BadgePosition.START,
    shouldShow: ({ userId }) => {
        const member = GuildMemberStore.getMember(GUILD_ID, userId);
        return !!member?.roles?.includes(CONTRIB_ROLE_ID);
    },
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(1.1)"
        }
    },
};

// ──────────────────────────────────────────────
// Badge ADMINISTRATOR — chi ha ADMINISTRATOR_ROLE_ID nel server SpaceCord
// ──────────────────────────────────────────────
const SpaceCordAdminBadge: ProfileBadge = {
    id: "spacecord_admin_badge",
    description: "Administrator", // ← testo tooltip
    iconSrc: "https://imgur.com/7AJ8fGC.png", // ← cambia con l'icona che vuoi
    position: BadgePosition.START,
    shouldShow: ({ userId }) => {
        const member = GuildMemberStore.getMember(GUILD_ID, userId);
        return !!member?.roles?.includes(ADMINISTRATOR_ROLE_ID);
    },
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(1.2)"
        }
    },
};

// ──────────────────────────────────────────────
// Badge STAFF — chi ha STAFF_ROLE_ID nel server SpaceCord
// ──────────────────────────────────────────────
const SpaceCordStaffBadge: ProfileBadge = {
    id: "spacecord_staff_badge",
    description: "Moderator",         // ← testo tooltip
    iconSrc: "https://imgur.com/s7kIPj3.png", // ← cambia con l'icona che vuoi
    position: BadgePosition.START,
    shouldShow: ({ userId }) => {
        const member = GuildMemberStore.getMember(GUILD_ID, userId);
        return !!member?.roles?.includes(STAFF_ROLE_ID);
    },
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(1.2)"
        }
    },
};

// ──────────────────────────────────────────────
// Badge DEVELOPER — chi ha DEVELOPER_ROLE_ID nel server SpaceCord
// ──────────────────────────────────────────────
const SpaceCordDevBadge: ProfileBadge = {
    id: "spacecord_dev_badge",
    description: "Developer",    // ← testo tooltip
    iconSrc: "https://imgur.com/06xw1ac.png", // ← cambia con l'icona che vuoi
    position: BadgePosition.START,
    shouldShow: ({ userId }) => {
        const member = GuildMemberStore.getMember(GUILD_ID, userId);
        return !!member?.roles?.includes(DEVELOPER_ROLE_ID);
    },
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(1.1)"
        }
    },
};
// ──────────────────────────────────────────────
// Badge EVENT — chi ha EVENT_ROLE_ID nel server SpaceCord
// ──────────────────────────────────────────────
const SpaceCordEventBadge: ProfileBadge = {
    id: "spacecord_event_badge",
    description: "Event HypeCord",    // ← testo tooltip
    iconSrc: "https://imgur.com/3etNO3Y.png", // ← cambia con l'icona che vuoi
    position: BadgePosition.START,
    shouldShow: ({ userId }) => {
        const member = GuildMemberStore.getMember(GUILD_ID, userId);
        return !!member?.roles?.includes(EVENT_ROLE_ID);
    },
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(0.9)"
        }
    },
};

// ──────────────────────────────────────────────
// Badge PARTNER — chi ha PARTNER_ROLE_ID nel server SpaceCord
// ──────────────────────────────────────────────
const SpaceCordPartnerBadge: ProfileBadge = {
    id: "spacecord_partner_badge",
    description: "Partnered Server Owner",    // ← testo tooltip
    iconSrc: "https://imgur.com/WCA5fe4.png", // ← link immagine badge
    position: BadgePosition.START,
    shouldShow: ({ userId }) => {
        const member = GuildMemberStore.getMember(GUILD_ID, userId);
        return !!member?.roles?.includes(PARTNER_ROLE_ID);
    },
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(1.1)"
        }
    },
};

const UserPluginContributorBadge: ProfileBadge = {
    id: "user_plugin_contributor_badge",
    description: "User Plugin Contributor",
    iconSrc: USERPLUGIN_CONTRIBUTOR_BADGE,
    position: BadgePosition.START,
    shouldShow: ({ userId }) => {
        if (!IS_DEV) return false;
        const allPlugins = Object.values(Plugins);
        return allPlugins.some(p => {
            const pluginMeta = PluginMeta[p.name];
            return pluginMeta?.userPlugin && p.authors.some(a => a.id.toString() === userId);
        });
    },
    onClick: (_, { userId }) => openContributorModal(UserStore.getUser(userId)),
    props: {
        style: {
            borderRadius: "50%",
            transform: "scale(0.9)"
        }
    },
};

let DonorBadges = {} as Record<string, Array<Record<"tooltip" | "badge", string>>>;
let EquicordDonorBadges = {} as Record<string, Array<Record<"tooltip" | "badge", string>>>;

async function loadBadges(url: string, noCache = false) {
    const init = {} as RequestInit;
    if (noCache) init.cache = "no-cache";

    return await fetch(url, init).then(r => r.json());
}

async function loadAllBadges(noCache = false) {
    const vencordBadges = await loadBadges("https://badges.vencord.dev/badges.json", noCache);
    const equicordBadges = await loadBadges("https://badge.equicord.org/badges.json", noCache);

    DonorBadges = vencordBadges;
    EquicordDonorBadges = equicordBadges;
}

let intervalId: any;

export function BadgeContextMenu({ badge }: { badge: Omit<ProfileBadge, "id"> & BadgeUserArgs; }) {
    return (
        <Menu.Menu
            navId="vc-badge-context"
            onClose={ContextMenuApi.closeContextMenu}
            aria-label="Badge Options"
        >
            {badge.description && (
                <Menu.MenuItem
                    id="vc-badge-copy-name"
                    label="Copy Badge Name"
                    action={() => copyWithToast(badge.description!)}
                />
            )}
            {badge.iconSrc && (
                <Menu.MenuItem
                    id="vc-badge-copy-link"
                    label="Copy Badge Image Link"
                    action={() => copyWithToast(badge.iconSrc!)}
                />
            )}
        </Menu.Menu>
    );
}

export default definePlugin({
    name: "BadgeAPI",
    description: "API to add badges to users",
    authors: [Devs.Megu, Devs.Ven, Devs.TheSun],
    required: true,
    patches: [
        {
            find: "#{intl::PROFILE_USER_BADGES}",
            replacement: [
                {
                    match: /alt:" ","aria-hidden":!0,src:.{0,50}(\i).iconSrc/,
                    replace: "...$1.props,$&"
                },
                {
                    match: /(?<=forceOpen:.{0,40}?ariaHidden:!0,)children:(?=.{0,50}?(\i)\.id)/,
                    replace: "children:$1.component?$self.renderBadgeComponent({...$1}) :"
                },
                // handle onClick and onContextMenu
                {
                    match: /href:(\i)\.link/,
                    replace: "...$self.getBadgeMouseEventHandlers($1),$&"
                }
            ]
        },
        {
            find: "getLegacyUsername(){",
            replacement: {
                match: /getBadges\(\)\{.{0,100}?return\[/,
                replace: "$&...$self.getBadges(this),"
            }
        }
    ],

    // for access from the console or other plugins
    get DonorBadges() {
        return DonorBadges;
    },

    get EquicordDonorBadges() {
        return EquicordDonorBadges;
    },

    toolboxActions: {
        async "Refetch Badges"() {
            await loadAllBadges(true);
            Toasts.show({
                id: Toasts.genId(),
                message: "Successfully refetched badges!",
                type: Toasts.Type.SUCCESS
            });
        }
    },

    userProfileBadges: [SpaceCordDonorBadge, SpaceCordDevBadge, SpaceCordAdminBadge, SpaceCordStaffBadge, SpaceCordEventBadge, SpaceCordPartnerBadge],

    async start() {
        await loadAllBadges();
        clearInterval(intervalId);
        intervalId = setInterval(loadAllBadges, 1000 * 60 * 30); // 30 minutes
    },

    async stop() {
        clearInterval(intervalId);
    },

    getBadges(profile: { userId: string; guildId: string; }) {
        if (!profile) return [];

        try {
            return _getBadges(profile);
        } catch (e) {
            new Logger("BadgeAPI#getBadges").error(e);
            return [];
        }
    },

    renderBadgeComponent: ErrorBoundary.wrap((badge: ProfileBadge & BadgeUserArgs) => {
        const Component = badge.component!;
        return <Component {...badge} />;
    }, { noop: true }),

    getBadgeMouseEventHandlers(badge: ProfileBadge & BadgeUserArgs) {
        const handlers = {} as Record<string, (e: React.MouseEvent) => void>;

        if (!badge) return handlers; // sanity check

        const { onClick, onContextMenu } = badge;

        if (onClick) handlers.onClick = e => onClick(e, badge);
        if (onContextMenu) handlers.onContextMenu = e => onContextMenu(e, badge);

        return handlers;
    },

    getDonorBadges(userId: string) {
        return DonorBadges[userId]?.map((badge, idx) => ({
            id: `vencord_donor_badge_${idx}`,
            iconSrc: badge.badge,
            description: badge.tooltip,
            position: BadgePosition.START,
            props: {
                style: {
                    borderRadius: "50%",
                    transform: "scale(0.9)" // The image is a bit too big compared to default badges
                }
            },
            onContextMenu(event, badge) {
                ContextMenuApi.openContextMenu(event, () => <BadgeContextMenu badge={badge} />);
            },
            onClick() {
                return VencordDonorModal();
            },
        } satisfies ProfileBadge));
    },

    getEquicordDonorBadges(userId: string) {
        return EquicordDonorBadges[userId]?.map((badge, idx) => ({
            id: `equicord_donor_badge_${idx}`,
            iconSrc: badge.badge,
            description: badge.tooltip,
            position: BadgePosition.START,
            props: {
                style: {
                    borderRadius: "50%",
                    transform: "scale(0.9)" // The image is a bit too big compared to default badges
                }
            },
            onContextMenu(event, badge) {
                ContextMenuApi.openContextMenu(event, () => <BadgeContextMenu badge={badge} />);
            },
            onClick() {
                return badge.tooltip === "Equicord Translator" ? EquicordTranslatorModal() : EquicordDonorModal();
            },
        } satisfies ProfileBadge));
    }
});
