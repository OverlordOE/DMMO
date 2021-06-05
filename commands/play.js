const ytdl = require('discord-ytdl-core');
const YouTube = require('youtube-sr');
const Discord = require('discord.js');
const cookie = process.env.YT_COOKIE;
const youtubeID = process.env.YT_ID;
let hasSearched = false;

module.exports = {
	name: 'Play',
	summary: 'Play a song',
	description: 'Play a song\nYou can search for songs by inputting a query or you can use a youtube link to get your song',
	category: 'music',
	aliases: ['song', 'p', 'music'],
	args: true,
	usage: '<search query or link>',
	example: 'darude sandstorm',

	async execute(message, args, msgUser, msgGuild, client, logger) {

		let embed = new Discord.MessageEmbed()
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		if (!message.member.voice.channel) return message.channel.send(embed.setDescription('you are not in a voice channel.'));

		const search = args.join(' ');
		const data = client.music.active.get(message.guild.id) || {};

		try {
			if (!data.connection) {

				const permissions = message.member.voice.channel.permissionsFor(message.guild.member(client.user));
				if (!permissions.any('CONNECT')) {
					logger.warn('Neia couldnt join the voice channel');
					return message.reply('Neia does not have permission to join the voice channel!');
				}

			}
			else if (data.connection.status == 4 && data.queue) {
				data.dispatcher = null;
				data.queue = [];
			}

			data.connection = await message.member.voice.channel.join();
		}
		catch (error) {
			logger.warn('Neia couldnt join the voice channel');
			return message.reply('Something went wrong when joining the voice channel');
		}


		if (!data.queue) data.queue = [];
		if (data.queue.length >= 5) return message.channel.send(embed.setDescription('You have reached the maximum queue size for free users.\nIf you want to upgrade your queue size contact OverlordOE#0717.'));
		data.guildID = message.guild.id;

		const tempMessage = await message.channel.send('Finding youtube video...');

		const video = await SearchVideo();
		tempMessage.delete();

		if (!video) {
			logger.warn(`Could not find youtube video with search terms "${search}"`);
			return message.channel.send(embed.setDescription(`Neia could not find any video connected to the search terms of \`${search}\``));
		}


		if (!data.dispatcher) Play(client, data, logger, msgUser, message);
		else message.channel.send(embed.setDescription(`**${video.title}**\nBy **${video.channel}**\n Has been added to the queue.\n\nRequested by ${message.author}`));

		client.music.active.set(message.guild.id, data);


		async function SearchVideo() {
			let videoData;
			let searchData;

			if (ytdl.validateURL(search)) {
				const info = await ytdl.getBasicInfo(search, {
					requestOptions: {
						headers: {
							Cookie: cookie,
							'x-youtube-identity-token': youtubeID,
						},
					},
				});
				searchData = info.videoDetails;
				let duration = 0;

				const minutes = Math.floor(searchData.lengthSeconds / 60);
				const seconds = searchData.lengthSeconds - (minutes * 60);
				if (seconds < 10) duration = `${minutes}:0${seconds}`;
				else duration = `${minutes}:${seconds}`;

				videoData = {
					title: searchData.title,
					channel: searchData.author.name,
					requester: message.author,
					url: searchData.video_url,
					announceChannel: message.channel.id,
					duration: duration,
					thumbnail: searchData.thumbnails[0].url,
				};
				data.queue.push(videoData);
				embed.setThumbnail(videoData.thumbnail);
			}
			else {
				searchData = await YouTube.searchOne(search);
				if (searchData) {
					videoData = {
						title: searchData.title,
						channel: searchData.channel.name,
						requester: message.author,
						url: searchData.url,
						announceChannel: message.channel.id,
						duration: searchData.durationFormatted,
						thumbnail: searchData.thumbnail.url,
					};
					data.queue.push(videoData);
					embed.setThumbnail(videoData.thumbnail);
				}

				else if (hasSearched) return null;
				else {
					logger.warn('Search 1 has failed');
					hasSearched = true;
					await SearchVideo();
				}
			}

			return videoData;
		}


		async function Play() {
			data.paused = false;
			const channel = client.channels.cache.get(data.queue[0].announceChannel);
			embed = new Discord.MessageEmbed()
				.setThumbnail(data.queue[0].thumbnail);

			channel.send(embed.setDescription(`Now playing **${data.queue[0].title}**\nBy **${data.queue[0].channel}**\n\nRequested by ${data.queue[0].requester}`));

			data.dispatcher = data.connection.play(ytdl(data.queue[0].url, {
				requestOptions: {
					headers: {
						Cookie: cookie,
						'x-youtube-identity-token': youtubeID,
					},
				},
				filter: 'audioonly',
				highWaterMark: 1 << 25,
				opusEncoded: true,
			}), {
				type: 'opus',
				bitrate: 'auto',
			});
			data.dispatcher.guildID = data.guildID;


			data.dispatcher.on('finish', () => Finish(client, data.dispatcher, logger, msgUser, message));
			data.dispatcher.on('debug', e => {
				channel.send(embed.setDescription(`error:  ${e.info}`));
				logger.error(e);
			});

			data.dispatcher.on('disconnect', e => {
				data.queue = [];
				data.dispatcher.emit('finish');
				logger.log('info', `Bot got forcefully disconnected by: ${e.info}}`);
			});

		}


		function Finish() {
			data.queue.shift();

			if (data.queue.length > 0) {
				client.music.active.set(data.dispatcher.guildID, data);
				Play(client, data, logger, msgUser, message);
			}
			else {
				client.music.active.delete(data.dispatcher.guildID);
				const voiceChannel = client.guilds.cache.get(data.dispatcher.guildID).me.voice.channel;
				if (voiceChannel) voiceChannel.leave();
			}
		}
	},
};

