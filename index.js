// Import library Discord.js
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  Events,
  SlashCommandBuilder,
  REST,
  Routes,
} = require("discord.js");
//auto restart lemehost
const express = require("express");
const fetch = require("node-fetch");

//auto restart
const app = express();
const port = process.env.PORT || 31543;

const dotenv = require("dotenv");
const { ActivityType } = require("discord.js");
const os = require("os");

// Load environment variables
dotenv.config();

// Token dan Client ID dari aplikasi bot
const {
  BOT_TOKEN,
  CLIENT_ID,
  ADMIN_ROLE_ID,
  GUILD_ID,
  BUYER_ROLE_ID,
  SELLER_ROLE_ID,
  CATEGORY_ID,
  VERIFY_ROLE_ID,
} = process.env;

//auto restart
app.get("/", (req, res) => {
    res.send("VINN SA-MP BOT aktif!");
});

app.listen(port, () => {
    console.log(`🌐 Web server running at http://localhost:${port}`);
});

// Inisialisasi bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});



const activities = [
  { name: "Melayani 24/7 | Customer VINN", type: ActivityType.Listening },
  { name: "Pelayan Vinn OnTop", type: ActivityType.Watching },
];

let currentActivityIndex = 0;

let botInfoMessage = null; // Variabel untuk menyimpan pesan embed

client.once("ready", () => {
  console.log(`Bot berhasil login sebagai ${client.user.tag}`);
  updateActivity();
  setInterval(updateActivity, 6000); // Update setiap 6000 milidetik (6 detik)
  updateBotInfo();
  setInterval(updateBotInfo, 2000); // Update informasi bot setiap 2 detik

  const restartChannel = client.channels.cache.get("1371863310747566206");
  if (restartChannel) {
    const restartEmbed = new EmbedBuilder()
      .setTitle("🔄 Bot Berhasil Restart")
      .setDescription("Bot telah berhasil melakukan restart otomatis.")
      .setColor("Green")
      .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
      .setTimestamp();
    restartChannel.send({ embeds: [restartEmbed] });
  }
});

setInterval(sendStoreOpenMessage, 3600000); // 3600000 milidetik = 1 jam

async function sendStoreOpenMessage() {
  const targetChannel = client.channels.cache.get("1350164817880682620"); // Ganti dengan ID channel yang benar
  if (!targetChannel) {
    console.error("Channel tidak ditemukan!");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("***𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 TELAH BUKA***")
    .setDescription(
      "*TOKOH 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 TELAH BUKA YANG INGIN ORDER SILAHKAN KE <#1367447852179132469>*",
    )
    .setColor("DarkBlue")
    .setImage("https://cdn.pfps.gg/banners/5132-pixel-mario.gif")
    .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
    .setTimestamp();

  try {
    // Hapus pesan sebelumnya jika ada
    const messages = await targetChannel.messages.fetch({ limit: 100 });
    const previousMessage = messages.find(
      (msg) =>
        msg.embeds &&
        msg.embeds.length > 0 &&
        msg.embeds[0].title.includes("𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 TELAH BUKA"),
    );
    if (previousMessage) {
      await previousMessage.delete();
    }
    // Kirim pesan baru
    await targetChannel.send({ content: "@everyone", embeds: [embed] });
  } catch (error) {
    console.error("Gagal mengirim atau menghapus pesan:", error);
  }
}

client.on("disconnect", () => {});

client.on("reconnecting", () => {});

function updateActivity() {
  const activity = activities[currentActivityIndex];
  client.user.setActivity(activity.name, { type: activity.type });
  currentActivityIndex = (currentActivityIndex + 1) % activities.length; // Berganti ke activity selanjutnya
}

function updateBotInfo() {
  const channel = client.channels.cache.get("1366613094624661626"); // Ganti dengan ID channel yang diinginkan
  if (!channel) return; // Memastikan channel ditemukan

  // Fungsi untuk membuat embed
  function createEmbed() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercentage = ((usedMem / totalMem) * 100).toFixed(2);

    // Mendapatkan penggunaan CPU secara keseluruhan (lebih akurat)
    const cpuUsage = os
      .cpus()
      .reduce(
        (acc, cpu) => acc + cpu.times.user + cpu.times.sys + cpu.times.irq,
        0,
      );
    const cpuTotal = os
      .cpus()
      .reduce(
        (acc, cpu) =>
          acc +
          cpu.times.user +
          cpu.times.nice +
          cpu.times.sys +
          cpu.times.idle +
          cpu.times.irq,
        0,
      );
    const cpuUsagePercentage = ((cpuUsage / cpuTotal) * 100).toFixed(2);

    const embed = new EmbedBuilder()
      .setTitle("***🤖 Informasi Bot Hosting***")
      .setDescription(
        "Berikut adalah spesifikasi hosting bot saat ini [tampilan ini akan update setiap 15 detik]",
      )
      .setColor("Blue")
      .addFields(
        {
          name: "🛡️ CPU Usage",
          value: `${cpuUsagePercentage}%`,
          inline: true,
        },
        {
          name: "🖨️ RAM",
          value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
          inline: true,
        },
        {
          name: "🖨️ RAM Usage",
          value: `${memUsagePercentage}%`,
          inline: true,
        },
        {
          name: "🕐 Uptime",
          value: `${Math.floor(process.uptime() / 60)} Menit`,
          inline: true,
        },
        { name: "📡Ping", value: `${client.ws.ping} ms`, inline: true },
        { name: "💻Platform", value: `${process.platform}`, inline: true },
        {
          name: "💾 Used Memory",
          value: `${(usedMem / (1024 * 1024 * 1024)).toFixed(2)} GB`,
          inline: true,
        },
        {
          name: "💾 Total Memory",
          value: `${(totalMem / (1024 * 1024 * 1024)).toFixed(2)} GB`,
          inline: true,
        },
        {
          name: "💾 Free Memory",
          value: `${(freeMem / (1024 * 1024 * 1024)).toFixed(2)} GB`,
          inline: true,
        },
        {
          name: "🔄Hostname",
          value: `𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞`,
          inline: true,
        },
      )
      .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
      .setThumbnail(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZVIRkeowj4Mjtsc2mA-zP4R1cxN8FgqyBMA&s",
      )
      .setImage(
        "https://media2.giphy.com/media/58OujxlE7e19Mjv0gj/200w.gif?cid=6c09b952s0hhvpegl190p9bnstj8gbmqrpbfcan1f74rpaoa&ep=v1_gifs_search&rid=200w.gif&ct=g",
      )
      .setTimestamp();
    return embed;
  }

  const embed = createEmbed();

  channel.messages
    .fetch({ limit: 100 }) // Mengambil 100 pesan terakhir
    .then((messages) => {
      botInfoMessage = messages.find(
        (msg) =>
          msg.embeds.length > 0 &&
          msg.embeds[0].title === "***🤖 Informasi Bot Hosting***",
      );

      if (botInfoMessage) {
        botInfoMessage.edit({ embeds: [embed] }).catch(console.error);
      } else {
        channel
          .send({ embeds: [embed] })
          .then((msg) => (botInfoMessage = msg))
          .catch(console.error);
      }
    })
    .catch(console.error);
}

