export enum TGoToLogin {
	Expired = "expired",
	Logout = "logout",
}

export const goToLogin = (auth: TGoToLogin) => {
	console.log("auth", auth);
	console.log("process.env.REACT_APP_LOGIN_URL", process.env.REACT_APP_LOGIN_URL);
	const loginUrl = `${process.env.REACT_APP_LOGIN_URL}/login?auth=${auth}`;
	window.location.replace(loginUrl);
};
