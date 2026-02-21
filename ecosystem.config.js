module.exports = {
	apps: [
		{
			name: "quality-api",
			script: "dist/server.js",
			instances: "max",
			exec_mode: "cluster",
			env: {
				NODE_ENV: "production",
				SERVICE_NAME: "quality-api",
			},
		},
		{
			name: "quality-worker",
			script: "dist/processes/worker.bootstrap.js",
			instances: 1,
			exec_mode: "fork",
			env: {
				NODE_ENV: "production",
				SERVICE_NAME: "quality-worker",
			},
		},
		{
			name: "quality-watchdog",
			script: "dist/processes/watchdog.bootstrap.js",
			instances: 1,
			exec_mode: "fork",
			env: {
				NODE_ENV: "production",
				SERVICE_NAME: "quality-watchdog",
			},
		},
	],
};
