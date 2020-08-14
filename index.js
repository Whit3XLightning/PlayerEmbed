"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("request"));
const discord = __importStar(require("discord.js"));
const bot = new discord.Client;
const config = {
    "token": "",
    "guild": "",
    "devteam": "",
    "refreshtime": 5,
    "servers": [
        {
            "name": "Freedom Community Roleplay",
            "ip": "192.223.27.184:30120",
            "channel_id": "743148647192985652",
            "message_id": "743543425302790167",
            "icon_url": "https://cdn.discordapp.com/attachments/743142796038373376/743142894222835882/logo.png"
        }
    ]
};
console.log(`Starting bot...\n Created by Whit3Xlightning (https://whitelightning.dev)`);
bot.on("message", message => {
    if (!message.member)
        return;
    if (message.content == "5m=setup" && message.member.roles.cache.has(config.devteam)) {
        if (message.deletable) {
            message.delete();
        }
        message.channel.send('Getting id...').then(msg => {
            if (msg instanceof discord.Message) {
                msg.edit(`"channel_id": "${msg.channel.id}",\n"message_id": "${msg.id}"`);
            }
        });
    }
    if (message.content == "5m=players" && message.member.roles.cache.has(config.devteam)) {
        config.servers.forEach(server => {
            http.get(`http://${server.ip}/players.json`, { json: true }, (err, res, data) => {
                if (err) {
                    if (err.code == "ECONNREFUSED" || err.code == "ETIMEDOUT") {
                        message.channel.send({
                            "embed": {
                                "description": "\n__**Online Players**__\n```diff\n- SERVER OFFLINE -```",
                                "color": 16711680,
                                "author": {
                                    "name": server.name,
                                    "icon_url": server.icon_url
                                },
                                "footer": {
                                    "icon_url": "https://whitelightning.dev/assets/logos/wld.png",
                                    "text": "Created by whitelightning.dev"
                                }
                            }
                        }).catch(console.log);
                        return;
                    }
                }
                var addstring = "";
                data.forEach(player => {
                    addstring = addstring + `\n**ID: ${player.id}** | ${player.name} | **${player.ping}ms**`;
                });
                message.channel.send({
                    "embed": {
                        "description": "\n__**Online Players**__\n" + addstring,
                        "color": 16711680,
                        "author": {
                            "name": server.name,
                            "icon_url": server.icon_url
                        },
                        "footer": {
                            "icon_url": "https://whitelightning.dev/assets/logos/wld.png",
                            "text": "Created by whitelightning.dev"
                        }
                    }
                }).catch(console.log);
            });
        });
    }
});
bot.login(config.token);
let updatePlayerInterval = setInterval(() => updatePlayers(), config.refreshtime * 1000);
function updatePlayers() {
    config.servers.forEach(server => {
        let guild = bot.guilds.resolve(config.guild);
        if (guild) {
            var channel = guild.channels.resolve(server.channel_id);
        }
        http.get(`http://${server.ip}/players.json`, { json: true }, (err, res, data) => {
            if (err) {
                if (err.code == "ECONNREFUSED" || err.code == "ETIMEDOUT") {
                    if (channel) {
                        channel.messages.fetch(server.message_id).then(message => {
                            message.edit("", {
                                "embed": {
                                    "description": "\n__**Online Players**__\n```diff\n- SERVER OFFLINE -```",
                                    "color": 16711680,
                                    "author": {
                                        "name": server.name,
                                        "icon_url": server.icon_url
                                    },
                                    "footer": {
                                        "icon_url": "https://whitelightning.dev/assets/logos/wld.png",
                                        "text": "Created by whitelightning.dev"
                                    }
                                }
                            });
                        }).catch(console.log);
                        return;
                    }
                }
            }
            if (channel) {
                var addstring = "";
                data.forEach(player => {
                    addstring = addstring + `\n**ID: ${player.id}** | ${player.name} | **${player.ping}ms**`;
                });
                channel.messages.fetch(server.message_id).then(message => {
                    message.edit("", {
                        "embed": {
                            "description": "\n__**Online Players**__\n" + addstring,
                            "color": 16711680,
                            "author": {
                                "name": server.name,
                                "icon_url": server.icon_url
                            },
                            "footer": {
                                "icon_url": "https://whitelightning.dev/assets/logos/wld.png",
                                "text": "Created by whitelightning.dev"
                            }
                        }
                    }).catch(console.log);
                });
            }
        });
    });
}