client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.get(`1366576447795236875`);
  if (!channel) return; // Memastikan channel log ditemukan
  const embed = new EmbedBuilder()
    .setTitle(
      `Halo Selamat Datang, ${member.user.tag}! Senang Bisa Menemui Kamu Di Store Vinn`,
    )
    .setDescription(
      `
    - Silahkan Baca ⁠<#1350096179823902859> dan ⁠<#1350096180276760651> Agar Kamu Tau Rules Dan Ketentuan
    - Silahkan Kamu Ambil Role Terlebih Dahulu Di <#1350379655835684925>
    - Dan Jika Ingin Melakukan Order Silahkan Ke <#1350096180473888797>
    - Ada Berbagai Jasa Yang Kami Sediakan Di Store Vinn, Seperti <#1360868943387955311> <#1360869600736317450> <#1360869261022724146> <#1360869404773974126>
    - Jika Kamu Ingin Pesan Mapping Kamu Bisa Cek Hasil Kerja Kami Di <#1354076913962057809> <#1350464462859145366> <#1354080279081385984> <#1354076623653175337> <#1354079295856967811>
    - Jika Kamu Ingin Belajar Mapping Kamu Bisa Baca Baca <#1360942706515382455>
    - Bergabunglah dengan tertib agar member Store Vinn respect dengan kalian
    - Jika butuh bantuan silahkan hubungi <@1201593515717689437>`,
    )

    .setColor(
      member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor,
    )
    .setColor("#34cceb")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 128 }))
    .setTimestamp();
  channel.send({ embeds: [embed] });
});

