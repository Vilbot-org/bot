const formatUser = (user) => {
	return {
		username: user.username,
		avatar_url: user?.avatar_url ?? user?.avatarURL()
	};
};

export default formatUser;
