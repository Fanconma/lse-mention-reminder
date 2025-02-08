const lastAtTime = new Map();

mc.listen("onChat", (player, msg) => {
    const currentTime = Date.now();
    const playerName = player.name;

    // 检查玩家是否在3秒内多次@
    if (lastAtTime.has(playerName) && (currentTime - lastAtTime.get(playerName)) < 3000) {
        player.tell("§c你的@信息发送过快。别人可能不会看到下方@信息的吐司消息。");
        return;
    }

    let str = msg;
    if (msg.includes("@")) {
        let startIndex = str.indexOf("@") + 1;
        let endIndex;
        if (str[startIndex] === '"') {
            // 如果 "@" 后面的内容是以引号开头
            startIndex++; // 跳过引号
            endIndex = str.indexOf('"', startIndex); // 查找结束引号的位置
        } else {
            // 正常情况
            endIndex = str.indexOf(" ", startIndex) !== -1 ? str.indexOf(" ", startIndex) : str.length;
        }
        const result = str.substring(startIndex, endIndex);
        const players = mc.getOnlinePlayers();

        if (result === "here") {
            // 通知所有玩家
            players.forEach(p => p.sendToast(`${player.name} @了所有人`, `${msg}`));
        } else {
            // 查找特定玩家并通知
            let sendPl = players.find(p => p.name === result);
            if (sendPl) {
                sendPl.sendToast(`${player.name} @了你`, `${msg}`);
            }
        }

        // 更新玩家最后@时间
        lastAtTime.set(playerName, currentTime);
    }
});