client.on("guildMemberRemove", (member) => {
  const channel = member.guild.channels.cache.get(`1366673198867021857`);
  if (!channel) return; // Memastikan channel log
  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle(`Selamat tinggal, ${member.user.tag} semoga bertemu kembali!`)
    .setDescription(`**${member.user.tag}** telah meninggalkan server.`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();
  channel.send({ embeds: [embed] });
});

client.on("messageCreate", async (message) => {
  if (message.content === "mapping") {
    message.channel.send("kamu mau pesan mapping? apa gimana?");
  }
  if (message.content === "!bot ramal aku") {
    const responses = [
      "***sepertinya tidak, karena kamu pemalas***",
      "***yaps, betul sekali, suatu saat nanti anda akan menjadi pengusaha kaya raya dan manusia yg rendah hari***",
      "***suatu saat kamu akan menjadi manusia yang berkecukupan, jadi jangan berharap telalu banyak***",
      "***kamu sepertinya orang yang tidak beruntung, jadi jangan berharap terlalu banyak***",
      "***kalau ramalan saya kamu akan hidup tenang damai, dan selalu bahagia hidup di kolong jembatan***",
      "***Dia semakin mencintaimu karena Dia telah percaya engkau menyukai diriNya apa adanya, dan bukan karena hal lain.***",
      "***Walaupun tidak ada hal lain di dunia ini yang bisa kau percayai, percayalah bahwa dia mencintaimu. Sepenuh hatiku.***",
      "***Jangan terlalu berharap pada seseorang yang belum pasti menyukaimu, namun hargailah mereka yang peduli denganmu.***",
      "***Ketika kamu menyadari kamu ingin menghabiskan sisa hidupmu dengan seseorang, kamu akan menginginkan sisa hidupmu dimulai secepat mungkin.***",
      "***Biarkan semuanya mengalir seperti air. Jika memang berjodoh, maka berjodohlah. Tidak perlu terlalu berharap, tapi tidak juga sangat negatif menanggapinya.***",
      "***Aku mendoakan yang terbaik untuk semua usaha baru, yang ada dalam hidupmu.***",
      "***Jaga harapan terbaik Anda, dekat dengan hati Anda, dan perhatikan apa yang terjadi.***",
      "***Semoga berhasil dan banyak harapan terbaik. Tuhan memberkatimu dalam apa pun yang kamu lakukan. Ini adalah keinginan hanya untukmu***",
      "***Pindah ke tahap baru dalam hidup bisa menjadi proses yang menantang. Kami berharap yang terbaik untuk Anda dalam semua usaha masa depan Anda, Anda akan menjadi hebat.***",
      "***Semoga beruntung saat kamu melangkah ke tahap selanjutnya dalam hidupmu. Tanpa ragu, kamu akan terus sukses di segala bidang.***",
      "***Jika kamu bisa memimpikannya, kamu bisa melakukannya. Harapan terbaik untuk masa depanmu yang cerah.***",
      "***Mengubah wajah tidak dapat mengubah apa pun, tetapi menghadapi perubahan dapat mengubah segalanya. Semoga berhasil.***",
    ];
    const randomRespone =
      responses[Math.floor(Math.random() * responses.length)];
    message.reply(randomRespone);
  }
  if (message.content === "!bot makasih") {
    message.reply("***sama-sama :)***");
  }
  if (message.content === "!store open") {
    if (!message.member.roles.cache.has(ADMIN_ROLE_ID)) {
      return message.reply(
        "***kamu tidak memiliki akses untuk menggunakan perintah ini***",
      );
    }

    const embed = new EmbedBuilder()
      .setTitle("***STORE 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 TELAH BUKA***")
      .setDescription(
        "*TOKOH 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 TELAH BUKA YANG INGIN ORDER SILAHKAN KE <#1350096180473888797>*",
      )
      .setColor("DarkBlue")
      .setImage("https://cdn.pfps.gg/banners/5132-pixel-mario.gif")
      .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
      .setTimestamp();

    const targetChannel = client.channels.cache.get("1350164817880682620");
    if (targetChannel) {
      targetChannel
        .send({ content: "@everyone", embeds: [embed] })
        .catch((error) => {
          console.error("Gagal mengirim pesan ke channel:", error);
          message.reply("Terjadi kesalahan saat mengirim pesan.");
        });
    } else {
      message.reply("Channel tidak ditemukan!");
    }
  }
  if (message.content === "!clear") {
    if (!message.member.roles.cache.has(ADMIN_ROLE_ID))
      return message.reply(
        "**Kamu tidak memiliki akses untuk menggunakan perintah ini!**",
      );
    message.channel.bulkDelete(10);
    message.channel.send("**10 pesan telah dihapus**");
  }
  if (message.content === "!bot kata kata hari ini") {
    const responses = [
      "**Belajarlah dari hari hari kemarin dan hiduplah untuk hari ini, lalu berharaplah untuk hari esok.**",
      "**Kesulitan yang sebenarnya ialah mengatasi caramu berpikir mengenai diri kamu sendiri.**",
      "**Tidak perlu menjadi seseorang yang serba bisa, tekuni saja salah satu bidang yang paling kamu suka, kemudian jadilah seseorang yang hebat dengan bidang tersebut.**",
      "**Ingatlah bahwa hari ini hanyalah hari yang buruk dan bukan kehidupan yang buruk.**",
      "**Jangan pernah menyesali masa lalu yang pernah terjadi sebelumnya, tetapi belajarlah dari masa lalu tersebut.**",
      "**Ada begitu banyak cara agar kamu bisa maju, akan tetapi hanya ada satu cara untuk tetap diam.**",
      "**Jangan pernah berharap bahwa jalan hidupmu akan seperti jalan hidup orang lain. Perjalanan hidup yang kamu miliki merupakan sesuatu yang unik, seperti dirimu.**",
      "**Hidup bukan hanya mengenai mendapatkan serta memiliki belaka, akan tetapi juga mengenai memberi serta menjadi sesuatu.**",
      "**Nikmatilah hal-hal kecil yang ada dalam hidup, sebab suatu hari nanti kamu akan melihat ke belakang dan kemudian menyadari bahwa itu adalah hal-hal besar.**",
      "**Setiap orang memiliki jatahnya masing-masing untuk gagal. Maka habiskanlah jatah kegagalanmu ketika kamu masih muda.**",
      "**Mulailah dari mana kamu berada. Gunakanlah segala sesuatu yang kamu miliki. Lakukanlah apa saja yang kamu bisa.**",
      "**Hidup merupakan sebuah pertanyaan serta bagaimana manusia menjalani kehidupan merupakan jawabannya.**",
      "**Hidup itu membutuhkan suatu perjuangan, sebab tidak ada satu hal pun yang mampu sukses tanpa adanya perjuangan di dalamnya.**",
      "**Ketika kita masih diberikan kesempatan untuk bangun di pagi hari, itu artinya Tuhan masih memberikan kesempatan pada kita untuk melakukan pekerjaan yang harus kita lakukan.**",
      "**Hujan mengajarkan bahwa setiap tetes yang jatuh membawa kehidupan baru.**",
      "**Jangan menyalahkan orang lain atas kegagalan kita sendiri.**",
      "**Tetaplah berpegang pada prinsip dan nilai-nilai baik dalam menjalani kehidupan sehari-hari.**",
      "**Hargai waktu, karena waktu tak akan pernah kembali.**",
      "**Kebahagiaan bukan tentang memiliki hal besar, tapi merasakan kepuasan dari hal-hal kecil.**",
      "**Jangan menyerah saat menghadapi kesulitan, ini bagian dari ujian kehidupan.**",
    ];
    const randomRespone =
      responses[Math.floor(Math.random() * responses.length)];
    message.reply(randomRespone);
  }
  if (message.content === "!help") {
    message.reply(
      "**PERINTAH BOT YANG TERSEDIA**\n\n**- !bot ramal aku**\n**- !bot kata kata hari ini**\n**- !bot makasih**\n**- !help**",
    );
  }
  if (message.content === "!help admin") {
    if (!message.member.roles.cache.has(ADMIN_ROLE_ID))
      return message.reply(
        "**Kamu tidak memiliki akses untuk menggunakan perintah ini!**",
      );
    message.reply(
      "**perinta admin**\n**- !store open**\n**- !clear**\n**- !help admin**\n**- !verify**\n**- !info**\n**- !chat**\n**- !payment",
    );
  }
  if (message.content === "!verify") {
    // Periksa apakah pesan dikirim di channel yang benar
    if (message.channelId === "1350379655835684925") {
      if (!message.member.roles.cache.has(VERIFY_ROLE_ID)) {
        try {
          await message.member.roles.add(VERIFY_ROLE_ID);
          await message.reply("Anda telah berhasil diverifikasi!");
        } catch (error) {
          console.error("Gagal menambahkan role:", error);
          await message.reply("Terjadi kesalahan saat verifikasi.");
        }
      } else {
        await message.reply("Anda sudah memiliki role verifikasi.");
      }
    } else {
      await message.reply(
        "Perintah !verify hanya dapat digunakan di channel verifikasi.",
      );
    }
  }
  if (message.content === "!payment") {
    if (!message.member.roles.cache.has(ADMIN_ROLE_ID))
      return message.reply(
        "***kamu tidak memiliki akses untuk menggunakan perintah ini***",
      );
    const embed = new EmbedBuilder()
      .setTitle("***PAYMENT 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞***")
      .setDescription(
        "***💳 [ DANA ] : 082228909195***\n***A/N :ARIANTO SIDABARIBA***\n***💳 [ GOPAY ] : 081264379501***\n***A/N : ARIANTO SIDABARIBA ***",
      )
      .setColor("DarkBlue")
      .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
  }
  if (message.content.startsWith("!info")) {
    if (message.author.bot) return;
    if (!message.member.roles.cache.has(ADMIN_ROLE_ID))
      return message.reply(
        "***kamu tidak memiliki akses untuk menggunakan perintah ini***",
      );

    const args = message.content.slice(5).trim().split(/ +/);
    if (args.length < 3) {
      return message.reply(
        "Penggunaan yang benar: `!info (judul) (pesan) (NamaChannel/IdChannel)`",
      );
    }

    const infoTitle = args[0];
    const infoMessage = args.slice(1, -1).join(" ");
    const channelIdentifier = args.slice(-1)[0];

    let infoChannel;
    if (isNaN(parseInt(channelIdentifier))) {
      infoChannel = message.guild.channels.cache.find(
        (channel) =>
          channel.name.toLowerCase() === channelIdentifier.toLowerCase(),
      );
    } else {
      infoChannel = message.guild.channels.cache.get(channelIdentifier);
    }

    if (!infoChannel) {
      console.error("Channel info tidak ditemukan!");
      return message.reply(
        "Channel tidak ditemukan. Pastikan nama atau ID channel benar.",
      );
    }

    const infoEmbed = new EmbedBuilder()
      .setTitle(infoTitle)
      .setDescription(infoMessage)
      .setColor("Purple")
      .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
      .setTimestamp();

    infoChannel.send({ embeds: [infoEmbed] });
    message.reply("Informasi telah dikirim ke " + infoChannel);
  }
  if (message.content.startsWith("!chat")) {
    if (message.author.bot) return;
    if (!message.member.roles.cache.has(ADMIN_ROLE_ID))
      return message.reply(
        "***kamu tidak memiliki akses untuk menggunakan perintah ini***",
      );

    // Hapus pesan perintah !chat
    message
      .delete()
      .catch((err) => console.error("Gagal menghapus pesan:", err));

    // Ambil pesan setelah "!chat"
    const chatMessage = message.content.slice(6).trim();

    // Kirim pesan ke channel yang sama
    message.channel
      .send(chatMessage)
      .then((sentMessage) => {
        // Opsional: Tambahkan reaksi atau embed pada pesan yang dikirim
      })
      .catch((err) => console.error("Gagal mengirim pesan:", err));
  }
  if (message.author.bot) return;

  const found = bannedWords.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(message.content.toLowerCase());
  });

  if (found) {
    try {
      await message.delete(); // Delete the inappropriate message

      let warnings = userWarnings.get(message.author.id) || 0;
      warnings++;

      userWarnings.set(message.author.id, warnings);

      // Send a warning message in the channel, but only to the author
      const warningMessage = await message.channel.send(
        `${message.author}, pesan kamu mengandung konten yang tidak pantas dan telah dihapus. Ini adalah peringatan ke-${warnings}/3.`,
      );
      //logs channel bahasa tidak pantas
      const logsChannel = client.channels.cache.get("1366517948973453446");
      logsChannel.send(
        `***<@1201593515717689437> lihat nih si ${message.author} telah menggunakan bahasa tidak pantas di channel: ${message.channel}***\n\n***Pesan yang dihapus adalah:***\n${message.content}`,
        { allowedMentions: { parse: [] } },
        { ephemeral: true },
      );

      // Delete the warning message after 3 seconds
      setTimeout(() => {
        warningMessage
          .delete()
          .catch((err) =>
            console.error("Gagal menghapus pesan peringatan:", err),
          );
      }, 3000);

      if (warnings >= 3) {
        await message.member.timeout(
          10 * 60 * 1000,
          "Penggunaan bahasa tidak pantas berulang kali",
        ); // Timeout 10 menit
        await message.channel.send(
          `${message.author} telah diberi timeout selama 10 menit karena berulang kali menggunakan bahasa yang tidak pantas.`,
        );
        userWarnings.set(message.author.id, 0);
      }
    } catch (err) {
      console.error("Gagal menghapus pesan atau memberikan timeout:", err);
    }
  }
});

