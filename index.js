const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

// BOT ONLINE
client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// MEMBRO ENTROU
client.on('guildMemberAdd', member => {
  const canal = member.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle('📥 Membro entrou')
    .setDescription(`${member.user} entrou no servidor`)
    .setColor('Green')
    .setTimestamp();

  canal.send({ embeds: [embed] });
});

// MEMBRO SAIU
client.on('guildMemberRemove', member => {
  const canal = member.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle('📤 Membro saiu')
    .setDescription(`${member.user.tag} saiu do servidor`)
    .setColor('Red')
    .setTimestamp();

  canal.send({ embeds: [embed] });
});

// MENSAGEM APAGADA
client.on('messageDelete', message => {
  if (!message.guild || message.author?.bot) return;

  const canal = message.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle('🗑️ Mensagem apagada')
    .addFields(
      { name: 'Usuário', value: `${message.author.tag}` },
      { name: 'Canal', value: `${message.channel}` },
      { name: 'Mensagem', value: message.content || 'Sem texto' }
    )
    .setColor('Orange')
    .setTimestamp();

  canal.send({ embeds: [embed] });
});

// MENSAGEM EDITADA
client.on('messageUpdate', (oldMsg, newMsg) => {
  if (!oldMsg.guild || oldMsg.author?.bot) return;
  if (oldMsg.content === newMsg.content) return;

  const canal = oldMsg.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle('✏️ Mensagem editada')
    .addFields(
      { name: 'Usuário', value: `${oldMsg.author.tag}` },
      { name: 'Antes', value: oldMsg.content || 'Sem texto' },
      { name: 'Depois', value: newMsg.content || 'Sem texto' }
    )
    .setColor('Blue')
    .setTimestamp();

  canal.send({ embeds: [embed] });
});

client.login(TOKEN);