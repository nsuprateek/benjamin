const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Speak through the bot')
		.addStringOption(option =>
			option.setName('msg')
				.setDescription('Your message')
				.setRequired(true)),

	async execute(interaction) {
		const msg = interaction.options.getString('msg');
		await interaction.reply(msg);
	},
};