// Daftar slash command
const commands = [
  new SlashCommandBuilder()
    .setName("setup-ticket-panel")
    .setDescription("Buat panel tiket untuk pengguna."),

  new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Create a vote and send it to a certain channel.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("*Provide the question of the vote.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("choice-1")
        .setDescription("*First choice.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("choice-2")
        .setDescription("*Second choice.")
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the poll to.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText),
    ),

  new SlashCommandBuilder()
    .setName("showsocialmedia")
    .setDescription("show server information (ADMIN ONLY)"),

  new SlashCommandBuilder()
    .setName("price-mapping")
    .setDescription("daftar harga mapping"),

  new SlashCommandBuilder()
    .setName("jasa-samp")
    .setDescription("Daftar Harga Jasa Samp"),

  new SlashCommandBuilder()
    .setName("jasa-rename")
    .setDescription("daftar harga jasa rename"),

  new SlashCommandBuilder()
    .setName("jasa-on-server")
    .setDescription("daftar harga jasa on server"),

  new SlashCommandBuilder()
    .setName("rating")
    .setDescription("Berikan rating dan feedback untuk penjual.")
    .addStringOption((option) =>
      option
        .setName("penjual")
        .setDescription("Nama atau tag penjual")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("pembeli")
        .setDescription("Nama atau tag pembeli")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("produk")
        .setDescription("Nama produk yang dibeli")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName("harga").setDescription("Harga produk").setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("rating")
        .setDescription("Berikan rating dari 1 hingga 5")
        .setRequired(true)
        .addChoices(
          { name: "⭐", value: 1 },
          { name: "⭐⭐", value: 2 },
          { name: "⭐⭐⭐", value: 3 },
          { name: "⭐⭐⭐⭐", value: 4 },
          { name: "⭐⭐⭐⭐⭐", value: 5 },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("komentar")
        .setDescription("Masukkan komentar atau feedback")
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("testimoni")
    .setDescription("Buat testimoni dengan lampiran gambar.")
    .addStringOption((option) =>
      option
        .setName("penjual")
        .setDescription("Nama atau tag penjual")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("pembeli")
        .setDescription("Nama atau tag pembeli")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("produk")
        .setDescription("Nama produk yang dibeli")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName("harga").setDescription("Harga produk").setRequired(true),
    )
    .addAttachmentOption((option) =>
      option
        .setName("gambar")
        .setDescription("Lampirkan gambar bukti transaksi")
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("addbuyer")
    .setDescription('Menambahkan role "Buyer" kepada pengguna')
    .addUserOption((option) =>
      option
        .setName("pengguna")
        .setDescription("Pengguna yang ingin ditambahkan role Buyer")
        .setRequired(true),
    ),
];

const bannedWords = [
  "anjeng",
  "allah",
  "anjg",
  "anjing",
  "ass",
  "asu",
  "bab1",
  "babi",
  "bajingan",
  "bangsat",
  "bego",
  "bego.jing",
  "begok",
  "bencong",
  "bgst",
  "bitch",
  "bjir",
  "blok",
  "brengsek",
  "buajingan",
  "cok",
  "dancok",
  "dongo",
  "dungu",
  "entod",
  "entot",
  "fuck",
  "goblok",
  "haram",
  "idiot",
  "jablay",
  "jancok",
  "jembut",
  "jeng",
  "jiancok",
  "jir",
  "jmbt",
  "juancok",
  "k0nt0l",
  "konto",
  "k0ntol",
  "ktl",
  "kampang",
  "kampret",
  "kanjut",
  "khontol",
  "kimak",
  "kintil",
  "kintil.kontol",
  "kirik",
  "kntl",
  "konol",
  "kntol",
  "kontl",
  "kontol",
  "Kontol",
  "kontols",
  "kuntul",
  "kunyuk",
  "lol",
  "lonte",
  "meki",
  "memek",
  "memeks",
  "Memeks",
  "memeq",
  "memk",
  "mmek",
  "mmk",
  "ng3n",
  "Ng3nt0d",
  "ng3nt0t",
  "ngen",
  "ngento",
  "ngengod",
  "ngent",
  "ngentd",
  "ngentod",
  "Ngentod²",
  "ngentot",
  "ngentt",
  "ngew",
  "ngewe",
  "ngewe",
  "ngntd",
  "ngntot",
  "nhentod",
  "nhentot",
  "njing",
  "nyeong",
  "p0rn",
  "pantek",
  "peler",
  "poorn",
  "porn",
  "pornn",
  "pornrn",
  "puki",
  "pukimak",
  "sange",
  "sepong",
  "sepongin",
  "spong",
  "t0d",
  "t0l0l",
  "t0t",
  "tai",
  "taik",
  "talal",
  "telaso",
  "tempik",
  "tilil",
  "tll",
  "tlol",
  "tod",
  "tolol",
  "tot",
  "tulul",
  "yatim",
  "y4tim",
  "yat1m",
  "y4t1m",
  "yteam",
  "yesus",
];

const userWarnings = new Map();

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
(async () => {
  try {
    console.log("Memulai registrasi slash commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("Slash commands berhasil terdaftar.");
  } catch (error) {
    console.error("Gagal mendaftarkan slash commands:", error);
  }
})();

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const { commandName, options, member } = interaction;

    if (commandName === "setup-ticket-panel") {
      if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "ADMIN" untuk menggunakan perintah ini.',
          flags: 64,
        });
      }
      const embed = new EmbedBuilder()
        .setTitle("Panel Tiket | Gunakan Fitur Tiket Dengan Baik!!")
        .setDescription(
          "Klik tombol di bawah untuk membuka tiket Sesuai Dengan Kebutuhan Anda\n\n『 🗺️ Order Mapper 』\n :information_source: Informasi Tombol ini digunakan bagi yang ingin memesan mapper/jasmap\n\n『 🛠️ Order Jasa 』\n :information_source: Informasi Tombol ini digunakan untuk customer yang ingin memesan jasa, seperti jasa on server, jasa developer, jasa buat bot js samp atau store bebas.\n\n『 📡 Order Hosting 』\n :information_source: Informasi Tombol ini digunakan bagi yang ingin memesan hosting samp/hosting bot.\n\n『 ❓ Bertanya 』\n :information_source: Informasi Tombol ini digunakan bagi yang ingin bertanya seputar product yang dijual oleh vinn",
        )
        .setColor("Blue")
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setImage(`https://i.ibb.co.com/ynCRn0RB/foto.png`)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("order-mapper")
          .setLabel("Order Mapper")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🗺️"),
        new ButtonBuilder()
          .setCustomId("order-jasa")
          .setLabel("Order Jasa")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🛠️"),
        new ButtonBuilder()
          .setCustomId("order-hosting")
          .setLabel("Order Hosting")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("📡"),
        new ButtonBuilder()
          .setCustomId("bertanya")
          .setLabel("Bertanya")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❓"),
      );

      await interaction.reply({
        content: "Panel tiket telah dibuat.",
        flags: 64,
      });
      await interaction.channel.send({ embeds: [embed], components: [row] });
    } else if (commandName === "price-mapping") {
      if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "ADMIN" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }
      const embed = new EmbedBuilder()
        .setTitle("***PRICE MAPPING BYE VINN***")
        .setDescription(
          "**- 30 OBJECT**\n**:money_with_wings:Rp.20.000**\n\n**- 50 OBJECT**\n**:money_with_wings:Rp.35.000**\n\n**- 80 OBJECT**\n**:money_with_wings:Rp.50.000**\n\n**- 100 OBJECT**\n**:money_with_wings:Rp.70.000**\n\n**- 150 OBJECT**\n**:money_with_wings:Rp.100.000**\n\n**- 200 OBJECT**\n**:money_with_wings:Rp.140.000**\n\n**- 300 OBJECT**\n**:money_with_wings:Rp.180.000**\n\n:warning:**NOTE : HARGA SEWAKTU WAKTU BISA BERUBAH KAPAN SAJA:innocent:**\n\n***JIKA BERMINAT UNTUK ORDER BISA KE <#1350096180473888797>***",
        )
        .setColor("Red")
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setImage(
          "https://media.istockphoto.com/id/487535463/id/vektor/kartun-arsitek-sketsa-rumah.jpg?s=612x612&w=0&k=20&c=jmkmN5t1u2mgH7ebrvr8QQ4Bs_r2EFOwcNssUpb3Qu0=",
        )
        .setThumbnail(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLlxksi7jgnUIUuEz3DdAYy7iejJtQYIJ6_g&s",
        )
        .setTimestamp();

      await interaction.reply({
        content: "**daftar product vinn di tampilkan**",
      });
      await interaction.channel.send({ embeds: [embed] });
    } else if (commandName === "jasa-samp") {
      if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "ADMIN" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }
      const embed = new EmbedBuilder()
        .setTitle("***JASA SA-MP***")
        .setDescription(
          "***[+] Add Mapping / Remove Mapping***\n***- :money_with_wings:Rp.10.000/Mapping***\n\n***[+] Add / Remove TextDraw***\n***- :money_with_wings:Rp.15.000/TD (tergantung texdraw)***\n\n***[+] Jasa Rename Td***\n***- :money_with_wings:Rp.5.000***\n\n:warning:**NOTE : HARGA SEWAKTU WAKTU BISA BERUBAH KAPAN SAJA:innocent:**\n\n***JIKA BERMINAT UNTUK ORDER BISA KE <#1350096180473888797>***",
        )
        .setColor("Red")
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setImage("https://backiee.com/static/wallpapers/1920x1080/386745.jpg")
        .setThumbnail(
          "https://imgcdn.stablediffusionweb.com/2024/12/19/ca8b5efe-8d21-4a63-9efa-cdb484e1dd99.jpg",
        )
        .setTimestamp();

      await interaction.reply({
        content: "**daftar jasa sa-mp berhasil di tampilkan**",
      });
      await interaction.channel.send({ embeds: [embed] });
    } else if (commandName === "jasa-rename") {
      if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "ADMIN" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }
      const embed = new EmbedBuilder()
        .setTitle("***JASA RENAME***")
        .setDescription(
          "***[+] Rename Beberapa***\n***- :money_with_wings:Rp.10.000***\n\n***[+] Rename Sampai Akar***\n:money_with_wings:- Rp.15.000***\n\n:warning:**NOTE : HARGA SEWAKTU WAKTU BISA BERUBAH KAPAN SAJA:innocent:**\n\n***JIKA BERMINAT UNTUK ORDER BISA KE <#1350096180473888797>***",
        )
        .setColor("Red")
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setImage(
          "https://i.pinimg.com/236x/a8/6e/d4/a86ed4889ee49509c83a0d179ff64f5c.jpg",
        )
        .setThumbnail(
          "https://png.pngtree.com/png-clipart/20230516/original/pngtree-cartoon-screwdriver-png-image_9162581.png",
        )
        .setTimestamp();

      await interaction.reply({
        content: "**daftar jasa rename berhasil di tampilkan**",
      });
      await interaction.channel.send({ embeds: [embed] });
    } else if (commandName === "jasa-on-server") {
      if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "ADMIN" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }
      const embed = new EmbedBuilder()
        .setTitle("***JASA ON SERVER***")
        .setDescription(
          "***[+] PAKET ON SERVER LOW📦***\n***- GM DARI BUYER***\n***- HOSTING DARI BUYER***\n***- FREE SET ADMIN***\n***- FREE RENAME SERVER BEBERAPA***\n***- FREE SETUP BOT UCP/WL [ Bot Dari Buyer ]***\n***- FREE OPEN PORT***\n***- :money_with_wings:Rp.20.000\n\n***PAKET ON SERVER HIGHT📦***\n***- GM DARI BUYER***\n***- HOSTING DARI BUYER***\n***- FREE SET ADMIN 2***\n***- FREE RENAME SERVER***\n***- FREE SETUP BOT UCP/WL [ Bot Dari Buyer/saya ]***\n***- FREE SETUP BOT SERVER ( KALO GA ADA )***\n***- FREE OPEN PORT***\n***- :money_with_wings:Rp.30.000***\n\n:warning:**NOTE : JIKA GAMEMODE TIDAK SUPPORT DIREFFUND 25%:innocent:**\n\n***JIKA BERMINAT UNTUK ORDER BISA KE <#1350096180473888797>***",
        )
        .setColor("Red")
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setImage(
          "https://t4.ftcdn.net/jpg/08/70/32/31/360_F_870323199_ajFBiDNHIlYPyy5Hdl0BOXuLFqLsirD6.jpg",
        )
        .setThumbnail(
          "https://t3.ftcdn.net/jpg/06/01/17/18/360_F_601171862_l7yZ0wujj8o2SowiKTUsfLEEx8KunYNd.jpg",
        )
        .setTimestamp();

      await interaction.reply({
        content: "**daftar jasa on server berhasil di tampilkan**",
      });
      await interaction.channel.send({ embeds: [embed] });
    } else if (commandName === "rating") {
      if (!member.roles.cache.has(BUYER_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "Buyer" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }

      const penjual = options.getString("penjual");
      const pembeli = options.getString("pembeli");
      const produk = options.getString("produk");
      const harga = options.getInteger("harga");
      const rating = options.getInteger("rating");
      const komentar = options.getString("komentar");

      const embed = new EmbedBuilder()
        .setTitle("Rating Seller 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞")
        .setColor("Green")
        .addFields(
          { name: "Penjual", value: penjual, inline: true },
          { name: "Pembeli", value: pembeli, inline: true },
          { name: "Produk", value: produk, inline: true },
          { name: "Harga", value: `${harga} IDR`, inline: true },
          { name: "Rating", value: "⭐".repeat(rating), inline: true },
          { name: "Komentar", value: komentar, inline: false },
        )
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setImage(`https://i.ibb.co.com/dqSbn5V/15.jpg`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (commandName === "vote") {
      if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "ADMIN" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }

      const { options, channel } = interaction;

      const question = options.getString("question");
      const choiceOne = options.getString("choice-1");
      const choiceTwo = options.getString("choice-2");
      const Channel = options.getChannel("channel") || channel; // If channel option provided, send poll therel. Otherwise send poll in the channel of interaction.
      if (!question || !choiceOne || !choiceTwo) {
        return interaction.reply({
          content: "Semua opsi (pertanyaan, pilihan 1, pilihan 2) harus diisi!",
          flags: 64, // atau gunakan flags: 64
        });
      }

      try {
        // Send the poll embed.
        const message = await Channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("`📊` Voting Server!")
              .setDescription(`**pertanyaan:** ${question}`)
              .addFields(
                { name: `> ✅ ${choiceOne}`, value: "  ", inline: false },
                { name: `> ❌ ${choiceTwo}`, value: "  ", inline: false },
              )
              .setFooter({
                text: `Diminta oleh: ${interaction.member.user.tag}`,
                iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
              })
              .setImage(
                "https://cdn.discordapp.com/attachments/1025641811210948648/1116668692500074536/Desain_tanpa_judul_1.png",
              )
              .setTimestamp()
              .setColor("Blue"),
          ],
        });

        // Add the number reactions to the poll embed.
        await message.react("✅");
        await message.react("❌");

        // Send the success embed.
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                `:white_check_mark: | Berhasil mengirim jajak pendapat yang disematkan di channel: <#${channel.id}>`,
              )
              .addFields(
                {
                  name: "`❓` pertanyaan",
                  value: `${question}`,
                  inline: false,
                },
                {
                  name: "`✅` pilihan 1",
                  value: `${choiceOne}`,
                  inline: false,
                },
                {
                  name: "`❌` pilihan 2",
                  value: `${choiceTwo}`,
                  inline: false,
                },
              ),
          ],
          flags: 64,
        });
      } catch (err) {
        console.error("Error creating vote:", err); // Log error yang lebih informatif
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Yellow")
              .setDescription(
                ":warning: | Terjadi kesalahan. Silakan coba lagi nanti.",
              ),
          ],
          flags: 64,
        });
      }
    } else if (commandName === "showsocialmedia") {
      if (!member.roles.cache.has(ADMIN_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "ADMIN" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }
      const c_member = await interaction.guild.members.fetch(
        interaction.client.user.id,
        {
          force: true,
        },
      );
      const serInfo = new EmbedBuilder()
        .setColor(
          c_member.displayHexColor === "#000000"
            ? "#ffffff"
            : c_member.displayHexColor,
        )
        .setTitle(`**🌐 Social Media**`)
        .setDescription(
          `Selamat datang di VINN COMMUNITY
                Kami seluruh Staff VINN COMMUNITY sangat berterima kasih atas kepercayaann kalian telah bergabung ke 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞. Sekarang kalian bisa mengajak Sahabat, teman, pacar kalian bergabung dalam VINN COMMUNITY. ini kami menyediakan Link untuk anda bagikan, Sekian yang bisa saya sampaikan Terimakasih.`,
        )
        .addFields(
          //{ name: 'Instagram', value: '[IG Exotic](https://instagram.com/dewatacommunity?igshid=Yzg5MTU1MDY=)'},
          {
            name: "WA Grup",
            value: "https://chat.whatsapp.com/IFNb82F9KvUEypp0SIVWA0",
          },
          //{ name: 'Youtube', value: '[Youtube Resmi Exotic](https://www.youtube.com/@dewataroleplay)'},
          {
            name: "Discord Vinn Community",
            value: "https://discord.gg/ATb53vTfPf",
          },
          {
            name: "Server GrandCountryRp",
            value: "https://discord.gg/DvmH5wK5wT",
          },
        )
        .setFooter({
          text: "Social Media",
          iconURL:
            "https://media.discordapp.net/attachments/1171285012960792626/1171303061520654356/image.png?ex=655c2ffb&is=6549bafb&hm=bf46a23650a30d7c5a5c128be6481edcf450b6e4417f5a73a4357da58cd858f1&=",
        })
        .setTimestamp();

      await interaction.channel
        .send({ embeds: [serInfo] })
        .catch((err) => console.log(err.message));

      await interaction.reply({
        content: "You've loaded the social media!",
        ephemeral: true,
      });
    } else if (commandName === "testimoni") {
      if (!member.roles.cache.has(SELLER_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "Seller" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }

      const penjual = options.getString("penjual");
      const pembeli = options.getString("pembeli");
      const produk = options.getString("produk");
      const harga = options.getInteger("harga");
      const gambar = options.getAttachment("gambar");

      const embed = new EmbedBuilder()
        .setTitle("Testimoni 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞")
        .setColor("Blue")
        .addFields(
          { name: "Penjual", value: penjual, inline: true },
          { name: "Pembeli", value: pembeli, inline: true },
          { name: "Produk", value: produk, inline: true },
          { name: "Harga", value: `${harga} IDR`, inline: true },
        )
        .setImage(gambar.url)
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (commandName === "addbuyer") {
      if (!member.roles.cache.has(SELLER_ROLE_ID)) {
        return interaction.reply({
          content:
            'Anda harus memiliki role "Seller" untuk menggunakan perintah ini.',
          ephemeral: true,
        });
      }

      const pengguna = options.getUser("pengguna");

      if (!pengguna) {
        return interaction.reply({
          content: "Pengguna tidak ditemukan.",
          ephemeral: true,
        });
      }

      const memberTarget = await interaction.guild.members.fetch(pengguna.id);

      if (memberTarget.roles.cache.has(BUYER_ROLE_ID)) {
        return interaction.reply({
          content: `${pengguna.tag} sudah memiliki role Buyer.`,
          ephemeral: true,
        });
      }

      try {
        await memberTarget.roles.add(BUYER_ROLE_ID);

        const embed = new EmbedBuilder()
          .setTitle("Add Buyer")
          .setColor("Blue")
          .setDescription(
            `Role **Buyer** berhasil ditambahkan kepada **${pengguna.tag}**.`,
          )
          .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        interaction.reply({
          content: "Gagal menambahkan role Buyer.",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isButton()) {
    if (interaction.customId === "open-ticket") {
    } else if (
      interaction.customId === "order-mapper" ||
      interaction.customId === "order-jasa" ||
      interaction.customId === "order-hosting" ||
      interaction.customId === "bertanya"
    ) {
      const guild = interaction.guild;
      const user = interaction.user;

      const existingChannel = guild.channels.cache.find((channel) =>
        channel.name.includes(`ticket-${user.username}`),
      );

      if (existingChannel) {
        await interaction.reply({
          content: `Anda sudah memiliki tiket yang terbuka! silahkan ke ticket anda`,
          flags: 64,
        });
        return;
      }

      // Menentukan kategori tempat tiket dibuat
      const category = guild.channels.cache.get("1350096180473888794");
      if (!category) {
        await interaction.reply({
          content: "Kategori tiket tidak ditemukan!",
          flags: 64,
        });
        return;
      }

      const ticketChannel = await guild.channels.create({
        name: `ticket-${user.username}-${interaction.customId}`, // Ganti nama channel
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
          {
            id: SELLER_ROLE_ID,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
          {
            id: client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });

      // Kirim embed log ke channel log
      const logChannel = guild.channels.cache.get("1366780840184647700"); // Ganti dengan ID channel log Anda
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle("🎟️ Ticket Opened - 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞")
          .setDescription(
            `
            👤 Ticket Owner: ${user.username} | 🤹\n📂 Ticket Details:\nTicket #${interaction.customId} opened\nToday at ${new Date().toLocaleTimeString()}
          `,
          )
          .setColor("Blue")
          .setTimestamp();
        await logChannel.send({ embeds: [logEmbed] });
      }

      const embed = new EmbedBuilder()
        .setTitle(`Tiket ${interaction.customId}`) // Ganti judul
        .setDescription(
          "***Tim Vinn akan segera membantu Anda. Klik tombol di bawah jika anda ingin menutup tiket***\n\n*Jika anda ingin oder, gunakan format order dengan tepat. format order ada di <#1367854889757053011> gunakan format dengan sesuai orderan anda!",
        )
        .setColor("Green")
        .setFooter({ text: "𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞" })
        .setImage(`https://i.ibb.co.com/qYCHVvkJ/timer.jpg`)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close-ticket")
          .setLabel("Tutup Tiket")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🔑"),
        new ButtonBuilder()
          .setCustomId("call-seller")
          .setLabel("Panggil Penjual")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🔔"),
      );

      await ticketChannel.send({
        content: `<@${user.id}> <@1201593515717689437>`,
        embeds: [embed],
        components: [row],
      });
      await interaction.reply({
        content: `Tiket Anda telah dibuka: <#${ticketChannel.id}>`,
        flags: 64,
      });
    } else if (interaction.customId === "close-ticket") {
      const channel = interaction.channel;
      const user = interaction.user;

      if (channel.name.startsWith("ticket-")) {
        // Kirim embed log ke channel log
        const logChannel = interaction.guild.channels.cache.get(
          "1366780840184647700",
        );
        // Ganti dengan ID channel log Anda
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setTitle("🔒 Ticket Closed - 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞")
            .setDescription(
              `
            👤 Ticket Owner: <@${user.id}> | 𝗖𝗬𝗕𝗘𝗥 || 𝗡𝗘𝗧𝗪𝗢𝗥𝗞\n📂 Ticket Details:\nTicket #${interaction.customId}} has been closed.\nToday at ${new Date().toLocaleTimeString()}
          `,
            )
            .setColor("Red")
            .setTimestamp();
          await logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.reply("Channel ini akan dihapus dalam 5 detik.");
        setTimeout(() => channel.delete(), 5000);
      } else {
        await interaction.reply({
          content: "Perintah ini hanya dapat digunakan di channel tiket.",
        });
      }
    } else if (interaction.customId === "call-seller") {
      const channel = interaction.channel;
      const sellerRole = interaction.guild.roles.cache.get(SELLER_ROLE_ID); // Pastikan SELLER_ROLE_ID benar

      if (!sellerRole) {
        await interaction.reply({
          content: "Role Penjual tidak ditemukan!",
          ephemeral: true,
        });
        return;
      }

      await channel.send(
        `Tolong customer ini memanggil kamu <@&${sellerRole.id}>`,
        {
          allowedMentions: { roles: [sellerRole.id] },
        },
      ); // Panggil role penjual
      await interaction.reply({
        content:
          "Penjual telah dipanggil! mohon bersabar ya, beliau akan segera hadir",
        flags: 64,
      });
    }
  }
});

// ⏱️ Auto Restart Setiap 1 Jam
setTimeout(() => {
  console.log("⏳ 28 menit berlalu. Bot akan restart otomatis sekarang...");
  process.exit(0);
}, 28 * 60 * 1000); // 28 menit

client.login(BOT_TOKEN);